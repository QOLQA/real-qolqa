import createGraph, { container, Graph } from "./graph";
import createLayout from "./layout";
import mx from "./util";
import LoopConversor from "./classes/loop_conversor";
import Axios from "./classes/axios";

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('model_id');

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

  let { graph, editor } = createGraph();
  graph.dropEnabled = true;
  editor.setGraphContainer(container);

  //boton guardar
  // Obtén el botón por su ID
  var BotonSave = document.getElementById("saveButton");

  // Conversor de mxgraph a json
  const loopConversor = new LoopConversor();

  // Servicio de api
  const api = new Axios(`${import.meta.env.VITE_URL_BACKEND}/models`);

  // Agrega un manejador de eventos al botón
  BotonSave.addEventListener("click", async function () { //async
    // Realizar la solicitud POST al backend de Firebase
    //api.create(loopConversor.fromGraphToJson(graph)); //update

    try {
      if (id) {
        const json = loopConversor.fromGraphToJson(graph)
        // Si ya tiene un id, entonces es un modelo existente y debes actualizarlo
        await api.update(id, json);

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

  const myGraph = new Graph(graph);
  myGraph.addToolbarItem(toolbar, '/assets/images/icons/document.svg');

  // Genera un grafico a partir de datos
  const modeloActual = await api.read(id);
  loopConversor.fromJsonToGraph(modeloActual, myGraph.graph);
}