import axios from "axios";

export async function fetchSolutions() {
    const response = await axios.get(`${import.meta.env.VITE_URL_BACKEND}/models`);
    return response.data;
}