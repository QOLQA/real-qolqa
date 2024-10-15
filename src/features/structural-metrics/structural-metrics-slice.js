import { createSlice } from "@reduxjs/toolkit";
import { setLoaded } from "../diagrama/diagramaSlice";
import { myGraph } from "../diagrama/graph";
import { findConnectedCells } from "../../classes/loop_conversor";
import { updateMatrix } from "../queries/queries-slice";

const initialState = {
    navigationCost: 0,
    patternAccess: 0,
    redundance: 0,
}

const structuralMetricsSlice = createSlice({
    name: 'structuralMetrics',
    initialState,
    reducers: {
        updateCountRelations: (state, action) => {

        },
        updateCountAtts: (state, action) => {

        },
        updateCountCols: (state, action) => {

        }
    },
    extraReducers: builder => {
        // builder.addCase(setLoaded, (state, action) => {
        //     const cells = myGraph.graph.getModel().cells;
        //     // only tables
        //     const reviewedTables = [];
        //     const onlyTables = (Object.values(cells)).filter(cell => myGraph.graph.isSwimlane(cell));
        //     onlyTables.forEach(table => {
        //         if (!reviewedTables.includes(table)) {
        //             const connectedTables = findConnectedCells(myGraph.graph, table);
        //             console.log('connectedTables', {connectedTables, table});
        //             reviewedTables.push(...connectedTables);
        //         }
        //     });
        // });
        // builder.addCase(updateMatrix, (state, action) => {
        //     const cells = myGraph.graph.getModel().cells;
        //     // only tables
        //     const reviewedTables = [];
        //     const onlyTables = (Object.values(cells)).filter(cell => myGraph.graph.isSwimlane(cell));
        //     onlyTables.forEach(table => {
        //         if (!reviewedTables.includes(table)) {
        //             const connectedTables = findConnectedCells(myGraph.graph, table);
        //             console.log('connectedTables', {connectedTables, table});
        //             reviewedTables.push(...connectedTables);
        //         }
        //     });
        // })
    }
});

export const {
    updateCountAtts,
    updateCountCols,
    updateCountRelations,
} = structuralMetricsSlice.actions;

export default structuralMetricsSlice.reducer;
