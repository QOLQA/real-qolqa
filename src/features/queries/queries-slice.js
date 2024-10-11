import { createSlice } from "@reduxjs/toolkit";
import { loadDiagrama } from "../diagrama/diagramaSlice";
import { myGraph } from "../diagrama/graph";

const initialState = {
    open: false,
    step: 1,
    fullQuery: '',
    toEdit: -1,
    queries: [],
    matrix: {},
    metric: 0,
};

function generateMatrix(queries) {
    const matrix = {};
    const todasColecciones = new Set();
    queries.forEach(query => {
        query.collections.forEach(coleccion => todasColecciones.add(coleccion));
    });

    const listaColecciones = Array.from(todasColecciones);

    listaColecciones.forEach(coleccion => {
        matrix[coleccion] = {};
        listaColecciones.forEach(otracColeccion => {
            matrix[coleccion][otracColeccion] = "00";
        });
    });

    return matrix;
}

function addReferentialRelations(matrix, submodels) {
    const submodelRelations = submodels.map(submodel => submodel.relations);
    submodelRelations.forEach(relations => {
        relations.forEach(({source, target}) => {
            const {name: sourceName} = source;
            const {name: targetName} = target;
            if (sourceName in matrix && targetName in matrix) {
                matrix[sourceName][targetName] = '10';
            }
        });
    });
}

function setParticipants(matrix, submodels) {
    const uniqueCols = new Set();

    function proccessNestedDocs(nested_docs) {
        if (nested_docs === null) return;
        nested_docs.forEach(nested_doc => {
            uniqueCols.add(nested_doc.name);
            proccessNestedDocs(nested_doc.nested_docs);
        });
    }

    submodels.forEach(({ collections }) => {
        collections.forEach(({ name, nested_docs }) => {
            uniqueCols.add(name);
            proccessNestedDocs(nested_docs);
        });
    });

    const listaColecciones = Array.from(uniqueCols);

    listaColecciones.forEach(coleccion => {
        if (coleccion in matrix) {
            matrix[coleccion][coleccion] = '11';
        }
    });
}

function addNestedRelations(matrix, submodels) {
    function findRelations({name: parent, nested_docs}) {
        if (nested_docs === null) return;
        nested_docs.forEach(nested_doc => {
            if (parent in matrix && nested_doc.name in matrix)
                matrix[parent][nested_doc.name] = '01';
            findRelations(nested_doc);
        });
    }

    submodels.forEach(({collections}) => {
        collections.forEach(coleccion => {
            findRelations(coleccion);
        });
    });
}

function hayConexion(grafo, a, b) {
  return grafo[a][b] !== '00' || grafo[b][a] !== '00';
}

function dfs(grafo, inicio, fin, visitados = new Set()) {
  visitados.add(inicio);
  if (inicio === fin) return true;

  for (let nodo in grafo) {
    if (hayConexion(grafo, inicio, nodo) && !visitados.has(nodo)) {
      if (dfs(grafo, nodo, fin, visitados)) return true;
    }
  }
  return false;
}

function verificarCamino(solucion, colecciones) {
  if (colecciones.length === 1) {
    const nodo = colecciones[0];
    return solucion[nodo][nodo] === '11';
  }

  for (let i = 0; i < colecciones.length - 1; i++) {
    for (let j = i + 1; j < colecciones.length; j++) {
      const inicio = colecciones[i];
      const fin = colecciones[j];
      if (!dfs(solucion, inicio, fin)) return false;
    }
  }
  return true;
}

function verificarQueries(queries, matrix) {
    const totalQueries = queries.length;
    const resultados = {};
    for (let {full_query, collections} of queries) {
        resultados[full_query] = verificarCamino(matrix, collections);
    }
    const consultasCubiertasCount = Object.values(resultados).filter(Boolean).length;
    return consultasCubiertasCount === totalQueries ? 1 : consultasCubiertasCount / totalQueries;
}

