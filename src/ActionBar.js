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
import { Hidden, Grid, Divider, Icon } from "@material-ui/core"

// How wide, son?
const drawerWidth = 240

// Local styles
const styles = theme => ({
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
        [theme.breakpoints.up("md")]: {
            width: `calc(100% - ${drawerWidth}px)`,
        },
        //zIndex: theme.zIndex.drawer + 1,
    },
    navIconHide: {
        [theme.breakpoints.up("md")]: {
            display: "none",
        },
    },
    toolbar: theme.mixins.toolbar,
    toolbarText:{
        marginTop: 1.6 * theme.spacing.unit,
        marginLeft: 3 * theme.spacing.unit,
        marginBottom: 1.3 * theme.spacing.unit,
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
        padding: theme.spacing.unit * 3,
    },

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
    }

    render() {
        // Get "classes" object from props
        const { classes, theme } = this.props

        const UACButton = this.props.loggedIn ?
            (<Button className={classes.UACButton} color="inherit"
                onClick={() => this.handleToggleDialog(true, "logout")}>Sair</Button>) :
            (<Button className={classes.UACButton} color="inherit"
                onClick={() => this.handleToggleDialog(true, "signin")}>Login</Button>)

        const DrawerFill = (
            <div>
                <div className={classes.toolbarText}>
                    <Typography color="textSecondary" align="left" variant="title">
                        PetShopApp
                    </Typography>
                    <Typography gutterBottom align="left" variant="caption">
                        v0.0.1
                    </Typography>
                </div>
                <Divider />
                <ActionList />
            </div>
        )

        return (
            <div className={classes.root}>
                {/* "Self-controlling" dialog*/}
                <UACDialog
                    open={this.state.dialogOpen}
                    mode={this.state.dialogMode}
                    toggleDialog={(status, mode) => this.handleToggleDialog(status, mode)} />
                {/* "Self-controlling" drawer */}
                {/*<Drawer open={this.state.drawerOpen} onClose={() => this.handleToggleDrawer(false)}>
                    <div tabIndex={0} role="button"
                        onClick={() => this.handleToggleDrawer(false)}
                        onKeyDown={() => this.handleToggleDrawer(false)}>
                        <ActionList />
                    </div>
                </Drawer>*/}
                {/* The main thing in this shiznit */}
                {/*<AppBar position="sticky">
                    <Toolbar>
                        <IconButton className={classes.menuButton} color="inherit" aria-label="Menu"
                            onClick={() => this.handleToggleDrawer(true)}>
                            <MenuIcon />
                        </IconButton>
                        <Typography className={classes.flex} align="center" variant="title" color="inherit">
                            Pet Shop App
                        </Typography>
                        {UACButton}
                    </Toolbar>
                </AppBar>*/}
                <AppBar position="absolute" className={classes.appBar}>
                    <Toolbar>
                        <Grid container justify="space-between" alignItems="center">
                            <Grid item className={classes.menuButton}>
                                <IconButton
                                    color="inherit"
                                    aria-label="open drawer"
                                    onClick={() => this.handleToggleDrawer(true)}
                                    className={classes.navIconHide}>
                                    <Icon>pets</Icon>
                                </IconButton>
                            </Grid>
                            <Grid item>
                                {UACButton}
                            </Grid>
                        </Grid>
                    </Toolbar>
                </AppBar>
                <Hidden mdUp>
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
                        {DrawerFill}
                    </Drawer>
                </Hidden>
                <Hidden smDown implementation="css">
                    <Drawer
                        variant="permanent"
                        open
                        classes={{
                            paper: classes.drawerPaper,
                        }}>
                        {DrawerFill}
                    </Drawer>
                </Hidden>
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
    loggedIn: PropTypes.bool.isRequired,

    // From material-ui
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
}

function mapStateToProps(state) {
    return {
        loggedIn: state.currentUserLoggedIn
    }
}

// Inject styles, connect mappers with the redux store and export symbol
export default connect(mapStateToProps)(withStyles(styles, { withTheme: true })(ActionBar))