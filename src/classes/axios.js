import Api from "../services/api"
import axios from "axios"

export default class Axios extends Api {
    constructor(endpoint) {
        super();
        this.endpoint = endpoint;
    }

    async create(jsonModel) {
        const resp = await axios.post(this.endpoint, jsonModel);
        // resp se retorna del backend
        return resp.data;
    }

    async readAll() {
        const resp = await axios.get(this.endpoint);
        return resp.data;
    }

    async read(idModel) {
        const resp = await axios.get(`${this.endpoint}/${idModel}`);
        return resp.data;
    }

    async update(id, jsonModel) {
        const resp = await axios.patch(`${this.endpoint}/${id}`, jsonModel);
        // resp se retorna del backend
        return resp.data;
    }
    
}
