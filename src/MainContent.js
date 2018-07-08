import { CircularProgress } from "@material-ui/core"
import Avatar from "@material-ui/core/Avatar"
import Button from "@material-ui/core/Button"
import Card from "@material-ui/core/Card"
import CardMedia from "@material-ui/core/CardMedia"
import DialogContentText from "@material-ui/core/DialogContentText"
import Grid from "@material-ui/core/Grid"
import { withStyles } from "@material-ui/core/styles"
import Typography from "@material-ui/core/Typography"
import Axios from "axios"
import classNames from "classnames"
import { PropTypes } from "prop-types"
import React from "react"
import { connect } from "react-redux"
import CustomerPetContainer from "./CustomerPetContainer"
import CustomerServiceContainer from "./CustomerServiceContainer"
import CustomerShopContainer from "./CustomerShopContainer"
import { PetShopProductList, PetShopServiceList } from "./PetShopCardViews"
import PetShopResponsiveDialog from "./PetShopResponsiveDialog"
import Root from "./remote"
import { getProducts, getServices } from "./StoreActions"
import SupervisorServiceContainer from "./SupervisorServiceContainer"
import SupervisorShopContainer from "./SupervisorShopContainer"
import SupervisorUserContainer from "./SupervisorUserContainer"

// TODO AAAAAALLL THIS NEEDS TO BEGONE FROM HERE!!!
const styles = theme => ({
    listRoot: {
        flexGrow: 1,
        marginTop: -2 * theme.spacing.unit,
        marginLeft: -1 * theme.spacing.unit,
        marginRight: -1 * theme.spacing.unit,
    },

    maxCard: {
        margin: 0,
        width: "100%"
    },
    maxMedia: {
        height: 0,
        paddingTop: "50.25%", // 56.25 for 16:9
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
    avatar: {
        margin: 3 * theme.spacing.unit,
    },
    bigAvatar: { // Customize AVATAR SIZE through this class
        width: 150,
        height: 150,
    },
    progress: {
        margin: theme.spacing.unit * 2,
    },
})

/*
    Home view common component
 */
function CommonHomeContainer(props) {
    const {classes} = props

    let content = (
        <Grid container direction="column" justify="flex-start" alignItems="stretch" spacing={24}>
            <Card className={classes.maxCard}>
                <CardMedia
                    className={classes.maxMedia}
                    image={require("./media/bannerHome.png")}
                    title="Seu melhor amigo"
                />
            </Card>
            <Grid item>
                <br />
                <Grid container justify="space-around" alignItems="center">
                    <Grid item>
                        <Grid container direction="column" alignItems="center">
                            <Typography color="textSecondary" align="center" variant="headline">
                            Faça seu cadastro
                            </Typography>
                            <Avatar
                                alt="Imagem do novo pet"
                                src={require("./media/sampleDog.png")}
                                className={classNames(classes.avatar, classes.bigAvatar)} />
                            <Typography color="textSecondary" align="center" variant="body1">
                            Cadastre-se e aproveite os recursos 
                                <br />
                            que nossa plataforma pode lhe oferecer
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Grid container direction="column" alignItems="center">
                            <Typography color="textSecondary" align="center" variant="headline">
                            Consulte nossa loja
                            </Typography>
                            <Avatar
                                alt="Imagem do novo pet"
                                src={require("./media/product3.jpg")}
                                className={classNames(classes.avatar, classes.bigAvatar)} />
                            <Typography color="textSecondary" align="center" variant="body1">
                            Produtos e alimentos da melhor qualidade
                                <br />
                            para seu melhor amigo de estimação
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Grid container direction="column" alignItems="center">
                            <Typography color="textSecondary" align="center" variant="headline">
                            Agende um serviço conosco
                            </Typography>
                            <Avatar
                                alt="Imagem do novo pet"
                                src={require("./media/service1.jpg")}
                                className={classNames(classes.avatar, classes.bigAvatar)} />
                            <Typography color="textSecondary" align="center" variant="body1">
                            Garantimos prestação de serviço
                                <br />
                            com o maior carinho e atenção
                                <br />
                            que seu pet pode merecer
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )

    return (
        <div>
            {content}
        </div>
    )
}
CommonHomeContainer.propTypes = {
    // style
    classes: PropTypes.object.isRequired,

    // state
    currentUserLoggedIn: PropTypes.bool.isRequired,
}


/*
    Shop view common component
*/
class CommonShopContainer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            errorStatus: false,
            errorMessage: "none",
            doingRemoteRequest: false
        }
    }

    componentDidMount() {
        // Begin remote request
        this.setState({
            doingRemoteRequest: true,
        })
        Axios.get(Root + "/products")
            .then(response => {
                if (response.data.ok) {
                    this.setState({
                        errorStatus: false,
                        errorMessage: "none",
                        doingRemoteRequest: false
                    })
                    this.props.onGetProducts(response.data.products)
                } else {
                    this.setState({
                        errorStatus: true,
                        errorMessage: response.data.error,
                        doingRemoteRequest: false
                    })
                }
            })
            .catch(error => {
                this.setState({
                    errorStatus: true,
                    errorMessage: error.message,
                    doingRemoteRequest: false
                })
            })
    }

    render() {
        let shopContainer = null
        switch (this.props.currentUserRights) {
        case "customer":
            shopContainer =  <CustomerShopContainer />
            break
        case "supervisor":
            shopContainer = <SupervisorShopContainer />
            break
        default:
            shopContainer = <PetShopProductList
                productArray={this.props.productArray}
                currentUserRights={this.props.currentUserRights}
                onChangeCurrentView={() => {}}
                onLaunchDialog={(open) => this.props.onLaunchDialog(open)}
                onSetSelected={() => {}}
            />

        }
        return (this.state.doingRemoteRequest ?
            <Grid container justify="center">
                <CircularProgress className={this.props.classes.progress} size={50} />
            </Grid>
            :
            (this.state.errorStatus ?
                <Typography variant="title" align="center" color="primary">
                    <br />
                    Erro de servidor :(
                    <br />
                    {this.state.errorMessage}
                </Typography>
                :
                shopContainer
            )
        )
    }
}
CommonShopContainer.propTypes = {
    // style
    classes: PropTypes.object,

    // state
    productArray: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
            description: PropTypes.string.isRequired,
            amount: PropTypes.number.isRequired,
            price: PropTypes.number.isRequired,
            media: PropTypes.string.isRequired,
            localMedia: PropTypes.bool.isRequired,
        })
    ).isRequired,
    currentUserRights: PropTypes.string.isRequired,

    // actions
    onLaunchDialog: PropTypes.func.isRequired,
    onGetProducts: PropTypes.func.isRequired,
}


