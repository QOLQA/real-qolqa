import { container, editor, graph, myGraph } from "./graph";
import createLayout from "./layout";
import mx from "./util";
import LoopConversor from "./classes/loop_conversor";
import Axios from "./classes/axios";


const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('model_id');
// Servicio de api
const api = new Axios(`${import.meta.env.VITE_URL_BACKEND}/models`);
// Conversor de mxgraph a json
  const loopConversor = new LoopConversor();
const nameModel = document.querySelector('#nameModel')

async function showNosqlData(api, id, myGraph) {
  const nosqlModel = await api.read(id)
  nameModel.innerHTML = nosqlModel.name
  GenerarGrafico(nosqlModel, myGraph)
  showQueries(nosqlModel)
}

const GenerarGrafico = async (nosqlModel, myGraph) => {
  // Genera un grafico a partir de datos
  // const modeloActual = await api.read(id);
  loopConversor.fromJsonToGraph(nosqlModel, myGraph.graph);
  // showQueries(modeloActual)
}

function showQueries(nosqlModel) {
  const { queries } = nosqlModel
  const queryList = document.getElementById('query-list')
  queries.forEach(query => {
    const queryDiv = generateQueryHTML(query)
    queryList.appendChild(queryDiv)
  })
}

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

function getQueries() {
  const queryList = document.getElementById('query-list')

  const queries = []

  queryList.querySelectorAll('div').forEach(div => {
    const fullQuery = div.querySelector('h1').textContent.trim()
    const collections = Array
      .from(div.querySelectorAll('ul.list-disc li'))
      .map(li => li.textContent.trim())
    queries.push({
      full_query: fullQuery,
      collections: collections
    })
  })

  return queries
}

if (!mx.mxClient.isBrowserSupported()) {
  mx.mxUtils.error("Browser is not supported!", 200, false);
} else {

  let tbContainer = document.getElementById("toolbar");

  // Crea un toolbar sin procesamiento de eventos
  let toolbar = new mx.mxToolbar(tbContainer);
  toolbar.enabled = false;

  container.style.background = `url(/assets/images/grid.gif)`;

  if (mx.mxClient.IS_QUIRKS) {
    document.body.style.overflow = "hidden";
    new mx.mxDivResizer(tbContainer);
    new mx.mxDivResizer(container);
  }

  // let { graph, editor } = createGraph();
  graph.dropEnabled = true;
  editor.setGraphContainer(container);

  //boton guardar
  // Obtén el botón por su ID
  var BotonSave = document.getElementById("saveButton");

  // Agrega un manejador de eventos al botón
  BotonSave.addEventListener("click", async function () { //async
    // Realizar la solicitud POST al backend de Firebase
    //api.create(loopConversor.fromGraphToJson(graph)); //update

    try {
      if (id) {
        const modeloActual = await api.read(id)
        const json = loopConversor.fromGraphToJson(graph)
        const queries = getQueries()
        // Si ya tiene un id, entonces es un modelo existente y debes actualizarlo
        await api.update(id, {
          submodels: json.submodels,
          name: modeloActual.name,
          queries: queries,
        });

      } else {
        // Si no tiene id, es un nuevo modelo y debes crearlo
        const newModel = await api.create(loopConversor.fromGraphToJson(graph));
        // Actualiza el id del modelo con el id devuelto por el backend
        id = newModel.id;
      }
    } catch (error) {
      console.error("Error al guardar:", error);
    }
  });

  createLayout(editor);

  // empareja DNd dentro del grafo
  mx.mxDragSource.prototype.getDropTarget = function (graph, x, y) {
    let cell = graph.getCellAt(x, y);

    if (!graph.isValidDropTarget(cell)) {
      cell = null;
    }

    return null;
  };

  // parar la edicion al dar enter o tecla escape
  let keyHandler = new mx.mxKeyHandler(graph);
  let rubberband = new mx.mxRubberband(graph);

  // const myGraph = new Graph(graph);
  myGraph.addToolbarItem(toolbar, '/assets/icons/document-icon.svg');

  // GenerarGrafico(api, id, myGraph, loopConversor)
  showNosqlData(api, id, myGraph)

}
