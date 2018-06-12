import { PropTypes } from "prop-types"
import React from "react"
import { connect } from "react-redux"
import CustomerServiceControl from "./CustomerServiceControl"
import CustomerServiceView from "./CustomerServiceView"
import { addAppointment, changeCurrentView, removeAppointment } from "./StoreActions"

class CustomerServiceContainer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            dialogOpen: false,
            dialogMode: "",    // Can be any of { "add", "commit" }
            selectedId: 0,     // Id of product selected for "add to/remove from cart" or "commit purchase" operations
        }
    }

    handleLaunchDialog(open, mode = null) {
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
            siteData,
            customerData,
            currentUserView,
            currentUserEmail,
            handleChangeCurrentView,
            handleConfirmAddAppointment,
            handleConfirmRemoveAppointment,
        } = this.props


        return (
            <div>
                <CustomerServiceView
                    siteData={siteData}
                    customerData={customerData}
                    currentUserView={currentUserView}
                    currentUserEmail={currentUserEmail}
                    onChangeCurrentView={(nextView) => handleChangeCurrentView(nextView)}
                    onLaunchDialog={(open, mode) => this.handleLaunchDialog(open, mode)}
                    onSetSelected={(id) => this.handleSetSelected(id)}
                />
                <CustomerServiceControl
                    siteData={siteData}
                    customerData={customerData}
                    currentUserEmail={currentUserEmail}
                    dialogOpen={this.state.dialogOpen}
                    dialogMode={this.state.dialogMode}
                    selectedId={this.state.selectedId}
                    onLaunchDialog={(open, mode) => this.handleLaunchDialog(open, mode)}
                    onConfirmAddAppointment={(userEmail, appointData) =>
                        handleConfirmAddAppointment(userEmail, appointData)}
                    onConfirmRemoveAppointment={(userEmail, appointData) =>
                        handleConfirmRemoveAppointment(userEmail, appointData)}
                />
            </div>
        )
    }
}

CustomerServiceContainer.propTypes = {
    // store state
    siteData: PropTypes.object.isRequired,
    customerData: PropTypes.arrayOf(
        PropTypes.shape({
            email: PropTypes.string.isRequired,
            animals: PropTypes.arrayOf(PropTypes.object).isRequired,
            appointments: PropTypes.arrayOf(PropTypes.object).isRequired,
            shoppingCart: PropTypes.arrayOf(PropTypes.object).isRequired
        })
    ).isRequired,
    currentUserView: PropTypes.string.isRequired,
    currentUserEmail: PropTypes.string.isRequired,

    // store actions
    handleChangeCurrentView: PropTypes.func.isRequired,
    handleConfirmAddAppointment: PropTypes.func.isRequired,
    handleConfirmRemoveAppointment: PropTypes.func.isRequired,

}

function mapStateToProps(state) {
    return {
        currentUserView: state.currentUserView,
        currentUserEmail: state.currentUserEmail,
        customerData: state.CustomerData,
        siteData: state.SiteData,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        // CommonActions
        handleChangeCurrentView: nextView => {
            dispatch(changeCurrentView(nextView))
        },
        // Customer actions
        handleConfirmAddAppointment: (userEmail, appointData) => {
            dispatch(addAppointment(userEmail, appointData))
        },
        handleConfirmRemoveAppointment: (userEmail, appointData) => {
            dispatch(removeAppointment(userEmail, appointData))
        },
    }
}

// Inject styles, connect mappers with the redux store and export symbol
export default connect(mapStateToProps, mapDispatchToProps)(CustomerServiceContainer)