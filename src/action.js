import { column, table } from "./cells";
import { addActionsForDocs, addCardinalityVertex, addDefaultVertex } from "./cells_actions";
import { createDataOverlay } from "./helpers";
import showModalWindow, { wnd } from "./modal";
import { overlayForDelete, overlayForEdit } from "./overlays";
import moveContainedSwimlanesToBack from "./swimbottom";
import { selectionChanged } from "./userobjects";
import mx from "./util";

function getNeighbors(cell, graph) {
  const neighbors = []
  for (let to of cell.value.to) {
      neighbors.push(graph.model.cells[to])
  }
  const outerEdges = graph.model.getOutgoingEdges(cell)
  const terminals = outerEdges.map(edge => {
      return graph.model.getTerminal(edge, false)
  })
  neighbors.push(...terminals)
  return neighbors
}

function getOutgoingRelations(cell, graph) {
  const outerEdges = graph.model.getOutgoingEdges(cell)
  const relations = outerEdges.map(edge => {
    return graph.model.getTerminal(edge, false)
  })
  return relations
}

function getIncomingRelations(cell, graph) {
  const relations = cell.value.to.map(to => {
    return graph.model.cells[to]
  })
  return relations
}

export class Action {

  constructor(data, graph) {
    this._graph = graph;

    this._pathImage = data.pathImage;
    this._alignment = data.alignment;
    this._tooltip = data.tooltip;
    this._offset = data.offset;

    this._initOverlay();

    this._setupInGraph();

    this._setupProcess();
  }

  _setupInGraph() {
    this.overlay.addListener('pointerdown', (sender, eo) => {
      let evt2 = eo.getProperty('event');
      let state = eo.getProperty('state');

      this.graph.popupMenuHandler.hideMenu();
      this.graph.stopEditing(false);

      let pt = mx.mxUtils.convertPoint(
        this.graph.container,
        mx.mxEvent.getClientX(evt2),
        mx.mxEvent.getClientY(evt2)
      );

      this.graph.connectionHandler.start(state, pt.x, pt.y);
      this.graph.isMouseDown = true;
      this.graph.isMouseTrigger = mx.mxEvent.isMouseEvent(evt2);
      mx.mxEvent(evt2);
    });
  }

  _initOverlay() {
    this._overlay = new mx.mxCellOverlay(
      new mx.mxImage(this.pathImage, 15, 15),
      this.tooltip
    );
    this.overlay.cursor = 'hand';
    this.overlay.verticalAlign = this.alignment;
    this.overlay.offset = new mx.mxPoint(this.offset.x, this.offset.y);
  }

  _setupProcess() {}

  get pathImage() { return this._pathImage; }
  get alignment() { return this._alignment; }
  get tooltip() { return this._tooltip; }
  get offset() { return this._offset; }
  get overlay() { return this._overlay; }
  get graph() { return this._graph; }
}

export class DeleteAction extends Action {
  constructor(data, graph) {
    super(data, graph);
  }

