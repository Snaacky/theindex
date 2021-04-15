import React from "react";
import {Nav} from "react-bootstrap";
import {TabData} from "../api/Interfaces";

interface TabNavProps {
    tabs: Array<any>,
    onTabChange: (id: number) => void,
    currentTab?: TabData
}

class TabNav extends React.Component<TabNavProps> {

    render() {
        if (this.props.tabs.length > 0 && this.props.currentTab !== undefined) {
            return (
                <Nav variant="pills" activeKey={this.props.currentTab.id}
                     onSelect={(d) => this.props.onTabChange(parseInt(d as string))}>
                    {this.props.tabs.map((t: TabData) => {
                        return (
                            <Nav.Item key={t.id}>
                                <Nav.Link eventKey={t.id} title={t.description}>
                                    {t.name}
                                </Nav.Link>
                            </Nav.Item>
                        );
                    })}
                </Nav>
            );
        }

        return (
            <span>Loading....</span>
        );
    }
}

export default TabNav;