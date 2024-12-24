import Axios from "./classes/axios"

console.log('se llama el main desde solutions');

export function setupButton() {
    // Mostrar formulario para crear un nuevo modelo al hacer clic en el botón
    const showCreateModelFormBtn = document.getElementById('show-create-model-form');
    const createModelFormContainer = document.getElementById('create-model-form-container');
    showCreateModelFormBtn.addEventListener('click', () => {
        console.log('is clicked');
        createModelFormContainer.style.display = 'block';
    });

    // Formulario para crear un nuevo modelo
    const newModelForm = document.getElementById('new-model-form');
    newModelForm.addEventListener('submit', (event) => {
        event.preventDefault();
        // Obtener el nombre del modelo del formulario
        const modelName = document.getElementById('model-name').value;
    });
}
