import http from "../commons/http-common";

class QuoteService {
    getAll() {
        return http.get("/quotations");
    }

    get(id) {
        return http.get(`/quotations/${id}`);
    }

    create(data) {
        return http.post("/quotations", data);
    }

    update(id, data) {
        return http.put(`/quotations/${id}`, data);
    }

    delete(id) {
        return http.delete(`/quotations/${id}`);
    }

    deleteAll() {
        return http.delete(`/quotations`);
    }
}

export default new QuoteService();
