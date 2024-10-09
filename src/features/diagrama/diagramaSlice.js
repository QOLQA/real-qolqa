import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { fetchDiagrama, postDiagrama } from "./diagramaAPI"

const initialState = {
    value: {},
    initialValue: {},
    status: 'initial',
    error: '',
}

function compareObjectsByValue(obj1, obj2) {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
}

export const diagramaSlice = createSlice({
    name: 'diagrama',
    initialState,
    reducers: {
        addQuery: (state, action) => {
            state.value.queries = [
                ...state.value.queries,
                action.payload,
            ]
        },
        setLoaded: state => {
            state.status = 'loaded';
        }
    },
    extraReducers: builder => {
        builder.addCase(loadDiagrama.pending, state => {
            state.status = 'loading'
        })
        builder.addCase(loadDiagrama.fulfilled, (state, action) => {
                state.status = 'idle'
                state.value = {...action.payload}
                state.value.queries = []
                state.initialValue = action.payload
        })
        builder.addCase(loadDiagrama.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message; // Guardar el mensaje de error
        })
        builder.addCase(saveDiagrama.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
        })
        builder.addCase(saveDiagrama.fulfilled, (state, action) => {
            state.value = action.payload;
        })
        // builder.addCase(sendForm, (state, action) => {
        //     console.log('vista en diagramaSlice', action.payload.newKey);
        // })
    }
})

export const loadDiagrama = createAsyncThunk(
    'diagrama/getDiagrama',
    async (id) => {
        return await fetchDiagrama(id);
    }
)

export const saveDiagrama = createAsyncThunk(
    'diagrama/postDiagrama',
    async(diagramaData, state) => {
        const initialValue = selectDBValue(state.getState());
        if (compareObjectsByValue(initialValue.queries, diagramaData.queries)) {
            delete diagramaData.queries;
        }
        if (compareObjectsByValue(initialValue.name, diagramaData.name)) {
            delete diagramaData.name;
        }
        if (compareObjectsByValue(initialValue.submodels, diagramaData.submodels)) {
            delete diagramaData.submodels;
        }
        return await postDiagrama(diagramaData.id, {...diagramaData});
    }
)

export const {
    addQuery,
    setLoaded
} = diagramaSlice.actions

export const selectDiagrama = state => state.diagrama.value
export const selectStateDiagrama = state => state.diagrama.status
// export const selectQueries = state => state.diagrama.value.queries
const selectDBValue = state => state.diagrama.initialValue

export default diagramaSlice.reducer
