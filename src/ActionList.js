import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import PropTypes from 'prop-types';
import React from 'react';

function ActionList(props) {
    let defaultOptions = [
        { pt: "Início",   st: "Página inicial"},
        { pt: "Produtos", st: "Catálogo de produtos em oferta" },
        { pt: "Serviços", st: "Listagem de serviços prestados" },
    ]

    let customerOptions = []
    if (props.userRights === "customer") {
        customerOptions = [
            { pt: "Carrinho", st: "Estado do carrinho de compras" },
            { pt: "Agendamentos", st: "Informações de serviços agendados" },
        ]
    }

    let adminOptions = []
    if (props.userRights === "admin") {
        adminOptions = [
            { pt: "Estoque", st: "Controle de produtos em estoque" },
            { pt: "Agendamentos", st: "Informações sobre todos agendamentos" },
        ]
    }

    // Concatenate custom options conditionally
    let allOptions = defaultOptions.concat(customerOptions).concat(adminOptions)

    return (
        <List component="nav">
            {
                allOptions.map((item, index) => (
                    // The "key" prop MUST be provided!
                    <ListItem button divider key={index}>
                        <ListItemText
                            primary={item.pt}
                            secondary={item.st}
                        />
                    </ListItem>
                ))
            }
        </List>
    )
}

// Do typechecking
ActionList.propTypes = {
    userRights: PropTypes.string.isRequired,
}

export default ActionList