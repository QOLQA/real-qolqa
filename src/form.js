import mx from "./util";


function showProperties(graph, cell) {
  let form = new mx.mxForm('properties');

  // agregar columnas
  let nameField = form.addText('Name', cell.value.name);
  let typeField = form.addText('type');
}