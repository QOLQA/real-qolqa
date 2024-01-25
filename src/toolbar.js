import createGraph, {container, editorImagesPath, Graph} from "./graph";
import createLayout from "./layout";
import mx from "./util";
import LoopConversor from "./classes/loop_conversor";
import Axios from "./classes/axios";

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('model_id');
console.log('model id', id);

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
  const api = new Axios('http://127.0.0.1:8000/models');

  // Agrega un manejador de eventos al botón
  BotonSave.addEventListener("click", async function() { //async
    var json = {
      "submodels": [
        {
          "documents": [
            {
              "name": "string",
              "id": "string",
              "fields": {
                "additionalProp1": "string",
                "additionalProp2": "string",
                "additionalProp3": "string"
              },
              "position": {
                "x": 0,
                "y": 0
              },
              "nested_docs": [
                {
                  "name": "string",
                  "fields": {
                    "additionalProp1": "string",
                    "additionalProp2": "string",
                    "additionalProp3": "string"
                  },
                  "nested_docs": [
                    "string"
                  ]
                }
              ]
            }
          ],
          "relations": {
            "additionalProp1": "string",
            "additionalProp2": "string",
            "additionalProp3": "string"
          }
        }
      ]
    }
    console.log(loopConversor.fromGraphToJson(graph));
    //console.log(graph.getModel())
    // Realizar la solicitud POST al backend de Firebase
    //api.create(loopConversor.fromGraphToJson(graph)); //update
    
    try {
      if (id) {
          // Si ya tiene un id, entonces es un modelo existente y debes actualizarlo
          await api.update(id, loopConversor.fromGraphToJson(graph));
          console.log('actualizado: ',graph.getModel())

      } else {
          // Si no tiene id, es un nuevo modelo y debes crearlo
          const newModel = await api.create(loopConversor.fromGraphToJson(graph));
          // Actualiza el id del modelo con el id devuelto por el backend
          id = newModel.id;
      }
      console.log("Guardado exitoso");
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
  myGraph.addToolbarItem(toolbar, editorImagesPath + 'swimlane.gif');

  // Genera un grafico a partir de datos
  const modeloActual = await api.read(id);
  loopConversor.fromJsonToGraph(modeloActual, myGraph.graph);
}