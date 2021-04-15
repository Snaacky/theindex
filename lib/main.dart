import 'package:flutter/material.dart';
import 'api.dart' as api;
import 'layout/adaptive.dart';
import 'layout/tab.dart';

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
      home: Root(),
    );
  }
}

class Root extends StatefulWidget {
  @override
  _RootState createState() => _RootState();
}

class _RootState extends State<Root> {
  int _selectedTab = -1;
  List<api.Tab> _tabs = <api.Tab>[];

  void _onTabTapped(int id) {
    print("Clicked Tab $id");
    setState(() {
      _selectedTab = id;
    });
  }

  Widget _getBody() {
    if (_selectedTab < 0) {
      return Center(child: CircularProgressIndicator());
    }
    return TabPage(id: _selectedTab);
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
    // bar at the top
    PreferredSizeWidget appbar = AppBar(
      title: Row(
        children: [
          Container(
            child: const Image(
              image: NetworkImage('/img/logo.png'),
              height: 40,
            ),
            margin: const EdgeInsets.only(right: 10),
          ),
          const Text("/r/animepiracy Index"),
        ],
      ),
      actions: <Widget>[
        IconButton(
          icon: const Icon(Icons.account_circle),
          tooltip: 'Show Snackbar',
          onPressed: () {
            api.isLoggedIn().then((loggedIn) {
              Widget status;
              if (loggedIn) {
                status = const Text("You are logged in");
              } else {
                status = const Text("You are not logged in");
              }
              ScaffoldMessenger.of(context)
                  .showSnackBar(SnackBar(content: status));
            });
          },
        ),
      ],
    );

    // drawer with tab listing
    Widget drawer = FutureBuilder<List<api.Tab>>(
      future: api.fetchTabs(),
      initialData: <api.Tab>[],
      builder: (BuildContext context, AsyncSnapshot<List<api.Tab>> snapshot) {
        List<Widget> children;
        if (snapshot.hasData && snapshot.data!.length > 0) {
          _tabs = snapshot.data!;
          children = _tabs.map((tab) {
            return ListTile(
              leading: Icon(Icons.business),
              title: Text(tab.name),
              onTap: () {
                if (_selectedTab != tab.id) {
                  _onTabTapped(tab.id);
                }
                if (!isDesktop(context)) {
                  Navigator.pop(context);
                }
              },
            );
          }).toList();
        } else if (snapshot.hasError) {
          children = <Widget>[Center(child: Text("Error: ${snapshot.error}"))];
        } else {
          children = <Widget>[Center(child: Text("Loading..."))];
        }

        return Drawer(
          child: Column(
            children: <Widget>[
              DrawerHeader(
                child: const Text(
                  'Tabs',
                  textAlign: TextAlign.left,
                ),
                // why is there a huge bottom spacer?? TODO: investigate
                margin: null,
              ),
              Divider(),
              Column(children: children)
            ],
          ),
        );
      },
    );

    // for large displays, we want the drawer to stick around
    if (isDesktop(context)) {
      return Scaffold(
        appBar: appbar,
        body: Row(
          children: <Widget>[
            drawer,
            _getBody(),
          ],
        ),
      );
    }

    // for small it is collapsable
    return Scaffold(
      appBar: appbar,
      drawer: drawer,
      body: _getBody(),
    );
  }
}
