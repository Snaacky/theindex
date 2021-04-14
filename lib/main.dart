import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:index/api.dart' as api;

var domain = "http://localhost:8080";

void main() {
  var url = Uri.parse(domain + '/api/health');
  print("url is $url");
  http.get(url).then((value) {
    print('Response status: ${value.statusCode}');
    print('Response body: ${value.body}');
  }, onError: (e) {
    print('Request failed: $e');
  });
  runApp(App());
}

class App extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: '/r/animepiracy Index',
      theme: ThemeData(
        // todo: someone actually designs this, check the docs out:
        // https://flutter.dev/docs/cookbook/design/themes
        primarySwatch: Colors.blue,
      ),
      home: LandingPage(title: 'Flutter Demo Home Page'),
    );
  }
}

class LandingPage extends StatefulWidget {
  LandingPage({Key key, this.title}) : super(key: key);

  // This widget is the home page of your application. It is stateful, meaning
  // that it has a State object (defined below) that contains fields that affect
  // how it looks.

  // This class is the configuration for the state. It holds the values (in this
  // case the title) provided by the parent (in this case the App widget) and
  // used by the build method of the State. Fields in a Widget subclass are
  // always marked "final".

  final String title;

  @override
  _LandingPageState createState() => _LandingPageState();
}

class _LandingPageState extends State<LandingPage> {
  int _counter = 0;

  void _incrementCounter() {
    setState(() {
      _counter++;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            Text(
              'You have pushed the button this many times:',
            ),
            Text(
              '$_counter',
              style: Theme.of(context).textTheme.headline4,
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _incrementCounter,
        tooltip: 'Increment',
        child: Icon(Icons.add),
      ),
    );
  }
}

class TabPage extends StatefulWidget {
  final int id;

  const TabPage({Key key, this.id}) : super(key: key);

  @override
  _TabPageState createState() => _TabPageState();
}

class _TabPageState extends State<TabPage> {
  late Future<api.Tab> tab;

  @override
  void initState() {
    super.initState();
    tab = api.Tab.fetch(widget.id);
  }

  @override
  Widget build(BuildContext context) {
    // TODO: implement build
    throw UnimplementedError();
  }
}
