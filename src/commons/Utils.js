/* Utils.js */
import Storage from "../commons/Storage";
import _ from "lodash";

const utils = {
    formatCurrency: (total, currency = 'PEN') => {
        const locales = currency === 'PEN' ? 'es-PE' : 'en-US';
        const formatter = new Intl.NumberFormat(locales, {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2
        });
        return formatter.format(total);
    },
    priceCurrency: (total, currency = 'PEN') => {
        return parseFloat(total * (currency === 'PEN' ? 1 : 1 / Storage.getDollarPrice())).toFixed(2);
    },
    currencyConverter: (amount, exchange) => {
        let amountChanged = 0.00;
        let dollarPrice = Storage.getDollarPrice();
        switch (exchange) {
            case "PEN-USD":
                amountChanged = amount / dollarPrice;
                break;
            case "USD-PEN":
                amountChanged = amount * dollarPrice;
                break;
            default:
                amountChanged = amount;
                break;
        }
        return parseFloat(amountChanged.toFixed(2));
    },
    indicatorGainColor: (realGain) => {
        let gain = parseFloat(realGain.toFixed(2));
        let color = "gris";
        if (gain > 0) {
            color = "green";
        }
        if (gain < 0) {
            color = "red";
        }
        return color;
    },
    indicatorGainIcon: (realGain) => {
        let gain = parseFloat(realGain.toFixed(2));
        let icon = "arrow-right";
        if (gain > 0) {
            icon = "arrow-up";
        }
        if (gain < 0) {
            icon = "arrow-down";
        }
        return icon;
    },
    maskQuoteId: (quoteId) => {
        const id = `${quoteId}`.padStart(6, "0");
        return `CT${id}`;
    },
    maskOrderId: (orderId) => {
        const id = `${orderId}`.padStart(6, "0");
        return `OT${id}`;
    },
    calcTotalFromOrder: (order) => {

        const isValidServices = (services) => {
            if (services != null && services.length) {
                return services.every(service => service.details ? service.details.length : false)
            }
            return false
        }

        const isValidSupplies = (supplies) => {
            if (supplies != null && supplies.length) {
                return true
            }
            return false
        }

        const isValidExternals = (externals) => {
            if (externals != null && externals.length) {
                return externals.every(external => external.details ? external.details.length : false)
            }
            return false
        }

        const calculateTotalService = (services) => {
            if (!isValidServices(services)) return 0;
            const [pricePerService] = services.map(service => {
                const {details} = service;
                return details.map(detail => {
                    const {salary, hours} = detail;
                    const salaryPerHour = salary / 30 / 8;
                    return salaryPerHour * hours;
                });
            });
            return _.sum(pricePerService);
        }

        const calculateTotalSupplies = (supplies) => {
            if (!isValidSupplies(supplies)) return 0;
            const [pricePerSupplie] = supplies.map(supplie => {
                const {quantity, saleprice} = supplie;
                return quantity * saleprice;
            });
            return _.sum(pricePerSupplie);
        }

        const calculateTotalExternals = (externals) => {
            if (!isValidExternals(externals)) return 0;
            const [pricePerExternal] = externals.map(external => {
                const {details} = external;
                return details.map(detail => {
                    const {salary, hours} = detail;
                    const salaryPerHour = salary / 30 / 8;
                    return salaryPerHour * hours;
                });
            });
            return _.sum(pricePerExternal);
        }

        try {
            return calculateTotalService(order.services) +
                calculateTotalSupplies(order.supplies) +
                calculateTotalExternals(order.externals)
        } catch (e) {
            console.error(e)
            return 0;
        }
    },
    formatCurrencytoPen(id) {
        let currency = Storage.getQuotePerId(id).currency;
        let totalquote = Storage.getQuotePerId(id).total;
        let totalforOt = 0

        if (currency === 'USD') {
            let costoDolar = Storage.getDollarPrice();
            totalforOt = totalquote * costoDolar

        } else {
            totalforOt = totalquote
        }
        return totalforOt;

    },
    formatCode(id, prefix) {
        if (id) {
            return prefix + id.toString().padStart(5, "0");
        } else {
            return prefix + "0".padStart(5, "0");
        }
    },
    getMessageError(err) {
        console.error(err);
        let message = "";
        try {
            if (err.messages) {
                message = err.messages[0] || err.messages
            } else if (err.response) {
                message = err.response;
                if (err.response.data) {
                    message = err.response.data;
                }
            } else {
                message = "Ocurrio un error inesperado, intentelo mas tarde."
            }
        } catch (error) {
            message = "Ocurrio un error inesperado, intentelo mas tarde."
        }

        return message;
    },
    usePagination(page, count) {
        const boundaryCount = 1;
        const hideNextButton = false;
        const hidePrevButton = false;
        const showFirstButton = false;
        const showLastButton = false;
        const siblingCount = 1;
        const range = (start, end) => {
            const length = end - start + 1;
            return Array.from({length}, (_, i) => start + i);
        };
        const startPages = range(1, Math.min(boundaryCount, count));
        const endPages = range(Math.max(count - boundaryCount + 1, boundaryCount + 1), count);
        const siblingsStart = Math.max(
            Math.min(
                page - siblingCount,
                count - boundaryCount - siblingCount * 2 - 1,
            ),
            boundaryCount + 2,
        );
        const siblingsEnd = Math.min(
            Math.max(
                page + siblingCount,
                boundaryCount + siblingCount * 2 + 2,
            ),
            endPages.length > 0 ? endPages[0] - 2 : count - 1,
        );

        const itemList = [
            ...(showFirstButton ? ['first'] : []),
            ...(hidePrevButton ? [] : ['previous']),
            ...startPages,
            ...(siblingsStart > boundaryCount + 2
                ? ['...']
                : boundaryCount + 1 < count - boundaryCount
                    ? [boundaryCount + 1]
                    : []),
            ...range(siblingsStart, siblingsEnd),
            ...(siblingsEnd < count - boundaryCount - 1
                ? ['...']
                : count - boundaryCount > boundaryCount
                    ? [count - boundaryCount]
                    : []),
            ...endPages,
            ...(hideNextButton ? [] : ['next']),
            ...(showLastButton ? ['last'] : []),
        ];
        return itemList;
    },
    downloadCSV(csv, filename) {
        var csvFile;
        var downloadLink;
        csvFile = new Blob(["\uFEFF" + csv], {type: "text/csv; charset=utf-18"});
        downloadLink = document.createElement("a");
        downloadLink.download = filename;
        downloadLink.href = window.URL.createObjectURL(csvFile);
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
        return downloadLink;
    },
    getApi(type) {
        let user = Storage.getUsername();
        let api = "employee/" + user.employeeid + "/" + type;
        if (user.profile === "Administrador") {
            api = type;
        }
        return api;
    },
    itemsOnArrayIsNotZero(items) {
        return items.every(e => e.product_id > 0);
    },
    getFormatInvoice(id) {
        if (id) {
            return ("" + id).padStart(11, "F001-00000");
        } else {
            return id;
        }
    },
    getVariantOfStatus(status) {
        switch (status) {
            case 'Pendiente':
                return "primary";
            case 'Rechazado':
                return "danger";
            case 'Aceptado':
                return "success";
            case 'Terminado':
                return "success";
            case 'Aprobado':
                return "success";
            case 'Facturado':
                return "default";
            case 'Registrado':
                return "default"
            case 'Emitido':
                return "primary"
            case 'Observado':
                return "warning"
            case 'Anulado':
                return "danger"
            default:
                return "primary";
        }
    },
    getKeyStatus(statusName) {
        const statusMap = {
            'P': 'Pendiente',
            'A': 'Aceptado',
            'R': 'Rechazado'
        }
        return Object.keys(statusMap).find(key => statusMap[key] === statusName) || statusName;
    }
}

export default utils;
