import 'package:flutter/material.dart';
import 'package:index/api.dart' as api;
import 'package:table_sticky_headers/table_sticky_headers.dart';

class TablePage extends StatefulWidget {
  final int id;

  const TablePage({Key? key, required this.id}) : super(key: key);

  @override
  _TablePageState createState() => _TablePageState();
}

class _TablePageState extends State<TablePage> {
  api.Table? _table;

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<api.Table>(
      future: api.Table.fetch(widget.id),
      builder: (BuildContext context, AsyncSnapshot<api.Table> snapshot) {
        if (snapshot.hasData) {
          _table = snapshot.data!;
          return Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              Card(
                child: Container(
                  padding: const EdgeInsets.all(10),
                  child: Column(
                    children: <Widget>[
                      Text("Table-id: ${_table!.id}"),
                      Text("Table-name: ${_table!.name}"),
                      Text("Table-description: ${_table!.description}"),
                      DataTableWrapper(table: _table!),
                    ],
                  ),
                ),
              ),
            ],
          );
        } else if (snapshot.hasError) {
          return Center(
              child: Text("Table: ${widget.id} errored: ${snapshot.error}"));
        } else {
          return Center(child: Text("Table: ${widget.id} is loading..."));
        }
      },
    );
  }
}

class DataTableWrapper extends StatefulWidget {
  final api.Table table;

  const DataTableWrapper({Key? key, required this.table}) : super(key: key);

  @override
  _DataTableWrapperState createState() => _DataTableWrapperState();
}

class _DataTableWrapperState extends State<DataTableWrapper> {
  List<dynamic> _sorted = <dynamic>[];
  List<bool> _selected = <bool>[];

  List<dynamic> _sortColumns(List<dynamic> cols) {
    List<dynamic?> result = new List<dynamic?>.generate(
      cols.length,
      (i) => null,
    );
    for (var c in cols) {
      result[c["order"]] = c;
    }
    return result;
  }

  List<DataColumn> _columnsGenerator(List<dynamic> cols) {
    return new List<DataColumn>.generate(
      cols.length,
      (i) => DataColumn(label: Text(_sorted[i]["name"])),
    );
  }

  List<DataCell> _rowGenerator(dynamic row) {
    return new List<DataCell>.generate(
      _sorted.length,
      (i) => DataCell(Text(row[_sorted[i]["name"]].toString())),
    );
  }

  @override
  void initState() {
    super.initState();
    _sorted = _sortColumns(widget.table.columns!);
    _selected = List<bool>.generate(
      widget.table.data!.length,
      (int index) => false,
    );
  }

  @override
  Widget build(BuildContext context) {
    int numItems = widget.table.data!.length;

    return StickyHeadersTable(
      columnsLength: _sorted.length - 1,
      rowsLength: numItems,
      columnsTitleBuilder: (i) => Text(_sorted[i]["name"]),
      rowsTitleBuilder: (i) => Text(widget.table.data![i][_sorted[0]["name"]].toString()),
      contentCellBuilder: (i, j) =>
          Text(widget.table.data![j][_sorted[i]["name"]].toString()),
      legendCell: Text(_sorted[0]["name"]),
    );
  }
}
