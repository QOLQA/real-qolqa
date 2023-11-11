import createGraph, {container, editorImagesPath, Graph} from "./graph";
import createLayout from "./layout";
import mx from "./util";
import LoopConversor from "./classes/loop_conversor";
import Axios from "./classes/axios";

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
console.log('model id', id);

// recuperar datos del backend
const miModelo = {
  submodels: [
    {
      documents: [
        {
          name: 'person',
          fields: [
            { id_column1: 'String' },
            { name: 'String' },
            { last_name: 'String' },
            { nacimiento: 'Date' },
          ],
          relations: {
            inner_relations: null,
            outer_relations: null,
          },
          pt: {
            x: 230,
            y: 180,
          }
        }
      ]
    }
  ]
}

if (!mx.mxClient.isBrowserSupported()) {
  mx.mxUtils.error("Browser is not supported!", 200, false);
} else {

  let tbContainer = document.getElementById("toolbar");

  // Crea un toolbar sin procesamiento de eventos
  let toolbar = new mx.mxToolbar(tbContainer);
  toolbar.enabled = false;

  container.style.background = `url(${editorImagesPath}grid.gif)`;

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
  const axios = new Axios('http://127.0.0.1:8000/models');

  // Agrega un manejador de eventos al botón
  BotonSave.addEventListener("click", function() {
    console.log(loopConversor.fromGraphToJson(graph));
    
    // Realizar la solicitud POST al backend de Firebase
    axios.create(loopConversor.fromGraphToJson(graph));
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
  myGraph.addToolbarItem(toolbar, editorImagesPath + 'swimlane.gif');

  // Genera un grafico a partir de datos
  graph.model.beginUpdate();
  loopConversor.fromJsonToGraph(miModelo, myGraph.graph);
  console.log('terminado de graficar');
  graph.model.endUpdate();
}

