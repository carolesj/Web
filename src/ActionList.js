import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import PropTypes from "prop-types"
import React from "react"
import { connect } from "react-redux"
import { changeCurrentView } from "./StoreActions"

function ActionList(props) {
    let defaultOptions = [
        { control: "home", pt: "Início", st: "Página inicial" },
        { control: "products", pt: "Produtos", st: "Catálogo de produtos em oferta" },
        { control: "services", pt: "Serviços", st: "Listagem de serviços prestados" },
    ]

    let customerOptions = []
    if (props.userRights === "customer") {
        customerOptions = [
            { control: "myPets", pt: "Meus Pets", st: "Lista dos seus pets cadastrados na loja" },
            { control: "myAppoints", pt: "Meus agendamentos", st: "Informações de serviços agendados" },
            { control: "myShoppingCart", pt: "Carrinho de compras", st: "Estado atual do carrinho de compras" },
        ]
    }

    let adminOptions = []
    if (props.userRights === "admin") {
        adminOptions = [
            { control: "userCtl", pt: "Controle de usuários", st: "Controle de cadastros de usuários" },
            { control: "stockCtl", pt: "Controle de estoque", st: "Controle de produtos em estoque" },
            { control: "serviceCtl", pt: "Controle de serviços", st: "Controle de serviços agendamentos" },
        ]
    }

    // Concatenate custom options conditionally
    let allOptions = defaultOptions.concat(customerOptions).concat(adminOptions)

    return (
        <List component="nav">
            {
                allOptions.map((item, index) => (
                    // The "key" prop MUST be provided!
                    <ListItem button divider key={index}
                        onClick={() => props.onChangeViewClick(item.control)}>
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

ActionList.propTypes = {
    // From store state
    userRights: PropTypes.string.isRequired,

    // From store actions
    onChangeViewClick: PropTypes.func.isRequired
}

function mapStateToProps(state) {
    return {
        userRights: state.currentUserRights
    }
}

function mapDispatchToProps(dispatch) {
    return {
        onChangeViewClick: nextView => {
            dispatch(changeCurrentView(nextView))
        }
    }
}

// Connect mappers with the redux store and export symbol
export default connect(mapStateToProps, mapDispatchToProps)(ActionList)