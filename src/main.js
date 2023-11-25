// Agregar la logica para recuperar los ids
// de la base de datos

import Axios from "./classes/axios"

document.addEventListener('DOMContentLoaded', () => {
    const axios = new Axios('http://127.0.0.1:8000/models');
    let models;
    const linksContainer = document.getElementById('linkModels');
    axios.readAll()
        .then(data => {
            console.log(data);
            models = data;
            let counter = 0;
            models.forEach(element => {
                let linkModel = document.createElement('a');
                linkModel.setAttribute('href', `http://localhost:5173/model.html?model_id=${element.model_id}`);
                linkModel.innerText = `Model ${++counter}`;
                let item = document.createElement('li');
                item.append(linkModel);
                linksContainer.append(item);
            });
        })
        .catch(e => console.error('Ocurrió el siguiente error', e))
})
