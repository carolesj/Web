import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Chip from '@material-ui/core/Chip';
import Divider from '@material-ui/core/Divider';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import classNames from 'classnames';
import { PropTypes } from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

const styles = theme => ({
    mainRoot: {
        flexGrow: 1,
        margin: 2 * theme.spacing.unit,
    },

    expRoot: {
        width: '100%',
        margin: 2 * theme.spacing.unit,
    },

    card: {  // DON'T FORGET to add this to <Card /> for dimension control
        minWidth: 380,
        maxWidth: 480,
    },

    media: {
        height: 0,
        paddingTop: '76.25%',  // Originally, 56.25%, meaning 16:9 media
    },

    heading: {
        fontSize: theme.typography.pxToRem(15),
    },

    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
    },

    icon: {
        verticalAlign: 'bottom',
        height: 20,
        width: 20,
    },

    details: {
        alignItems: 'center',
    },

    column: {
        flexBasis: '33.33%',
    },

    helper: {
        borderLeft: `2px solid ${theme.palette.divider}`,
        padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
    },

    link: {
        color: theme.palette.primary.main,
        textDecoration: 'none',
        '&:hover': {
            textDecoration: 'underline',
        },
    },
})

/*
    DATA VIEW BUILDERS
 */
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

const commonProductList = (classes, siteData) => {
    return (
        <div className={classes.mainRoot}>
            <Grid container spacing={24} justify="flex-start">
                {siteData.products.map((item, index) => (
                    <Grid key={index} item xs={12} sm={6} md={4}>
                        <Card>
                            <CardMedia
                                className={classes.media}
                                image={require("./media/" + item.media)}
                                title={"Serviço de " + item.name}
                            />
                            <CardContent>
                                <Typography gutterBottom variant="headline" component="h2">
                                    {item.name}
                                </Typography>
                                <Typography component="p">
                                    {item.description}
                                </Typography>
                                {item.amount > 0 ?
                                    <Typography variant="caption" gutterBottom align="left">
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
                                    <Button size="small" color="primary">
                                        Comprar
                                    </Button>
                                    :
                                    <Button disabled size="small" color="primary">
                                        Comprar
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

const commonServiceList = (classes, siteData) => {
    return (
        <div className={classes.mainRoot}>
            <Grid container spacing={24} justify="flex-start">
                {siteData.services.map((item, index) => (
                    <Grid key={index} item xs={12} sm={6} md={4}>
                        <Card>
                            <CardMedia
                                className={classes.media}
                                image={require("./media/" + item.media)}
                                title={"Serviço de " + item.name}
                            />
                            <CardContent>
                                <Typography gutterBottom variant="headline" component="h2">
                                    {item.name}
                                </Typography>
                                <Typography component="p">
                                    {item.description}
                                </Typography>
                                {item.available ?
                                    <Typography variant="caption" gutterBottom align="left">
                                        <br />
                                        Disponível para agendamento
                                    </Typography>
                                    :
                                    <Typography variant="body1" color="error" gutterBottom align="left">
                                        <br />
                                        Serviço indisponível
                                    </Typography>
                                }
                            </CardContent>
                            <CardActions>
                                {item.available ?
                                    <Button size="small" color="primary">
                                        Contratar
                                    </Button>
                                    :
                                    <Button disabled size="small" color="primary">
                                        Contratar
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

const customerPetList = (classes, userEmail, customerData) => {
    let data = null
    for (const user of customerData) {
        if (user.email === userEmail) {
            data = user
        }
    }

    /*
        GRID TYPE

            Full-width, with grow (control grow via outer div and justification
            via the Grid container element).
        
        GRID ITEM

            Size controlled via breakpoints, for xs, sm, and upper.
            (To re-enable control via media size, set the class to classes.media.)

        CARD TYPE

            Media container. (TODO include pet register control in the cards.)

     */
    return (data === null) ? null :  // Don't worry, this comparison is safe
        (
            <div className={classes.mainRoot}>
                <Grid container spacing={24} justify="flex-start">
                    {data.animals.map((item, index) => (
                        <Grid key={index} item xs={12} sm={6} md={4}>
                            <Card>
                                <CardMedia
                                    className={classes.media}
                                    image={require("./media/" + item.media)}
                                    title={"Meu pet " + item.name}
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="headline" component="h2">
                                        {item.name}
                                    </Typography>
                                    <Typography component="p">
                                        {"Raça: " + item.race}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button size="small" color="primary">
                                        Editar
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </div>
        )
}

const customerAppointList = (classes, userEmail, customerData) => {
    let data = null
    for (const user of customerData) {
        if (user.email === userEmail) {
            data = user
        }
    }

    // For generating text out of date info
    let dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    return (data === null) ? null :
        (
            //<div className={classes.expRoot}>
            <div>
                {data.appointments.map((item, index) => (
                    <ExpansionPanel key={index}>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                            <div className={classes.column}>
                                <Typography className={classes.heading}>
                                    {(new Date(item.date)).toLocaleDateString("pt-BR", dateOptions)}
                                </Typography>
                            </div>
                            <div className={classes.column}>
                            </div>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails className={classes.details}>
                            <div className={classes.column}>
                                <Typography className={classes.secondaryHeading}>
                                    {`Serviço: ${item.serviceName}`}
                                </Typography>
                            </div>
                            <div className={classes.column}>
                                <Chip label={item.animalName} className={classes.chip}
                                    avatar={<Avatar src={require("./media/" + data.animals[item.animalId].media)} />}
                                    onClick={() => { console.log(data.animals[item.animalId].media) }} />
                            </div>
                            <div className={classNames(classes.column, classes.helper)}>
                                <Typography variant="caption">
                                    Seu pet a ser tratado no serviço<br />
                                    <a href="./" className={classes.link}>
                                        Deseja tratar outro pet?
                                        </a>
                                </Typography>
                            </div>
                        </ExpansionPanelDetails>
                        <Divider />
                        <ExpansionPanelActions>
                            <Button size="small" color="secondary">Cancelar</Button>
                            <Button size="small" color="primary">Trocar data</Button>
                        </ExpansionPanelActions>
                    </ExpansionPanel>
                ))}
            </div>
        )
}

// TODO
const customerShoppingCartSummary = (classes, userEmail, customerData) => {
    return null
}

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
    DATA VIEW MODIFIERS
 */

// TODO stuff here

/*
    MAIN COMPONENT CLASS
 */
class MainContent extends React.Component {

    buildMainView() {
        switch (this.props.userView) {
            // Visitor options
            case "home":
                return commonHomeSummary(this.props.userRights, this.props.userLoggedIn)

            case "products":
                return commonProductList(this.props.classes, this.props.SiteData)

            case "services":
                return commonServiceList(this.props.classes, this.props.SiteData)

            // Customer options
            case "myPets":
                return customerPetList(this.props.classes, this.props.userEmail, this.props.CustomerData)

            case "myAppoints":
                return customerAppointList(this.props.classes, this.props.userEmail, this.props.CustomerData)

            case "myShoppingCart":
                return customerShoppingCartSummary(this.props.classes, this.props.userEmail, this.props.CustomerData)

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
                {this.buildMainView()}
            </div>
        )
    }
}

MainContent.propTypes = {
    // From store state
    userView: PropTypes.string.isRequired,
    userEmail: PropTypes.string.isRequired,
    userRights: PropTypes.string.isRequired,
    userLoggedIn: PropTypes.bool.isRequired,
    // CustomerData
    // SiteData
}

function mapStateToProps(state) {
    return {
        userView: state.currentUserView,
        userEmail: state.currentUserEmail,
        userRights: state.currentUserRights,
        userLoggedIn: state.currentUserLoggedIn,
        CustomerData: state.CustomerData,
        SiteData: state.SiteData
    }
}

// Inject styles, connect mappers with the redux store and export symbol
export default connect(mapStateToProps)(withStyles(styles)(MainContent))