import { v4 as uuidv4 } from "uuid";
import {configureTableStyle} from "./configureTableStyle";
import mx from "./util";
import {table, column} from "./cells.js";
import {addActionsForDocs, addDefaultVertex} from "./cells_actions.js";
import moveContainedSwimlanesToBack from "./swimbottom.js";
import {selectionChanged} from "./userobjects.js";
import { SimpleRegex } from "./classes/simple_regex.js";

function createGraph() {

  let editor = new mx.mxEditor();
  let graph = editor.graph;
  const regex = new SimpleRegex();

  graph.setConnectable(true);
  graph.setCellsDisconnectable(true); //desconectar y pasar a otrp
  graph.setCellsCloneable(true); //clona manteniendo crtl y arrastrando
  graph.swimlaneNesting = true; //permite agrupar anidar los grafos entre si
  graph.dropEnabled = true; //permite el anidamiento total (en false no se anidan las propiedades del grafo)
  graph.setAllowDanglingEdges(false);
  graph.connectionHandler.factoryMethod = null;

  //si la figura es un swinlane se puede redimencionar
  graph.isCellResizable = function (cell) {
    return this.isSwimlane(cell);
  };
  // se puede mover si la figura es un swinlane
  graph.isCellMovable = function (cell) {
    return this.isSwimlane(cell);
  };

  // retornar un label
  graph.convertValueToString = function (cell) {
    if (cell.value != null && cell.value.name != null) {
      return cell.value.name;
    }
  }

  // labels -- devuelve true si la etiqueta no es un swinlane o un borde lo que permite tratar como html
  graph.isHtmlLabel = function (cell) {
    return !this.isSwimlane(cell) && !this.model.isEdge(cell);
  };

  // retorna la etiqueta de la celda
  graph.getLabel = function (cell) {
    if (this.isHtmlLabel(cell)) {
      // cell.value este sera mi objeto
      return `${cell.value.name}:\t${cell.value.type}`;
    } else if (this.isSwimlane(cell)) {
      return cell.value.name;
    } else if (cell.isEdge()) {
      return cell.value;
    }
  };
  //reemplaza la propiedad name del valor de la celda con un nuevo valor proporcionado,
  // y devuelve el valor anterior de la propiedad name si no se proporcionó un nuevo valor.
  graph.model.valueForCellChanged = function (cell, value) {
    if (value.name != null) {
      return mx.mxGraphModel.prototype.valueForCellChanged.apply(
        this,
        arguments
      );
    } else if (cell.isEdge()) {
      if (!regex.isValidCardinality(value)) {
        alert('Escriba un formato valido de cardinaliad');
        return cell.value;
      } else {
        let old = cell.value;
        cell.value = value;
        return old;
      }
    } else {
      if (!cell.value.forCardinality) {
        let old = cell.value.name;
        cell.value.name = value;
        return old;
      } else {
        if (!regex.isValidCardinality(value)) {
          alert('Escriba un formato valid de cardinalidad');
          return cell.value.name;
        } else {
          let old = cell.value.name;
          cell.value.name = value;
          return old;
        }
      }
      
    }
  };

  let iconTolerance = 20;

  // modify hover effect
  graph.addMouseListener({
    currentState: null,
    currentIconSet: null,
    mouseDown: function (sender, me) {
      if (this.currentState != null) {
        this.dragLeave(me.getEvent(), this.currentState);
        this.currentState = null;
      }
    },
    mouseMove: function (sender, me) {
      if (
        this.currentState != null &&
        (me.getState() === this.currentState || me.getState() == null)
      ) {
        let tol = iconTolerance;
        let tmp = new mx.mxRectangle(
          me.getGraphX() - tol,
          me.getGraphY() - tol,
          2 * tol,
          2 * tol
        );

        if (mx.mxUtils.intersects(tmp, this.currentState)) return;
      }

      // recuperamos la celda
      let tmp = graph.view.getState(me.getCell());

      if (graph.isMouseDown || (tmp != null && !graph.isHtmlLabel(tmp.cell))) {
        tmp = null;
      }

      if (tmp !== this.currentState) {
        if (this.currentState != null) {
          this.dragLeave(me.getEvent(), this.currentState);
        }

        this.currentState = tmp;

        if (this.currentState != null) {
          this.dragEnter(me.getEvent(), this.currentState);
        }
      }
    },
    mouseUp: function (sender, me) {},
    dragEnter: function (evt, state) {},
    dragLeave: function (evt, state) {
      if (this.currentIconSet != null) {
        this.currentIconSet.destroy();
        this.currentIconSet = null;
      }
    },
  });

  graph.addEdge = function(edge, parent, source, target, index) //agregar conexiones 
  {
      // Finds the primary key child of the target table
      var child = this.model.getChildAt(target, 0); //por defetco agarra el primer atributo

      this.model.beginUpdate();
      try
      {
        var col1 = this.model.cloneCell(column);

        col1.value.name = target.value.name + '.' + child.value.name;
        col1.value.type = child.value.type;
        col1.value.isForeignKey = true;//setea  como "clave foranea"

        this.addCell(col1, source);
        source = col1;
        target = child;

        return mx.mxGraph.prototype.addEdge.apply(this, arguments); // "supercall"
      }
      finally
      {
        moveContainedSwimlanesToBack(graph, this.model.getParent(source))
        this.model.endUpdate();
      }

      return null;
  };

  configureTableStyle(graph);

  return { graph, editor };
}


