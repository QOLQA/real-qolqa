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
        console.log('Respuesta de create', resp);
    }
}
