import React from "react";
import {Image, Nav, Navbar, NavbarBrand} from "react-bootstrap";
import NavbarToggle from "react-bootstrap/NavbarToggle";
import NavbarCollapse from "react-bootstrap/NavbarCollapse";
import {BsBook, HiOutlineStatusOnline} from "react-icons/all";

const IndexNavbar = () => {
    return (
        <Navbar variant={"dark"} style={{backgroundColor: "#121212"}}>
            <NavbarBrand href={"/#home"}>
                <Image src={"/img/logo.png"} width={30} height={30}
                       className={"d-inline-block align-top mr-2"} rounded/>
                /r/animepiracy Index
            </NavbarBrand>
            <NavbarToggle aria-controls="responsive-navbar-nav"/>
            <NavbarCollapse id="responsive-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Link href="https://wiki.piracy.moe">
                        <BsBook/> Wiki
                    </Nav.Link>
                    <Nav.Link href="https://status.piracy.moe">
                        <HiOutlineStatusOnline/> Status
                    </Nav.Link>
                </Nav>
                <Nav>
                    <Nav.Link href="#deets" disabled>
                        More deets
                    </Nav.Link>
                </Nav>
            </NavbarCollapse>
        </Navbar>
    );
}

export default IndexNavbar;