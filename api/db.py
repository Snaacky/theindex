import os
import dataset


def _get_database():
    """
    Returns an active connection to the database.

    :return: SQL connection
    """

    return dataset.connect("".join(["sqlite:///", os.path.join("/config", "data.db")]))


def get_data(table: str):
    """
    Fetches all rows of given table

    :param table: id of table
    :return: queried rows
    """

    with _get_database() as db:
        t = db.load_table(table)

        # error if table doesn't exist
        if not t.exists:
            return "table does not exist"

        # For some reason, accessing all the data in the table
        # as Python objects causes a memory leak that results
        # in memory exhaustion and an endless crash-reboot
        # loop but this manual SQL query works just fine. :^)
        return list(t.all())


def get_row(table: str, id):
    """
    Returns a the row of id and given table

    :param table: id of table
    :param id: row-id
    :return: row
    """

    with _get_database() as db:
        t = db.load_table(table)

        # error if table doesn't exist
        if not t.exists:
            return "table does not exist"

        row = t.find_one(id=id)

        # error if did entry did not exist in database
        if row is None:
            return "id does not exist"

        return row


def update_row(table: str, data: dict):
    """
    Updates the row if data in table, must have attribute "id"

    :param table: id of table
    :param data:
    :return: error or success message
    """

    with _get_database() as _db:
        t = _db[table]

        # error if table doesn't exist
        if not t.exists:
            return "table does not exist"

        t.update(data, ["id"])
        return "updated"


def insert_row(table: str, data: dict):
    """
    Insert data as a new row in table

    :param table: id of table
    :param data:
    :return: error or success message
    """

    with _get_database() as _db:
        t = _db[table]

        # error if table doesn't exist
        if not t.exists:
            return "table does not exist"

        t.insert(data)
        return "inserted"


def delete_row(table: str, id):
    """
    Insert data as a new row in table

    :param table: id of table
    :param id: row-id
    :return: error or success message
    """

    with _get_database() as _db:
        t = _db[table]

        # error if table doesn't exist
        if not t.exists:
            return "table does not exist"

        data = t.find_one(id=id)
        if data is None:
            return "id does not exist"

        t.delete(id=id)
        return "deleted"


def create_table(table: str):
    """
    Creates a new table

    :param table: id of table
    :return: error or success message
    """

    with _get_database() as _db:
        _db.create_table(table)
        _db.commit()
