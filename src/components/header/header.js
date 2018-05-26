import React from "react";
import { Navbar, NavItem, Row} from 'react-materialize';

const Header = () => (
    <Row>
        <Navbar className="red lighten-1" brand='Petshop' left>
            <NavItem href='/'><i className="fa fa-paw"></i>    Home</NavItem>
            <NavItem href='/produtos'>Produtos</NavItem>
            <NavItem href='/servicos'>Serviços</NavItem>
        </Navbar>
    </Row>
);

export default Header;
