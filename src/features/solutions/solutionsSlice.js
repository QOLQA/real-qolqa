import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { deleteSolution, fetchSolutions, postSolution } from "./solutionsAPI"

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
            console.error(action.error.message);
        })
        builder.addCase(submitSolution.pending, (state) => {
            state.status = 'loading';
            state.elements = state.elements;
        });
        builder.addCase(submitSolution.fulfilled, (state, action) => {
            state.status = 'idle';
            state.elements = [...state.elements, action.payload];
        });
        builder.addCase(submitSolution.rejected, (state, action) => {
            state.status = 'failed';
            console.error(action.error.message);
        });
        builder.addCase(removeSolution.pending, (state) => {
            state.status = 'loading';
        });
        builder.addCase(removeSolution.fulfilled, (state, action) => {
            state.status = 'idle';
            let solutionId = action.payload;
            state.elements = state.elements.filter((solution) => solution._id !== solutionId);
        });
        builder.addCase(removeSolution.rejected, (state, action) => {
            state.status = 'failed';
            console.error(action.error.message);
        })
    }
})

export const loadSolutions = createAsyncThunk(
    'solutions/fetchSolutions',
    async () => {
        return await fetchSolutions();
    }
);

export const submitSolution = createAsyncThunk(
    'solutions/postSolution',
    async (modelName) => {
        return await postSolution({
            name: modelName.trim(),
            submodels: [],
            queries: [],
        });
    }
)

export const removeSolution = createAsyncThunk(
    'solutions/deleteSolution',
    async (solutionId) => {
        return await deleteSolution(solutionId);
    }
)

export const {
    createSolution,
} = solutionsSlice.actions;

export const selectSolutions = (state) => state.solutions.elements;

export default solutionsSlice.reducer