import { store } from "../../app/store";
import { app, cleanUp, loadHTML, unsubscribe } from "../../app/utils"
import { loadDiagrama, saveDiagrama, selectDiagrama, selectQueries, selectStateDiagrama, setLoaded } from "./diagramaSlice";
import { editor, graph, myGraph } from "./graph";
import createLayout from "./layout";
import mx from "../../util";
import { haddleNavbar } from "../navbar";
import { initializeQueryPopup } from "../queries";
import LoopConversor from "../../classes/loop_conversor";

function generateQueryHTML(query) {
  const div = document.createElement('div')
  const h1 = document.createElement('h1')
  const ul = document.createElement('ul')
  ul.classList.add('list-disc')
  h1.textContent = query.full_query
  query.collections.forEach(collection => {
    const li = document.createElement('li')
    li.textContent = collection
    ul.appendChild(li)
  })
  div.appendChild(h1)
  div.appendChild(ul)
  return div
}

function showQueries(queries) {
    const queryList = document.getElementById('query-list');
    queryList.innerHTML = '';
    queries.forEach(query => {
        const queryDiv = generateQueryHTML(query);
        queryList.appendChild(queryDiv);
    });
}

export const renderDiagramaView = async(params, router) => {
    cleanUp()

    await loadHTML('/model.html');
    haddleNavbar();
    initializeQueryPopup();

    const conversor = new LoopConversor();
    
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
        store.dispatch(saveDiagrama(
            {
                id: params.id,
                submodels: json.submodels,
                name: diagrama.name,
                queries: diagrama.queries,
            },
        ));
    })

    let backToIndex = document.getElementById('back-to-index');
    backToIndex.addEventListener('click', () => {
        window.history.pushState({}, '', '/');
        router();
    })
}