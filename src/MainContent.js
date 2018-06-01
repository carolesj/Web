import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import React from 'react';
import { UserContext } from './UserContext';

const styles = theme => ({
    root: {
        flexGrow: 1,
        margin: 2 * theme.spacing.unit,
    },

    card: {  // DON'T FORGET to add this to <Card /> for dimension control
        minWidth: 380,
        maxWidth: 480,
    },

    media: {
        height: 0,
        paddingTop: '86.25%',  // Originally, 56.25%, for 16:9 media
    },
})

let siteData = {
    products: [
        // {id: "exampleString", name:"exampleString", description: "exampleString", media: "./product1.jpg"}, {...}, ...
        { id: 1, name: "Biscoitos Caninos", description: "Deliciosos agrados de qualidade para cachorros", media: "./product1.jpg", amount: 1000 },
        { id: 2, name: "Bola de Tênis", description: "Bola verde que quica", media: "./product2.jpg", amount: 1000 },
        { id: 3, name: "Coleira", description: "Coleira de couro sintético", media: "./product3.jpg", amount: 1000 },
        { id: 4, name: "Erva de Gato", description: "Erva recreativa ressequida para gatos", media: "./product4.jpg", amount: 1000 },
        { id: 5, name: "Guia", description: "Guia para coleiras padrão", media: "./product5.JPG", amount: 1000 },
        { id: 6, name: "Petisco de Gato", description: "Deliciosos agrados de qualidade para gatos", media: "./product6.jpg", amount: 1000 },
        { id: 7, name: "Ração", description: "Ração de primeira qualidade", media: "./product7.jpg", amount: 1000 }
    ],
    services: [
        // {service: "exampleString", description: "exampleString", media: "./service1.jpg"}, {...}, ...
        { id: 1, name: "Banho", description: "Banho com xampu hipoalergênico para gatos e cães", media: "./service1.jpg", available: true },
        { id: 2, name: "Cortar Unha", description: "Cuidados com a unha de seu gato com segurança e sem machucá-lo", media: "./service2.jpg", available: true },
        { id: 3, name: "Massagem", description: "Massagem relaxante para seu cão", media: "./service3.jpg", available: true },
        { id: 4, name: "Tosa", description: "Corte dos pêlos do seu animal", media: "./service4.jpg", available: true }
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
            { id: 1, name: "Felicloper", race: "Bernese", media: "dog1.jpg" },
            { id: 2, name: "Glauber", race: "McNab", media: "dog2.jpg" },
            { id: 3, name: "Gustavo", race: "Buldogue", media: "dog3.jpg" },
            { id: 4, name: "Caramelo", race: "Harrier", media: "dog4.jpg" },
            { id: 5, name: "Carolhos", race: "SRD", media: "dog5.jpg" },
            { id: 6, name: "Nerso", race: "Labrador", media: "dog6.jpg" },
            { id: 7, name: "Sabrino", race: "Pharaoh Hound", media: "dog7.jpg" },
            { id: 8, name: "Kik", race: "Chihuahua", media: "dog8.jpg" },
            { id: 9, name: "Frederico", race: "Siamês", media: "cat1.jpg" },
            { id: 10, name: "Fofinho", race: "Maine Coon", media: "cat2.jpg" }
        ],
        appointments: [
            // {service: "exampleString", animal: "exampleString", dateUTC:"DD-MM-AAAAZ"}, {...}, ...
            { id: 1, serviceName: "Banho", animalName: "Sabrino", dateUTC: "06-06-2018Z" },
            { id: 2, serviceName: "Massagem", animalName: "Nerso", dateUTC: "24-06-2019Z" },
            { id: 3, serviceName: "Cortar Unha", animalName: "Fofinho", dateUTC: "06-08-2018Z" },
            { id: 4, serviceName: "Tosa", animalName: "Felicloper", dateUTC: "04-06-2018Z" }
        ],
    },
]

const makePresenterView = (userRights, loggedIn) => {
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

const makeProductsList = () => {
    return null
}

const makeServicesList = () => {
    return null
}

const makePetList = (classes, userEmail) => {
    let data = null
    let id = 0

    for (const user of userData) {
        if (user.email === userEmail) {
            data = user
            id = user.id
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
    return (id === 0) ? null :
        (
            <div className={classes.root}>
                <Grid container spacing={24} justify="space-around">
                    {data.animals.map((item, index) => (
                        <Grid key={index} item xs={12} sm={6} md={4}>
                            <Card>
                                <CardMedia
                                    className={classes.media}
                                    image={require("./" + item.media)}
                                    title={"My pet number " + index}
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
                                        Share
                                    </Button>
                                    <Button size="small" color="primary">
                                        Learn More
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </div>
        )
}

const makeAppointmentList = (userEmail) => {
    return null
}

const makeShoppingCartView = () => {
    return null
}

const makeStockDashboard = () => {
    return null
}

// TODO move this out of here
class MainContent extends React.Component {

    buildMainView(state) {
        let view = state.currentView

        switch (view) {
            case "home":
                return makePresenterView(state.userRights, state.loggedIn)

            case "products":
                return makeProductsList()

            case "services":
                return makeServicesList()

            case "appointments":
                return makeAppointmentList(state.userEmail)

            case "pets":
                return makePetList(this.props.classes, state.userEmail)

            case "cart":
                return makeShoppingCartView()

            case "stock":
                return makeStockDashboard()

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