import { configureStore } from "@reduxjs/toolkit";
import solutionsReducer from "../features/solutions/solutionsSlice";
import diagramaReducer from "../features/diagrama/diagramaSlice";
import matrixReducer from "../features/matrix/matrixSlice";

export const store = configureStore({
    reducer: {
        solutions: solutionsReducer,
        diagrama: diagramaReducer,
        matrix: matrixReducer,
    }
})
