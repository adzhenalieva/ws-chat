import React from 'react';
import {
    Nav,
    Navbar,
    NavbarBrand,
} from "reactstrap";
import {NavLink as RouterNavLink} from "react-router-dom";
import UserMenu from "./Menus/UserMenu";
import AnonimousMenu from "./Menus/AnonimousMenu";

const Toolbar = ({user, logout}) => {
    return (
        <Navbar color="light" light expand="md">
            <NavbarBrand tag={RouterNavLink} to="/">Chat</NavbarBrand>
            <Nav className="ml-auto" navbar>
                {user ? <UserMenu user={user} logout={logout}/> : <AnonimousMenu/>}
            </Nav>
        </Navbar>
    );
};

export default Toolbar;