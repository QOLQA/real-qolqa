import {
  AddPropAction,
  DeleteAction,
  EditAction,
  NestDocumentAction
} from "./action";

export function overlayForDelete(data, cell, graph) {
  const overlay = new DeleteAction(data, graph);
  graph.addCellOverlay(cell, overlay.overlay);
}

export function overlayForNestDoc(data, cell, graph) {
  const overlay = new NestDocumentAction(data, graph);
  graph.addCellOverlay(cell, overlay.overlay);
}

export function overlayForAddProp(data, cell, graph) {
  const overlay = new AddPropAction(data, graph);
  graph.addCellOverlay(cell, overlay.overlay);
}

export function overlayForEdit(data, cell, graph) {
  const overlay = new EditAction(data, graph);
  graph.addCellOverlay(cell, overlay.overlay);
}