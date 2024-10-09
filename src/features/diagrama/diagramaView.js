import { store } from "../../app/store";
import { app, cleanUp, loadHTML, unsubscribe } from "../../app/utils"
import { loadDiagrama, saveDiagrama, selectDiagrama, selectStateDiagrama, setLoaded } from "./diagramaSlice";
import { editor, graph, myGraph } from "./graph";
import createLayout from "./layout";
import mx from "../../util";
import { haddleNavbar } from "../navbar";
import LoopConversor from "../../classes/loop_conversor";
import { changeStep, selectQueries, selectQueryForm, onSubmitQueryForm, toggleVisibility, deleteQuery } from "../queries/queries-slice";

function generateQueryHTML(query, index) {
    const div = document.createElement('div');
    div.classList.add('p-4', 'bg-white', 'rounded-lg', 'shadow-md', 'mb-4', 'flex', 'flex-col');

    const contentDiv = document.createElement('div');

    const h1 = document.createElement('h1');
    h1.classList.add('text-lg', 'font-semibold', 'mb-2', 'text-gray-800');
    h1.textContent = query.full_query;

    const ul = document.createElement('ul');
    ul.classList.add('list-disc', 'pl-5', 'text-gray-600');

    query.collections.forEach(collection => {
        const li = document.createElement('li');
        li.classList.add('mb-1');
        li.textContent = collection;
        ul.appendChild(li);
    });

    contentDiv.appendChild(h1);
    contentDiv.appendChild(ul);

    // Botón de edición
    const editButton = document.createElement('button');
    editButton.textContent = 'Editar';
    editButton.classList.add('text-blue-500', 'font-semibold', 'hover:underline', 'ml-4');
    editButton.onclick = () => {
        store.dispatch(changeStep({
            otherStep: 1,
            query: query.full_query,
            toEdit: index,
        }));
    };
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('text-red-500', 'font-semibold', 'hover:underline', 'ml-4');
    deleteButton.textContent = 'Delete';
    deleteButton.onclick = () => {
        store.dispatch(deleteQuery(index));
    }

    const divButtons = document.createElement('div');
    divButtons.classList.add('flex', 'flex-row', 'justify-between');
    divButtons.appendChild(editButton);
    divButtons.appendChild(deleteButton);
    div.appendChild(contentDiv);
    div.appendChild(divButtons);
    
    return div;
}

function showQueries(queries) {
    const queryList = document.getElementById('query-list');
    queryList.innerHTML = '';
    queries.forEach((query, i) => {
        const queryDiv = generateQueryHTML(query, i);
        queryList.appendChild(queryDiv);
    });
}

