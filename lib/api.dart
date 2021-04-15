import 'dart:convert';

import 'package:http/http.dart' as http;

// for debugging only, on prod everything will be relative, meaning domain = ""
var domain = "http://localhost:8080";

class Tab {
  final int id;
  String name;
  String description;
  List<int>? tables;

  Tab({
    required this.id,
    this.name = "",
    this.description = "",
    this.tables,
  });

  factory Tab.fromJson(Map<String, dynamic> json) {
    return Tab(
      id: json["id"],
      name: json["name"],
      description: json["description"],
      tables: List<int>.from(json["tables"]),
    );
  }

  static Future<Tab> fetch(int id) async {
    return http.get(Uri.parse(domain + '/api/tabs/' + id.toString())).then(
      (resp) {
        if (resp.statusCode == 200) {
          return Tab.fromJson(jsonDecode(resp.body));
        }
        throw Exception('Failed to load Tab $id');
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
  int? tabId;

  // data should be fetched via /api/tables/<id>/data
  List<dynamic>? data;

  // columns should be fetched via /api/tables/<id>/columns
  List<dynamic>? columns;

  Table({
    required this.id,
    this.name = "",
    this.description = "",
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
        throw Exception('Failed to load Table $id');
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

  Column({
    required this.id,
    this.name = "",
    this.description = "",
    this.columnType = "text",
  });

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
        throw Exception('Failed to load Column $id');
      },
      onError: (e) {
        print('Request failed: $e');
      },
    );
  }
}

Future<List<Column>> fetchAllColumns() async {
  print("Fetching columns from remote");
  return http.get(Uri.parse(domain + '/api/columns')).then(
    (resp) {
      if (resp.statusCode == 200) {
        return List<Column>.from(
            jsonDecode(resp.body).map((c) => Column.fromJson(c)));
      }
      throw Exception('Failed to load Columns');
    },
    onError: (e) {
      print('Request failed: $e');
    },
  );
}

Future<List<dynamic>> fetchColumns(int id) async {
  print("Fetching columns of table $id from remote");
  return http
      .get(Uri.parse(domain + '/api/tables/' + id.toString() + '/columns'))
      .then(
    (resp) {
      if (resp.statusCode == 200) {
        return jsonDecode(resp.body);
      }
      throw Exception('Failed to load columns of table $id');
    },
    onError: (e) {
      print('Request failed: $e');
    },
  );
}

Future<List<Tab>> fetchTabs() async {
  print("Fetching tabs from remote");
  return http.get(Uri.parse(domain + '/api/tabs')).then(
    (resp) {
      if (resp.statusCode == 200) {
        return List<Tab>.from(
            jsonDecode(resp.body).map((c) => Tab.fromJson(c)));
      }
      throw Exception('Failed to load Tabs');
    },
    onError: (e) {
      throw Exception('Request failed: $e');
    },
  );
}

Future<List<Table>> fetchTables() async {
  print("Fetching tables from remote");
  return http.get(Uri.parse(domain + '/api/tables')).then(
    (resp) {
      if (resp.statusCode == 200) {
        return List<Table>.from(
            jsonDecode(resp.body).map((c) => Table.fromJson(c)));
      }
      throw Exception('Failed to load Tables');
    },
    onError: (e) {
      print('Request failed: $e');
    },
  );
}

Future<List<dynamic>> fetchData(int id) async {
  print("Fetching data of table $id from remote");
  return http
      .get(Uri.parse(domain + '/api/tables/' + id.toString() + '/data'))
      .then(
    (resp) {
      if (resp.statusCode == 200) {
        return jsonDecode(resp.body);
      }
      throw Exception('Failed to load data of table $id');
    },
    onError: (e) {
      print('Request failed: $e');
    },
  );
}

Future<bool> health() async {
  return http.get(Uri.parse(domain + '/api/health')).then((resp) {
    return resp.statusCode == 200;
  }, onError: (e) {
    return false;
  });
}

Future<bool> isLoggedIn() async {
  return http.get(Uri.parse(domain + '/user/is-login')).then(
    (resp) {
      if (resp.statusCode == 200) {
        return jsonDecode(resp.body)["edit"];
      }
      throw Exception('Failed to check login');
    },
    onError: (e) {
      print('Request failed: $e');
    },
  );
}