  _setupProcess() {
    this.overlay.addListener(mx.mxEvent.CLICK, (sender, evt2) => {
      var deleteContainer = document.createElement('div');
      deleteContainer.classList.add('delete-confirmation'); // Agregar una clase para dar estilo

      // Crear el mensaje de confirmación
      var confirmationMessage = document.createElement('p');
      confirmationMessage.textContent = '¿Seguro que quieres eliminar?';

      // Crear los botones
      var continueButton = document.createElement('button');
      continueButton.textContent = 'Continuar';
      continueButton.classList.add('btn-continue'); // Agregar una clase para dar estilo

      var cancelButton = document.createElement('button');
      cancelButton.textContent = 'Cancelar';
      cancelButton.classList.add('btn-cancel'); // Agregar una clase para dar estilo

      // Agregar los elementos al contenedor
      deleteContainer.appendChild(confirmationMessage);
      deleteContainer.appendChild(continueButton);
      deleteContainer.appendChild(cancelButton);
      // ----- ends DOM---------------
      showModalWindow(this._graph, 'Properties', deleteContainer, 250, 100);

      const removeRelation = (graph) => {
        var cellToRemove = evt2.properties.cell; //celda a remover 
        graph.clearSelection()
        graph.getModel().beginUpdate()
        if (cellToRemove.style === 'table') {
          const neighbors = getNeighbors(cellToRemove, graph)
          if (neighbors.length === 0) {
            // cell to remove don't have any relations
            const r = graph.removeCells([evt2.properties.cell]) //evt2.properties.cell: tabla actual
          } else {
            // remove incoming relations
            const incoming = getIncomingRelations(cellToRemove, graph)
            for (const inc of incoming) {
              const childCount = graph.getModel().getChildCount(inc);
              for (let i = 0; i < childCount; i++) {
                const child = inc.getChildAt(i);
                var name = child.value.name;
                var parts = name.split('.');
                var docname = parts[0];
                // Verifica si el nombre del hijo coincide con el patrón de referencia
                if (docname == cellToRemove.value.name) {
                  // Coincide con el patrón, lo que significa que está referenciando
                  graph.model.remove(child)
                  break
                }
              }
            }
            // remove outgoing relations
            const outgoing = getOutgoingRelations(cellToRemove, graph)
            for (const out of outgoing) {
              const index = out.value.to.indexOf(cellToRemove.value.id)
              out.value.to.splice(index, 1)
            }
          }
          const r = graph.removeCells([evt2.properties.cell]) //evt2.properties.cell: tabla actual
        } else {
          const r = graph.removeCells([evt2.properties.cell]) //evt2.properties.cell: tabla actual
        }
        graph.getModel().endUpdate()
        wnd.destroy();
      }
    
      // Agregar eventos a los botones
      continueButton.addEventListener('click', () => removeRelation(this._graph));

      cancelButton.addEventListener('click', function() {
        wnd.destroy();
      });
    })
  }
}

export class AddPropAction extends Action {
  constructor(data, graph) {
    super(data, graph);
  }

  _setupProcess() {
    this.overlay.addListener(mx.mxEvent.CLICK, (sender, evt2) => {
      this.graph.clearSelection();
      // Crear un contenedor div para la tabla
      var tableContainer = document.createElement('div');
      // Crear la tabla HTML
      var table = document.createElement('table');
      table.classList.add('undefined'); // Agregar la clase 'undefined' a la tabla

      var tbody = document.createElement('tbody');

      var row1 = document.createElement('tr');

      // Crear el campo de entrada de "nombre" con un id
      var nameInput = document.createElement('input');
      nameInput.setAttribute('type', 'text');
      nameInput.setAttribute('id', 'exampleInputName'); // Establecer el id



      // Crear la etiqueta "Nombre"
      var nameLabel = document.createElement('label');
      nameLabel.setAttribute('for', 'exampleInputName'); // Establecer el atributo "for" para asociarlo con el campo de entrada
      nameLabel.textContent = 'Nombre: ';

      // Crear la celda de la etiqueta
      var nameInputCell = document.createElement('td');
      nameInputCell.appendChild(nameInput);

      row1.appendChild(nameLabel);
      row1.appendChild(nameInputCell);

      var row2 = document.createElement('tr');

      var typeLabel = document.createElement('td');
      typeLabel.textContent = 'Tipo: ';

      var typeInputCell = document.createElement('td');
      var typeSelect = document.createElement('select');
      typeSelect.setAttribute('id', 'tipoValueTable');

      var typeOptions = [
        'String',
        'Integer',
        'Boolean',
        'Double',
        'Arrays',
        'Timestamp',
        'Null',
        'Symbol',
        'Date'
      ];

      typeOptions.forEach(function (optionText) {
        var option = document.createElement('option');
        option.textContent = optionText;
        typeSelect.appendChild(option);
      });

      typeInputCell.appendChild(typeSelect);

      row2.appendChild(typeLabel);
      row2.appendChild(typeInputCell);

      // Supongamos que tienes un botón para procesar los datos
      var procesarBoton = document.createElement('button');
      procesarBoton.textContent = 'Guardar';

      tbody.appendChild(row1);
      tbody.appendChild(row2);
      tbody.appendChild(procesarBoton);

      table.appendChild(tbody);

      // Agregar la tabla al contenedor
      tableContainer.appendChild(table);

      showModalWindow(this.graph, 'Properties', tableContainer, 250, 100);

      const addProp = function (graph) {
        // Obtener los valores de los campos de entrada
        var nombreValue = document.getElementById('exampleInputName').value;
        var tipoValue = document.getElementById('tipoValueTable').value;

        // agregar nueva columna
        const columnName = nombreValue; //nombre del atributo
        const columnType = tipoValue; //tipo del atributo
        if (columnName != null && columnType != null) {
          graph.getModel().beginUpdate();
          try {
            const v1 = graph.getModel().cloneCell(column);
            v1.value.name = columnName;
            v1.value.type = columnType;
            graph.addCell(v1, evt2.properties.cell);

            // Find the last child in the parent cell and position the new cell after it
            const parent = evt2.properties.cell;
            moveContainedSwimlanesToBack(graph, parent);

            overlayForDelete(
              createDataOverlay('cross_.png', -10, 0, 'Borrar atributo', mx.mxConstants.ALIGN_MIDDLE),
              v1,
              graph
            );
            overlayForEdit(
              createDataOverlay('edit_.png', -30, 0, 'Editar atributo', mx.mxConstants.ALIGN_MIDDLE),
              v1,
              graph
            );
          } finally {
            graph.getModel().endUpdate();
          }
        }
        // Cerrar el modal cuando se hace clic en el botón
        wnd.destroy();
      }

      // Función para procesar los datos cuando se hace clic en el botón
      procesarBoton.addEventListener('click', () => addProp(this.graph));
  });
  }
}

