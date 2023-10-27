import {
  AddPropAction,
  DeleteAction,
  EditAction,
  NestDocumentAction,
  generarJSON
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

// Obtén el botón por su ID
var BotonSave = document.getElementById("saveButton");

// Agrega un manejador de eventos al botón
BotonSave.addEventListener("click", function() {
  console.log(generarJSON(graph))
});

export function SaveInFirebase(){
  //recuperar Los datos de Los documentos
  //convertir esos datos en formato json
  //enviar el json al backend
}