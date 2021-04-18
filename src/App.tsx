import React from "react";
import IndexNavbar from "./components/IndexNavbar";
import TabNav from "./components/TabNav";
import {Container} from "react-bootstrap";
import TabView from "./components/TabView";
import {TabData, TableData} from "./api/Interfaces";
import Footer from "./components/Footer";

const debugUrl = "http://localhost:8080";

interface AppState {
    columns: [],
    tables: Array<TableData>,
    tabs: Array<TabData>,
    currentTab?: TabData,
    searchString: string
}

class App extends React.Component {
    state: AppState;

    constructor(props: {} | Readonly<{}>) {
        super(props);

        this.state = {
            columns: [],
            tables: Array<TableData>(),
            tabs: Array<TabData>(),
            currentTab: undefined, // cannot be defined at this state
            searchString: ""
        };
    }

    componentDidMount() {
        fetch(debugUrl + "/api/columns")
            .then(r => r.json())
            .then(cols => {
                this.setState({columns: cols});
            });
        fetch(debugUrl + "/api/tables")
            .then(r => r.json())
            .then(tables => {
                this.setState({tables: tables});
            });
        fetch(debugUrl + "/api/tabs")
            .then(r => r.json())
            .then((tabs) => {
                this.setState({tabs: tabs, currentTab: tabs[0]});
            });
    }

    switchTab(id: number) {
        this.setState({currentTab: this.state.tabs.filter(t => t.id === id)[0]});
    }

    search(query: string) {
        this.setState({searchString: query});
    }

    render() {
        return (
            <div className="App" style={{minHeight: "100vh"}}>
                <IndexNavbar/>
                <Container className={"my-4"}>
                    <TabNav tabs={this.state.tabs}
                            currentTab={this.state.currentTab}
                            search={this.search.bind(this)}
                            onTabChange={this.switchTab.bind(this)}/>
                </Container>
                {typeof this.state.currentTab !== "undefined" ?
                    <TabView search={this.state.searchString}
                             tab={this.state.currentTab}
                             tables={this.state.tables}/> :
                    <span>Loading....</span>}
                <Footer/>
            </div>
        );
    }
}

export default App;
