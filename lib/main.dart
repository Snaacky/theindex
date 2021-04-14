import 'package:flutter/material.dart';
import 'package:index/api.dart' as api;

void main() {
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
      home: LandingPage(),
    );
  }
}

class LandingPage extends StatefulWidget {
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
  void initState() {
    super.initState();
    api.health().then((alive) {
      if (alive) {
        print("Yeah! API is still alive!");
      } else {
        print("Oh no... API seems not to be okay");
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("/r/animepiracy Index"),
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

  const TabPage({required this.id}) : super();

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
