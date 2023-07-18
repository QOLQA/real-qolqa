import { overlay } from "./attributeTypes";
import { column } from "./cells";
import mx from "./util";


const imagesPath = '../../examples/images/';

function mxVertexToolHandler(state) {
  mx.mxVertexHandler.apply(this, arguments);
}

// hereda metodos y atributos
// graph => .prototyope.graph
mxVertexToolHandler.prototype = new mx.mxVertexHandler();
mxVertexToolHandler.prototype.constructor = mxVertexToolHandler;
mxVertexToolHandler.prototype.domNode = null;
// mxVertexToolHandler.prototype.graph

mxVertexToolHandler.prototype.init = function() {
  //
  // this.constructor.prototype.init.apply(this, arguments);
  mx.mxVertexHandler.prototype.init.apply(this, arguments);

  this.domNode = document.createElement('div');
  this.domNode.style.position = 'absolute';
  this.domNode.style.whiteSpace = 'nowrap';

  function createImage(src) {
    if (mx.mxClient.IS_IE && !mx.mxClient.IS_SVG) {
      let img = document.createElement('div');
      img.style.backgroundImage = 'url(' + src + ')';
      img.style.backgroundPosition = 'center';
      img.style.backgroundRepeat = 'no-repeat';
      img.style.display = (mx.mxClient.IS_QUIRKS) ? 'inline' : 'inline-block';
      return img;
    } else {
      return mx.mxUtils.createImage(src);
    }
  }

  // delete
  let img = createImage(imagesPath + 'delete2.png');
  img.setAttribute('title', 'Delete');
  img.style.cursor = 'pointer';
  img.style.width = '16px';
  img.style.height = '16px';

  mx.mxEvent.addGestureListeners(img,
    mx.mxUtils.bind(this, function(evt) {
      mx.mxEvent.consume(evt);
    })
  );

  // el this se vincula con mxVexterHandler que tiene graph
  mx.mxEvent.addListener(img, 'click',
    mx.mxUtils.bind(this, function(evt) {
      this.graph.removeCells([this.state.cell]);
      mx.mxEvent.consume(evt);
    })
  );

  this.domNode.appendChild(img);

  // agregar plus
  let imgPlus = createImage(imagesPath + 'plus.png');
  imgPlus.setAttribute('title', 'Add attribute');
  imgPlus.style.cursor = 'pointer';
  imgPlus.style.width = '16px';
  imgPlus.style.height = '16px';

  mx.mxEvent.addGestureListeners(imgPlus,
    mx.mxUtils.bind(this, function(evt) {
      mx.mxEvent.consume(evt);
    })
  );

  mx.mxEvent.addListener(imgPlus, 'click',
    mx.mxUtils.bind(this, function(evt) {
      let columnName = mx.mxUtils.prompt('Enter a column name');
      if (columnName != null) {
        let graph = this.graph;
        let { cell } = this.state;
        graph.getModel().beginUpdate();
        try {
          let v1 = graph.getModel().cloneCell(column);
          v1.value.name = columnName;
          //let v2 = graph.insertVertde ex(cell, null, v1, 0, 0, width, 30)
          graph.addCell(v1, cell);
          graph.addCellOverlay(v1, overlay);
        } finally {
          graph.getModel().endUpdate();
        }
      }
      mx.mxEvent.consume(evt);
    })
  )
  this.domNode.appendChild(imgPlus);

  // agregar iconos
  this.state.view.graph.container.appendChild(this.domNode);
  // console.log('constructor graph', this.constructor.prototype.graph);
  // console.log('state graph', this.state.view.graph);
  this.redrawTools();
}

mxVertexToolHandler.prototype.redraw = function() {
  mx.mxVertexHandler.prototype.redraw.apply(this);
  this.redrawTools();
}

mxVertexToolHandler.prototype.redrawTools = function() {
  if (this.state != null && this.domNode != null) {
    let dy = (mx.mxClient.IS_VML && document.compatMode == 'CSS1Compat') ? 20 : 4;
    this.domNode.style.left = (this.state.x + this.state.width - 56) + 'px';
    this.domNode.style.top = (this.state.y + this.state.height + dy) + 'px';
  }
}

mxVertexToolHandler.prototype.destroy = function(sender, me) {
  mx.mxVertexHandler.prototype.destroy.apply(this, arguments);

  if (this.domNode != null) {
    this.domNode.parentNode.removeChild(this.domNode);
    this.domNode = null;
  }
}



export default mxVertexToolHandler;