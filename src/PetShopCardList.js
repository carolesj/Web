import { withStyles } from "@material-ui/core"
import Button from "@material-ui/core/Button"
import Card from "@material-ui/core/Card"
import CardActions from "@material-ui/core/CardActions"
import CardContent from "@material-ui/core/CardContent"
import CardMedia from "@material-ui/core/CardMedia"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import AddIcon from "@material-ui/icons/Add"
import { PropTypes } from "prop-types"
import React from "react"


/*
    Style sheet for all lists
 */
const style = theme => ({
    // Service list
    root: {
        flexGrow: 1,
        marginTop: -2 * theme.spacing.unit,
        marginLeft: -1 * theme.spacing.unit,
        marginRight: -1 * theme.spacing.unit,
    },
    card: {  // Add this class to <Card /> for dimension control
        minWidth: 380,
        maxWidth: 480,
    },
    media: {
        height: 0,
        paddingTop: "76.25%",  // Originally, 56.25%, meaning 16:9 media
    },
    details: {
        alignItems: "center",
    },
})


/*
    Pet card list for the pet shop app
 */
const PetShopPetList = withStyles(style)(props => {

    // Destructure props
    const {
        classes,
        animalArray,
        onSetSelected,
        onLaunchDialog
    } = props

    return (
        <div className={classes.root}>
            <Grid container spacing={16} direction="column" justify="flex-start" alignItems="flex-end">
                <Grid item>
                    <Button variant="raised" color="primary"
                        onClick={() => onLaunchDialog(true, "registryAdd")}>
                        <AddIcon />
                        Cadastrar Novo Pet
                    </Button>
                </Grid>
            </Grid>
            <Grid container spacing={24} justify="flex-start" alignItems="flex-start">
                {animalArray.map((item, index) => (
                    <Grid item key={index} xs={12} sm={6} md={4}>
                        <Card>
                            <CardMedia
                                className={classes.media}
                                image={item.localMedia ? require(`${item.media}`) : item.media}
                                title={"Meu pet " + item.name}
                            />
                            <CardContent>
                                <Typography gutterBottom variant="headline" component="h2">
                                    {item.name}
                                </Typography>
                                <Typography gutterBottom component="p">
                                    {"Raça: " + item.race}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Grid container justify="flex-end">
                                    <Grid item>
                                        <Button size="small" color="secondary"
                                            onClick={() => { onSetSelected(item.id); onLaunchDialog(true, "remove") }}>
                                            Remover
                                        </Button>
                                        <Button size="small" color="primary"
                                            onClick={() => { onSetSelected(item.id); onLaunchDialog(true, "edit") }}>
                                            Editar
                                        </Button>
                                    </Grid>
                                </Grid>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </div>
    )
})

PetShopPetList.propTypes = {
    // style
    classes: PropTypes.object.isRequired,

    // state
    animalArray: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            race: PropTypes.string.isRequired,
            media: PropTypes.string.isRequired,
            localMedia: PropTypes.bool.isRequired,
        })
    ).isRequired,

    // functions
    onLaunchDialog: PropTypes.func.isRequired,
    onSetSelected: PropTypes.func.isRequired,
}


/*
    Product card list for the pet shop app
 */
