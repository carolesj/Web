import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import PropTypes from 'prop-types';
import React from 'react';
import { UserContext } from './UserContext';

function ActionList(props) {

    let defaultOptions = [
        { control: "home", pt: "Início", st: "Página inicial" },
        { control: "products", pt: "Produtos", st: "Catálogo de produtos em oferta" },
        { control: "services", pt: "Serviços", st: "Listagem de serviços prestados" },
    ]

    let customerOptions = []
    if (props.userRights === "customer") {
        customerOptions = [
            { control: "appointments", pt: "Agendamentos", st: "Informações de serviços agendados" },
            { control: "pets", pt: "Meus Pets", st: "Lista dos seus pets cadastrados na loja" },
            { control: "cart", pt: "Carrinho", st: "Estado do carrinho de compras" },
        ]
    }

    let adminOptions = []
    if (props.userRights === "admin") {
        adminOptions = [
            { control: "appointments", pt: "Agendamentos", st: "Informações sobre todos agendamentos" },
            { control: "stock", pt: "Estoque", st: "Controle de produtos em estoque" },
        ]
    }

    // Concatenate custom options conditionally
    let allOptions = defaultOptions.concat(customerOptions).concat(adminOptions)

    return (
        <UserContext.Consumer>
            {state => (
                <List component="nav">
                    {
                        allOptions.map((item, index) => (
                            // The "key" prop MUST be provided!
                            <ListItem button divider key={index}
                                onClick={() => state.updateViewContext({ currentView: item.control })}>
                                <ListItemText
                                    primary={item.pt}
                                    secondary={item.st}
                                />
                            </ListItem>
                        ))
                    }
                </List>
            )}
        </UserContext.Consumer>
    )
}

// Do typechecking
ActionList.propTypes = {
    userRights: PropTypes.string.isRequired,
}

export default ActionList