(function()
{
  // Enables rotation handle
  mx.mxVertexHandler.prototype.rotationEnabled = false;
  
  // Enables managing of sizers
  mx.mxVertexHandler.prototype.manageSizers = true;
  
  // Enables live preview
  mx.mxVertexHandler.prototype.livePreview = true;

  // One finger pans (no rubberband selection) must start regardless of mouse button
  mx.mxPanningHandler.prototype.isPanningTrigger = function(me)
  {
    var evt = me.getEvent();
    
    return (me.getState() == null && !mx.mxEvent.isMouseEvent(evt)) ||
      (mx.mxEvent.isPopupTrigger(evt) && (me.getState() == null ||
      mx.mxEvent.isControlDown(evt) || mx.mxEvent.isShiftDown(evt)));
  };

  // On connect the target is selected and we clone the cell of the preview edge for insert
  mx.mxConnectionHandler.prototype.selectCells = function(edge, target)
  {
    if (target != null)
    {
      this.graph.setSelectionCell(target);
    }
    else
    {
      this.graph.setSelectionCell(edge);
    }
  };



  // Rounded edge and vertex handles
  var touchHandle = new mx.mxImage('images/handle-main.png', 17, 17);
  mx.mxVertexHandler.prototype.handleImage = touchHandle;
  mx.mxEdgeHandler.prototype.handleImage = touchHandle;
  mx.mxOutline.prototype.sizerImage = touchHandle;
  
  // Pre-fetches touch handle
  new Image().src = touchHandle.src;

  // Adds connect icon to selected vertex
  var connectorSrc = 'images/arrow-right-solid-2.svg';

  var vertexHandlerInit = mx.mxVertexHandler.prototype.init;
  mx.mxVertexHandler.prototype.init = function()
  {
    // TODO: Use 4 sizers, move outside of shape
    //this.singleSizer = this.state.width < 30 && this.state.height < 30;
    vertexHandlerInit.apply(this, arguments);

    // Only show connector image on one cell and do not show on containers
    if (this.graph.connectionHandler.isEnabled() &&
      this.graph.isCellConnectable(this.state.cell) &&
      this.graph.getSelectionCount() == 1)
    {
      this.connectorImg = mx.mxUtils.createImage(connectorSrc);
      this.connectorImg.style.cursor = 'pointer';
      this.connectorImg.style.width = '16px';
      this.connectorImg.style.height = '16px';
      this.connectorImg.style.position = 'absolute';
      
      if (!mx.mxClient.IS_TOUCH)
      {
        this.connectorImg.setAttribute('title', mx.mxResources.get('connect'));
        mx.mxEvent.redirectMouseEvents(this.connectorImg, this.graph, this.state);
      }

      // Starts connecting on touch/mouse down
      mx.mxEvent.addGestureListeners(this.connectorImg,
        mx.mxUtils.bind(this, function(evt)
        {
          this.graph.popupMenuHandler.hideMenu();
          this.graph.stopEditing(false);
          
          var pt = mx.mxUtils.convertPoint(this.graph.container,
              mx.mxEvent.getClientX(evt), mx.mxEvent.getClientY(evt));
          this.graph.connectionHandler.start(this.state, pt.x, pt.y);
          this.graph.isMouseDown = true;
          this.graph.isMouseTrigger = mx.mxEvent.isMouseEvent(evt);
          mx.mxEvent.consume(evt);
        })
      );

      this.graph.container.appendChild(this.connectorImg);
    }

    this.redrawHandles();
  };
  
  var vertexHandlerHideSizers = mx.mxVertexHandler.prototype.hideSizers;
  mx.mxVertexHandler.prototype.hideSizers = function()
  {
    vertexHandlerHideSizers.apply(this, arguments);
    
    if (this.connectorImg != null)
    {
      this.connectorImg.style.visibility = 'hidden';
    }
  };
  
  var vertexHandlerReset = mx.mxVertexHandler.prototype.reset;
  mx.mxVertexHandler.prototype.reset = function()
  {
    vertexHandlerReset.apply(this, arguments);
    
    if (this.connectorImg != null)
    {
      this.connectorImg.style.visibility = '';
    }
  };
  
  var vertexHandlerRedrawHandles = mx.mxVertexHandler.prototype.redrawHandles;
  mx.mxVertexHandler.prototype.redrawHandles = function()
  {
    vertexHandlerRedrawHandles.apply(this);

    if (this.state != null && this.connectorImg != null)
    {
      var pt = new mx.mxPoint();
      var s = this.state;
      
      // Top right for single-sizer
      if (mx.mxVertexHandler.prototype.singleSizer)
      {
        pt.x = s.x + s.width - this.connectorImg.offsetWidth / 2;
        pt.y = s.y - this.connectorImg.offsetHeight / 2;
      }
      else
      {
        pt.x = s.x + s.width + mx.mxConstants.HANDLE_SIZE / 2 + 4 + this.connectorImg.offsetWidth / 2;
        pt.y = s.y + s.height / 2;
      }
      
      
      this.connectorImg.style.left = (pt.x - this.connectorImg.offsetWidth / 2 + 8) + 'px';
      this.connectorImg.style.top = (pt.y - this.connectorImg.offsetHeight / 2 ) + 'px';
    }
  };
  
  var vertexHandlerDestroy = mx.mxVertexHandler.prototype.destroy;
  mx.mxVertexHandler.prototype.destroy = function(sender, me)
  {
    vertexHandlerDestroy.apply(this, arguments);

    if (this.connectorImg != null)
    {
      this.connectorImg.parentNode.removeChild(this.connectorImg);
      this.connectorImg = null;
    }
  };
  
  // Pre-fetches touch connector
  new Image().src = connectorSrc;
})();
  

