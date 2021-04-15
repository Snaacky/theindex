import 'package:flutter/material.dart';
import 'package:index/api.dart' as api;

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
  List<dynamic>? _sorted;

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
      (i) => DataColumn(label: _sorted![i]["name"]),
    );
  }

  List<DataCell> _rowGenerator(dynamic row) {
    return new List<DataCell>.generate(
      _sorted!.length,
      (i) => DataCell(Text(row[_sorted![i]["name"]])),
    );
  }

  @override
  void initState() {
    super.initState();
    _sorted = _sortColumns(widget.table.columns!);
  }

  @override
  Widget build(BuildContext context) {
    int numItems = widget.table.data!.length;
    List<bool> selected = List<bool>.generate(numItems, (int index) => false);

    return DataTable(
      columns: _columnsGenerator(widget.table.columns!),
      rows: List<DataRow>.generate(
        numItems,
        (int index) => DataRow(
          color: MaterialStateProperty.resolveWith<Color?>(
              (Set<MaterialState> states) {
            // All rows will have the same selected color.
            if (states.contains(MaterialState.selected))
              return Theme.of(context).colorScheme.primary.withOpacity(0.08);
            // Even rows will have a grey color.
            if (index.isEven) {
              return Colors.grey.withOpacity(0.3);
            }
            return null; // Use default value for other states and odd rows.
          }),
          cells: _rowGenerator(widget.table.data![index]),
          selected: selected[index],
          onSelectChanged: (bool? value) {
            setState(() {
              selected[index] = value!;
            });
          },
        ),
      ),
    );
  }
}
