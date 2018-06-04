import Button from "@material-ui/core/Button"
import Card from "@material-ui/core/Card"
import CardActions from "@material-ui/core/CardActions"
import CardContent from "@material-ui/core/CardContent"
import CardMedia from "@material-ui/core/CardMedia"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogContentText from "@material-ui/core/DialogContentText"
import DialogTitle from "@material-ui/core/DialogTitle"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import { withStyles } from "@material-ui/core/styles"
import { PropTypes } from "prop-types"
import React from "react"
import { connect } from "react-redux"
import CustomerPetViewBehavior from "./CustomerPetViewBehavior"
import CustomerServiceViewBehavior from "./CustomerServiceViewBehavior"
import CustomerShopViewBehavior from "./CustomerShopViewBehavior"

const styles = theme => ({
    mainRoot: {
        flexGrow: 1,
        margin: 2 * theme.spacing.unit,
    },

    expRoot: {
        width: "100%",
        margin: 2 * theme.spacing.unit,
    },

    card: {  // DON'T FORGET to add this to <Card /> for dimension control
        minWidth: 380,
        maxWidth: 480,
    },

    media: {
        height: 0,
        paddingTop: "76.25%",  // Originally, 56.25%, meaning 16:9 media
    },

    heading: {
        fontSize: theme.typography.pxToRem(15),
    },

    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
    },

    icon: {
        verticalAlign: "bottom",
        height: 20,
        width: 20,
    },

    details: {
        alignItems: "center",
    },

    column: {
        flexBasis: "33.33%",
    },

    helper: {
        borderLeft: `2px solid ${theme.palette.divider}`,
        padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
    },

    link: {
        color: theme.palette.primary.main,
        textDecoration: "none",
        "&:hover": {
            textDecoration: "underline",
        },
    },
})

/*
    DATA VIEW BUILDERS
 */
// TODO HERE
const commonHomeSummary = (userRights, userLoggedIn) => {
    let headtext = null
    let subtext = null

    if (userLoggedIn) {
        headtext = "Você é um " + userRights
        subtext = "Explore o painel para mais opções"
    } else {
        headtext = "Seja bem vindo!"
        subtext = "Faça login para mais informações ou compra de produtos e serviços"
    }

    return (
        <div>
            <br />
            <br />
            <Typography align="center" variant="display3" gutterBottom>
                {headtext}
            </Typography>
            <Typography align="center" variant="subheading" gutterBottom>
                {subtext}
            </Typography>
        </div>
    )
}

/*
    Common shop list view
 */
function CommonShopViewBehavior(props) {
    /*
        required props:

        - classes
        - siteData

        - onToggleDialog(open, mode)
        - onSetSelected(id)
     */

    // Destructure classes
    const { classes } = props

    return (
        <div className={classes.listRoot}>
            <Grid container spacing={24} justify="flex-start">
                {props.siteData.products.map((item, index) => (
                    <Grid key={index} item xs={12} sm={6} md={4}>
                        <Card>
                            <CardMedia
                                className={classes.media}
                                image={item.localMedia ? require(`${item.media}`) : item.media}
                                title={"Serviço de " + item.name}
                            />
                            <CardContent>
                                <Typography gutterBottom variant="headline" component="h2">
                                    {`${item.name} - R$${item.price}`}
                                </Typography>
                                <Typography component="p">
                                    {item.description}
                                </Typography>
                                {item.amount > 0 ?
                                    <Typography variant="body1" gutterBottom align="left">
                                        <br />
                                        {`Disponibilidade: ${item.amount} unidades`}
                                    </Typography>
                                    :
                                    <Typography variant="body1" color="error" gutterBottom align="left">
                                        <br />
                                        Produto esgotado
                                    </Typography>
                                }
                            </CardContent>
                            <CardActions>
                                {item.amount > 0 ?
                                    <Button size="small" color="primary"
                                        onClick={() => { props.onToggleDialog(true) }}>
                                        Adicionar ao Carrinho
                                    </Button>
                                    :
                                    <Button disabled size="small" color="primary">
                                        Adicionar ao Carrinho
                                    </Button>
                                }
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </div>
    )
}

CommonShopViewBehavior.propTypes = {
    classes: PropTypes.object.isRequired,
    siteData: PropTypes.object.isRequired,
    onToggleDialog: PropTypes.func.isRequired,
}

// TODO HERE

// TODO
const supervisorUserControlView = () => {
    return null
}

// TODO
const supervisorStockControlView = () => {
    return null
}

// TODO
const supervisorServiceControlView = () => {
    return null
}

/*
    MAIN COMPONENT CLASS
 */
class MainContent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            dialogOpen: false,
        }
    }

    handleToggleDialog(open) {
        this.setState({
            dialogOpen: open,
        })
    }

    buildMainView() {
        switch (this.props.userView) {
        // Visitor options
        case "home":
            return commonHomeSummary(this.props.userRights, this.props.userLoggedIn)

        case "products":
            switch (this.props.userRights) {
            case "customer":
                return <CustomerShopViewBehavior />
            case "supervisor":
                // TODO HERE
                return null
            default:
                return <CommonShopViewBehavior classes={this.props.classes} siteData={this.props.siteData}
                    onToggleDialog={(open) => this.handleToggleDialog(open)} />
            }

        case "services":
            switch (this.props.userRights) {
            case "customer":
                // TODO HERE
                return <CustomerServiceViewBehavior />
            case "supervisor":
                // TODO HERE
                return null
            default:
                // TODO HERE
                return null
            }

        // Customer options
        case "myPets":
            return <CustomerPetViewBehavior />

        case "myShoppingCart":
            return <CustomerShopViewBehavior />

        case "myAppoints":
            return <CustomerServiceViewBehavior />

        // Supervisor options
        case "userCtl":
            return supervisorUserControlView()

        case "stockCtl":
            return supervisorStockControlView()

        case "serviceCtl":
            return supervisorServiceControlView()

        default:
            return null
        }
    }

    render() {
        return (
            <div>
                <Dialog open={this.state.dialogOpen} aria-labelledby="visitor-dialog-title"
                    onClose={() => this.handleToggleDialog(false)}>

                    <DialogTitle id="visitor-dialog-title">
                        Operação Inválida
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText align="center" color="secondary">
                            Faça login ou cadastre-se para acessar nossos serviços
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.handleToggleDialog(false)} color="primary">
                            Ok
                        </Button>
                    </DialogActions>
                </Dialog>

                {this.buildMainView()}
            </div>
        )
    }
}

MainContent.propTypes = {
    classes: PropTypes.object.isRequired,
    userView: PropTypes.string.isRequired,
    userEmail: PropTypes.string.isRequired,
    userRights: PropTypes.string.isRequired,
    userLoggedIn: PropTypes.bool.isRequired,
    siteData: PropTypes.object.isRequired,
}

function mapStateToProps(state) {
    return {
        userView: state.currentUserView,
        userEmail: state.currentUserEmail,
        userRights: state.currentUserRights,
        userLoggedIn: state.currentUserLoggedIn,
        customerData: state.CustomerData,
        siteData: state.SiteData
    }
}

// Inject styles, connect mappers with the redux store and export symbol
export default connect(mapStateToProps)(withStyles(styles)(MainContent))