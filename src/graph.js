import { configureTableStyle } from "./configureTableStyle";
import mx from "./util";

function createGraph() {

  let editor = new mx.mxEditor();
  let graph = editor.graph;

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
    } else {
      let old = cell.value.name;
      cell.value.name = value;
      return old;
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
        (me.getState() == this.currentState || me.getState() == null)
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

      if (tmp != this.currentState) {
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
