import { store } from "../app/store";
// import { selectQueries } from "./diagrama/diagramaSlice";

export function updateChart(graph) {
    // // generate a matrix based on queries
    // const queries = selectQueries(store.getState());
    // const matrix = generateMatrix(queries);
    // const { cells } = graph.getModel();
    // const allCells = Object.values(cells);
    // // filter only tables from cells
    // const onlyColections = allCells.filter(cell => graph.isSwimlane(cell));
    // // filter only tables that exists in queries
    // let collectionsInQueries = onlyColections.filter(cell => cell.value.name in matrix);
    // collectionsInQueries.forEach(cell => {
    //     matrix[cell.value.name][cell.value.name] = '11';
    // });
    // // filter only nested collections
    // const nestedColections = collectionsInQueries.filter(cell => {
    //     const parent = graph.getModel().getParent(cell);
    //     return parent.value !== undefined;
    // });
    // nestedColections.forEach(cell => {
    //     const parent = graph.getModel().getParent(cell);
    //     matrix[parent.value.name][cell.value.name] = '01';
    // });
    // // console.log('nestedCollections', nestedColections);
    // const relations = allCells.filter(cell => cell.isEdge());
    // collectionsInQueries = relations.filter(cell => {
    //     return cell.target.value.name in matrix &&
    //         cell.source.value.name in matrix
    // });
    // // collectionsInQueries = collectionSources.filter(cell => cell.value.name in matrix);
    // collectionsInQueries.forEach(cell => {
    //     // get target
    //     const target = cell.target.value;
    //     const source = cell.source.value;
    //     matrix[source.name][target.name] = '10';
    // });
    // console.log('relaciones', collectionSources);
    console.log('necesitamos actualizar el diagrama de metricas');
}

function generateMatrix(queries) {
    const salida = {};
    const todasColecciones = new Set();
    queries.forEach(query => {
        query.collections.forEach(coleccion => todasColecciones.add(coleccion));
    });

    const listaColecciones = Array.from(todasColecciones);

    listaColecciones.forEach(coleccion => {
        salida[coleccion] = {};
        listaColecciones.forEach(otracColeccion => {
            salida[coleccion][otracColeccion] = "00";
        });
    });

    return salida
}