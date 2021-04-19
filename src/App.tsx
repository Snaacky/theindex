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
    editMode: boolean,
    searchString: string
}

class App extends React.Component {
    state: AppState;

    constructor(props: any) {
        super(props);

        this.state = {
            columns: [],
            tables: Array<TableData>(),
            tabs: Array<TabData>(),
            editMode: false,
            currentTab: undefined, // cannot be defined at this state
            searchString: "",
        };
    }

    componentDidMount(): void {
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

    switchTab(id: number): void {
        this.setState((oldState: AppState) => ({
            currentTab: oldState.tabs.filter(t => t.id === id)[0]
        }));
    }

    enableEditMode(enabled: boolean): void {
        this.setState({editMode: enabled});
    }

    search(query: string): void {
        this.setState({searchString: query});
    }

    render(): JSX.Element {
        return (
            <div className="App" style={{minHeight: "100vh"}}>
                <IndexNavbar editMode={this.state.editMode} editModeChange={this.enableEditMode.bind(this)}/>
                <Container className={"my-4"}>
                    <TabNav tabs={this.state.tabs}
                            editMode={this.state.editMode}
                            currentTab={this.state.currentTab}
                            search={this.search.bind(this)}
                            onTabChange={this.switchTab.bind(this)}/>
                </Container>
                {typeof this.state.currentTab !== "undefined" ?
                    <TabView search={this.state.searchString}
                             editMode={this.state.editMode}
                             tab={this.state.currentTab}
                             tables={this.state.tables}/> :
                    <span>Loading....</span>}
                <Footer/>
            </div>
        );
    }
}

export default App;
