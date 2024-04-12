import { column, table } from "../cells";
import { addActionsForDocs, addDefaultVertex, addActionsForNestedDocs } from "../cells_actions";
import { createDoc } from "../graph";
import { createDataOverlay } from "../helpers";
import { overlayForDelete, overlayForEdit } from "../overlays";
import ConversorJson from "../services/coversor_json";
import moveContainedSwimlanesToBack from "../swimbottom";
import mx from "../util";

export default class LoopConversor extends ConversorJson {
    constructor() { super() }

    fromGraphToJson(graph) {
        // Inicializa la estructura base del JSON
        var jsonData = { submodels: [] };

        // Obtén el modelo del gráfico
        var model = graph.getModel();

        // Itera sobre todas las celdas en el modelo
        var cells = model.cells;

        // Para guardar los documentos ya conectados
        var reviewedDocs = [];

        for (var cellId in cells) {
            var cell = cells[cellId];
            var parentCell = model.getParent(cell)
            // Verifica si la celda es un contenedor .... y si no es un hijo contenido..
            if ((!reviewedDocs.includes(cell)) && (cell.style == "table") && (parentCell.style != "table")) {
                // Add same cell and other connected's
                var connectedCells = findConnectedCells(graph, cell);
                var relaciones = [];
                // Comprueba si esta lista de cell esta en connected cells
                if (!reviewedDocs.includes(cell)) {

                    // Genera el documento a partir de las celdas conectadas
                    var documento = generardocs(graph, connectedCells);

                    // Agrega las celdas conectadas a la lista de reviewedDocs
                    reviewedDocs.push(...connectedCells);

                    for (const cell of connectedCells) {
                        const childCount = cell.getChildCount()
                        for (let i = 0; i < childCount; i++) {
                            const attribute = cell.getChildAt(i)
                            if (attribute.value.isForeignKey) {
                                // Obtener cardinalidad
                                let cardinality;
                                for (const edges of cell.edges) {
                                    if (edges.target.id === attribute.value.to && edges.source.id === cell.value.id) {
                                        cardinality = edges.value
                                        break
                                    }
                                }

                                relaciones.push({
                                    id_source: cell.value.id,
                                    id_target: attribute.value.to,
                                    cardinality: cardinality,
                                })
                            }
                        }
                    }

                    // Agrega el documento y la relacion al submodelo correspondiente
                    jsonData.submodels.push({
                        collections: documento,
                        relations: relaciones.length > 0 ? relaciones : null
                    });
                }
            }
        }

        // Devuelve el JSON resultante
        return jsonData;
    }

    fromJsonToGraph(jsonModel, graph) {
        const { submodels } = jsonModel;
        const prototype = graph.getModel().cloneCell(table);

        let counter = 100;
        const model = graph.getModel();
        model.createId = (cell) => {
            if (graph.isSwimlane(cell)) {
                return cell.value.id;
            }
            return counter++;
        }

        submodels.forEach(submodel => {
            const { collections, relations } = submodel;
            // agregar los documentos
            collections.forEach(collection => processDocument(collection, graph, prototype, counter++));
            if (relations !== null) {
                var parent = graph.getDefaultParent();
                for (const { id_source, id_target, cardinality } of relations) {
                    const sourceVertex = model.cells[id_source]
                    const targetVertex = model.cells[id_target]
                    const edge = new mx.mxCell()
                    edge.edge = true
                    // this code ensure that "new" attribute is added in document
                    // without actions
                    graph.insertEdge(parent, null, cardinality, sourceVertex, targetVertex)
                }
            }
        });
    }
}

const addProp = function (graph, cell, nombreValue, tipoValue) {

    // agregar nueva columna
    const columnName = nombreValue; //nombre del atributo
    const columnType = tipoValue; //tipo del atributo
    const v1 = graph.getModel().cloneCell(column);
    v1.value.name = columnName;
    v1.value.type = columnType;
    moveContainedSwimlanesToBack(graph, cell);
    overlayForDelete(
        createDataOverlay('cross_.png', -10, 0, 'Borrar atributo', mx.mxConstants.ALIGN_MIDDLE),
        v1,
        graph
    );
    overlayForEdit(
        createDataOverlay('edit_.png', -30, 0, 'Editar atributo', mx.mxConstants.ALIGN_MIDDLE),
        v1,
        graph
    );
    return v1;
}



function processDocument(collection, graph, prototype, counter) {
    const {
        fields, position, nested_docs, id, name
    } = collection;

    const parent = graph.getDefaultParent();
    const pt = new mx.mxPoint(position.x, position.y);
    const vertex = createDoc(graph, prototype, name, pt);
    vertex.value.id = id;
    addActionsForDocs(vertex, graph);
    vertex.setConnectable(true);

    const attributeNames = Object.keys(fields);
    const columns = attributeNames.map(name => addProp(graph, vertex, name, fields[name]));

    const model = graph.getModel();

    columns.forEach(column => {
        model.add(vertex, column);
    });
    processNestedDocs(vertex, nested_docs, columns, graph)

    model.add(parent, vertex);
    // graph.importCells([vertex], 0, 0, null);
}


