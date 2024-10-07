import Axios from "../../classes/axios";

const api = new Axios(
    `${import.meta.env.VITE_URL_BACKEND}/solutions`
);

export const fetchDiagrama = async (id) => {
    return await api.read(id);
}

export const postDiagrama = async (id, diagramaUpdated) => {
    return await api.update(id, diagramaUpdated);
}