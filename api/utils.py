import json
import os

import urllib3
from deepdiff import DeepDiff


# TODO: adjust for more general notifications
def _send_webhook_message(user, operation, table, after, before=None):
    """
    Sends a Discord webhook if env AUDIT_WEBHOOK set.

        Parameters:
            user (discord.User): Returns the Discord user object that called the route.
            operation (str): The type of operation being processed, insert, update, or delete.
            table (str): The table containing the affected data.

        Optional Parameters:
            before (dict): Used during update operations, the data stored in the database prior to being manipulated.
            after (dict): Used during update operations, the data submitted by the user to be updated in the database.
    """

    webhook = os.environ.get('AUDIT_WEBHOOK')
    if webhook == "":
        return

    embed = {
        "embeds": [
            {
                "author":
                    {
                        "name": f"{user}",
                        "icon_url": f"{user.avatar_url}"
                    },
                "color": 2105893,
                "fields": [
                    {
                        "name": "Table:",
                        "value": f"{table}",
                        "inline": "true"
                    },
                    {
                        # A stupid hack so we don't have any diffs on the first row.
                        # I couldn't think of any other useful data to put on this line...
                        "name": "** **",
                        "value": "** **",
                        "inline": "true"
                    },
                    {
                        "name": "Entry:",
                        "value": f"{after['siteName']}",
                        "inline": "true"
                    },

                ]
            }
        ]
    }

    if operation == "update":
        # Update the embed title to reflect the operation.
        embed["embeds"][0]["title"] = f"The following entry was updated: {before['siteName']}"

        # Compare the before and after dictionaries using DeepDiff so we can learn the differences.
        # TODO: Replace this with DIY. I thought the library would be more useful than it was.
        diff = DeepDiff(before, after)
        for item in reversed(diff["values_changed"]):
            # Every column name is wrapped in root['column_name'] so we need to strip that off.
            changed = item.replace("root['", "").replace("']", "")

            # Create a new field for the embed containing the column name and a diff of the changes made to the data.
            # Build the value dynamically so we can exclude the old value if there wasn't a value there previously.
            value = ""
            value += "```diff\n"
            value += f"+ {diff['values_changed'][item]['new_value']}\n"
            if len(diff['values_changed'][item]['old_value']):
                value += f"- {diff['values_changed'][item]['old_value']}\n"
            value += "```"

            field = {
                "name": f"{changed}:",
                "value": value,
                # A few columns entry changes are typically more lengthy so we want to give those more space than the rest.
                "inline": "false" if changed in ["features", "siteAddresses", "editorNotes"] else "true"
            }

            # Append the newly created field to the embed.
            embed["embeds"][0]["fields"].append(field)

    if operation == "delete":
        embed["embeds"][0]["title"] = f"The following entry was removed: {after['siteName']}"

        for column in after:
            value = ""
            value += "```diff\n"
            value += f"- {after.get(column)}\n"
            value += "```"
            field = {
                "name": f"{column}:",
                "value": value,
                # A few columns entry changes are typically more lengthy so we want to give those more space than the rest.
                "inline": "false" if column in ["features", "siteAddresses", "editorNotes"] else "true"
            }

            # Append the newly created field to the embed.
            embed["embeds"][0]["fields"].append(field)

    if operation == "insert":
        embed["embeds"][0]["title"] = f"The following entry was created: {after['siteName']}"

        for column in after:
            value = ""
            value += "```diff\n"
            value += f"+ {after.get(column)}\n"
            value += "```"
            field = {
                "name": f"{column}:",
                "value": value,
                # A few columns entry changes are typically more lengthy so we want to give those more space than the rest.
                "inline": "false" if column in ["features", "siteAddresses", "editorNotes"] else "true"
            }

            # Append the newly created field to the embed.
            embed["embeds"][0]["fields"].append(field)

    # Didn't feel like importing two libraries for this one-off function so using the standard urllib library for POST.
    http = urllib3.PoolManager()
    r = http.request('POST', webhook, body=json.dumps(embed), headers={'Content-Type': 'application/json'})
    return r
