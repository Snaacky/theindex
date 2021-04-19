import React from "react";
import {Col, FormControl, InputGroup, Nav, Row} from "react-bootstrap";
import {TabData} from "../api/Interfaces";
import "./TabNav.css";

interface TabNavProps {
    tabs: Array<any>,
    onTabChange: (id: number) => void,
    search: (query: string) => void,
    editMode: boolean,
    currentTab?: TabData
}

class TabNav extends React.Component<TabNavProps> {
    render(): JSX.Element {
        if (this.props.tabs.length > 0 && typeof this.props.currentTab !== "undefined") {
            return (
                <Row className={"tab-nav"}>
                    <Col xs={"auto"}>
                        <Nav variant="pills" fill
                             onSelect={(d) => this.props.onTabChange(parseInt(d as string, 10))}
                             activeKey={this.props.currentTab.id}>
                            {this.props.tabs.map((t: TabData) => {
                                return (
                                    <Nav.Item key={t.id} className={"m-1"}>
                                        <Nav.Link eventKey={t.id} title={t.description}>
                                            {t.name}
                                        </Nav.Link>
                                    </Nav.Item>
                                );
                            })}
                        </Nav>
                    </Col>
                    <Col>
                        <InputGroup className={"mt-1"}>
                            <FormControl
                                className={"custom"}
                                onInput={(e: React.FormEvent<HTMLInputElement>) => this.props.search(
                                    e.currentTarget.value.toLowerCase()
                                )}
                                placeholder={"Search terms here..."}
                                type="text"/>
                        </InputGroup>
                    </Col>
                </Row>

            );
        }

        return (
            <span>Loading....</span>
        );
    }
}

export default TabNav;
