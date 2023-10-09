import { table } from "./cells";
import createGraph from "./graph";
import createLayout from "./layout";
import { selectionChanged }from "./userobjects";
import mx from "./util";
import moveContainedSwimlanesToBack from './swimbottom';
import { addActionsForDocs, addDefaultVertex } from "./cells_actions";

let container = document.querySelector("#container");

const editorImagesPath = "../../examples/editors/images/";

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

  let addVertex = function (icon, w, h, style) {
    let vertex = graph.getModel().cloneCell(table);
    addToolbarItem(graph, toolbar, vertex, icon);
  };

  // solo agregar la primera opcion
  addVertex(
    editorImagesPath + "swimlane.gif",
    120,
    160,
    "shape=swimlane;startSize=20;"
  );

  graph.getSelectionModel().addListener(mx.mxEvent.CHANGE, function(sender, evt)
  {
    selectionChanged(graph,null);
  });
  // Arreglo para almacenar las swimlanes
  var swimlanes = [];
  function handleSwimlaneEvent(graph, swimlanes, moveFunction) {
    return function(sender, evt) {
      const cells = evt.getProperty('cells'); // Obtiene las celdas que se agregaron o se están moviendo
  
      // Verifica si alguna de las celdas es un swimlane
      cells.forEach(function(cell) {
        if (graph.isSwimlane(cell)) {
          // Realiza acciones específicas cuando se agrega o se selecciona y arrastra una swimlane
  
          if (swimlanes.indexOf(cell) === -1) {
            // Agrega la swimlane al arreglo si no está duplicada
            swimlanes.push(cell);
          }
  
          if (swimlanes.length > 0) {
            // Itera sobre todas las swimlanes en el arreglo y aplica la función moveFunction a cada swimlane
            swimlanes.forEach(function(swimlane) {
              moveFunction(graph, swimlane);
            });
          }
        }
      });
    };
  }
  
  // Registra un oyente de eventos para detectar cuando se agregan celdas al grafo
  graph.addListener(mx.mxEvent.CELLS_ADDED, handleSwimlaneEvent(graph, swimlanes, moveContainedSwimlanesToBack));
  graph.addListener(mx.mxEvent.MOVE_CELLS, handleSwimlaneEvent(graph, swimlanes, moveContainedSwimlanesToBack));
  
}

function addToolbarItem(graph, toolbar, prototype, image) {
  let funct = function (graph, evt, cell) {
    graph.stopEditing(false);
    graph.clearSelection()

    var name = mx.mxUtils.prompt("Enter name for new document");

    if (name != null && name.trim() != "") {
      let pt = graph.getPointForEvent(evt);
      let vertex = graph.getModel().cloneCell(prototype);
      vertex.value.name = name;
      vertex.geometry.x = pt.x;
      vertex.geometry.y = pt.y;
      vertex.geometry.alternateBounds = new mx.mxRectangle(
        0,
        0,
        vertex.geometry.width,
        vertex.geometry.height
      );
      
      addActionsForDocs(vertex, graph);

      vertex.setConnectable(true)
      
      addDefaultVertex(graph, vertex)

      graph.setSelectionCells(graph.importCells([vertex], 0, 0, cell));
    }
  };

  // crea la imagen que es usada para el arrastre
  let img = toolbar.addMode(null, image, funct);
  mx.mxUtils.makeDraggable(img, graph, funct);
}

