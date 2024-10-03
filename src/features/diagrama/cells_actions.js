import { overlayForAddProp, overlayForDelete, overlayForEdit, overlayForNestDoc, overlayForEditCardinality } from "./overlays";
import mx from "../../util";
import { createDataOverlay } from "./helpers";
import { column } from "./cells";

export function addActionsForDocs(vertex, graph) {
  overlayForDelete(
    createDataOverlay('cross_.png', -10, 15, 'Delete document', mx.mxConstants.ALIGN_TOP),
    vertex,
    graph
  );
  overlayForAddProp(
    createDataOverlay('plus_.png', -30, 15, 'Add property', mx.mxConstants.ALIGN_TOP),
    vertex,
    graph
  );
  overlayForNestDoc(
    createDataOverlay('add_.png', -50, 15, 'Add document', mx.mxConstants.ALIGN_TOP),
    vertex,
    graph
  );
}


export function addActionsForNestedDocs(vertex, graph) {
  addActionsForDocs(vertex, graph) //botones generales
  // overlayForEditCardinality(   //bton para agregar cardinalidad
  //   createDataOverlay('add_.png', -70, 15, 'Change carinality', mx.mxConstants.ALIGN_TOP),
  //   vertex,
  //   graph
  // );
}

export function addDefaultVertex(graph, vertex) {
  let v1 = graph.getModel().cloneCell(column);
  v1.value.name = "id_column1";

  vertex.insert(v1, 0);

  overlayForDelete(
    createDataOverlay('cross_.png', -10, -7, 'Borrar atributo'),
    v1,
    graph
  );
  overlayForEdit(
    createDataOverlay('edit_.png', -30, -7, 'Editar atributo'),
    v1,
    graph
  );
}