export class NestDocumentAction extends Action {
  constructor(data, graph) {
    super(data, graph);
  }

  _setupProcess() {
    this.overlay.addListener(mx.mxEvent.CLICK, (sender, evt2) => {
      this.graph.stopEditing(false);
      this.graph.clearSelection();
      // Add a new document inside cell (evt2.properties.cell)
      const name = mx.mxUtils.prompt('Enter name for new document');
      if (name != null && name.trim() != '') {
        const vertex = this.graph.getModel().cloneCell(table);
        vertex.value.name = name;

        // Find the last child in the parent cell and position the new cell after it
        const parent = evt2.properties.cell;
        var lastChild = null;
        const childCount = this.graph.model.getChildCount(parent);
        if (childCount > 0) {
          lastChild = this.graph.model.getChildAt(parent, childCount);
        }

        if (lastChild != null) {
          const lastGeometry = this.graph.model.getGeometry(lastChild);
          const newX = lastGeometry.x + lastGeometry.width + 20; // You can adjust the horizontal spacing here
          vertex.geometry.x = newX;
          vertex.geometry.y = lastGeometry.y;
        }

        addActionsForDocs(vertex, this.graph);
        vertex.setConnectable(false);

        // Agregar atributo por defecto
        addDefaultVertex(this.graph, vertex);
        // Agregar atributo para la cardinalidad
        addCardinalityVertex(this.graph, vertex);

        this.graph.setSelectionCells(
          this.graph.importCells([vertex], 0, 0, evt2.properties.cell)
        );
      }
    });
  }
}

export class EditAction extends Action {
  constructor(data, graph) {
    super(data, graph);
  }

  _setupProcess() {
    this.overlay.addListener(mx.mxEvent.CLICK, (sender, evt2) => {
      this.graph.clearSelection();
      // abrir menu Funcion
      selectionChanged(this.graph, evt2.properties.cell);
      if (document.getElementById('tipoValueTable')) {
        var selectElement = document.getElementById('tipoValueTable');
        selectElement.value = evt2.properties.cell.value.type;
      }
    });
  }
}