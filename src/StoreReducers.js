// Action types
import { CommonActions, CustomerActions, SupervisorActions } from "./StoreActions";

// UAC actions
import { signUserIn, signUserUp, logUserOut, changeCurrentView } from "./StoreActions"

// Customer actions
import {
    addPet, editPet, removePet,
    addToCart, editCartItem, removeFromCart, commitOnPurchase,
    addAppointment, removeAppointment
} from "./StoreActions";

// Supervisor actions
import {
    addUser, editUser, removeUser,
    addProduct, editProduct, removeProduct, addStockRegistry,
    sudoEditAppointment, sudoRemoveAppointment, addServiceRegistry
} from "./StoreActions";

let initialState = {
    // Current user
    currentUserView: "home",        // Any user starts at home page
    currentUserEmail: "",           // No sense in tracking a visitors e-mail
    currentUserRights: "visitor",   // Any user starts browsing as a visitor
    currentUserLoggedIn: false,     // Any user starts as not logged in

    // Credentials
    UACData: [
        { email: "user@example.com", password: "user", rights: "customer" },
        { email: "admin@example.com", password: "admin", rights: "admin" },
    ],

    // Static site
    SiteData: {
        products: [
            // {id: "exampleString", name:"exampleString", description: "exampleString", media: "./product1.jpg"}, {...}, ...
            { id: 0, name: "Biscoitos Caninos", description: "Deliciosos agrados de qualidade para cachorros", price: 10.0, media: "./media/product1.jpg", localMedia: true, amount: 1000 },
            { id: 1, name: "Bola de Tênis", description: "Bola verde que quica", price: 10.0, media: "./media/product2.jpg", localMedia: true, amount: 1000 },
            { id: 2, name: "Coleira", description: "Coleira de couro sintético", price: 10.0, media: "./media/product3.jpg", localMedia: true, amount: 1000 },
            { id: 3, name: "Erva de Gato", description: "Erva recreativa ressequida para gatos", price: 10.0, media: "./media/product4.jpg", localMedia: true, amount: 0 },
            { id: 4, name: "Guia", description: "Guia para coleiras padrão", price: 10.0, media: "./media/product5.JPG", localMedia: true, amount: 1000 },
            { id: 5, name: "Petisco de Gato", description: "Deliciosos agrados de qualidade para gatos", price: 10.0, media: "./media/product6.jpg", localMedia: true, amount: 1000 },
            { id: 6, name: "Ração", description: "Ração de primeira qualidade", price: 10.0, media: "./media/product7.jpg", localMedia: true, amount: 1000 }
        ],
        services: [
            // {service: "exampleString", description: "exampleString", media: "./service1.jpg"}, {...}, ...
            { id: 0, name: "Banho", description: "Banho com xampu hipoalergênico para gatos e cães", media: "./media/service1.jpg", available: true },
            { id: 1, name: "Cortar Unha", description: "Cuidados com a unha de seu gato com segurança e sem machucá-lo", media: "./media/service2.jpg", available: false },
            { id: 2, name: "Massagem", description: "Massagem relaxante para seu cão", media: "./media/service3.jpg", available: true },
            { id: 3, name: "Tosa", description: "Corte dos pêlos do seu animal", media: "./media/service4.jpg", available: true }
        ],
    },

    // Customer specific
    CustomerData: [
        {
            email: "user@example.com",
            animals: [
                // {name: "exampleString", race: "exampleString", media: "./dog1.jpg"}, {...}, ...
                { id: 0, name: "Felicloper", race: "Bernese", media: "./media/dog1.jpg", localMedia: true },
                { id: 1, name: "Glauber", race: "McNab", media: "./media/dog2.jpg", localMedia: true },
                { id: 2, name: "Gustavo", race: "Buldogue", media: "./media/dog3.jpg", localMedia: true },
                { id: 3, name: "Caramelo", race: "Harrier", media: "./media/dog4.jpg", localMedia: true },
                { id: 4, name: "Carolhos", race: "SRD", media: "./media/dog5.jpg", localMedia: true },
                { id: 5, name: "Nerso", race: "Labrador", media: "./media/dog6.jpg", localMedia: true },
                { id: 6, name: "Sabrino", race: "Pharaoh Hound", media: "./media/dog7.jpg", localMedia: true },
                { id: 7, name: "Kik", race: "Chihuahua", media: "./media/dog8.jpg", localMedia: true },
                { id: 8, name: "Frederico", race: "Siamês", media: "./media/cat1.jpg", localMedia: true },
                { id: 9, name: "Fofinho", race: "Maine Coon", media: "./media/cat2.jpg", localMedia: true }
            ],
            appointments: [
                // {service: "exampleString", animal: "exampleString", dateUTC:"MM/DD/AAAA XX:YY:ZZ GMT-3"}, {...}, ...
                { serviceId: 0, serviceName: "Banho", animalId: 6, animalName: "Sabrino", date: "06/06/2018 14:00:00 GMT-3", status: "pending", message: "" },
                { serviceId: 2, serviceName: "Massagem", animalId: 5, animalName: "Nerso", date: "06/24/2019 14:00:00 GMT-3", status: "approved", message: "Aprovado pelo supervisor (sujeito à mudanças)" },
                { serviceId: 1, serviceName: "Cortar Unha", animalId: 9, animalName: "Fofinho", date: "08/06/2018 14:00:00 GMT-3", status: "pending", message: "" },
                { serviceId: 3, serviceName: "Tosa", animalId: 0, animalName: "Felicloper", date: "06/04/2018 14:00:00 GMT-3", status: "revoked", message: "Requisição negada: emergência de plantão (nenhum doutor disponivel)" },
                { serviceId: 3, serviceName: "Tosa", animalId: 0, animalName: "Felicloper", date: "06/04/2018 14:00:00 GMT-3", status: "revoked", message: "Requisição negada: nenhum horário indisponível" }
                /*
                    status:
                        pending: not yet processed
                        approved: processed and approved, can be modified or removed at any time
                        modified: processed, approved and eventually modified (but not removed)
                        removed: processed and denied or processed, approved and then removed
                 */
            ],
            shoppingCart: [
                // {itemId, itemName, itemPrice, itemAmount}
                { itemId: 1, itemName: "Bola de Tênis", itemPrice: 10.0, itemAmount: 3 },
                { itemId: 6, itemName: "Ração", itemPrice: 10.0, itemAmount: 15 },
                { itemId: 2, itemName: "Coleira", itemPrice: 10.0, itemAmount: 1 },
            ],
        },
    ],
}

