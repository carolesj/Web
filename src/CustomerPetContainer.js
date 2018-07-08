import { PropTypes } from "prop-types"
import React from "react"
import { connect } from "react-redux"
import CustomerPetControl from "./CustomerPetControl"
import CustomerPetView from "./CustomerPetView"
import { addPet, editPet, removePet, getUserAnimals } from "./StoreActions"
import Axios from "axios"
import Root from "./remote"
import { Typography, Grid, CircularProgress } from "@material-ui/core"
import spacing from "@material-ui/core/styles/spacing"

class CustomerPetContainer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            dialogOpen: false,
            dialogMode: "",    // TODO Define possible values as constants for this
            selectedId: 0,     // Id of pet selected for "edit" or "remove" operations

            errorText: "",
            errorStatus: false,
            doingRemoteRequest: false,
        }
    }

    componentDidMount() {
        // Begin remote request
        this.setState({
            doingRemoteRequest: true,
        })
        Axios.get(Root + "/" + this.props.currentUserEmail + "/pets")
            .then(response => {
                if (response.data.ok) {
                    this.props.onGetUserAnimals(response.data.animals)
                    this.handleToggleDialog(false)
                } else {
                    this.setState({
                        errorStatus: true,
                        errorText: response.data.error,
                        doingRemoteRequest: false,
                    })
                }
            })
            .catch(error => {
                this.setState({
                    errorStatus: true,
                    errorText: error.message,
                    doingRemoteRequest: false,
                })
            })
    }

    handleToggleDialog(open, mode = null) {
        this.setState(state => ({
            dialogOpen: open,
            dialogMode: (mode !== null) ? mode : state.dialogMode,
            
            errorText: (open) ? state.errorText : "",
            errorStatus: (open) ? state.errorStatus : false,
            doingRemoteRequest: (open) ? state.doingRemoteRequest : false
        }))
    }

    handleSetSelected(id) {
        this.setState({
            selectedId: id
        })
    }

    render() {
        const {
            customerData,
            currentUserEmail,
            handleSubmitAddPet,
            handleSubmitEditPet,
            handleSubmitRemovePet,
        } = this.props

        return (
            <div>
                {this.state.doingRemoteRequest ?
                    <Grid container justify="center">
                        <CircularProgress style={{margin: spacing.unit * 2}} size={50} />
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
                        <CustomerPetView
                            customerData={customerData}
                            currentUserEmail={currentUserEmail}
                            onLaunchDialog={(open, mode) => this.handleToggleDialog(open, mode)}
                            onSetSelected={(id) => this.handleSetSelected(id)}
                        />
                    )
                }
                <CustomerPetControl
                    customerData={customerData}
                    currentUserEmail={currentUserEmail}
                    onToggleDialog={(open, mode) => this.handleToggleDialog(open, mode)}
                    dialogOpen={this.state.dialogOpen}
                    dialogMode={this.state.dialogMode}
                    selectedId={this.state.selectedId}
                    onConfirmAddPet={handleSubmitAddPet}
                    onConfirmEditPet={handleSubmitEditPet}
                    onConfirmRemovePet={handleSubmitRemovePet}
                />
            </div>
        )
    }
}

CustomerPetContainer.propTypes = {
    // store state
    customerData: PropTypes.arrayOf(
        PropTypes.shape({
            email: PropTypes.string.isRequired,
            animals: PropTypes.arrayOf(PropTypes.object).isRequired,
            appointments: PropTypes.arrayOf(PropTypes.object).isRequired,
            shoppingCart: PropTypes.arrayOf(PropTypes.object).isRequired
        })
    ).isRequired,
    currentUserEmail: PropTypes.string.isRequired,
    currentUserRights: PropTypes.string.isRequired,

    // store actions
    onGetUserAnimals: PropTypes.func.isRequired,
    handleSubmitAddPet: PropTypes.func.isRequired,
    handleSubmitEditPet: PropTypes.func.isRequired,
    handleSubmitRemovePet: PropTypes.func.isRequired,
}

function mapStateToProps(state) {
    return {
        currentUserEmail: state.currentUserEmail,
        currentUserRights: state.currentUserRights,
        customerData: state.CustomerData,
        //siteData: state.SiteData
    }
}

function mapDispatchToProps(dispatch) {
    return {
        onGetUserAnimals: animals => {
            dispatch(getUserAnimals(animals))
        },
        handleSubmitAddPet: (userEmail, petData) => {
            dispatch(addPet(userEmail, petData))
        },
        handleSubmitEditPet: (userEmail, petData) => {
            dispatch(editPet(userEmail, petData))
        },
        handleSubmitRemovePet: (userEmail, petData) => {
            dispatch(removePet(userEmail, petData))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomerPetContainer)