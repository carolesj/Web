import { Grid, Icon } from "@material-ui/core"
import AppBar from "@material-ui/core/AppBar"
import Button from "@material-ui/core/Button"
import Drawer from "@material-ui/core/Drawer"
import IconButton from "@material-ui/core/IconButton"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import Toolbar from "@material-ui/core/Toolbar"
import Typography from "@material-ui/core/Typography"
import { withStyles } from "@material-ui/core/styles"
import MenuIcon from "@material-ui/icons/Menu"
import classNames from "classnames"
import PropTypes from "prop-types"
import React from "react"
import { connect } from "react-redux"
import MainContent from "./MainContent"
import { changeCurrentView } from "./StoreActions"
import UACDialog from "./UACDialog"

/*
    Style sheet for whole appbar
 */
const drawerWidth = 240
const styles = theme => ({
    // New AppBar
    root: {
        flexGrow: 1,
        zIndex: 1,
        //overflowX: "auto",
        //overflowY: "hidden",
        position: "relative",
        display: "flex",
        height: "100%",
        width: "100%",
    },
    logo: {
        marginLeft: 2*theme.spacing.unit
    },
    appBar: {
        position: "absolute",
        marginLeft: drawerWidth,
        //[theme.breakpoints.up("md")]: {
        //    width: `calc(100% - ${drawerWidth}px)`,
        //},
        //zIndex: theme.zIndex.drawer + 1,
        width: "100%",
    },
    navIconHide: {
        [theme.breakpoints.up("md")]: {
            display: "none",
        },
    },
    navButtonHide: {
        [theme.breakpoints.down("sm")]: {
            display: "none",
        },
    },
    drawerPaper: {
        width: drawerWidth,
        [theme.breakpoints.up("md")]: {
            position: "relative",
        },
    },
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        // TODO Remove this padding and set margin for all main content
        padding: theme.spacing.unit * 3, // PADDING FOR ALL CONTENT HERE!!!
    },
    toolbar: theme.mixins.toolbar,
})


/*
    Option list for each user
 */
const visitorOptions = [
    { control: "home", pt: "Início", st: "Página inicial" },
    { control: "shop", pt: "Loja", st: "Consulte nosso catálogo" },
    { control: "services", pt: "Serviços", st: "Consulte os serviços prestados" },
]

const customerOptions = [
    { control: "home", pt: "Início", st: "Sua página inicial" },
    { control: "shop", pt: "Loja", st: "Consulte nosso catálogo" },
    { control: "pets", pt: "Meus Pets", st: "Controle sua lista de pets" },
    { control: "services", pt: "Serviços", st: "Marque seus agendamentos" },
    { control: "appointments", pt: "Agendamentos", st: "Controle suas requisições" },
]

const supervisorOptions = [
    { control: "home", pt: "Início", st: "Sua página inicial" },
    { control: "shop", pt: "Estoque", st: "Controle de catálogo da loja" },
    { control: "users", pt: "Usuários", st: "Controle do cadastros de usuários" },
    { control: "services", pt: "Serviços", st: "Controle de serviços e agendamentos" },
]


