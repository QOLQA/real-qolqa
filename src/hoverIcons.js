import mx from "./util";


function mxIconSet(state) {
  this.images = [];
  const graph = state.view.graph;

  let img = mx.mxUtils.createImage('/images/delete2.png');
  img.setAttribute('title', 'Delete');
  img.style.position = 'absolute';
  img.style.cursor = 'pointer';
  img.style.width = '16px';
  img.style.height = '16px';
  img.style.left = (state.width / 2 + state.x) + 'px';
  img.style.top = (state.y + state.height - 20) + 'px';

  mx.mxEvent.addGestureListeners(img,
    mx.mxUtils.bind(this, function(evt) {
      mx.mxEvent.consume(evt);
    })
  );

  mx.mxEvent.addListener(img, 'click',
    mx.mxUtils.bind(this, function(evt) {
      graph.removeCells([state.cell]);
      mx.mxEvent.consume(evt);
      // funcion definida abajo
      this.destroy();
    })
  );

  state.view.graph.container.appendChild(img);
  this.images.push(img);
}

mxIconSet.prototype.destroy = function() {
  if (this.images != null) {
    let img = this.images[0];
    img.parentNode.removeChild(img);
  }

  this.images = null;
}

export default mxIconSet;