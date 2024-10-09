import { createSlice } from "@reduxjs/toolkit";
import { loadDiagrama } from "../diagrama/diagramaSlice";

const initialState = {
    open: false,
    step: 1,
    fullQuery: '',
    toEdit: -1,
    queries: [],
    matrix: {},
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
                // TODO: Update matrix
            } else {
                // update query
                state.queries[state.toEdit] = action.payload;
                // TODO: Update matrix
            }
            // close and reset form state
            state.step = 1;
            state.open = false;
            state.fullQuery = '';
            state.toEdit = -1;
        },
        deleteQuery: (state, action) => {
            state.queries = state.queries.filter((_, index) => index !== action.payload);
        }
    },
    extraReducers: builder => {
        builder.addCase(loadDiagrama.fulfilled, (state, action) => {
            // primera carga
            state.queries = action.payload.queries;
            const matrix = generateMatrix(action.payload.queries);
            addReferentialRelations(matrix, action.payload.submodels);
            state.matrix = matrix;
        })
    }
});

export const {
    toggleVisibility,
    changeStep,
    onSubmitQueryForm,
    deleteQuery,
} = queryFormSlice.actions;

export const selectQueryForm = (state) => state.queryForm;
export const selectQueries = (state) => state.queryForm.queries;

export default queryFormSlice.reducer;
