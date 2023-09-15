import { column, table } from "./cells"
import mx from "./util"


export function overlayForDelete(cell, graph, pathImage, offset, tooltip, alignment) {
  const overlay = addOverlay(cell, pathImage, graph, offset, tooltip, alignment)
  
  overlay.addListener(mx.mxEvent.CLICK, (sender, evt2) => {
    console.log('sender', sender)
    console.log('evt2', evt2.properties.cell)
    graph.clearSelection()
    // console.log(cell)
    graph.getModel().beginUpdate()
    const r = graph.removeCells([evt2.properties.cell])
    console.log('BORRADO', r)
    graph.getModel().endUpdate()
    alert('cell clickeado borrado de la vista')
  })
  
  graph.addCellOverlay(cell, overlay)
}

export function overlayForNestDoc(cell, graph, pathImage, offset, tooltip, alignment) {
  const overlay = addOverlay(cell, pathImage, graph, offset, tooltip, alignment)

  overlay.addListener(mx.mxEvent.CLICK, (sender, evt2) => {
    graph.clearSelection()
    console.log('nesting document')
    // Add a new document inside cell (evt2.properties.cell)
    const name = mx.mxUtils.prompt('Enter name for new document')
    if (name != null && name.trim() != '') {
      const vertex = graph.getModel().cloneCell(table)
      vertex.value.name = name
      overlayForDelete(vertex, graph, 'images/delete2.png', { x:-10, y:15 }, 'Borrar documento', mx.mxConstants.ALIGN_TOP)
      overlayForAddProp(vertex, graph, 'images/add.png', {x:-30, y:15}, 'Add property', mx.mxConstants.ALIGN_TOP)
      overlayForNestDoc(vertex, graph, 'images/handle-connect.png', {x:-50, y:15}, 'Add document', mx.mxConstants.ALIGN_TOP)
      graph.setSelectionCells(graph.importCells([vertex], 0, 0, evt2.properties.cell))
    }
  })

  graph.addCellOverlay(cell, overlay)
}

export function overlayForAddProp(cell, graph, pathImage, offset, tooltip, alignment) {

  const overlay = addOverlay(cell, pathImage, graph, offset, tooltip, alignment)
  overlay.addListener(mx.mxEvent.CLICK, (sender, evt2) => {
    graph.clearSelection()
    // agregar nueva columna
    const columnName = mx.mxUtils.prompt('Enter a column name')
    if (columnName != null) {
      graph.getModel().beginUpdate()
      try {
        const v1 = graph.getModel().cloneCell(column)
        v1.value.name = columnName
        graph.addCell(v1, evt2.properties.cell)
        overlayForDelete(v1, graph, 'images/delete2.png', {x:-10, y:0}, 'Borrar atributo', mx.mxConstants.ALIGN_MIDDLE)
        overlayForEdit(v1, graph, 'examples/editors/images/overlays/pencil.png', {x:-30, y:0}, 'Editar atributo', mx.mxConstants.ALIGN_MIDDLE)
        console.log('ejecuta todo try')
      } finally {
        graph.getModel().endUpdate()
      }
    }
    console.log('add prop clicked')
  })

  graph.addCellOverlay(cell, overlay)
}


export function overlayForEdit(cell, graph, pathImage, offset, tooltip, alignment) {
  const overlay = addOverlay(cell, pathImage, graph, offset, tooltip, alignment)

  overlay.addListener(mx.mxEvent.CLICK, (sender, evt2) => {
    graph.clearSelection()
    // abrir menu
    console.log('abriendo el menu')
  })

  graph.addCellOverlay(cell, overlay)
}

export const addOverlay = (cell, pathImage, graph, offset, tooltip, alignment) => {
  let overlay = new mx.mxCellOverlay(new mx.mxImage(pathImage, 15, 15), tooltip)
  overlay.cursor = 'hand'
  overlay.verticalAlign = alignment
  overlay.offset = new mx.mxPoint(offset.x, offset.y)

  // overlay.addListener(mx.mxEvent.CLICK, (sender, evt2) => {
  //   graph.clearSelection()
  //   alert(`Se presionó la funcionalidad de ${tooltip}`)
  // })

  // escucha la finalizacion del click? no
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

  // graph.addCellOverlay(cell, overlay)
  return overlay
}

