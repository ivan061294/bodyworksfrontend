import {constantes} from "./Constantes";
import Utils from "./Utils";

const storage = {
    getCustomers: () => {
        let customers = JSON.parse(localStorage.getItem('customers'));
        let optionCustomers = customers ? customers.map(e => {
            return {
                value: e.id,
                label: e.fullname
            }
        }) : [];
        return optionCustomers;
    },
    getCustomersForQuote: (iduser) => {
        let customers = JSON.parse(localStorage.getItem('customers'));
        let optionCustomers = customers ? customers.map(e => {
            return {
                value: e.id,
                label: e.fullname
            }
        }) : [];
        return optionCustomers;
    },
    getSuppliesAll: () => {
        let supplies = JSON.parse(localStorage.getItem('products'));
        let optionSupplies = supplies ? supplies.map(e => {
            return {
                value: e.id,
                label: e.description,
            }
        }) : [];
        return optionSupplies;
    },
    getSupplies: () => {
        let supplies = JSON.parse(localStorage.getItem('products'));
        let optionSupplies = supplies ? supplies.filter(e =>
            e.category === constantes.PRODUCT_CATEGORY_INSUMOS || e.category === constantes.PRODUCT_TYPE_MATERIAL
        ).map(e => {
            return {
                value: e.description,
                label: e.description,
            }
        }) : [];
        return optionSupplies;
    },
    getOptionSuppliesOrMaterials: () => {

        let supplies = JSON.parse(localStorage.getItem('products'));
        let optionSupplies = supplies ? supplies.filter(e =>
            e.category === constantes.PRODUCT_CATEGORY_INSUMOS || e.category === constantes.PRODUCT_TYPE_MATERIAL
        ).map(e => {
            return {
                value: e.description,
                label: e.description
            }
        }) : [];
        return optionSupplies;
    },
    getSuppliesCodePerId: (id) => {
        let supplies = JSON.parse(localStorage.getItem('products'));
        let suppliesData = supplies.find(e =>
            parseInt(id) === e.id
        ) || {
            code: null,
            unitprice: null,
            measurement: null
        };
        return suppliesData;
    },
    getSuppliesCodePerDescription: (description) => {
        let supplies = JSON.parse(localStorage.getItem('products'));
        let suppliesData = supplies.find(e =>
            description === e.description
        ) || {
            code: null,
            unitprice: null,
            measurement: null
        };
        return suppliesData;
    },
    getEmployeePerId: (id) => {
        let employees = JSON.parse(localStorage.getItem('employees'));
        let salary = employees.find(e =>
            parseInt(id) === e.id) || {
            salary: null
        };
        return salary;
    },
    getEmployeesPerCare: (care) => {
        let employees = JSON.parse(localStorage.getItem('employees'));
        let optionEmployees = employees ? employees.filter(e => care.includes(e.care)).map(e => {
            return {
                value: e.id,
                label: e.name + ' ' + e.lastname
            }
        }) : [];
        return optionEmployees;
    },
    getEmployees: () => {
        let employees = JSON.parse(localStorage.getItem('employees'));
        let optionEmployees = employees ? employees.map(e => {
            return {
                value: e.id,
                label: e.name + ' ' + e.lastname
            }
        }) : [];
        return optionEmployees;
    },
    getQuotesedit: () => {
        let quotes = JSON.parse(localStorage.getItem('quotes'));
        let optionQuotes = quotes ? quotes.filter(e => e.status === 'Aceptado')
            .map(e => {
                return {
                    value: e.id,
                    label: Utils.formatCode(e.id, constantes.PREFIX_QUOTEID)
                }
            }) : [];
        return optionQuotes;
    },
    getordersedit: () => {
        let order = JSON.parse(localStorage.getItem('orders'));//funciona
        let optionorders = order ? order.filter(e => e.status === 'Terminado' || e.status === 'Facturado').map(e => {
            return {
                value: e.id,
                label: e.id
            }
        }) : []
        return optionorders;
    },
    getQuotePerId: (id) => {
        let quotes = JSON.parse(localStorage.getItem('quotes'));
        let quote = quotes.find(e =>
            parseInt(id) === e.id
        ) || {
            quote: {}
        }
        return quote;
    },
    getUser: () => {
        let user = JSON.parse(localStorage.getItem('users'));
        let userid = null;
        if (user != null && user.profile === 'Supervisor') {
            userid = user.employeeid
            return userid
        } else {
            return false
        }
    },
    getUsername: () => {
        return JSON.parse(localStorage.getItem('users')) || {};
    },
    getquotesforinvoice: () => {
        let certifys = JSON.parse(localStorage.getItem('certifys'));
        let idquote = certifys ? certifys.filter(e => e.action.flow === true).map(e => {
            return {
                value: e.quote,
                label: Utils.formatCode(e.quote, constantes.PREFIX_QUOTEID)
            }
        }) : []
        return idquote;
    },
    getidquote: (id) => {
        let certifys = JSON.parse(localStorage.getItem('certifys'));
        let idquote = certifys.find(e => e.quote === parseInt(id)) || {
            id: null
        }
        return idquote;
    },
    getDollarPrice: () => {
        let settings = JSON.parse(localStorage.getItem('settings'));
        let dollarprice = settings.find(e => e.name === "DOLLAR_PRICE").data;
        return dollarprice;
    },
    findProductPerCategory: (type) => {
        let products = JSON.parse(localStorage.getItem('products'));
        return products ? products.filter(p => p.category.toUpperCase() === type.toUpperCase()).map(p => {
            return {
                value: p.id,
                label: p.code + ' - ' + p.description
            }
        }) : [];
    },
    findProductsPerId: (id) => {
        let products = JSON.parse(localStorage.getItem('products'));
        return products ? products.find(p => p.id === id) : {};
    },
    employees: () => {
        return JSON.parse(localStorage.getItem('employees'));
    },
    customers: () => {
        return JSON.parse(localStorage.getItem('customers'));
    },
    supervisoryEmployees: () => {
        return JSON.parse(localStorage.getItem('employees')).filter(e => e.care === "SUPERVISOR")
    }
}

export default storage;
