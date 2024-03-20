// Agregar la logica para recuperar los ids
// de la base de datos

import Axios from "./classes/axios"

document.addEventListener('DOMContentLoaded', () => {
    const axios = new Axios(`${import.meta.env.VITE_URL_BACKEND}/models`);
    let models;
    const linksContainer = document.getElementById('linkModels');
    axios.readAll()
        .then(data => {
            models = data;
            let counter = 0;
            models.forEach(element => {
                let linkModel = document.createElement('a');
                linkModel.setAttribute('href', `${import.meta.env.VITE_URL_FRONDEND}/model.html?model_id=${element.id}`);
                linkModel.innerText = `Model ${++counter}`;
                let item = document.createElement('li');
                item.append(linkModel);
                linksContainer.append(item);
            });
        })
        .catch(e => console.error('Ocurrió el siguiente error', e))
})
