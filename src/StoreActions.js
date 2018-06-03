/*
import { SupervisorActions } from './StoreActions';
   UAC action types
 */
export const CommonActions = {
    USER_SIGNIN: "USER_SIGNIN",
    USER_SIGNUP: "USER_SIGNUP",
    USER_LOGOUT: "USER_LOGOUT",
    CHANGE_CURRENT_VIEW: "CHANGE_CURRENT_VIEW",
}

/*
    Customer action types
 */
export const CustomerActions = {
    // Pet list control
    PET_ADD: "PET_ADD",
    PET_EDIT: "PET_EDIT",
    PET_REMOVE: "PET_REMOVE",

    // Store interaction
    STORE_ADD_TO_CART: "STORE_ADD_TO_CART",
    STORE_REMOVE_FROM_CART: "STORE_REMOVE_FROM_CART",
    STORE_COMMIT_ON_PURCHASE: "STORE_COMMIT_ON_PURCHASE",

    // Appointment control
    APPOINTMENT_ADD: "APPOINTMENT_ADD",
    APPOINTMENT_REMOVE: "APPOINTMENT_REMOVE",
}

/*
    Superisor action types
 */
export const SupervisorActions = {
    // User control
    USERCTL_ADD: "USERCTL_ADD",
    USERCTL_EDIT: "USERCTL_EDIT",
    USERCTL_REMOVE: "USERCTL_REMOVE",

    // Stock control
    STOCKCTL_ADD: "STOCKCTL_ADD",
    STOCKCTL_EDIT: "STOCKCTL_EDIT",
    STOCKCTL_REMOVE: "STOCKCTL_REMOVE",
    STOCKCTL_REG_INCLUDE: "STOCKCTL_REG_INCLUDE", // Register new product

    // Service control
    SERVICECTL_EDIT: "SERVICECTL_EDIT",
    SERVICECTL_REMOVE: "SERVICECTL_REMOVE",
    SERVICECTL_REG_INCLUDE: "SERVICECTL_REG_INCLUDE", // Register new service
}

/*
   UAC action creators
 */
export function signUserIn(userEmail, userRights) {
    return {
        type: CommonActions.USER_SIGNIN,
        payload: { userEmail, userRights }
    }
}

export function signUserUp(userEmail, userPassword) {
    return {
        type: CommonActions.USER_SIGNUP,
        payload: { userEmail, userPassword }
    }
}

// TODO credentials may be unnecessary
export function logUserOut() {
    return {
        type: CommonActions.USER_LOGOUT,
        payload: {}
    }
}

export function changeCurrentView(nextView) {
    return {
        type: CommonActions.CHANGE_CURRENT_VIEW,
        payload: { nextView }
    }
}

/*
   Customer action creators
 */
export function addPet(userEmail, petData) {
    return {
        type: CustomerActions.PET_ADD,
        payload: { userEmail, petData }
    }
}

export function editPet(userEmail, petData) {
    return {
        type: CustomerActions.PET_EDIT,
        payload: { userEmail, petData }
    }
}

export function removePet(userEmail, petData) {
    return {
        type: CustomerActions.PET_REMOVE,
        payload: { userEmail, petData }
    }
}

export function addToCart(userEmail, itemData) {
    return {
        type: CustomerActions.STORE_ADD_TO_CART,
        payload: { userEmail, itemData }
    }
}

export function removeFromCart(userEmail, itemData) {
    return {
        type: CustomerActions.STORE_REMOVE_FROM_CART,
        payload: { userEmail, itemData }
    }
}

export function commitOnPurchase(userEmail) {
    return {
        type: CustomerActions.STORE_COMMIT_ON_PURCHASE,
        payload: { userEmail }
    }
}

export function addAppointment(userEmail, appointData) {
    return {
        type: CustomerActions.APPOINTMENT_ADD,
        payload: { userEmail, appointData }
    }
}

export function removeAppointment(userEmail, appointData) {
    return {
        type: CustomerActions.APPOINTMENT_REMOVE,
        payload: { userEmail, appointData }
    }
}

/*
   Supervisor action creators
 */
// TODO adminData might not be necessary
export function addUser(adminData, userData) {
    return {
        type: SupervisorActions.USERCTL_ADD,
        payload: { adminData, userData }
    }
}

// TODO adminData might not be necessary
export function editUser(adminData, userData) {
    return {
        type: SupervisorActions.USERCTL_EDIT,
        payload: { adminData, userData }
    }
}

// TODO adminData might not be necessary
export function removeUser(adminData, userData) {
    return {
        type: SupervisorActions.USERCTL_REMOVE,
        payload: { adminData, userData }
    }
}

// TODO adminData might not be necessary
export function addProduct(adminData, itemData) {
    return {
        type: SupervisorActions.STOCKCTL_ADD,
        payload: { adminData, itemData }
    }
}

// TODO adminData might not be necessary
export function editProduct(adminData, itemData) {
    return {
        type: SupervisorActions.STOCKCTL_EDIT,
        payload: { adminData, itemData }
    }
}

// TODO adminData might not be necessary
export function removeProduct(adminData, itemData) {
    return {
        type: SupervisorActions.STOCKCTL_REMOVE,
        payload: { adminData, itemData }
    }
}

// TODO adminData might not be necessary
export function addStockRegistry(adminData, newItem) {
    return {
        type: SupervisorActions.STOCKCTL_REG_INCLUDE,
        payload: { adminData, newItem }
    }
}

// TODO adminData might not be necessary
export function sudoEditAppointment(adminData, appointData) {
    return {
        type: SupervisorActions.SERVICECTL_EDIT,
        payload: { adminData, appointData }
    }
}

// TODO adminData might not be necessary
export function sudoRemoveAppointment(adminData, appointData) {
    return {
        type: SupervisorActions.SERVICECTL_REMOVE,
        payload: { adminData, appointData }
    }
}

// TODO adminData might not be necessary
export function addServiceRegistry(adminData, newService) {
    return {
        type: SupervisorActions.SERVICECTL_REG_INCLUDE,
        payload: { adminData, newService }
    }
}