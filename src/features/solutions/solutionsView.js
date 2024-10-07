import { store } from "../../app/store";
import { cleanUp, loadHTML, unsubscribe } from "../../app/utils";
import { loadSolutions, selectSolutions } from "./solutionsSlice";
import '../../styles/output.css';

export const renderSolutionsView = async(handleNavigation) => {
    // clean up
    cleanUp()

    await loadHTML('/solutions.html');

    const renderSolutions = () => {
        const solutions = selectSolutions(store.getState());
        const linksContainer = document.getElementById('linkModels');
        solutions.forEach(solution => {
            let linkModel = document.createElement('a');
            linkModel.setAttribute('href', `/diagrama/${solution._id}`);
            linkModel.innerText = `Model named: ${solution.name}`;
            linkModel.addEventListener('click', handleNavigation);

            // Crear botón Delete
            let deleteButton = document.createElement('button');
            deleteButton.innerText = 'Delete';
            deleteButton.classList.add('delete-button');
            deleteButton.className = 'text-red-500';

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