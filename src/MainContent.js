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
import React from 'react';
import { UserContext } from './UserContext';

const styles = theme => ({
    root: {
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
    STATIC DATA

    Declares initial static data for profiles and such.
 */
let siteData = {
    products: [
        // {id: "exampleString", name:"exampleString", description: "exampleString", media: "./product1.jpg"}, {...}, ...
        { id: 0, name: "Biscoitos Caninos", description: "Deliciosos agrados de qualidade para cachorros", media: "product1.jpg", amount: 1000 },
        { id: 1, name: "Bola de Tênis", description: "Bola verde que quica", media: "product2.jpg", amount: 1000 },
        { id: 2, name: "Coleira", description: "Coleira de couro sintético", media: "product3.jpg", amount: 1000 },
        { id: 3, name: "Erva de Gato", description: "Erva recreativa ressequida para gatos", media: "product4.jpg", amount: 0 },
        { id: 4, name: "Guia", description: "Guia para coleiras padrão", media: "product5.JPG", amount: 1000 },
        { id: 5, name: "Petisco de Gato", description: "Deliciosos agrados de qualidade para gatos", media: "product6.jpg", amount: 1000 },
        { id: 6, name: "Ração", description: "Ração de primeira qualidade", media: "product7.jpg", amount: 1000 }
    ],
    services: [
        // {service: "exampleString", description: "exampleString", media: "./service1.jpg"}, {...}, ...
        { id: 0, name: "Banho", description: "Banho com xampu hipoalergênico para gatos e cães", media: "service1.jpg", available: true },
        { id: 1, name: "Cortar Unha", description: "Cuidados com a unha de seu gato com segurança e sem machucá-lo", media: "service2.jpg", available: false },
        { id: 2, name: "Massagem", description: "Massagem relaxante para seu cão", media: "service3.jpg", available: true },
        { id: 3, name: "Tosa", description: "Corte dos pêlos do seu animal", media: "service4.jpg", available: true }
    ],
    shoppingCart: {
        user: "",
        items: [],
    },
}

let userData = [
    {
        id: 1,
        email: "user@example.com",
        animals: [
            // {name: "exampleString", race: "exampleString", media: "./dog1.jpg"}, {...}, ...
            { id: 0, name: "Felicloper", race: "Bernese", media: "dog1.jpg" },
            { id: 1, name: "Glauber", race: "McNab", media: "dog2.jpg" },
            { id: 2, name: "Gustavo", race: "Buldogue", media: "dog3.jpg" },
            { id: 3, name: "Caramelo", race: "Harrier", media: "dog4.jpg" },
            { id: 4, name: "Carolhos", race: "SRD", media: "dog5.jpg" },
            { id: 5, name: "Nerso", race: "Labrador", media: "dog6.jpg" },
            { id: 6, name: "Sabrino", race: "Pharaoh Hound", media: "dog7.jpg" },
            { id: 7, name: "Kik", race: "Chihuahua", media: "dog8.jpg" },
            { id: 8, name: "Frederico", race: "Siamês", media: "cat1.jpg" },
            { id: 9, name: "Fofinho", race: "Maine Coon", media: "cat2.jpg" }
        ],
        appointments: [
            // {service: "exampleString", animal: "exampleString", dateUTC:"MM/DD/AAAA XX:YY:ZZ GMT-3"}, {...}, ...
            { serviceId: 0, serviceName: "Banho", animalId: 6, animalName: "Sabrino", date: "06/06/2018 14:00:00 GMT-3" },
            { serviceId: 2, serviceName: "Massagem", animalId: 5, animalName: "Nerso", date: "06/24/2019 14:00:00 GMT-3" },
            { serviceId: 1, serviceName: "Cortar Unha", animalId: 9, animalName: "Fofinho", date: "08/06/2018 14:00:00 GMT-3" },
            { serviceId: 3, serviceName: "Tosa", animalId: 0, animalName: "Felicloper", date: "06/04/2018 14:00:00 GMT-3" }
        ],
    },
]

/*
    DATA VIEW BUILDERS
 */
const commonHomeSummary = (userRights, loggedIn) => {
    let headtext = null
    let subtext = null

    if (loggedIn) {
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

const commonProductList = (classes) => {
    return (
        <div className={classes.root}>
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

const commonServiceList = (classes) => {
    return (
        <div className={classes.root}>
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

const customerPetList = (classes, userEmail) => {
    let data = null

    for (const user of userData) {
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
            <div className={classes.root}>
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

const customerAppointList = (classes, userEmail) => {
    let data = null

    for (const user of userData) {
        if (user.email === userEmail) {
            data = user
        }
    }

    // For generating text out of date info
    let dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    return (data === null) ? null :
        (
            <div className={classes.expRoot}>
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
                                    onClick={() => {console.log(data.animals[item.animalId].media)}} />
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
const customerShoppingCartSummary = (classes, userEmail) => {
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

    buildMainView(state) {
        let view = state.currentView

        switch (view) {
            // Visitor options
            case "home":
                return commonHomeSummary(state.userRights, state.loggedIn)

            case "products":
                return commonProductList(this.props.classes)

            case "services":
                return commonServiceList(this.props.classes)

            // Customer options
            case "myPets":
                return customerPetList(this.props.classes, state.userEmail)

            case "myAppoints":
                return customerAppointList(this.props.classes, state.userEmail)

            case "myShoppingCart":
                return customerShoppingCartSummary(this.props.classes, state.userEmail)

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
            <UserContext.Consumer>
                {state => (
                    <div>
                        {this.buildMainView(state)}
                    </div>
                )}
            </UserContext.Consumer>
        )
    }
}

export default withStyles(styles)(MainContent)