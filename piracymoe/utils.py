import json
import logging
import os
import urllib3

import dataset

def _get_database():
    """ Returns an active connection to the database. """
    return dataset.connect("".join(["sqlite:///", os.path.join("/config", "data.db")]))


def _send_webhook_message(user, operation, table, before=None, after=None):
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

    # So we can get the site name regardless of the operation occuring.
    data = before or after

    # Defines the JSON used for the webhook's embed.
    embed = {
        "embeds": [
            {
                "author": {"name": f"{user}", "icon_url": f"{user.avatar_url}"},
                "color": 2105893,
                "fields": [
                    { "name": "Table:", "value": f"{table}", "inline": "true" },
                    # A stupid hack so we don't have any diffs on the first row.
                    # I couldn't think of any other useful data to put on this line...
                    { "name": "** **", "value": f"** **", "inline": "true",},
                    { "name": "Entry:", "value": f"{data['siteName']}", "inline": "true" },
                ],
            }
        ]
    }

    if operation == "insert":
        embed["embeds"][0]["title"] = f"The following entry was created: {after['siteName']}"

        # Add all of the new key/values into diff codeblocks. 
        for key, value in after.items():
            block = "```diff\n"
            block += f"+ {value}\n"
            block += "```"
            
            # Insert the codeblock into the field and add it to the embed.
            field = {
                "name": f"{key}:", 
                "value": block,
                # Some entry changes are more lengthy so give them more space.
                "inline": "false" if key in ["features", "siteAddresses", "editorNotes"] else "true"
            }

            embed["embeds"][0]["fields"].append(field)

    if operation == "delete":
        embed["embeds"][0]["title"] = f"The following entry was deleted: {before['siteName']}"

        # Add all of the former key/values into diff codeblocks. 
        for key, value in before.items():
            block = "```diff\n"
            block += f"- {value}\n"
            block += "```"

            # Insert the codeblock into the field and add it to the embed.
            field = {
                "name": f"{key}:", 
                "value": block,
                # Some entry changes are more lengthy so give them more space.
                "inline": "false" if key in ["features", "siteAddresses", "editorNotes"] else "true"
            }

            embed["embeds"][0]["fields"].append(field)

    if operation == "update":
        embed["embeds"][0]["title"] = f"The following entry was updated: {before['siteName']}"
        diff = {}
        
        # Searches for the difference between the two dictionaries
        # and adds them to the diff dictionary.
        for key in before.keys():
            if before[key] != after[key]:
                diff[key] = {
                    "before": before[key],
                    "after": after[key]
                }

        # Insert each diff into their own codeblock for the embed.
        for item in diff:
            value = ""
            value += "```diff\n"
            value += f"+ {diff[item]['after']}\n"
            if diff[item]["before"]:
                value += f"- {diff[item]['before']}\n"
            else: 
                value += f"- ?\n"
            value += "```"

            # Insert the codeblock into the field and add it to the embed.
            field = {
                "name": f"{item}:", 
                "value": value,
                # Some entry changes are more lengthy so give them more space.
                "inline": "false" if item in ["features", "siteAddresses", "editorNotes"] else "true"
            }

            embed["embeds"][0]["fields"].append(field)
    
    # Post the embed JSON to the webhook.
    http = urllib3.PoolManager()
    r = http.request(
        method='POST', 
        url=webhook, 
        body=json.dumps(embed), 
        headers={'Content-Type': 'application/json'}
    )
    return r