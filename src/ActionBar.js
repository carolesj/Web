import AppBar from "@material-ui/core/AppBar"
import Button from "@material-ui/core/Button"
import Drawer from "@material-ui/core/Drawer"
import IconButton from "@material-ui/core/IconButton"
import Toolbar from "@material-ui/core/Toolbar"
import Typography from "@material-ui/core/Typography"
import { withStyles } from "@material-ui/core/styles"
import MenuIcon from "@material-ui/icons/Menu"
import PropTypes from "prop-types"
import React from "react"
import { connect } from "react-redux"
import ActionList from "./ActionList"
import UACDialog from "./UACDialog"
import MainContent from "./MainContent"
import AccountCircle from "@material-ui/icons/AccountCircle"
import { Hidden, Grid, Divider, Icon, Menu, MenuItem } from "@material-ui/core"
import { changeCurrentView } from "./StoreActions"
import classNames from "classnames"

// How wide, son?
const drawerWidth = 240

// Local styles
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
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
        width: drawerWidth,
        [theme.breakpoints.up("md")]: {
            position: "relative",
        },
    },
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing.unit * 3, // PADDING FOR ALL CONTENT HERE!!!
    },

    // Old AppBar
    flex: {
        flex: 1,
    },
    UACButton: {
        marginRight: -14,
    },
    menuButton: {
        marginLeft: -10,
        marginRight: 20,
    },
})

class ActionBar extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            anchorEl: null,
            drawerOpen: false,
            dialogOpen: false,
            dialogMode: "signin",
        }
    }

    handleToggleDrawer(status) {
        this.setState({
            drawerOpen: status,
        })
    }

    handleToggleDialog(status, mode) {
        /*
            Where "mode" must be either
            "signin", "signup" or "logout".
         */
        this.setState({
            dialogOpen: status,
            dialogMode: mode,
        })

        if (!status) {
            this.handleToggleAnchorMenu()
        }
    }

    handleToggleAnchorMenu(event=null) {
        this.setState({
            anchorEl: (event === null) ? null : event.currentTarget,
        })
    }

    render() {
        // Get "classes" object from props
        const { classes, theme } = this.props

        return (
            <div className={classes.root}>
                {/* Include UAC dialog */}
                <UACDialog
                    open={this.state.dialogOpen}
                    mode={this.state.dialogMode}
                    toggleDialog={(status, mode) => this.handleToggleDialog(status, mode)} />

                {/* Main AppBar */}
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <Grid container justify="space-between" alignItems="center">
                            <Grid item>
                                {/* Show this on small displays */}
                                <Grid container direction="row" alignItems="center">
                                    <IconButton
                                        color="inherit"
                                        aria-label="home-button"
                                        onClick={() => this.handleToggleDrawer(true)}
                                        className={classNames(classes.menuButton, classes.navIconHide)}>
                                        <MenuIcon />
                                    </IconButton>
                                    <Typography variant="title" color="inherit"
                                        className={classes.navIconHide}>
                                    PetShopApp v0.0.1
                                    </Typography>
                                </Grid>

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
                                <div>
                                    {(this.props.currentUserRights === "customer") &&
                                    <IconButton
                                        color="inherit"
                                        aria-label="shopping-cart-button"
                                        onClick={() => this.props.handleChangeCurrentView("shoppingCart")}
                                    >
                                        <Icon>shopping_cart</Icon>
                                    </IconButton>
                                    }

                                    <IconButton
                                        aria-owns={this.state.anchorEl ? "menu-appbar" : null}
                                        aria-haspopup="true"
                                        color="inherit"
                                        onClick={e => this.handleToggleAnchorMenu(e)}
                                    >
                                        <AccountCircle />
                                    </IconButton>

                                    <Menu
                                        id="menu-appbar"
                                        anchorEl={this.state.anchorEl}
                                        anchorOrigin={{
                                            vertical: "top",
                                            horizontal: "right",
                                        }}
                                        transformOrigin={{
                                            vertical: "top",
                                            horizontal: "right",
                                        }}
                                        open={Boolean(this.state.anchorEl)}
                                        onClose={() => this.handleToggleAnchorMenu()}
                                    >
                                        {this.props.currentUserLoggedIn ?
                                            <div>
                                                <MenuItem onClick={() => {this.handleToggleDialog(true, "logout")}}>
                                                    Sair
                                                </MenuItem>
                                            </div>
                                            :
                                            <div>
                                                <MenuItem onClick={() => {this.handleToggleDialog(true, "signin")}}>
                                                    Login
                                                </MenuItem>
                                                <MenuItem onClick={() => {this.handleToggleDialog(true, "signup")}}>
                                                    Cadastro
                                                </MenuItem>
                                            </div>
                                        }
                                    </Menu>
                                </div>
                            </Grid>
                        </Grid>
                    </Toolbar>
                </AppBar>

                {/* Main Drawer */}
                <Drawer
                    variant="temporary"
                    anchor={theme.direction === "rtl" ? "right" : "left"}
                    open={this.state.drawerOpen}
                    onClose={() => this.handleToggleDrawer(false)}
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}>
                    <ActionList />
                </Drawer>

                <main className={classes.content}>
                    <div className={classes.toolbar} />
                    <MainContent />
                </main>
            </div>
        )
    }
}

// Do typechecking
ActionBar.propTypes = {
    // From store state
    currentUserView: PropTypes.string.isRequired,
    currentUserRights: PropTypes.string.isRequired,
    currentUserLoggedIn: PropTypes.bool.isRequired,
    handleChangeCurrentView: PropTypes.func.isRequired,

    // From material-ui
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
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
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(ActionBar))