import { withStyles, Icon } from "@material-ui/core"
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
const styles = theme => ({
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
    fab: {
        position: "fixed",
        bottom: theme.spacing.unit * 2,
        right: theme.spacing.unit * 2,
    },
})


/*
    Pet card list for the customer view
 */
const PetShopPetList = withStyles(styles)(props => {

    // Destructure props
    const {
        classes,
        animalArray,
        onSetSelected,
        onLaunchDialog,
        currentUserRights
    } = props

    return (
        <div className={classes.root}>
            {/* Pretty card list */}
            <Grid container spacing={24} justify="flex-start" alignItems="flex-start">
                {animalArray.map((item, index) => (
                    <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
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

            {/* Floating action button */}
            {(currentUserRights === "customer") &&  // Can it be any different, tho?
                <Button variant="fab" color="primary"
                    onClick={() => onLaunchDialog(true, "add")}
                    className={classes.fab}
                >
                    <AddIcon />
                </Button>
            }
        </div>
    )
})

PetShopPetList.propTypes = {
    // style
    classes: PropTypes.object,

    // state
    animalArray: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
            race: PropTypes.string.isRequired,
            media: PropTypes.string.isRequired,
            localMedia: PropTypes.bool.isRequired,
        })
    ).isRequired,
    currentUserRights: PropTypes.string.isRequired,

    // functions
    onLaunchDialog: PropTypes.func.isRequired,
    onSetSelected: PropTypes.func.isRequired,
}


/*
    Product card list for all user views
 */
const PetShopProductList = withStyles(styles)(props => {

    // Destructure props
    const {
        classes,
        productArray,
        onSetSelected,
        onLaunchDialog,
        onChangeCurrentView,
        currentUserRights,
    } = props

    return (
        <div className={classes.root}>
            {/* Pretty card list */}
            <Grid container spacing={24} justify="flex-start">
                {productArray.map((item, index) => (
                    <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
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
                                    {(currentUserRights === "supervisor") &&
                                        <Grid item>
                                            <Button size="small" color="primary"
                                                onClick={() => { onSetSelected(item.id); onLaunchDialog(true, "remove") }}
                                            >
                                                Remover
                                            </Button>
                                        </Grid>
                                    }
                                    <Grid item>
                                        <Button
                                            size="small"
                                            color="primary"
                                            disabled={(currentUserRights !== "supervisor" && item.amount === 0)}
                                            onClick={(currentUserRights === "supervisor") ?
                                                () => { onSetSelected(item.id); onLaunchDialog(true, "edit") }
                                                :
                                                () => { onSetSelected(item.id); onLaunchDialog(true, "add") }
                                            }
                                        >
                                            {(currentUserRights === "supervisor") ?
                                                "Editar"
                                                :
                                                "Comprar"
                                            }
                                        </Button>
                                    </Grid>
                                </Grid>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Floating action buttons */}
            {(currentUserRights === "supervisor") &&
                <Button variant="fab" color="primary"
                    onClick={() => onLaunchDialog(true, "add")}
                    className={classes.fab}
                >
                    <AddIcon />
                </Button>
            }
            {(currentUserRights === "customer") &&
                <Button variant="fab" color="primary"
                    onClick={() => onChangeCurrentView("shoppingCart")}
                    className={classes.fab}
                >
                    <Icon>shopping_cart</Icon>
                </Button>
            }
        </div>
    )
})

PetShopProductList.propTypes = {
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
    onChangeCurrentView: PropTypes.func.isRequired,
    onLaunchDialog: PropTypes.func.isRequired,
    onSetSelected: PropTypes.func.isRequired,
}


/*
    Service card list for all user views
 */
const PetShopServiceList = withStyles(styles)(props => {

    // Destructure props
    const {
        classes,
        serviceArray,
        onSetSelected,
        onLaunchDialog,
        currentUserRights,
        onChangeCurrentView
    } = props

    return (
        <div className={classes.root}>
            {/* Pretty card list */}
            <Grid container spacing={24} justify="flex-start">
                {serviceArray.map((item, index) => (
                    <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
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
                                        {(currentUserRights === "supervisor") ?
                                            <div>
                                                <Button size="small" color="secondary"
                                                    onClick={() => { onSetSelected(item.id); onLaunchDialog(true, "remove") }}>
                                                    Remover
                                                </Button>
                                                <Button size="small" color="primary"
                                                    onClick={() => { onSetSelected(item.id); onLaunchDialog(true, "edit") }}>
                                                    Editar
                                                </Button>
                                            </div>
                                            :
                                            (item.available) ?
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

            {/* Floating action buttons */}
            {(currentUserRights === "supervisor") &&
                <Button variant="fab" color="primary"
                    onClick={() => onLaunchDialog(true, "add")}
                    className={classes.fab}
                >
                    <AddIcon />
                </Button>
            }
            {(currentUserRights === "customer") &&
                <Button variant="fab" color="primary"
                    onClick={() => onChangeCurrentView("appointments")}
                    className={classes.fab}
                >
                    <Icon>schedule</Icon>
                </Button>
            }
        </div>
    )
})

PetShopServiceList.propTypes = {
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

    // functions
    onChangeCurrentView: PropTypes.func.isRequired,
    onLaunchDialog: PropTypes.func.isRequired,
    onSetSelected: PropTypes.func.isRequired,
}

export { PetShopPetList, PetShopProductList, PetShopServiceList }