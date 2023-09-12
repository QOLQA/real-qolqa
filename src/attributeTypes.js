import mx from "./util";

export let overlay = new mx.mxCellOverlay(new mx.mxImage('../examples/editors/images/bottom.gif', 16, 16), 'Click Derecho para cambiar el tipo de atributo');

export function configMenuCell(graph) {

  let mxCellRendererInstallCellOverlayListeners = mx.mxCellRenderer.prototype.installCellOverlayListeners;

  mx.mxCellRenderer.prototype.installCellOverlayListeners = function(state, overlay, shape) {
    mxCellRendererInstallCellOverlayListeners.apply(this, arguments);

    mx.mxEvent.addGestureListeners(shape.node,
      function(evt) {
        graph.fireMouseEvent(mx.mxEvent.MOUSE_DOWN, new mx.mxMouseEvent(evt, state));
      },
      function(evt) {
        graph.fireMouseEvent(mx.mxEvent.MOUSE_MOVE, new mx.mxMouseEvent(evt, state));
      },
      function(evt) {
        if (mx.mxClient.IS_QUIRKS) graph.fireMouseEvent(mx.mxEvent.MOUSE_UP, new mx.mxMouseEvent(evt, state));
      }
    );

    if (!mx.mxClient.IS_TOUCH) {
      mx.mxEvent.addListener(shape.node, 'mouseup', function(evt) {
        overlay.fireEvent(new mx.mxEventObject(mx.mxEvent.CLICK, 'event', evt, 'cell', state.cell));
      });
    }

    graph.popupMenuHandler.autoExpand = true;

    graph.popupMenuHandler.factoryMethod = function(menu, cell, evt) {
      menu.addItem('String', null, () => modifyType(cell, 'String', graph));
      menu.addItem('Integer', null, () => modifyType(cell, 'Integer', graph));
      menu.addItem('Boolean', null, () => modifyType(cell, 'Boolean', graph));
      menu.addItem('Double', null, () => modifyType(cell, 'Double', graph));
      menu.addItem('Arrays', null, () => modifyType(cell, 'Arrays', graph));
      menu.addItem('Timestamp', null, () => modifyType(cell, 'Timestamp', graph));
      menu.addItem('Object', null, () => modifyType(cell, 'Object', graph));
      menu.addItem('Null', null, () => modifyType(cell, 'Null', graph));
      menu.addItem('Symbol', null, () => modifyType(cell, 'Symbol', graph));
      menu.addItem('Date', null, () => modifyType(cell, 'Date', graph));
    }
  }
}

function modifyType(cell, type, graph) {
  let clone = cell.value.clone();
  // clone.name = cell.value.name;
  // console.log('clone', clone);
  clone.type = type;

  graph.model.setValue(cell, clone);
}