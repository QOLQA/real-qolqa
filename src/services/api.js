// Interfaz para las peticiones http
class Api {
    async create(jsonModel) {}

    // se puede agregar parametros para temas de paginacion
    async readAll() {}

    async read(idModel) {}

    async update(idModel, jsonModelUpdated) { }

    async delete(idModel) {}
}

export default Api
