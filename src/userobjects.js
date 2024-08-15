import { updateChart } from "./features/update_chart";
import { haddleEditSection } from "./features/navbar";

/**
 * Actualiza el panel de propiedades para la cardinalidad.
 * @param {mxGraph} graph - Instancia del gráfico mxGraph.
 * @param {mxCell} table - Célula seleccionada que representa una tabla.
 */
export function selectionChangedCardinality(graph, table) {
  const div = document.querySelector('#edit-section');
  haddleEditSection();

  if (!table) {
    div.innerHTML = '';
    return;
  }

  const name = table.value.name;
  const currentCardinality = table.value.cardinality;

  div.innerHTML = `
  <div class="relative p-8 sm:p-12">
    <h3 class="text-center font-bold text-lg">Nested Document Properties</h3>
    <div class="mb-6">
      <label for="TableName" class="text-left">Name</label>
      <input type="text" name="TableName" id="TableName" value="${name}" class="
        w-full
        rounded
        py-3
        px-[14px]
        text-body-color text-base
        border border-[f0f0f0]
        outline-none
        focus-visible:shadow-none
        focus:shadow-outline-blue 
        focus:border-blue-300
      ">
    </div>
    <div class="mb-6">
      <label for="Cardinality" class="text-left">Cardinality</label>
      <select name="Cardinality" id="Cardinality" class="
        w-full
        rounded
        py-3
        px-[14px]
        text-body-color text-base
        border border-[f0f0f0]
        outline-none
        focus-visible:shadow-none
        focus:shadow-outline-blue 
        focus:border-blue-300
      ">
        <option value="1..n" ${currentCardinality === '1..n' ? 'selected' : ''}>1..n</option>
        <option value="1..1" ${currentCardinality === '1..1' ? 'selected' : ''}>1..1</option>
        <option value="n..n" ${currentCardinality === 'n..n' ? 'selected' : ''}>n..n</option>
        <option value="0..n" ${currentCardinality === '0..n' ? 'selected' : ''}>0..n</option>
      </select>
    </div>
  </div>
  `;

  const update = () => {
    const newName = document.getElementById('TableName').value;
    const newCardinality = document.getElementById('Cardinality').value;
    const clone = table.value.clone();
    clone.name = newName;
    clone.cardinality = newCardinality;
    graph.model.setValue(table, clone);
    updateChart();
  }

  document.getElementById('TableName').addEventListener('input', update);
  document.getElementById('Cardinality').addEventListener('input', update);
}

/**
 * Actualiza el panel de propiedades para una célula seleccionada.
 * @param {mxGraph} graph - Instancia del gráfico mxGraph.
 * @param {mxCell} cell - Célula seleccionada.
 */
export function selectionChanged(graph, cell) {
  haddleEditSection();

  const div = document.getElementById('edit-section');
  div.innerHTML = '';

  const type = cell.value.type;
  const name = cell.value.name;

  div.innerHTML = `
  <div class="relative p-8 sm:p-12">
    <h3 class="text-center font-bold text-lg">Attribute Properties</h3>
    <div class="mb-6">
      <label for="AttributeName" class="text-left">Name</label>
      <input type="text" name="AttributeName" id="AttributeName" value="${name}" class="
        w-full
        rounded
        py-3
        px-[14px]
        text-body-color text-base
        border border-[f0f0f0]
        outline-none
        focus-visible:shadow-none
        focus:shadow-outline-blue 
        focus:border-blue-300
      ">
    </div>
    <div class="mb-6">
      <label for="Type" class="text-left">Type</label>
      <select name="Type" id="Type" class="
        w-full
        rounded
        py-3
        px-[14px]
        text-body-color text-base
        border border-[f0f0f0]
        outline-none
        focus-visible:shadow-none
        focus:shadow-outline-blue 
        focus:border-blue-300
      ">
        <option value="String" ${type === 'String' ? 'selected' : ''}>String</option>
        <option value="Number" ${type === 'Number' ? 'selected' : ''}>Number</option>
        <option value="Double" ${type === 'Double' ? 'selected' : ''}>Double</option>
        <option value="Array" ${type === 'Array' ? 'selected' : ''}>Array</option>
        <option value="Timestamp" ${type === 'Timestamp' ? 'selected' : ''}>Timestamp</option>
        <option value="Null" ${type === 'Null' ? 'selected' : ''}>Null</option>
        <option value="Symbol" ${type === 'Symbol' ? 'selected' : ''}>Symbol</option>
        <option value="Date" ${type === 'Date' ? 'selected' : ''}>Date</option>
      </select>
    </div>
  </div>
  `;

  const update = (id, property) => {
    const newProperty = document.getElementById(id).value;
    const clone = cell.value.clone();
    clone[property] = newProperty;
    graph.model.setValue(cell, clone);
  };

  document.getElementById('AttributeName').addEventListener('input', () => {
    update('AttributeName', 'name')
    updateChart();
  });
  document.getElementById('Type').addEventListener('input', () => {
    update('Type', 'type');
    updateChart();
  });
}

