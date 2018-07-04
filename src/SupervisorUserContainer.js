import { PropTypes } from "prop-types"
import React from "react"
import { connect } from "react-redux"
import { addUser, editUser, removeUser } from "./StoreActions"
import SupervisorUserControl from "./SupervisorUserControl"
import SupervisorUserView from "./SupervisorUserView"

class SupervisorUserContainer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            dialogOpen: false,
            dialogMode: "",    // Can be any of { "add", "commit" }
            selectedEmail: "",
        }
    }

    handleLaunchDialog(open, mode = null) {
        this.setState(state => ({
            dialogOpen: open,
            dialogMode: (mode !== null) ? mode : state.dialogMode,
        }))
    }

    handleSetSelected(email) {
        this.setState({
            selectedEmail: email
        })
    }

    render() {
        const {
            UACData,
            customerData,
            currentUserEmail,
            handleConfirmAddUser,
            handleConfirmEditUser,
            handleConfirmRemoveUser,
        } = this.props


        return (
            <div>
                <SupervisorUserView
                    UACData={UACData}
                    customerData={customerData}
                    currentUserEmail={currentUserEmail}
                    onSetSelected={(email) => this.handleSetSelected(email)}
                    onLaunchDialog={(open, mode) => this.handleLaunchDialog(open, mode)}
                />
                <SupervisorUserControl
                    UACData={UACData}
                    customerData={customerData}
                    dialogOpen={this.state.dialogOpen}
                    dialogMode={this.state.dialogMode}
                    selectedEmail={this.state.selectedEmail}
                    onLaunchDialog={(open, mode) => this.handleLaunchDialog(open, mode)}
                    onConfirmAddUser={(userData) => handleConfirmAddUser(userData)}
                    onConfirmEditUser={(userData) => handleConfirmEditUser(userData)}
                    onConfirmRemoveUser={(userData) => handleConfirmRemoveUser(userData)}
                />
            </div>
        )
    }
}

SupervisorUserContainer.propTypes = {
    // store state
    UACData: PropTypes.arrayOf(
        PropTypes.shape({
            email: PropTypes.string.isRequired,
            rights: PropTypes.string.isRequired,
            password: PropTypes.string,
        })
    ).isRequired,
    customerData: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            email: PropTypes.string.isRequired,
            animals: PropTypes.arrayOf(PropTypes.object).isRequired,
            appointments: PropTypes.arrayOf(PropTypes.object).isRequired,
            shoppingCart: PropTypes.arrayOf(PropTypes.object).isRequired
        })
    ).isRequired,
    currentUserEmail: PropTypes.string.isRequired,

    // store actions
    handleConfirmAddUser: PropTypes.func.isRequired,
    handleConfirmEditUser: PropTypes.func.isRequired,
    handleConfirmRemoveUser: PropTypes.func.isRequired,

}

function mapStateToProps(state) {
    return {
        UACData: state.UACData,
        customerData: state.CustomerData,
        currentUserEmail: state.currentUserEmail,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        // Supervisor Actions
        handleConfirmAddUser: userData => {
            dispatch(addUser(userData))
        },
        handleConfirmEditUser: userData => {
            dispatch(editUser(userData))
        },
        handleConfirmRemoveUser: userData => {
            dispatch(removeUser(userData))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SupervisorUserContainer)