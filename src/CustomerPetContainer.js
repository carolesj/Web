import { PropTypes } from "prop-types"
import React from "react"
import { connect } from "react-redux"
import CustomerPetControl from "./CustomerPetControl"
import CustomerPetView from "./CustomerPetView"
import { addPet, editPet, removePet } from "./StoreActions"

class CustomerPetContainer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            dialogOpen: false,
            dialogMode: "",    // TODO Define possible values as constants for this
            selectedId: 0,     // Id of pet selected for "edit" or "remove" operations
        }
    }

    handleToggleDialog(open, mode = null) {
        this.setState(state => ({
            dialogOpen: open,
            dialogMode: (mode !== null) ? mode : state.dialogMode,
        }))
    }

    handleSetSelected(id) {
        this.setState({
            selectedId: id
        })
    }

    render() {
        const {
            classes,
            customerData,
            currentUserEmail,
            handleSubmitAddPet,
            handleSubmitEditPet,
            handleSubmitRemovePet,
        } = this.props

        return (
            <div>
                <CustomerPetView    
                    customerData={customerData}
                    currentUserEmail={currentUserEmail}
                    onLaunchDialog={(open, mode) => this.handleToggleDialog(open, mode)}
                    onSetSelected={(id) => this.handleSetSelected(id)}
                />
                <CustomerPetControl
                    classes={classes}
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