import mx from "../../util";


function createLayout(editor) {
  editor.layoutSwimlanes = true; //en false no permite crear mas de un atributo
  editor.createSwimlaneLayout = function() {
    let layout = new mx.mxStackLayout(this.graph, false); //.en true no permite crear atributos (desaparece el grafo)
    layout.fill = true;//En false no permite seleccionar cambiar el tipo de atributo
    layout.resizeParent = true; //En false los atributos a partir de 2do aparecen fuera del grado y se redimensiona manuelamente para que encaje
    layout.borderCollapse= false;
    layout.spacing = 4;
    layout.border = 10;
    layout.isVertexMovable = function(cell) {
      return true;
    }

    return layout;
  }
}

export default createLayout;