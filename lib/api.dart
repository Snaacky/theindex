import 'dart:convert';

import 'package:http/http.dart' as http;

// for debugging only, on prod everything will be relative, meaning domain = ""
var domain = "http://localhost:8080";

class Tab {
  final int id;
  String name;
  String description;
  List<int> tables;

  Tab(this.id, this.name, this.description);

  factory Tab.fromJson(Map<String, dynamic> json) {
    return Tab(json["id"], json["name"], json["description"]);
  }

  static Future<Tab> fetch(int id) async {
    return http.get(Uri.parse(domain + '/api/tabs/' + id.toString())).then(
      (resp) {
        if (resp.statusCode == 200) {
          return Tab.fromJson(jsonDecode(resp.body));
        }
        throw Exception('Failed to load Tab');
      },
      onError: (e) {
        print('Request failed: $e');
      },
    );
  }
}

class Table {
  final int id;
  String name;
  String description;
  int tabId;

  // data should be fetched via /api/tables/<id>/data
  List<int> data;

  // columns should be fetched via /api/tables/<id>/columns
  List<int> columns;

  Table({
    this.id,
    this.name,
    this.description,
    this.tabId,
    this.data,
    this.columns,
  });

  factory Table.fromJson(Map<String, dynamic> json) {
    return Table(
      id: json["id"],
      name: json["name"],
      description: json["description"],
      tabId: json["tab_id"],
      data: json["data"],
      columns: json["columns"],
    );
  }

  static Future<Table> fetch(int id) async {
    return http.get(Uri.parse(domain + '/api/tables/' + id.toString())).then(
      (resp) {
        if (resp.statusCode == 200) {
          return Table.fromJson(jsonDecode(resp.body));
        }
        throw Exception('Failed to load Table');
      },
      onError: (e) {
        print('Request failed: $e');
      },
    );
  }
}

class Column {
  final int id;
  String name;
  String description;
  String columnType;

  Column({this.id, this.name, this.description, this.columnType});

  factory Column.fromJson(Map<String, dynamic> json) {
    return Column(
      id: json["id"],
      name: json["name"],
      description: json["description"],
      columnType: json["column_type"],
    );
  }

  static Future<Column> fetch(int id) async {
    return http.get(Uri.parse(domain + '/api/columns/' + id.toString())).then(
      (resp) {
        if (resp.statusCode == 200) {
          return Column.fromJson(jsonDecode(resp.body));
        }
        throw Exception('Failed to load Column');
      },
      onError: (e) {
        print('Request failed: $e');
      },
    );
  }
}
