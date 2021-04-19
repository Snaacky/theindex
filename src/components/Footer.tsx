import React from "react";
import {Col, Container, Row} from "react-bootstrap";
import {FaDiscord, FaGithub, FaReddit, FaTwitter} from "react-icons/all";
import "./Footer.css";

const Footer = (): JSX.Element => (
    <footer className={"mt-auto p-2"}>
        <Container>
            <p>
                We are not liable for the accuracy of the contents of the /r/animepiracy index. All data is provided
                faithfully to the best of our knowledge and is subject to change without prior notice. We are not
                affiliated with, nor own, any of the services listed. We do not bear any legal responsibility for
                the provided content of the services listed and you should familiarize yourself with your local laws
                before accessing them.
            </p>
            <hr/>
            <Row className={"g-2"}>
                <Col className={"d-flex justify-content-center"}>
                    <a href={"https://www.reddit.com/r/animepiracy/"} target={"_blank"} rel={"noopener"}>
                        <span className={"icon"}>
                            <FaReddit/>
                        </span>
                        <span className={"d-none d-sm-inline-block ml-1"}>
                            Reddit
                        </span>
                    </a>
                </Col>
                <Col className={"d-flex justify-content-center"}>
                    <a href={"https://discord.gg/piracy"} target={"_blank"} rel={"noopener"}>
                        <span className={"icon"}>
                            <FaDiscord/>
                        </span>
                        <span className={"d-none d-sm-inline-block ml-1"}>
                            Discord
                        </span>
                    </a>
                </Col>
                <Col className={"d-flex justify-content-center"}>
                    <a href={"https://twitter.com/ranimepiracy"} target={"_blank"} rel={"noopener"}>
                        <span className={"icon"}>
                            <FaTwitter/>
                        </span>
                        <span className={"d-none d-sm-inline-block ml-1"}>
                            Twitter
                        </span>
                    </a>
                </Col>
                <Col className={"d-flex justify-content-center"}>
                    <a href={"https://github.com/ranimepiracy/index"} target={"_blank"} rel={"noopener"}>
                        <span className={"icon"}>
                            <FaGithub/>
                        </span>
                        <span className={"d-none d-sm-inline-block ml-1"}>
                            Github
                        </span>
                    </a>
                </Col>
            </Row>
        </Container>
    </footer>
);

export default Footer;
