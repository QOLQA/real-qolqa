import { configureStore } from "@reduxjs/toolkit";
import solutionsReducer from "../features/solutions/solutionsSlice";
import diagramaReducer from "../features/diagrama/diagramaSlice";
import queryFormReducer from "../features/queries/queries-slice";

export const store = configureStore({
    reducer: {
        solutions: solutionsReducer,
        diagrama: diagramaReducer,
        queryForm: queryFormReducer,
    }
})