const PetShopProductList = withStyles(style)(props => {

    // Destructure props
    const {
        classes,
        productArray,
        onSetSelected,
        onLaunchDialog,
        currentUserRights,
    } = props

    return (
        <div className={classes.root}>
            {(currentUserRights === "supervisor") &&
                <Grid container spacing={16} direction="column" justify="flex-start" alignItems="flex-end">
                    <Grid item>
                        <Button variant="raised" color="primary"
                            onClick={() => onLaunchDialog(true, "registryAdd")}>
                            <AddIcon />
                            Cadastrar Novo Produto
                        </Button>
                    </Grid>
                </Grid>
            }
            <Grid container spacing={24} justify="flex-start">
                {productArray.map((item, index) => (
                    <Grid item key={index} xs={12} sm={6} md={4}>
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
                                <Typography gutterBottom component="p">
                                    {item.description}
                                </Typography>
                                {item.amount > 0 ?
                                    <Typography variant="body1" align="right">
                                        <br />
                                        {`Disponibilidade: ${item.amount} unidades`}
                                    </Typography>
                                    :
                                    <Typography variant="body1" color="error" align="right">
                                        <br />
                                        Produto esgotado
                                    </Typography>
                                }
                            </CardContent>
                            <CardActions>
                                <Grid container justify="flex-end">
                                    <Grid item>
                                        {(item.amount > 0 && currentUserRights === "customer") ?
                                            <Button size="small" color="primary"
                                                onClick={() => { onSetSelected(item.id); onLaunchDialog(true, "add") }}>
                                                Comprar
                                            </Button>
                                            :
                                            <Button disabled size="small" color="primary">
                                                Comprar
                                            </Button>
                                        }
                                    </Grid>
                                </Grid>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </div>
    )
})

PetShopProductList.propTypes = {
    // style
    classes: PropTypes.object.isRequired,

    // state
    productArray: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number,
            name: PropTypes.string.isRequired,
            description: PropTypes.string.isRequired,
            amount: PropTypes.number.isRequired,
            price: PropTypes.number.isRequired,
            media: PropTypes.string.isRequired,
            localMedia: PropTypes.string.isRequired,
        })
    ).isRequired,
    currentUserRights: PropTypes.string.isRequired,

    // functions
    onLaunchDialog: PropTypes.func.isRequired,
    onSetSelected: PropTypes.func.isRequired,
}


/*
    Service card list for the pet shop app
 */
const PetShopServiceList = withStyles(style)(props => {

    // Destructure props
    const {
        classes,
        serviceArray,
        onSetSelected,
        onLaunchDialog,
        currentUserRights,
    } = props

    return (
        <div className={classes.root}>
            <Grid container spacing={16} direction="column" justify="flex-start" alignItems="flex-end">
                <Grid item>
                    <Button variant="raised" color="primary"
                        onClick={() => onLaunchDialog(true, "registryAdd")}>
                        <AddIcon />
                        Cadastrar Novo Serviço
                    </Button>
                </Grid>
            </Grid>
            <Grid container spacing={24} justify="flex-start">
                {serviceArray.map((item, index) => (
                    <Grid item key={index} xs={12} sm={6} md={4}>
                        <Card>
                            <CardMedia
                                className={classes.media}
                                image={item.localMedia ? require(`${item.media}`) : item.media}
                                title={"Serviço de " + item.name}
                            />
                            <CardContent>
                                <Typography gutterBottom variant="headline" component="h2">
                                    {item.name}
                                </Typography>
                                <Typography gutterBottom component="p">
                                    {item.description}
                                </Typography>
                                {item.available ?
                                    <Typography variant="body1" align="right">
                                        <br />
                                        Disponível para agendamento
                                    </Typography>
                                    :
                                    <Typography variant="body1" color="error" align="right">
                                        <br />
                                        Serviço indisponível
                                    </Typography>
                                }
                            </CardContent>
                            <CardActions>
                                <Grid container justify="flex-end">
                                    <Grid item>
                                        {(item.available && currentUserRights === "customer") ?
                                            <Button size="small" color="primary"
                                                onClick={() => { onSetSelected(item.id); onLaunchDialog(true, "add") }}>
                                                Contratar
                                            </Button>
                                            :
                                            <Button disabled size="small" color="primary">
                                                Contratar
                                            </Button>
                                        }
                                    </Grid>
                                </Grid>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </div>
    )
})

PetShopServiceList.propTypes = {
    // style
    classes: PropTypes.object.isRequired,

    // state
    serviceArray: PropTypes.object.arrayOf(
        PropTypes.shape({
            id: PropTypes.number,
            name: PropTypes.string.isRequired,
            description: PropTypes.string.isRequired,
            available: PropTypes.bool.isRequired,
            media: PropTypes.string.isRequired,
            localMedia: PropTypes.bool.isRequired,
        })
    ).isRequired,
    currentUserRights: PropTypes.string.isRequired,

    // functions
    onSetSelected: PropTypes.func.isRequired,
    onLaunchDialog: PropTypes.func.isRequired,
}

export { PetShopPetList, PetShopProductList, PetShopServiceList }