import axios from "axios";

export const fetchDiagrama = async (id) => {
    const respose = await axios.get(`${import.meta.env.VITE_URL_BACKEND}/models/${id}`);
    return respose.data
}

export const postDiagrama = async (id, diagramaUpdated) => {
    let headersList = {
        "Accept": "*/*",
        "Content-Type": "application/json"
    }

    let bodyContent = JSON.stringify(diagramaUpdated);

    let response = await fetch(`${import.meta.env.VITE_URL_BACKEND}/models/${id}`, { 
        method: "PATCH",
        body: bodyContent,
        headers: headersList
    });

    // return response.text();
}