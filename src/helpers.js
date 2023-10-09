import { column } from "./cells";
import { overlayForDelete, overlayForEdit } from "./overlays";
import { overlaysPath } from "./util";

export function createDataOverlay(image, xOffset, yOffset, tooltip, alignment) {
  return {
    pathImage: `${overlaysPath}/${image}`,
    offset: { x: xOffset, y: yOffset },
    tooltip,
    alignment
  }
}

export function addDefaultVertex(graph, vertex) {
  let v1 = graph.getModel().cloneCell(column);
  v1.value.name = "id_column1";

  vertex.insert(v1, 0);

  // addOverlay(v1, 'images/add.png', graph, {x:-20, y:0}, 'que fue')
  overlayForDelete(
    createDataOverlay('cross_.png', -10, -25, 'Borrar atributo'),
    v1,
    graph
  );
  overlayForEdit(
    createDataOverlay('edit_.png', -30, -25, 'Editar atributo'),
    v1,
    graph
  );
}
