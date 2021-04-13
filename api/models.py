from app import db

# TODO: add manipulation of hidden and order
table_columns = db.Table(
    'table_columns',
    db.Column('table_id', db.Integer, db.ForeignKey('table.id'), primary_key=True),
    db.Column('column_id', db.Integer, db.ForeignKey('column.id'), primary_key=True),
    db.Column('hidden', db.Boolean),
    db.Column('order', db.Integer)
)


class Data(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    data = db.Column(db.String, nullable=False)
    table = db.relationship('Table', backref=db.backref('data', lazy=True))

    def to_dict(self):
        return {
            "id": self.id,
            "data": self.data,
            "table": self.table
        }


class Table(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.String)
    tab = db.relationship('Tab', backref=db.backref('tables', lazy=True))
    columns = db.relationship('Column', secondary=table_columns, lazy='subquery',
                              backref=db.backref('tables', lazy=True))

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "tab": self.tab,
            "columns": self.columns,
            "data": self.data
        }


class Tab(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.String)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "tables": self.tables
        }


class Column(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    column_type = db.Column(db.String)
    description = db.Column(db.String)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "column_type": self.column_type,
            "tables": self.tables
        }