class PetShopActionBar extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            anchorEl: null,
            drawerOpen: false,
            dialogOpen: false,
            dialogMode: "signin",
        }
    }


    /*
        Local state handlers
     */
    handleToggleDrawer(status) {
        this.setState({
            drawerOpen: status,
        })
    }

    handleToggleDialog(status, mode) {
        this.setState({
            dialogOpen: status,
            dialogMode: mode,
        })
    }


    /*
        Main render function
     */
    render() {
        const { classes, theme } = this.props

        // Option list for current user
        let optionList = visitorOptions
        if (this.props.currentUserRights === "customer")
            optionList = customerOptions
        if (this.props.currentUserRights === "supervisor")
            optionList = supervisorOptions

        return (
            <div className={classes.root}>

                {/* Modals */}
                <UACDialog
                    open={this.state.dialogOpen}
                    mode={this.state.dialogMode}
                    toggleDialog={(status, mode) => this.handleToggleDialog(status, mode)} />

                {/* Application appbar */}
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <Grid container justify="space-between" alignItems="center">
                            <Grid item>
                                {/* Show this on small displays */}
                                <IconButton
                                    color="inherit"
                                    aria-label="home-button"
                                    onClick={() => this.handleToggleDrawer(true)}
                                    className={classNames(classes.menuButton, classes.navIconHide)}>
                                    <MenuIcon />
                                </IconButton>

                                {/* Show this on bigger displays */}
                                <IconButton
                                    color="inherit"
                                    aria-label="home-button"
                                    onClick={() => this.props.handleChangeCurrentView("home")}
                                    className={classNames(classes.menuButton, classes.navButtonHide)}>
                                    <Icon>home</Icon>
                                </IconButton>
                                <Button className={classes.navButtonHide} color="inherit"
                                    onClick={() => this.props.handleChangeCurrentView("shop")}>
                                        Loja
                                </Button>
                                <Button className={classes.navButtonHide} color="inherit"
                                    onClick={() => this.props.handleChangeCurrentView("services")}>
                                        Serviços
                                </Button>

                                {/* Show this for customers only */}
                                {(this.props.currentUserRights === "customer") &&
                                    <Button className={classes.navButtonHide} color="inherit"
                                        onClick={() => this.props.handleChangeCurrentView("pets")}>
                                        Meus Pets
                                    </Button>
                                }
                                {(this.props.currentUserRights === "customer") &&
                                    <Button className={classes.navButtonHide} color="inherit"
                                        onClick={() => this.props.handleChangeCurrentView("appointments")}>
                                        Agendamentos
                                    </Button>
                                }

                                {/* Show this for supervisors only */}
                                {(this.props.currentUserRights === "supervisor") &&
                                    <Button className={classes.navButtonHide} color="inherit"
                                        onClick={() => this.props.handleChangeCurrentView("users")}>
                                        Usuários
                                    </Button>
                                }
                            </Grid>

                            <Grid item>
                                <Typography variant="title" color="inherit"
                                    className={classNames(classes.logo, classes.navIconHide)}>
                                    PetClovis
                                </Typography>
                            </Grid>


                            {/* UAC Button */}
                            <Grid item>
                                {this.props.currentUserLoggedIn ?
                                    <Button color="inherit"
                                        onClick={() => this.handleToggleDialog(true, "logout")}
                                    >
                                        Sair
                                    </Button>
                                    :
                                    <Button color="inherit"
                                        onClick={() => this.handleToggleDialog(true, "signin")}
                                    >
                                        Entrar
                                    </Button>
                                }
                            </Grid>
                        </Grid>
                    </Toolbar>
                </AppBar>

                {/* Application drawer */}
                <Drawer
                    variant="temporary"
                    anchor={theme.direction === "rtl" ? "right" : "left"}
                    open={this.state.drawerOpen}
                    onClose={() => this.handleToggleDrawer(false)}
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile. TODO Is it tho?
                    }}
                >

                    <List component="nav">
                        {
                            optionList.map((item, index) => (
                                <ListItem button key={index}
                                    onClick={() => this.props.handleChangeCurrentView(item.control)}
                                >
                                    <ListItemText primary={item.pt} secondary={item.st} />
                                </ListItem>
                            ))
                        }
                    </List>
                </Drawer>

                {/* Content area */}
                <main className={classes.content}>
                    <div className={classes.toolbar} /> {/*TODO Why do we need this here?*/}
                    <MainContent />
                </main>
            </div>
        )
    }
}

PetShopActionBar.propTypes = {
    // style
    theme: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,

    // store state
    currentUserView: PropTypes.string.isRequired,
    currentUserRights: PropTypes.string.isRequired,
    currentUserLoggedIn: PropTypes.bool.isRequired,

    // store actions
    handleChangeCurrentView: PropTypes.func.isRequired,
}

function mapStateToProps(state) {
    return {
        currentUserView: state.currentUserView,
        currentUserRights: state.currentUserRights,
        currentUserLoggedIn: state.currentUserLoggedIn,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        handleChangeCurrentView: nextView => {
            dispatch(changeCurrentView(nextView))
        },
    }
}

// Inject styles, connect mappers with the redux store and export symbol
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(PetShopActionBar))