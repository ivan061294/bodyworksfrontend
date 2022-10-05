/* Storage.js */
export default {
    getNameById: (id) => {
        var customers = JSON.parse(localStorage.getItem('customers'));
        if (id) {
            return customers.find(x => id === x.id).fullname || null;
        } else {
            return null;
        }
    }
}