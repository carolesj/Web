import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import PropTypes from "prop-types"
import React from "react"
import { connect } from "react-redux"
import { changeCurrentView } from "./StoreActions"

function ActionList(props) {
    let allOptions = []

    if (props.userRights === "visitor") {
        allOptions = [
            { control: "home", pt: "Início", st: "Página inicial" },
            { control: "shop", pt: "Loja", st: "Consulte nosso catálogo" },
            { control: "services", pt: "Serviços", st: "Consulte os serviços prestados" },
        ]
    }

    if (props.userRights === "customer") {
        allOptions = [
            { control: "home", pt: "Início", st: "Sua página inicial" },
            { control: "shop", pt: "Loja", st: "Consulte nosso catálogo" },
            { control: "pets", pt: "Meus Pets", st: "Controle sua lista de pets" },
            { control: "services", pt: "Serviços", st: "Marque seus agendamentos" },
            { control: "appointments", pt: "Agendamentos", st: "Controle suas requisições" },
        ]
    }

    if (props.userRights === "supervisor") {
        allOptions = [
            { control: "home", pt: "Início", st: "Sua página inicial" },
            { control: "shop", pt: "Estoque", st: "Controle de catálogo da loja" },
            { control: "users", pt: "Usuários", st: "Controle do cadastros de usuários" },
            { control: "services", pt: "Serviços", st: "Controle de serviços e agendamentos" },
        ]
    }

    return (
        <List component="nav">
            {
                allOptions.map((item, index) => (
                    // The "key" prop MUST be provided!
                    <ListItem button key={index}
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