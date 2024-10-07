import { createSlice } from "@reduxjs/toolkit";
import { addQuery, loadDiagrama, setLoaded } from "../diagrama/diagramaSlice";
import { graph } from "../diagrama/graph";

const initialState = {
    value: {},
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

export const matrixSlice = createSlice({
    name: 'matrix',
    initialState,
    reducers: {
        addReferentialRelation: (state, action) => {
            const {source, target} = action.payload;
            state.value[source][target] = '10';
        },
        addNestedRelation: (state, action) => {
            const {source, target} = action.payload;
            state.value[source][target] = '01';
        },
        setParticipant: (state, action) => {
            state.value[action.payload][action.payload] = '11';
        }
    },
    extraReducers: builder => {
        builder.addCase(loadDiagrama.fulfilled, (state, action) => {
            state.value = generateMatrix(action.payload.queries);
        });
        builder.addCase(addQuery, (state, action) => {
            const existendCollections = Object.keys(state.value);
            const coleccionesExistentes = new Set(existendCollections);
            const collectionsToAdd = action.payload.collections.filter(
                col => !coleccionesExistentes.has(col)
            );
            const newMatrix = {...state.value};
            collectionsToAdd.forEach(newCol => {
                newMatrix[newCol] = {}
                collectionsToAdd.forEach(otherCol => {
                    newMatrix[newCol][otherCol] = '00';
                })
                existendCollections.forEach(existendCol => {
                    newMatrix[existendCol][newCol] = '00';
                    newMatrix[newCol][existendCol] = '00';
                });
            });
            state.value = newMatrix;
        });
        builder.addCase(setLoaded, (state) => {
            const newMatrix = {...state.value};
            const allCells = Object.values(graph.getModel().cells);
            const onlyCollections = allCells.filter(cell => graph.isSwimlane(cell));
            const collectionsInqueries = onlyCollections.filter(cell => cell.value.name in state.value);
            collectionsInqueries.forEach(col => {
                newMatrix[col.value.name][col.value.name] = '11';
            });
            const nestedCollections = collectionsInqueries.filter(col => {
                const parent = graph.getModel().getParent(col);
                return parent.value !== undefined;
            });
            nestedCollections.forEach(nestedCol => {
                const parent = graph.getModel().getParent(nestedCol);
                newMatrix[parent.value.name][nestedCol.value.name] = '01';
            });
        })
    }
});

export const {
    addNestedRelation,
    addReferentialRelation,
    setParticipant,
} = matrixSlice.actions;

export const selectMatrix = (state) => state.matrix.value;

export default matrixSlice.reducer;