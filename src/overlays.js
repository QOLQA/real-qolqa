import { column } from "./cells"
import mx from "./util"


export function overlayForDelete(cell, graph, pathImage, offset, tooltip) {
  const overlay = addOverlay(cell, pathImage, graph, offset, tooltip)
  
  overlay.addListener(mx.mxEvent.CLICK, (sender, evt2) => {
    graph.clearSelection()
    graph.removeCells([cell])
    alert('cell clickeado borrado de la vista')
  })
  
  graph.addCellOverlay(cell, overlay)
}

export function overlayForAddProp(cell, graph, pathImage, offset, tooltip) {
  let columnName = mx.mxUtils.prompt('Enter a column name');
  if (columnName != null) {
    graph.getModel().beginUpdate();
    try {
      let v1 = graph.getModel().cloneCell(column);
      v1.value.name = columnName;
      //let v2 = graph.insertVertde ex(cell, null, v1, 0, 0, width, 30)
      graph.addCell(v1, cell);
      // addOverlay(v1, 'images/add.png', graph, {x:-20, y:0}, 'que fue')
      overlayForDelete(v1, graph, 'images/delete2.png', {x:-10, y:0}, 'Borrar atributo')
      overlayForEdit(v1, graph, 'examples/editors/images/overlays/pencil.png', {x:-30, y:0}, 'Editar atributo')
    } finally {
      graph.getModel().endUpdate();
    }
  }
}


export function overlayForEdit(cell, graph, pathImage, offset, tooltip) {
  const overlay = addOverlay(cell, pathImage, graph, offset, tooltip)

  overlay.addListener(mx.mxEvent.CLICK, (sender, evt2) => {
    graph.clearSelection()
    // abrir menu
    alert('abriendo el menu')
  })

  graph.addCellOverlay(cell, overlay)
}

export const addOverlay = (cell, pathImage, graph, offset, tooltip) => {
  let overlay = new mx.mxCellOverlay(new mx.mxImage(pathImage, 15, 15), tooltip)
  overlay.cursor = 'hand'
  overlay.verticalAlign = mx.mxConstants.ALIGN_MIDDLE
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

function removeCell(cell, graph) {

}


