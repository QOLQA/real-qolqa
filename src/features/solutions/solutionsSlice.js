import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { fetchSolutions } from "./solutionsAPI"

const initialState = {
    elements: [],
    status: 'idle',
}

export const solutionsSlice = createSlice({
    name: 'solutions',
    initialState,
    reducers: {
        // TODO: Create solution reducer,
        // TODO: Update solution reducer,
        // TODO: Delete solution reducer,
    },
    extraReducers: builder => {
        builder.addCase(loadSolutions.pending, state => {
            state.status = 'loading'
        })
        builder.addCase(loadSolutions.fulfilled, (state, action) => {
            state.status = 'idle'
            state.elements = action.payload
        })
        builder.addCase(loadSolutions.rejected, (state, action) => {
            state.status = 'failed';
        })
    }
})

export const loadSolutions = createAsyncThunk(
    'solutions/fetchSolutions',
    async () => {
        return await fetchSolutions();
    }
)

export const selectSolutions = (state) => state.solutions.elements;

export default solutionsSlice.reducer