function processNestedDocs(vertex, nested_docs, columns, graph) {
    const model = graph.getModel();
    if (nested_docs !== null) {
        // relaciones internas (documentos anidados)
        nested_docs.forEach(({ fields, name, nested_docs, id, cardinality }) => {
            // processNestedDocs(vertex, nested_docs, columns)
            const nestedVertex = model.cloneCell(table);
            nestedVertex.connectable = false // La tabla ya no puede relacionarse a travez de aristas
            nestedVertex.value.name = name + " (" + cardinality + " )";
            nestedVertex.value.id = id
            let lastChild = null;

            const childCount = model.getChildCount(vertex);
            if (childCount > 0) {
                lastChild = columns[columns.length - 1];
            }

            if (lastChild !== null) {
                const lastGeometry = model.getGeometry(lastChild);
                const newX = lastGeometry.x + lastGeometry.width + 20;
                nestedVertex.geometry.x = newX;
                nestedVertex.geometry.y = lastGeometry.y;
            }

            addActionsForNestedDocs(nestedVertex, graph);
            // addDefaultVertex(graph, nestedVertex);

            const attributeNames1 = Object.keys(fields);
            const columns1 = attributeNames1.map(name => addProp(graph, vertex, name, fields[name]));

            columns1.forEach(column => {
                model.add(nestedVertex, column);
            });

            model.add(vertex, nestedVertex);

            processNestedDocs(nestedVertex, nested_docs, columns1, graph)

        })
    }
}

function findConnectedCells(graph, startCell) {
    function getNeighbors(cell, graph) {
        const neighbors = []
        for (let to of cell.value.to) {
            neighbors.push(graph.model.cells[to])
        }
        const outerEdges = graph.model.getOutgoingEdges(cell)
        const terminals = outerEdges.map(edge => {
            return graph.model.getTerminal(edge, false)
        })
        neighbors.push(...terminals)
        return neighbors
    }

    function bfs(cell) {
        const visited = new Set()
        visited.add(cell)
        const queue = [cell]
        while (queue.length > 0) {
            const vertex = queue.shift()
            const neighbors = getNeighbors(vertex, graph)
            for (let neighbor of neighbors) {
                if (!visited.has(neighbor)) {
                    visited.add(neighbor)
                    queue.push(neighbor)
                }
            }
        }
        return visited
    }

    const bfs_result = [...bfs(startCell)]
    return bfs_result;
}

function generardocs(graph, cells) {
    var docs = []
    var model = graph.getModel();
    for (var cellId in cells) {
        var cell = cells[cellId];
        // Verifica si la celda es un contenedor
        if (cell.style == "table") {
            var parentCell = model.getParent(cell)
            var nombreDocumento = cell.value.name; // Nombre del documento del contenedor
            var atributosDocumento = {};
            //var relaciones = [];
            var relacionesInternas = [];

            //obtiene la posicion de la tabla pricipal
            var cellX = graph.model.getGeometry(cell).x;
            var cellY = graph.model.getGeometry(cell).y;

            // Itera sobre los hijos de la celda (atributos)
            var childCount = cell.getChildCount();
            for (var i = 0; i < childCount; i++) {
                var atributo = cell.getChildAt(i);
                var nombreAtributo = atributo.value.name; // Nombre del atributo
                var tipoAtributo = atributo.value.type; // Tipo del atributo
                // verifica si es un contenedor interno (doc)
                if (atributo.style === "table") {
                    //reviewedDocs.push(atributo)
                    var documentoInterno = generardocs(graph, [atributo]);
                    relacionesInternas.push(
                        ...documentoInterno,
                    );
                } else {
                    if (!atributo.value.isForeignKey) {
                        // Si no es una clave foránea ni un contenedor interno, es un atributo normal
                        atributosDocumento[nombreAtributo] = tipoAtributo;
                    }
                }
            }
            // Crea el objeto de documento

            if (parentCell.style != "table") {
                var documento = {
                    name: nombreDocumento,
                    id: cell.id,
                    fields: atributosDocumento,
                    position: {
                        x: cellX,
                        y: cellY
                    },
                    nested_docs: relacionesInternas.length > 0 ? relacionesInternas : null,
                };
            }
            else {
                const regex = /([^()]+) \(([^)]+)\)/;
                const match = nombreDocumento.match(regex);

                const name = match[1].trim();
                const cardinality = match[2].trim();

                documento = {
                    name: name,
                    id: cell.id,
                    fields: atributosDocumento,
                    nested_docs: relacionesInternas.length > 0 ? relacionesInternas : null,
                    cardinality: cardinality
                };
            }
            docs.push(documento)
        }
    }
    return docs;
}
