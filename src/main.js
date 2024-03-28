import Axios from "./classes/axios"

document.addEventListener('DOMContentLoaded', () => {
    const axios = new Axios(`${import.meta.env.VITE_URL_BACKEND}/models`);
    let models;
    const linksContainer = document.getElementById('linkModels');
    
    // Función para cargar los modelos existentes
    const loadModels = () => {
        axios.readAll()
            .then(data => {
                models = data;
                let counter = 0;
                models.forEach(element => {
                    let linkModel = document.createElement('a');
                    linkModel.setAttribute('href', `${import.meta.env.VITE_URL_FRONDEND}/model.html?model_id=${element.id}`);
                    linkModel.innerText = `Model ${++counter} ${element.name}`;

                    // Crear botón Delete
                    let deleteButton = document.createElement('button');
                    deleteButton.innerText = 'Delete';
                    deleteButton.classList.add('delete-button');
                    deleteButton.className = 'text-red-500';
                    deleteButton.addEventListener('click', () => deleteModel(element.id)); // Asociar la función deleteModel

                    let item = document.createElement('li');
                    item.dataset.modelId = element.id; // Agregar un atributo de datos para identificar el modelo
                    item.append(linkModel);
                    item.append(deleteButton); // Agregar el botón al elemento de la lista
                    linksContainer.append(item);
                });
            })
            .catch(e => console.error('Ocurrió el siguiente error', e))
    };

    // Función para eliminar un modelo
    const deleteModel = (modelId) => {
        axios.delete(modelId)
            .then(() => {
                // Eliminar el modelo de la lista
                const modelItem = document.querySelector(`[data-model-id="${modelId}"]`);
                if (modelItem) {
                    modelItem.remove();
                }
            })
            .catch(error => console.error('Error al eliminar el modelo', error));
    };
    
    // Cargar modelos al cargar la página
    loadModels();

    // Mostrar formulario para crear un nuevo modelo al hacer clic en el botón
    const showCreateModelFormBtn = document.getElementById('show-create-model-form');
    const createModelFormContainer = document.getElementById('create-model-form-container');
    showCreateModelFormBtn.addEventListener('click', () => {
        createModelFormContainer.style.display = 'block';
    });

    // Formulario para crear un nuevo modelo
    const newModelForm = document.getElementById('new-model-form');
    newModelForm.addEventListener('submit', (event) => {
        event.preventDefault();
        // Obtener el nombre del modelo del formulario
        const modelName = document.getElementById('model-name').value;
        // Crear un nuevo modelo con el nombre proporcionado
        axios.create({
            "submodels": [],
            "name": modelName
        })
            .then(data => {
                // Recargar la página para reflejar los cambios
                window.location.reload();
            })
            .catch(error => console.error('Error al crear un nuevo modelo', error));
    });
});