export const renderDiagramaView = async(params, router) => {
    cleanUp()

    await loadHTML('/model.html');
    haddleNavbar();
    // these functionality
    // initializeQueryPopup();

    const conversor = new LoopConversor();
    // init query functionality
    const queryPopup = document.getElementById('query-popup');
    const openPopupButton = document.getElementById('open-popup-button');
    const closePopupButton = document.getElementById('close-popup-button');
    const stepOneForm = document.getElementById('step-one-form');
    const stepTwoForm = document.getElementById('step-two-form');
    const stepTwoContainer = document.getElementById('step-two-container');
    const backToStepOneButton = document.getElementById('back-button');
    const cancelQueryButton = document.getElementById('cancel-button');
    const fullQueryInput = document.getElementById('query');
    const wordsButtons = document.getElementById('words-buttons');
    const selectedWordsInput = document.getElementById('selected-words');

    openPopupButton.addEventListener('click', () => {
        store.dispatch(toggleVisibility());
    });
    closePopupButton.addEventListener('click', () => {
        store.dispatch(toggleVisibility());
    });
    stepOneForm.addEventListener('submit', (event) => {
        event.preventDefault();
        store.dispatch(changeStep({
            otherStep: 2,
            query: fullQueryInput.value,
        }));
    });
    cancelQueryButton.addEventListener('click', () => {
        store.dispatch(toggleVisibility());
    });
    backToStepOneButton.addEventListener('click', () => {
        store.dispatch(changeStep({
            otherStep: 1,
        }))
    });
    stepTwoForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const collectionNames = selectedWordsInput.value.split(',');
        wordsButtons.innerHTML = '';
        selectedWords.splice(0, selectedWords.length);
        store.dispatch(onSubmitQueryForm({
            full_query: fullQueryInput.value,
            collections: collectionNames,
        }));
        // store.dispatch(sendForm({
        //     queryData: {
        //         full_query: fullQueryInput.value,
        //         collections: collectionNames,
        //     },
        //     modification: '',
        // }));
    })

    const selectedWords = []

    // Query Form Function
    function getWords(sentence) {
        const words = sentence.split(/\s+/)
        return words.filter(p => p !== '')
    }

    function createWordButton(word) {
        let wordButton = document.createElement('button')
        wordButton.classList.add('p-2', 'text-white', 'bg-green-500')
        wordButton.textContent = word
        wordButton.addEventListener('click', () => {
          toggleSelectedWord(wordButton, word)
        })
        return wordButton
    }
    
    function toggleSelectedWord(button, word) {
        const index = selectedWords.indexOf(word)
        if (index === -1) {
            selectedWords.push(word)
            button.classList.replace('bg-green-500', 'bg-purple-500')
        } else {
            selectedWords.splice(index, 1)
            button.classList.replace('bg-purple-500', 'bg-green-500')
        }
        updateSelectedWordsInput()
    }
    
    function updateSelectedWordsInput() {
        selectedWordsInput.value = selectedWords.join(',')
    }
    
    const renderDiagram = () => {
        const status = selectStateDiagrama(store.getState());
        
        
        if (status !== 'loaded' && status !== 'failed') {
            if (status === 'idle') {
                const diagrama = selectDiagrama(store.getState());
                const conversor = new LoopConversor();
                conversor.fromJsonToGraph(diagrama, myGraph.graph);
                store.dispatch(setLoaded());
            }
        } else if (status === 'loaded') {
            const queries = selectQueries(store.getState());
            showQueries(queries);
        }

        // render function for query form
        const queryForm = selectQueryForm(store.getState());
        stepTwoForm.dataset.customData = queryForm.toEdit;
        if (queryForm.open) {
            // show query popup
            queryPopup.classList.replace('hidden', 'flex');
            queryPopup.classList.add('items-center', 'justify-center');
            // stepper one with fullQuery
            if (queryForm.step === 1) {
                stepTwoContainer.classList.replace('block', 'hidden');
                stepOneForm.classList.replace('hidden', 'block');
                fullQueryInput.value = queryForm.fullQuery;
            } else if (queryForm.step === 2) {
                // show form for step two
                stepOneForm.classList.replace('block', 'hidden');
                stepTwoContainer.classList.replace('hidden', 'block');
                const words = getWords(queryForm.fullQuery);
                wordsButtons.innerHTML = '';
                for (let word of words) {
                    let wordButton = createWordButton(word);
                    wordsButtons.appendChild(wordButton);
                }
            }
        } else {
            // hide query popup
            queryPopup.classList.replace('flex', 'hidden');
            queryPopup.classList.remove('items-center', 'justify-center');
        }
    }

    unsubscribe.value = store.subscribe(renderDiagram);
    store.dispatch(loadDiagrama(params.id));
    renderDiagram();

    let tbContainer = document.getElementById('toolbar');

    let toolbar = new mx.mxToolbar(tbContainer);
    toolbar.enabled = false;

    let container = document.getElementById('container');
    container.style.background = `url(/assets/images/grid.gif)`;

    if (mx.mxClient.IS_QUIRKS) {
        document.body.style.overflow = 'hidden';
        new mx.mxDivResizer(tbContainer);
        new mx.mxDivResizer(container);
    }

    graph.dropEnabled = true;
    editor.setGraphContainer(container);

    createLayout(editor);

    mx.mxDragSource.prototype.getDropTarget = function(graph, x, y) {
        let cell = graph.getCellAt(x, y);

        if (!graph.isValidDropTarget(cell)) {
            cell = null;
        }

        return null;
    };

    myGraph.addToolbarItem(toolbar, '/assets/icons/document-icon.svg');

    let botonSave = document.getElementById("saveButton");

    botonSave.addEventListener('click', () => {
        console.log('click click')
        const json = conversor.fromGraphToJson(graph);
        const diagrama = selectDiagrama(store.getState());
        const queries = selectQueries(store.getState());
        store.dispatch(saveDiagrama(
            {
                id: params.id,
                submodels: json.submodels,
                name: diagrama.name,
                queries: queries,
            },
        ));
    })

    let backToIndex = document.getElementById('back-to-index');
    backToIndex.addEventListener('click', () => {
        window.history.pushState({}, '', '/');
        router();
    })
}