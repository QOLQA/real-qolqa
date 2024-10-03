import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { fetchDiagrama, postDiagrama } from "./diagramaAPI"

const initialState = {
    value: {},
    status: 'initial',
    error: '',
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
                state.value = action.payload
        })
        builder.addCase(loadDiagrama.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message; // Guardar el mensaje de error
        })
        builder.addCase(saveDiagrama.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
        })
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
    async(id, diagramaUpdated) => {
        await postDiagrama(id, diagramaUpdated);
    }
)

export const {
    addQuery,
    setLoaded
} = diagramaSlice.actions

export const selectDiagrama = state => state.diagrama.value
export const selectStateDiagrama = state => state.diagrama.status
export const selectQueries = state => state.diagrama.value.queries

export default diagramaSlice.reducer
