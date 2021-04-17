import React from "react";
import {TabData, TableData} from "../api/Interfaces";
import {Card, Container} from "react-bootstrap";
import TableView from "./TableView";


interface TabViewProps {
    tab: TabData,
    tables: TableData[]
}

class TabView extends React.Component<TabViewProps> {

    render() {
        return (
            <Container fluid style={{textAlign: "left"}}>
                <Card style={{backgroundColor: "#121212"}}>
                    <Card.Header>
                        {this.props.tab.name}
                    </Card.Header>
                    <Card.Body style={{backgroundColor: "#202020"}}>
                        {this.props.tab.description}
                    </Card.Body>
                </Card>
                {this.props.tab.tables.map((table_id: number) => {
                    let t = this.props.tables.filter(table => table.id === table_id)[0];
                    if (t === undefined) {
                        return (
                            <span key={table_id}>Loading...</span>
                        );
                    }
                    return (
                        <TableView table={t} key={t.id}/>
                    );
                })}
            </Container>
        );
    }
}

export default TabView;