import axios from "axios";

export async function fetchSolutions() {
    const response = await axios.get(`${import.meta.env.VITE_URL_BACKEND}/solutions`);
    return response.data;
}

export async function postSolution(newSolution) {
    const response = await fetch(`${import.meta.env.VITE_URL_BACKEND}/solutions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSolution),
    });
    
    const data = await response.json();

    if (response.status >= 400) {
        throw new Error(`Ocurrio un error: ${data.detail}`);
    } else {
        return data;
    }
}

export async function deleteSolution(solutionId) {
    const response = await fetch(`${import.meta.env.VITE_URL_BACKEND}/solutions/${solutionId}`, {
        method: 'DELETE',
    });

    if (response.status === 204) {
        return solutionId;
    }

    const data = await response.json();

    if (response.status >= 400) {
        throw new Error(`Ocurrio un error: ${data.detail}`);
    }
}