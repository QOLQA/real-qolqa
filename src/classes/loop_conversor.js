import { column, table } from "../cells";
import { addActionsForDocs, addDefaultVertex } from "../cells_actions";
import { createDoc } from "../graph";
import { createDataOverlay } from "../helpers";
import { overlayForDelete, overlayForEdit } from "../overlays";
import ConversorJson from "../services/coversor_json";
import moveContainedSwimlanesToBack from "../swimbottom";
import mx from "../util";

export default class LoopConversor extends ConversorJson {
    constructor () { super() }

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
            if ((cell.style == "table") && (parentCell.style != "table")) {

                var connectedCells = findConnectedCells(graph, cell);
                var relaciones = {};
                // Comprueba si esta lista de cell esta en connected cells
                if (!reviewedDocs.includes(cell)) {

                    // Genera el documento a partir de las celdas conectadas
                    var documento = generardocs(graph, connectedCells);

                    // Agrega las celdas conectadas a la lista de reviewedDocs
                    reviewedDocs.push(...connectedCells);

                    //busca relations
                    var childCount = cell.getChildCount();
                    for (var i = 0; i < childCount; i++) {
                        var atributo = cell.getChildAt(i);
                        console.log('atributo num', i, atributo);
                        // Agrega el atributo al arreglo de atributos del documento
                        if (atributo.value.isForeignKey) {
                            console.log('entra aca');
                            relaciones[cellId] = cell.edges[0].target.id;
                        }
                    }

                    // Agrega el documento y la relacion al submodelo correspondiente
                    jsonData.submodels.push({ documents: documento,
                     relations: Object.keys(relaciones).length > 0 ? relaciones : null});

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
            const { documents, relations } = submodel;
            // agregar los documentos
            documents.forEach(document => processDocument(document, graph, prototype, counter++));
            if (relations !== null) {
                // agregar las relaciones
                const sources = Object.keys(relations);
                var parent = graph.getDefaultParent();
                sources.forEach(sourceId => {
                    // source vertex
                    const sourceVertex = model.cells[sourceId];
                    // target vertex
                    const targetId = relations[sourceId];
                    const targetVertex = model.cells[targetId];
                    const edge = new mx.mxCell();
                    edge.edge = true;
                    graph.insertEdge(parent, null, '', sourceVertex, targetVertex);
                    //graph.addEdge(edge, parent, sourceVertex, targetVertex);
                })
            }
        });

        const cellsIndex = model.cells;
        console.log('cells', cellsIndex);

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



function processDocument(document, graph, prototype, counter) {
    const {
        fields, position, nested_docs, id, name
    } = document;

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

    function processNestedDocs(vertexParent, nestedDocs, columns) {
        if (nestedDocs === null) return

        const { fields, name, nested_docs } = nestedDocs
        const nestedVertex = model.cloneCell(table)
        nestedVertex.value.name = name
        let lastChild = null
        const childCount = model.getChildCount(vertexParent)
        
        if (childCount > 0) {
            lastChild = columns[columns.length - 1]
        }

        if (lastChild !== null) {
            const lastGeometry = model.getGeometry(lastChild)
            const newX = lastGeometry.x + lastGeometry.width + 20
            nestedVertex.geometry.x = newX
            nestedVertex.geometry.y = lastGeometry.y
        }

        addActionsForDocs(nestedVertex, graph)

        const attributeNames = Object.keys(fields)
        const columns1 = attributeNames.map(
            name => addProp(graph, vertexParent, name, fields[name])
        )

        columns1.forEach(
            column => model.add(nestedVertex, column)
        )

        model.add(vertexParent, nestedVertex)
    }

    if (nested_docs !== null) {
        // relaciones internas (documentos anidados)
        nested_docs.forEach(({ fields, name, nested_docs }) => {
            // processNestedDocs(vertex, nested_docs, columns)
            console.log({ fields, name, nested_docs })
            const nestedVertex = model.cloneCell(table);
            nestedVertex.value.name = name;
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

            addActionsForDocs(nestedVertex, graph);
            // addDefaultVertex(graph, nestedVertex);

            const attributeNames1 = Object.keys(fields);
            const columns1 = attributeNames1.map(name => addProp(graph, vertex, name, fields[name]));

            columns1.forEach(column => {
                model.add(nestedVertex, column);
            });

            model.add(vertex, nestedVertex);
        })
    }

    model.add(parent, vertex);
    // graph.importCells([vertex], 0, 0, null);
}

function findConnectedCells(graph, startCell) {
    var visited = new Set();
    var connectedCells = [];

    // Función recursiva para realizar la búsqueda en profundidad
    function dfs(currentCell) {
        visited.add(currentCell);
        connectedCells.push(currentCell);

        // Obtenemos todas las aristas salientes de la celda actual
        var edges = graph.model.getOutgoingEdges(currentCell);

        for (var i = 0; i < edges.length; i++) {
            var targetCell = graph.model.getTerminal(edges[i], false); // Obtenemos la celda de destino
            if (!visited.has(targetCell)) {
                dfs(targetCell);
            }
        }
    }

    // Iniciar la búsqueda desde la celda de inicio
    dfs(startCell);

    return connectedCells;
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
                    relacionesInternas.push(documentoInterno[0]);
                } else {
                    // Si no es una clave foránea ni un contenedor interno, es un atributo normal
                    atributosDocumento[nombreAtributo] = tipoAtributo;
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
                documento = {
                    name: nombreDocumento,
                    fields: atributosDocumento,
                    nested_docs: relacionesInternas.length > 0 ? relacionesInternas : null,
                };
            }
            docs.push(documento)
        }
    }
    
      
    return docs;
}