/*
    Service view common component
*/
class CommonServiceContainer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            errorStatus: false,
            errorMessage: "none",
            doingRemoteRequest: false
        }
    }

    componentDidMount() {
        // Begin remote request
        this.setState({
            doingRemoteRequest: true,
        })
        Axios.get(Root + "/services")
            .then(response => {
                if (response.data.ok) {
                    this.setState({
                        errorStatus: false,
                        errorMessage: "none",
                        doingRemoteRequest: false
                    })
                    this.props.onGetServices(response.data.services)
                } else {
                    this.setState({
                        errorStatus: true,
                        errorMessage: response.data.error,
                        doingRemoteRequest: false
                    })
                }
            })
            .catch(error => {
                this.setState({
                    errorStatus: true,
                    errorMessage: error.message,
                    doingRemoteRequest: false
                })
            })
    }

    render() {
        let serviceContainer = null
        switch (this.props.currentUserRights) {
        case "customer":
            serviceContainer =  <CustomerServiceContainer />
            break
        case "supervisor":
            serviceContainer = <SupervisorServiceContainer />
            break
        default:
            serviceContainer = <PetShopServiceList
                serviceArray={this.props.serviceArray}
                currentUserRights={this.props.currentUserRights}
                onChangeCurrentView={() => {}}
                onLaunchDialog={(open) => this.props.onLaunchDialog(open)}
                onSetSelected={() => {}}
            />
        }

        return (this.state.doingRemoteRequest ?
            <Grid container justify="center">
                <CircularProgress className={this.props.classes.progress} size={50} />
            </Grid>
            :
            (this.state.errorStatus ?
                <Typography variant="title" align="center" color="primary">
                    <br />
                    Erro de servidor :(
                    <br />
                    {this.state.errorMessage}
                </Typography>
                :
                serviceContainer
            )
        )
    }
}
CommonServiceContainer.propTypes = {
    // style
    classes: PropTypes.object,

    // state
    serviceArray: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
            description: PropTypes.string.isRequired,
            available: PropTypes.bool.isRequired,
            media: PropTypes.string.isRequired,
            localMedia: PropTypes.bool.isRequired,
        })
    ).isRequired,
    currentUserRights: PropTypes.string.isRequired,

    // actions
    onLaunchDialog: PropTypes.func.isRequired,
    onGetServices: PropTypes.func.isRequired,
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

    render() {
        // Application content
        let mainContent = null
        switch (this.props.currentUserView) {
        case "home":
            mainContent = <CommonHomeContainer
                classes={this.props.classes}
                currentUserLoggedIn={this.props.currentUserLoggedIn}
            />
            break
        case "shop":
            mainContent = <CommonShopContainer
                classes={this.props.classes}
                productArray={this.props.siteData.products}
                currentUserRights={this.props.currentUserRights}
                onLaunchDialog={(open) => this.handleToggleDialog(open)}
                onGetProducts={(products) => this.props.onGetProducts(products)}
            />
            break
        case "services":
            mainContent = <CommonServiceContainer
                classes={this.props.classes}
                serviceArray={this.props.siteData.services}
                currentUserRights={this.props.currentUserRights}
                onLaunchDialog={(open) => this.handleToggleDialog(open)}
                onGetServices={(services) => this.props.onGetServices(services)}
            />
            break
        case "pets":
            mainContent = <CustomerPetContainer />
            break
        case "users":
            mainContent = <SupervisorUserContainer />
            break
        case "shoppingCart":
            mainContent = <CustomerShopContainer />
            break
        case "appointments":
            mainContent = <CustomerServiceContainer />
            break
        default:
            mainContent = null
            break
        }

        // Default popup for visitors
        const dialogTitle = "Operação Inválida"
        const dialogContent = (
            <DialogContentText align="center" color="secondary">
                Faça login ou cadastre-se para acessar os serviços
            </DialogContentText>
        )
        const dialogActions = (
            <Button onClick={() => this.handleToggleDialog(false)} color="primary">
                Ok
            </Button>
        )

        return (
            <div>
                <PetShopResponsiveDialog
                    isOpen={this.state.dialogOpen}
                    onClose={() => this.handleToggleDialog(false)}
                    ariaLabel="visitor-prompt-dialog"
                    dialogTitle={dialogTitle}
                    dialogContent={dialogContent}
                    dialogActions={dialogActions}
                />
                {mainContent}
            </div>
        )
    }
}
MainContent.propTypes = {
    // style
    classes: PropTypes.object.isRequired,

    // store state
    siteData: PropTypes.object.isRequired,
    currentUserView: PropTypes.string.isRequired,
    currentUserEmail: PropTypes.string.isRequired,
    currentUserRights: PropTypes.string.isRequired,
    currentUserLoggedIn: PropTypes.bool.isRequired,

    // store actions
    onGetProducts: PropTypes.func.isRequired,
    onGetServices: PropTypes.func.isRequired
}

function mapStateToProps(state) {
    return {
        currentUserView: state.currentUserView,
        currentUserEmail: state.currentUserEmail,
        currentUserRights: state.currentUserRights,
        currentUserLoggedIn: state.currentUserLoggedIn,
        customerData: state.CustomerData,
        siteData: state.SiteData
    }
}

function mapDispatchToProps(dispatch) {
    return {
        onGetProducts: products => {
            dispatch(getProducts(products))
        },
        onGetServices: services => {
            dispatch(getServices(services))
        }
    }
}

// Inject styles, connect mappers with the redux store and export symbol
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(MainContent))