export function selectionChangedForConnections(graph, cell)
//Se define una función llamada selectionChanged que toma un argumento graph, que se supone que es una instancia del gráfico mxGraph.
{
  var elemento = document.querySelector('#edit-section');
  haddleEditSection();

  var div = document.getElementById('#edit-section');
  //Se obtiene una referencia al elemento HTML con el ID 'properties'. Esto se utiliza para manipular el contenido del panel de propiedades.

  // Clears the DIV the non-DOM way
  div.innerHTML = '';

  const cardinality = cell.value.cardinality;

  div.innerHTML = `
  <div class="relative p-8 sm:p-12">
    <h3 class="text-center font-bold text-lg">Relation Properties</h3>
    <div class="mb-6">
      <label for="Cardinality" class="text-left">Cardinality</label>
      <select name="Cardinality" id="Cardinality" class="
        w-full
        rounded
        py-3
        px-[14px]
        text-body-color text-base
        border border-[f0f0f0]
        outline-none
        focus-visible:shadow-none
        focus:shadow-outline-blue 
        focus:border-blue-300
      ">
        <option value="0..1" ${cardinality === '0..1' ? 'selected' : ''}>0..1</option>
        <option value="1..1" ${cardinality === '1..1' ? 'selected' : ''}>1..1</option>
      </select>
    </div>
  </div>
  `;

  const update = () => {
    const newCardinality = document.getElementById('Cardinality').value;
    graph.getModel().setValue(cell, { generatedAttr: cell.value.generatedAttr, cardinality: newCardinality });
    updateChart();
  }

  document.getElementById('Cardinality').addEventListener('input', update)
}

/**
 * Actualiza el panel de propiedades para los padres seleccionados.
 * @param {mxGraph} graph - Instancia del gráfico mxGraph.
 * @param {mxCell} table - Célula seleccionada que representa una tabla.
 */
export function selectionChangedForParents(graph, table) {
  const div = document.querySelector('#edit-section');
  haddleEditSection();
  // if (div) {
  //   div.style.display = 'block';
  // }

  if (!table) {
    div.innerHTML = '';
    return;
  }

  const name = table.value.name;

  div.innerHTML = `
  <div class="relative p-8 sm:p-12 ">
    <h3 class="text-center font-bold text-lg">Document Properties</h3>
    <div class="mb-6">
      <label for="TableName" class="text-left">Name</label>
      <input type="text" name="TableName" id="TableName" value="${name}" class="
        w-full
        rounded
        py-3
        px-[14px]
        text-body-color text-base
        border border-[f0f0f0]
        outline-none
        focus-visible:shadow-none
        focus:shadow-outline-blue 
        focus:border-blue-300
      ">
    </div>
  </div>
  `;

  const update = () => {
    const newName = document.getElementById('TableName').value;
    const clone = table.value.clone();
    clone.name = newName;
    graph.getModel().setValue(table, clone);
    updateChart();
  }

  document.getElementById('TableName').addEventListener('input', update);
}