import json
import os
import urllib3
import db

from deepdiff import DeepDiff


def tables():
    """
    Returns the tables of given tab

    :return: list of tables
    """

    tables_data = []
    _data = db.get_data("tables")
    if isinstance(_data, str):
        return _data
    for _t in _data:
        _t["columns"] = columns(_t["id"])
        tables_data.append(_t)
    return tables_data


def table(table: str):
    """
    Returns a table definition of given table t

    :param table: id of table
    :return: table definition
    """

    table_row = db.get_row("tables", table)
    table_row["columns"] = columns(table)
    return table_row


def tabs():
    """
    Returns a list of tabs

    :return: list of tabs
    """

    result = []
    for _tab in db.get_data("tabs"):
        _data = _tab
        _data["tables"] = tab(_tab["key"])
        result.append(_data)
    return result


def tab(tab: str):
    """
    Returns a list of tables

    :return: list of table
    """

    # here a join would be optimal...
    _tables = db.get_data("tab_" + tab)
    table_data = []
    for _table in _tables:
        # merge two dicts
        data = db.get_row("tables", _table["id"]) | _table
        table_data.append(data)

    return table_data


def table_types(type: str = None):
    if type is not None:
        return dict(
            name=type,
            columns=db.get_data("type_" + type)
        )

    result = []
    for _type in db.get_data("table_types"):
        result.append(_type | dict(
            columns=db.get_data("type_" + _type["name"])
        ))
    return result


def columns(table: str = None):
    """
    Returns all possible columns or columns of table if given

    :param table: id of table
    :return: columns object or list of columns
    """

    columns_data = db.get_data("columns")
    # on error return
    if isinstance(columns_data, str):
        return columns_data

    if table is None:
        return columns_data

    table_data = db.get_row("tables", table)

    # on error return
    if isinstance(table_data, str):
        return table_data

    _column = db.get_data("type_" + table_data["type"])
    filtered_columns = []
    for _d in columns_data:
        for _c in _column:
            if _c["id"] == _d["id"]:
                # merge two dicts
                _filtered = _d | _c
                filtered_columns.append(_filtered)
    return filtered_columns


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
                        "value": f"** **",
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
