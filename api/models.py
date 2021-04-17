from app import db


class Tab(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(1000), nullable=False)
    description = db.Column(db.String(1000))
    tables = db.relationship(
        'Table',
        backref="tab",
        lazy=True,
        uselist=True
    )

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "tables": [t.id for t in self.tables]
        }


class Table(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(1000), nullable=False)
    description = db.Column(db.String(1000))
    tab_id = db.Column(db.Integer, db.ForeignKey('tab.id'))
    order = db.Column(db.Integer)
    hidden = db.Column(db.Boolean, default=False)
    columns = db.relationship(
        'TableColumn',
        backref="table",
        lazy=True,
        uselist=True
    )
    data = db.relationship(
        'Data',
        backref="table",
        lazy=True,
        uselist=True
    )

    def to_dict(self, recursive=False):
        return {
            "id": self.id,
            "tab_id": self.tab_id,
            "name": self.name,
            "description": self.description,
            "columns": [t.to_dict() for t in self.columns],
            "data": [t.to_dict() for t in self.data]
        }


class Data(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    data = db.Column(db.String(1000), nullable=False)
    table_id = db.Column(db.Integer, db.ForeignKey('table.id'))

    def to_dict(self):
        return {
            "id": self.id,
            "data": self.data,
            "table_id": self.table_id
        }


class Column(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(1000), nullable=False)
    column_type = db.Column(db.String(1000), default="text")
    key = db.Column(db.String(1000))
    description = db.Column(db.String(1000))

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "key": self.key,
            "description": self.description,
            "column_type": self.column_type
        }


class TableColumn(db.Model):
    table_id = db.Column(db.Integer, db.ForeignKey('table.id'), primary_key=True)
    column_id = db.Column(db.Integer, db.ForeignKey('column.id'), primary_key=True)
    column = db.relationship(
        'Column',
        primaryjoin="foreign(TableColumn.column_id) == remote(Column.id)"
    )
    order = db.Column(db.Integer)
    hidden = db.Column(db.Boolean, default=False)

    def to_dict(self):
        return {
                   "table_id": self.table_id,
                   "column_id": self.column_id,
                   "order": self.order,
                   "hidden": self.hidden
               } | self.column.to_dict()
