import { configureTableStyle } from "./configureTableStyle";
import mx from "./util";

function createGraph() {

  mx.mxConnectionHandler.prototype.connectImage = new mx.mxImage(
    "/images/connector.gif",
    16,
    16
  );

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

export default createGraph;
