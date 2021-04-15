import 'package:flutter/material.dart';
import 'package:index/api.dart' as api;
import 'package:index/layout/table.dart';

class TabPage extends StatefulWidget {
  final int id;

  const TabPage({Key? key, required this.id}) : super(key: key);

  @override
  _TabPageState createState() => _TabPageState();
}

class _TabPageState extends State<TabPage> {
  api.Tab? _tab;

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.all(10),
      child: FutureBuilder<api.Tab>(
        future: api.Tab.fetch(widget.id),
        builder: (BuildContext context, AsyncSnapshot<api.Tab> snapshot) {
          if (snapshot.hasData) {
            _tab = snapshot.data!;
            return Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                Card(
                  child: Container(
                    padding: const EdgeInsets.all(10),
                    child: Column(
                      children: <Widget>[
                        Text("Tab-id: ${_tab!.id}"),
                        Text("Tab-name: ${_tab!.name}"),
                        Text("Tab-description: ${_tab!.description}"),
                      ],
                    ),
                  ),
                ),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: _tab!.tables!
                      .map((table) => TablePage(id: table))
                      .toList(),
                ),
              ],
            );
          } else if (snapshot.hasError) {
            return Center(
                child: Text("Tab: ${widget.id} errored: ${snapshot.error}"));
          } else {
            return Center(child: Text("Tab: ${widget.id} is loading..."));
          }
        },
      ),
    );
  }
}
