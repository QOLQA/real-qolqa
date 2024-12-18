import { store } from "../../app/store";
import { cleanUp, loadHTML, unsubscribe } from "../../app/utils";
import { loadSolutions, removeSolution, selectSolutions, submitSolution } from "./solutionsSlice";
import '../../styles/output.css';

export const renderSolutionsView = async(handleNavigation) => {
    // clean up
    cleanUp()

    await loadHTML('/solutions.html');

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
        store.dispatch(submitSolution(modelName));
    });

    const renderSolutions = () => {
        const solutions = selectSolutions(store.getState());
        const linksContainer = document.getElementById('linkModels');
        linksContainer.innerHTML = '';
        solutions.forEach(solution => {
            let linkModel = document.createElement('a');
            linkModel.setAttribute('href', `/diagrama/${solution._id}`);
            linkModel.innerText = `Model named: ${solution.name}`;
            linkModel.addEventListener('click', handleNavigation);

            // Crear botón Delete
            let deleteButton = document.createElement('button');
            deleteButton.innerText = 'Delete';
            deleteButton.className = 'text-red-500';

            deleteButton.addEventListener('click', () => {
                store.dispatch(removeSolution(solution._id));
            });

            let item = document.createElement('li');
            item.dataset.modelId = solution.id; // Agregar un atributo de datos para identificar el modelo
            item.append(linkModel);
            item.append(deleteButton);

            linksContainer.append(item);
        });
    }

    unsubscribe.value = store.subscribe(renderSolutions);
    // dispatch load solutions
    store.dispatch(loadSolutions())
    renderSolutions();

    // more logic
}