export default createGraph;
export const container = document.querySelector("#container");
export const editorImagesPath = "../../examples/editors/images/";

export class Graph {
  constructor(graph, conversor) {
    this._graph = graph;
    this._configSwimlaneToBack();
    this._configAttributesEdition();
    this.conversor = conversor;
  }

  get graph() {
    return this._graph;
  }

  addToolbarItem(toolbar, image) {
    // crea la imagen que es usada para el arrastre
    let img = toolbar.addMode(null, image, this._bindCreateDocument);
    mx.mxUtils.makeDraggable(img, this.graph, this._bindCreateDocument);
  }

  _bindCreateDocument(graph, evt, cell) {
    // en este contexto no podemos usar this
    graph.stopEditing(false);
    graph.clearSelection();

    const prototype = graph.getModel().cloneCell(table);
    modalCreateDoc(graph, evt, prototype, cell);
  }

  _configSwimlaneToBack() {
    // Registra un oyente de eventos para detectar cuando se agregan celdas al grafo
    this.graph.addListener(
      mx.mxEvent.CELLS_ADDED,
      handleSwinlane(this.graph, moveContainedSwimlanesToBack)
    );
    this.graph.addListener(
      mx.mxEvent.MOVE_CELLS,
      handleSwinlane(this.graph, moveContainedSwimlanesToBack)
    );
  }

  _configAttributesEdition() {
    this.graph.getSelectionModel().addListener(
      // parametros de la segunda funcion sender, evt
      mx.mxEvent.CHANGE, (_, __) => {
        selectionChanged(this.graph, null);
      }
    )
  }
}

export function createDoc(graph, prototype, name, pt) {
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
  return vertex;
}

function modalCreateDoc(graph, evt, prototype, cell) {
  var name = mx.mxUtils.prompt("Enter name for new document");

  if (name != null && name.trim() !== "") {
    let pt = graph.getPointForEvent(evt);
    let vertex = createDoc(graph, prototype, name, pt);
    vertex.value.id = uuidv4();

    addActionsForDocs(vertex, graph);

    vertex.setConnectable(true)

    addDefaultVertex(graph, vertex)

    graph.setSelectionCells(graph.importCells([vertex], 0, 0, cell));
  }
}

function handleSwinlane(graph, moveFunction) {
  const swimlanes = [];

  return function (sender, evt) {
    const cells = evt.getProperty('cells'); // Obtiene las celdas que se agregaron o se están moviendo

    // Verifica si alguna de las celdas es un swimlane
    cells.forEach(function (cell) {
      if (graph.isSwimlane(cell)) {
        // Realiza acciones específicas cuando se agrega o se selecciona y arrastra una swimlane

        if (swimlanes.indexOf(cell) === -1) {
          // Agrega la swimlane al arreglo si no está duplicada
          swimlanes.push(cell);
        }

        if (swimlanes.length > 0) {
          // Itera sobre todas las swimlanes en el arreglo y aplica la función moveFunction a cada swimlane
          swimlanes.forEach(function (swimlane) {
            moveFunction(graph, swimlane);
          });
        }
      }
    });
  };
}