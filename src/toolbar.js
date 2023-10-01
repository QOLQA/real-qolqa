import { table } from "./cells";
import createGraph from "./graph";
import createLayout from "./layout";
import { selectionChanged }from "./userobjects";
import { overlayForAddProp, overlayForDelete, overlayForEdit, overlayForNestDoc } from "./overlays";
import mx from "./util";
import { column } from "./cells";
import moveContainedSwimlanesToBack from './swimbottom';

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
    // let vertex = new mx.mxCell(null, new mx.mxGeometry(0, 0, w, h), style);
    // vertex.setVertex(true);
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
          console.log('Swimlane event:', cell.getValue());
  
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
      overlayForDelete(
        vertex,
        graph,
        "images/delete2.png",
        { x: -10, y: 15 },
        "Borrar documento",
        mx.mxConstants.ALIGN_TOP
      );
      overlayForAddProp(
        vertex,
        graph,
        "images/add.png",
        { x: -30, y: 15 },
        "Add property",
        mx.mxConstants.ALIGN_TOP
      );
      overlayForNestDoc(
        vertex,
        graph,
        "images/handle-connect.png",
        { x: -50, y: 15 },
        "Add document",
        mx.mxConstants.ALIGN_TOP
      );

      // Agregar atributo por defecto
      let v1 = graph.getModel().cloneCell(column);
      v1.value.name = "id_column1";

      vertex.insert(v1, 0);

      // addOverlay(v1, 'images/add.png', graph, {x:-20, y:0}, 'que fue')
      overlayForDelete(
        v1,
        graph,
        "images/delete2.png",
        { x: -10, y: -25 },
        "Borrar atributo"
      );
      overlayForEdit(
        v1,
        graph,
        "examples/editors/images/overlays/pencil.png",
        { x: -30, y: -25 },
        "Editar atributo"
      );

      graph.setSelectionCells(graph.importCells([vertex], 0, 0, cell));
    }
  };

  // crea la imagen que es usada para el arrastre
  let img = toolbar.addMode(null, image, funct);
  mx.mxUtils.makeDraggable(img, graph, funct);
}

export function addTableChildren(graph) {
  let selectedCell = graph.getSelectionCell();

  if (selectedCell) {
    var name = mx.mxUtils.prompt("Enter name for new table");

    if (name != null && name.trim() != "") {
      let childTable = graph.getModel().cloneCell(table);
      childTable.value.name = name;

      // estilos de la tabla hijo
      let childStyle = childTable.getStyle();
      childStyle += ";fillColor=#81B9FF";
      childStyle += ";gradientColor=#5F98FF";
      childStyle += ";strokeColor=#81B9FF";
      childStyle += ";strokeWidth=1";
      childTable.setStyle(childStyle);

      childTable.geometry.alternateBounds = new mx.mxRectangle(
        0,
        0,
        childTable.geometry.width,
        childTable.geometry.height
      );

      graph.getModel().beginUpdate();
      try {
        graph.addCell(childTable, selectedCell);
      } finally {
        graph.getModel().endUpdate();
      }
    }
  }
}
