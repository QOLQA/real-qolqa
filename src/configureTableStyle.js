import mx from "./util";

// confiuracion de estilos para tablas
export function configureTableStyle(graph) {
  let style = new Object();
  style[mx.mxConstants.STYLE_SHAPE] = mx.mxConstants.SHAPE_SWIMLANE;
  style[mx.mxConstants.STYLE_SHAPE] = mx.mxConstants.SHAPE_SWIMLANE;
  style[mx.mxConstants.STYLE_PERIMETER] = mx.mxPerimeter.RectanglePerimeter;
  style[mx.mxConstants.STYLE_ALIGN] = mx.mxConstants.ALIGN_CENTER;
  style[mx.mxConstants.STYLE_VERTICAL_ALIGN] = mx.mxConstants.ALIGN_TOP;
  style[mx.mxConstants.STYLE_GRADIENTCOLOR] = "#FFAC81"; //abajo tittle
  style[mx.mxConstants.STYLE_FILLCOLOR] = "#FF928B"; //arriba tittle
  style[mx.mxConstants.STYLE_SWIMLANE_FILLCOLOR] = "#FFFFFF "; //casillero del atributo
  style[mx.mxConstants.STYLE_STROKECOLOR] = "#FF928B"; // borde
  style[mx.mxConstants.STYLE_FONTCOLOR] = "#000000"; //fuente de letra T
  style[mx.mxConstants.STYLE_STROKEWIDTH] = "1"; //grosor de borde
  style[mx.mxConstants.STYLE_STARTSIZE] = "28"; //tamanio tittle --- NO TOCAR
  style[mx.mxConstants.STYLE_VERTICAL_ALIGN] = "middle"; //posicion respecto a vertical
  style[mx.mxConstants.STYLE_FONTSIZE] = "12"; //tamnio de letra
  style[mx.mxConstants.STYLE_FONTSTYLE] = 2; //estilo: italico T


  //style[mx.mxConstants.STYLE_IMAGE] = 'images/icons48/table.png';
  // Looks better without opacity if shadow is enabled
  style[mx.mxConstants.STYLE_OPACITY] = "100"; //opacidad de la tabla
  style[mx.mxConstants.STYLE_SHADOW] = 0; //shadow...para tridimensionalidad
  graph.getStylesheet().putCellStyle("table", style);

  style = new Object();
  style[mx.mxConstants.STYLE_SHAPE] = mx.mxConstants.SHAPE_RECTANGLE;
  style[mx.mxConstants.STYLE_PERIMETER] = mx.mxPerimeter.RectanglePerimeter;
  style[mx.mxConstants.STYLE_ALIGN] = mx.mxConstants.ALIGN_MIDDLE;
  style[mx.mxConstants.STYLE_VERTICAL_ALIGN] = mx.mxConstants.ALIGN_MIDDLE;
  style[mx.mxConstants.STYLE_FONTCOLOR] = "#000000"; //color de fuente A
  style[mx.mxConstants.STYLE_FONTSIZE] = "11"; //tamanio
  style[mx.mxConstants.STYLE_FONTSTYLE] = 0; //stilo


  /*style[mx.mxConstants.STYLE_SPACING_LEFT] = '8';
  style[mx.mxConstants.STYLE_IMAGE_WIDTH] = '100';*/
  graph.getStylesheet().putDefaultVertexStyle(style);
  //--Estilo de la flecha
  style = graph.stylesheet.getDefaultEdgeStyle();
  style[mx.mxConstants.STYLE_LABEL_BACKGROUNDCOLOR] = "#FFFFF ";
  style[mx.mxConstants.STYLE_STROKEWIDTH] = "2";
  style[mx.mxConstants.STYLE_ROUNDED] = true; //redondeado
  style[mx.mxConstants.STYLE_EDGE] = mx.mxEdgeStyle.SideToSide; //estilo?
}
