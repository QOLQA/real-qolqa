import { column, table } from "./cells"
import { selectionChanged }from "./userobjects";
import mx from "./util"
import showModalWindow from "./modal"
import { wnd } from './modal';
import moveContainedSwimlanesToBack from './swimbottom';
import { addDefaultVertex, createDataOverlay } from "./helpers";


export function overlayForDelete(data, cell, graph) {
  const overlay = addOverlay(data, graph)
  
  overlay.addListener(mx.mxEvent.CLICK, (sender, evt2) => {
    graph.clearSelection()
    graph.getModel().beginUpdate()
    const r = graph.removeCells([evt2.properties.cell])
    graph.getModel().endUpdate()
  })
  
  graph.addCellOverlay(cell, overlay)
}

export function overlayForNestDoc(data, cell, graph) {
  const overlay = addOverlay(data, graph)

  overlay.addListener(mx.mxEvent.CLICK, (sender, evt2) => {
    graph.stopEditing(false)
    graph.clearSelection()
    // Add a new document inside cell (evt2.properties.cell)
    const name = mx.mxUtils.prompt('Enter name for new document')
    if (name != null && name.trim() != '') {
      const vertex = graph.getModel().cloneCell(table)
      vertex.value.name = name
      
      // Find the last child in the parent cell and position the new cell after it
      const parent = evt2.properties.cell
      var lastChild = null
      const childCount = graph.model.getChildCount(parent)
      console.log(childCount)
      if (childCount > 0) {
        lastChild = graph.model.getChildAt(parent, childCount)
      }
      
      if (lastChild != null) {
        const lastGeometry = graph.model.getGeometry(lastChild)
        const newX = lastGeometry.x + lastGeometry.width + 20 // You can adjust the horizontal spacing here
        vertex.geometry.x = newX
        vertex.geometry.y = lastGeometry.y        
        console.log(vertex.geometry.x)
        console.log(vertex.geometry.y)
      }

      overlayForDelete(
        createDataOverlay('cross_.png', -10, 15, 'Delete document', mx.mxConstants.ALIGN_TOP),
        vertex,
        graph
      )
      overlayForAddProp(
        createDataOverlay('plus_.png', -30, 15, 'Add property', mx.mxConstants.ALIGN_TOP),
        vertex,
        graph
      )
      overlayForNestDoc(
        createDataOverlay('add_.png', -50, 15, 'Add document', mx.mxConstants.ALIGN_TOP),
        vertex,
        graph
      )
      vertex.setConnectable(false)

      // Agregar atributo por defecto
      addDefaultVertex(graph, vertex);
      
      graph.setSelectionCells(graph.importCells([vertex], 0, 0, evt2.properties.cell))
    }
  })

  graph.addCellOverlay(cell, overlay)
}

export function overlayForAddProp(data, cell, graph) {

  const overlay = addOverlay(data, graph)
  overlay.addListener(mx.mxEvent.CLICK, (sender, evt2) => {
    graph.clearSelection()
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
      'Object',
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

    showModalWindow(graph, 'Properties', tableContainer, 250, 100);

    // Función para procesar los datos cuando se hace clic en el botón
    procesarBoton.addEventListener('click', function() {
      // Obtener los valores de los campos de entrada
      var nombreValue = document.getElementById('exampleInputName').value;
      var tipoValue = document.getElementById('tipoValueTable').value;

      // agregar nueva columna
      const columnName = nombreValue //nombre del atributo
      const columnType = tipoValue //tipo del atributo
      if (columnName != null && columnType != null) {
        graph.getModel().beginUpdate()
        try {
          const v1 = graph.getModel().cloneCell(column)
          v1.value.name = columnName
          v1.value.type = columnType
          graph.addCell(v1, evt2.properties.cell)

           // Find the last child in the parent cell and position the new cell after it
          const parent = evt2.properties.cell
          moveContainedSwimlanesToBack(graph, parent);
          
          overlayForDelete(
            createDataOverlay('cross_.png', -10, 0, 'Borrar atributo', mx.mxConstants.ALIGN_MIDDLE),
            v1,
            graph
          )
          overlayForEdit(
            createDataOverlay('edit_.png', -30, 0, 'Editar atributo', mx.mxConstants.ALIGN_MIDDLE),
            v1,
            graph
          )
        } finally {
          graph.getModel().endUpdate()
        }
      }
      // Cerrar el modal cuando se hace clic en el botón
      wnd.destroy();

    }
    );
  })

  graph.addCellOverlay(cell, overlay)
}


export function overlayForEdit(data, cell, graph) {
  const overlay = addOverlay(data, graph)

  overlay.addListener(mx.mxEvent.CLICK, (sender, evt2) => {
    graph.clearSelection()
    // abrir menu Funcion
    selectionChanged(graph,evt2.properties.cell);
    if(document.getElementById('tipoValueTable')){
      var selectElement = document.getElementById('tipoValueTable');
      selectElement.value = evt2.properties.cell.value.type;
    }
  })
  

  graph.addCellOverlay(cell, overlay)
}

const addOverlay = (data, graph) => {
  let overlay = new mx.mxCellOverlay(new mx.mxImage(data.pathImage, 15, 15), data.tooltip)
  overlay.cursor = 'hand'
  overlay.verticalAlign = data.alignment
  overlay.offset = new mx.mxPoint(data.offset.x, data.offset.y)

  overlay.addListener('pointerdown', (sender, eo) => {
    let evt2 = eo.getProperty('event')
    let state = eo.getProperty('state')

    graph.popupMenuHandler.hideMenu()
    graph.stopEditing(false)

    let pt = mx.mxUtils.convertPoint(
      graph.container,
      mx.mxEvent.getClientX(evt2),
      mx.mxEvent.getClientY(evt2)
    )

    graph.connectionHandler.start(state, pt.x, pt.y)
    graph.isMouseDown = true
    graph.isMouseTrigger = mx.mxEvent.isMouseEvent(evt2)
    mx.mxEvent(evt2)
  })

  return overlay
}