const queryFormSlice = createSlice({
    name: 'querForm',
    initialState,
    reducers: {
        toggleVisibility: (state) => {
            state.fullQuery = '';
            state.toEdit = -1;
            if (state.step === 2) {
                state.step = 1;
                state.open = !state.open;
            } else {
                state.open = !state.open;
            }
        },
        changeStep: (state, action) => {
            state.step = action.payload.otherStep;
            state.fullQuery = action.payload.query ?? state.fullQuery;
            state.open = true;
            state.toEdit = action.payload.toEdit ?? state.toEdit;
        },
        onSubmitQueryForm: (state, action) => {
            if (state.toEdit === -1) {
                // create new query
                state.queries = [
                    ...state.queries,
                    action.payload,
                ]
                const colInQueries = new Set(Object.keys(state.matrix));
                action.payload.collections.forEach(collection => {
                    if (!colInQueries.has(collection)) {
                        state.matrix[collection] = {}
                        state.matrix[collection][collection] = '00';
                        colInQueries.forEach(otherCol => {
                            state.matrix[collection][otherCol] = '00';
                            state.matrix[otherCol][collection] = '00';
                        });
                    }
                });
                // usar graph
                const collections = myGraph.getCollections();
                const refRelations = myGraph.getReferentialRelations();
                const nestRelations = myGraph.getNestedRelations();
                const colsInQueries = new Set(Object.keys(state.matrix));
                const uniqueCols = new Set(collections.map(col => col.value.name));
                colsInQueries.forEach(col => {
                    if (!uniqueCols.has(col)) {
                        colsInQueries.forEach(otherCol => {
                            state.matrix[otherCol][col] = '00';
                            state.matrix[col][otherCol] = '00';
                        });
                    }
                });
                collections.forEach(collection => {
                    if (collection.value.name in state.matrix) {
                        state.matrix[collection.value.name][collection.value.name] = '11';
                    }
                });
                nestRelations.forEach(({child, parent}) => {
                    if (parent.value.name in state.matrix && child.value.name in state.matrix) {
                        state.matrix[parent.value.name][child.value.name] = '01';
                    }
                });
                refRelations.forEach(({source, target}) => {
                    if (source.value.name in state.matrix && target.value.name in state.matrix) {
                        state.matrix[source.value.name][target.value.name] = '10';
                    }
                });
                // calc metric completude
                state.metric = verificarQueries(state.queries, state.matrix);
            } else {
                // first: remove old collections
                const oldValue = state.queries[state.toEdit];
                const newCols = new Set(action.payload.collections);
                const colsCounter = {};
                (Object.keys(state.matrix)).forEach(uniqueCol => {
                    colsCounter[uniqueCol] = 0;
                });
                state.queries.forEach(({collections}) => {
                    collections.forEach(collection => {
                        colsCounter[collection] += 1;
                    });
                });
                // const newMatrix = {...state.matrix};
                oldValue.collections.forEach(col => {
                    if (colsCounter[col] === 1 && !newCols.has(col)) {
                        delete state.matrix[col];
                        for (let otherCol in state.matrix) {
                            delete state.matrix[otherCol][col];
                        }
                    }
                });
                // // second: add new entries
                const colInQueries = new Set(Object.keys(state.matrix));
                action.payload.collections.forEach(collection => {
                    if (!colInQueries.has(collection)) {
                        state.matrix[collection] = {}
                        state.matrix[collection][collection] = '00';
                        colInQueries.forEach(otherCol => {
                            state.matrix[collection][otherCol] = '00';
                            state.matrix[otherCol][collection] = '00';
                        });
                    }
                });
                // update query
                state.queries[state.toEdit] = action.payload;
                // state.matrix = newMatrix;
                // // usar graph
                const collections = myGraph.getCollections();
                const refRelations = myGraph.getReferentialRelations();
                const nestRelations = myGraph.getNestedRelations();
                // const colsInQueries = new Set(Object.keys(state.matrix));
                // const uniqueCols = new Set(collections.map(col => col.value.name));
                // colsInQueries.forEach(col => {
                //     if (!uniqueCols.has(col)) {
                //         colsInQueries.forEach(otherCol => {
                //             state.matrix[otherCol][col] = '00';
                //             state.matrix[col][otherCol] = '00';
                //         });
                //     }
                // });
                collections.forEach(collection => {
                    if (collection.value.name in state.matrix) {
                        state.matrix[collection.value.name][collection.value.name] = '11';
                    }
                });
                nestRelations.forEach(({child, parent}) => {
                    if (parent.value.name in state.matrix && child.value.name in state.matrix) {
                        state.matrix[parent.value.name][child.value.name] = '01';
                    }
                });
                refRelations.forEach(({source, target}) => {
                    if (source.value.name in state.matrix && target.value.name in state.matrix) {
                        state.matrix[source.value.name][target.value.name] = '10';
                    }
                });
                // calc metric completude
                state.metric = verificarQueries(state.queries, state.matrix);                
            }
            // close and reset form state
            state.step = 1;
            state.open = false;
            state.fullQuery = '';
            state.toEdit = -1;
        },
        deleteQuery: (state, action) => {
            const toDelete = state.queries[action.payload];
            // TODO: update matrix
            const colsCounter = {};
            (Object.keys(state.matrix)).forEach(uniqueCol => {
                colsCounter[uniqueCol] = 0;
            });
            state.queries.forEach(({collections}) => {
                collections.forEach(collection => {
                    colsCounter[collection] += 1;
                });
            });
            const newMatrix = {...state.matrix};
            toDelete.collections.forEach(col => {
                if (colsCounter[col] === 1) {
                    delete newMatrix[col];
                    for (let otherCol in newMatrix) {
                        delete newMatrix[otherCol][col];
                    }
                }
            });
            state.queries = state.queries.filter((_, index) => index !== action.payload);
            state.matrix = newMatrix;
            // calc metric completude
            state.metric = verificarQueries(state.queries, state.matrix);
        },
        updateMatrix: (state) => {
            const collections = myGraph.getCollections();
            const refRelations = myGraph.getReferentialRelations();
            const nestRelations = myGraph.getNestedRelations();
            const colsInQueries = new Set(Object.keys(state.matrix));
            const uniqueCols = new Set(collections.map(col => col.value.name));
            colsInQueries.forEach(col => {
                console.log('analizado', col);
                if (!uniqueCols.has(col)) {
                    console.log('emtra siquiera una vez');
                    colsInQueries.forEach(otherCol => {
                        state.matrix[otherCol][col] = '00';
                        state.matrix[col][otherCol] = '00';
                    });
                } else {
                    colsInQueries.forEach(otherCol => {
                        if (state.matrix[otherCol][col] === '10' || state.matrix[otherCol][col] === '01') {
                            state.matrix[otherCol][col] = '00';
                        }
                    });
                }
                console.log('sale del bucle');
            });
            collections.forEach(collection => {
                if (collection.value.name in state.matrix) {
                    state.matrix[collection.value.name][collection.value.name] = '11';
                }
            });
            nestRelations.forEach(({child, parent}) => {
                if (parent.value.name in state.matrix && child.value.name in state.matrix) {
                    state.matrix[parent.value.name][child.value.name] = '01';
                }
            });
            refRelations.forEach(({source, target}) => {
                if (source.value.name in state.matrix && target.value.name in state.matrix) {
                    state.matrix[source.value.name][target.value.name] = '10';
                }
            });
            // calc metric completude
            state.metric = verificarQueries(state.queries, state.matrix);
        }
    },
    extraReducers: builder => {
        builder.addCase(loadDiagrama.fulfilled, (state, action) => {
            // primera carga
            state.queries = action.payload.queries;
            const matrix = generateMatrix(action.payload.queries);
            setParticipants(matrix, action.payload.submodels);
            addNestedRelations(matrix, action.payload.submodels);
            addReferentialRelations(matrix, action.payload.submodels);
            // last, assing the matrix
            state.matrix = matrix;
            // calc metric completude
            state.metric = verificarQueries(state.queries, state.matrix);
        })
    }
});

export const {
    toggleVisibility,
    changeStep,
    onSubmitQueryForm,
    deleteQuery,
    updateMatrix,
} = queryFormSlice.actions;

export const selectQueryForm = (state) => state.queryForm;
export const selectQueries = (state) => state.queryForm.queries;
export const selectMatrix = (state) => state.queryForm.matrix;
export const selectCompletitudMetric = (state) => state.queryForm.metric;

export default queryFormSlice.reducer;
