import { PropTypes } from "prop-types"
import React from "react"
import { connect } from "react-redux"
import { addService, changeCurrentView, editService, removeService } from "./StoreActions"
import SupervisorServiceControl from "./SupervisorServiceControl"
import SupervisorServiceView from "./SupervisorServiceView"

class SupervisorServiceContainer extends React.Component {
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
            handleChangeCurrentView,
            handleConfirmAddService,
            handleConfirmEditService,
            handleConfirmRemoveService,
        } = this.props


        return (
            <div>
                <SupervisorServiceView
                    siteData={siteData}
                    onChangeCurrentView={(nextView) => handleChangeCurrentView(nextView)}
                    onLaunchDialog={(open, mode) => this.handleLaunchDialog(open, mode)}
                    onSetSelected={(id) => this.handleSetSelected(id)}
                />
                <SupervisorServiceControl
                    siteData={siteData}
                    dialogOpen={this.state.dialogOpen}
                    dialogMode={this.state.dialogMode}
                    selectedId={this.state.selectedId}
                    onLaunchDialog={(open, mode) => this.handleLaunchDialog(open, mode)}
                    onConfirmAddService={(serviceData) => handleConfirmAddService(serviceData)}
                    onConfirmEditService={(serviceData) => handleConfirmEditService(serviceData)}
                    onConfirmRemoveService={(serviceData) => handleConfirmRemoveService(serviceData)}
                />
            </div>
        )
    }
}

SupervisorServiceContainer.propTypes = {
    // store state
    siteData: PropTypes.object.isRequired,

    // store actions
    handleChangeCurrentView: PropTypes.func.isRequired,
    handleConfirmAddService: PropTypes.func.isRequired,
    handleConfirmEditService: PropTypes.func.isRequired,
    handleConfirmRemoveService: PropTypes.func.isRequired,
}

function mapStateToProps(state) {
    return {
        siteData: state.SiteData,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        // CommonActions
        handleChangeCurrentView: nextView => {
            dispatch(changeCurrentView(nextView))
        },
        // Supervisor actions
        handleConfirmAddService: (serviceData) => {
            dispatch(addService(serviceData))
        },
        handleConfirmEditService: (serviceData) => {
            dispatch(editService(serviceData))
        },
        handleConfirmRemoveService: (serviceData) => {
            dispatch(removeService(serviceData))
        },
    }
}

// Inject styles, connect mappers with the redux store and export symbol
export default connect(mapStateToProps, mapDispatchToProps)(SupervisorServiceContainer)