// TODO decompose into separate reducers
function petShopApp(state, action) {
    // This is where we set the initial state
    if (typeof (state) === "undefined") {
        return initialState
    }

    switch (action.type) {
    // Common action reducers
    case CommonActions.USER_SIGNIN:
        return Object.assign({}, state, {
            currentUserEmail: action.payload.userEmail,
            currentUserRights: action.payload.userRights,
            currentUserLoggedIn: true,
        })
    case CommonActions.USER_SIGNUP:
        return Object.assign({}, state, {
            currentUserEmail: action.payload.userEmail,
            currentUserRights: "customer",
            currentUserLoggedIn: true,
            UACData: [
                ...state.UACData,
                { email: action.payload.userEmail, password: action.payload.userPassword, rights: "customer" }
            ],
            CustomerData: [
                ...state.CustomerData,
                { email: action.payload.userEmail, animals: [], appointments: [], shoppingCart: [] }
            ]
        })
    case CommonActions.USER_LOGOUT:
        return Object.assign({}, state, {
            currentUserView: "home",
            currentUserEmail: "",
            currentUserRights: "visitor",
            currentUserLoggedIn: false,
        })
    case CommonActions.CHANGE_CURRENT_VIEW:
        return Object.assign({}, state, {
            currentUserView: action.payload.nextView,
        })

        // Customer action reducers
    case CustomerActions.PET_ADD:
        return Object.assign({}, state, {
            CustomerData: state.CustomerData.map((customer, index) => {
                if (customer.email === action.payload.userEmail) {
                    return Object.assign({}, customer, {
                        animals: [
                            ...customer.animals,
                            {
                                id: customer.animals.length,
                                name: action.payload.petData.name,
                                race: action.payload.petData.race,
                                media: action.payload.petData.media,
                                localMedia: action.payload.petData.localMedia,
                            }
                        ]
                    })
                }
                // Otherwise keep old state
                return customer
            })
        })

        // TODO Maybe a filter followed by an insertion will work best
    case CustomerActions.PET_EDIT:
        return Object.assign({}, state, {
            CustomerData: state.CustomerData.map((customer, cIndex) => {
                if (customer.email === action.payload.userEmail) {
                    return Object.assign({}, customer, {
                        animals: customer.animals.map((animal, aIndex) => {
                            if (animal.id === action.payload.petData.id) {
                                return Object.assign({}, animal, {
                                    id: action.payload.petData.id,
                                    name: action.payload.petData.name,
                                    race: action.payload.petData.race,
                                    media: action.payload.petData.media,
                                    localMedia: action.payload.petData.localMedia,
                                })
                            }
                            // Otherwise keep old state
                            return animal
                        })
                    })
                }
                // Otherwise keep old state
                return customer
            })
        })

    case CustomerActions.PET_REMOVE:
        return Object.assign({}, state, {
            CustomerData: state.CustomerData.map((customer, index) => {
                if (customer.email === action.payload.userEmail) {
                    return Object.assign({}, customer, {
                        animals: customer.animals.filter(animal => {
                            return (animal.id !== action.payload.petData.id)
                        })
                    })
                }
                // Otherwise keep old state
                return customer
            })
        })

    case CustomerActions.STORE_ADD_TO_CART:
        return Object.assign({}, state, {
            CustomerData: state.CustomerData.map((customer, index) => {
                if (customer.email === action.payload.userEmail) {
                    return Object.assign({}, customer, {
                        shoppingCart: [
                            ...customer.shoppingCart,
                            {
                                itemId: action.payload.itemData.itemId,
                                itemName: action.payload.itemData.itemName,
                                itemPrice: action.payload.itemData.itemPrice,
                                itemAmount: action.payload.itemData.itemAmount,
                            }
                        ]
                    })
                }
            })
        })

    case CustomerActions.STORE_EDIT_CART_ITEM:
        return Object.assign({}, state, {
            CustomerData: state.CustomerData.map((customer, cIndex) => {
                if (customer.email === action.payload.userEmail) {
                    return Object.assign({}, customer, {
                        shoppingCart: customer.shoppingCart.map((item, iIndex) => {
                            if (item.itemId === action.payload.itemData.itemId) {
                                return Object.assign({}, item, {
                                    itemId: item.itemId,
                                    itemName: item.itemName,
                                    itemPrice: item.itemPrice,
                                    itemAmount: action.payload.itemData.itemAmount,
                                })
                            }
                            // Otherwise keep old state
                            return item
                        })
                    })
                }
                // Otherwise keep old state
                return customer
            })
        })

    case CustomerActions.STORE_REMOVE_FROM_CART:
        return Object.assign({}, state, {
            CustomerData: state.CustomerData.map((customer, index) => {
                if (customer.email === action.payload.userEmail) {
                    return Object.assign({}, customer, {
                        shoppingCart: customer.shoppingCart.filter(item => {
                            return (item.itemId !== action.payload.itemData.itemId)
                        })
                    })
                }
            })
        })

    case CustomerActions.STORE_COMMIT_ON_PURCHASE:
        return Object.assign({}, state, {
            // Recalculate available amounts 
            SiteData: Object.assign({}, state.SiteData, {
                products: state.SiteData.products.map((product, pIndex) => {
                    for (const item of action.payload.shoppingCart) {
                        if (product.id === item.itemId) {
                            return Object.assign({}, product, {
                                amount: (product.amount - item.itemAmount)
                            })
                        }
                    }
                    // Otherwise keep old state
                    return product
                })
            }),
            // Clear customer shopping cart
            CustomerData: state.CustomerData.map((customer, index) => {
                if (customer.email === action.payload.userEmail) {
                    return Object.assign({}, customer, {
                        shoppingCart: []
                    })
                }
            })
        })
        
    case CustomerActions.APPOINTMENT_ADD:
        return state

    case CustomerActions.APPOINTMENT_REMOVE:
        return state

    default:
        return state
    }
}

export default petShopApp