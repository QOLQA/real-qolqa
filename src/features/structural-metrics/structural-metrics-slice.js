import { createSlice } from "@reduxjs/toolkit";
import { setLoaded } from "../diagrama/diagramaSlice";
import { findConnectedCells } from "../../classes/loop_conversor";
import { updateMatrix } from "../queries/queries-slice";
import { myGraph } from "../diagrama/graph";


const initialState = {
    redundance: 0,
    relationsCalc: 0,
    attributesCalc: 0,
}

const coefAttSimple = 0.51;
const coefAtComplex = 0.49;
const coefRefRel = 0.6;
const coefNestRel = 0.4;

function getGroupedTables(graph) {
    const cells = graph.getModel().cells;
    const reviewedTables = [];
    const groupedTables = [];
    const onlyParentTables = (Object.values(cells)).filter(cell => {
        const parent = graph.getModel().getParent(cell);
        return graph.isSwimlane(cell) && parent.value === undefined;
    });
    onlyParentTables.forEach(table => {
        if (!reviewedTables.includes(table)) {
            const connectedTables = findConnectedCells(graph, table);
            reviewedTables.push(...connectedTables);
            groupedTables.push(connectedTables);
        }
    });
    return groupedTables;
}

function calcRelationsValue(graph) {
    const groupedTables = getGroupedTables(graph);
    const model = graph.getModel();
    let calc = 0;
    groupedTables.forEach((tables, _) => {
        // count ref relations
        const numRefRelations = tables.length - 1;
        // count nested relations
        const nestedForGrouped = tables.map(table => {
            let children = model.getChildren(table);
            children = children.filter(child => graph.isSwimlane(child));
            return children.length;
        });
        const numNestRelations = nestedForGrouped.reduce((a, b) => a + b, 0);
        calc += numNestRelations * coefNestRel + numRefRelations * coefRefRel;
    });
    return calc;
}

function calcRedundanceValue(graph) {
    const cells = graph.getModel().cells;
    const allTables = (Object.values(cells)).filter(cell => graph.isSwimlane(cell));
    const tablesCounter = {};
    allTables.forEach(table => {
        if (!(table.value.name in tablesCounter)) {
            tablesCounter[table.value.name] = 0;
        } else {
            tablesCounter[table.value.name] += 1;
        }
    });
    return (Object.values(tablesCounter)).reduce((a, b) => a + b, 0);
}

function calcAttributesValue(graph) {
    const groupedTables = getGroupedTables(graph);
    const model = graph.getModel();
    
    let calc = 0;

    let attSimples = 0;
    let attComplex = 0;

    function contar(table) {
        const children = model.getChildren(table);
        const onlyAtt = children.filter(cell => graph.isHtmlLabel(cell));
        attSimples += onlyAtt.length;
        const nestedDocs = children.filter(cell => graph.isSwimlane(cell));
        if (nestedDocs.length > 0)  {
            attComplex += nestedDocs.length;
            nestedDocs.forEach(nestedDoc => contar(nestedDoc));
        }
    }

    groupedTables.forEach((tables, _) => {
        tables.forEach(contar);
        calc += attSimples * coefAttSimple + attComplex * coefAtComplex;
        attSimples = 0;
        attComplex = 0;
    });
    return calc;
}

const structuralMetricsSlice = createSlice({
    name: 'structuralMetrics',
    initialState,
    reducers: {
        firstCalcStructuralMetrics: (state, action) => {
            state.attributesCalc = calcAttributesValue(myGraph.graph);
            state.relationsCalc = calcRelationsValue(myGraph.graph);
            state.redundance = calcRedundanceValue(myGraph.graph);
        },
        updateCountRelations: (state, action) => {            
            state.relationsCalc = calcRelationsValue(myGraph.graph);
        },
        updateCountAtts: (state, action) => {
            state.attributesCalc = calcAttributesValue(myGraph.graph);
        },
        updateRedundance: (state, action) => {
            state.redundance = calcRedundanceValue(myGraph.graph);
        },
    },
    extraReducers: builder => {
        builder.addCase(setLoaded, (state, action) => {
            state.attributesCalc = calcAttributesValue(myGraph.graph);
            state.relationsCalc = calcRelationsValue(myGraph.graph);
            state.redundance = calcRedundanceValue(myGraph.graph);
        });
    }
});

export const {
    updateCountAtts,
    updateRedundance,
    updateCountRelations,
    firstCalcStructuralMetrics,
} = structuralMetricsSlice.actions;

export const selectNavigationCost = (state) => {
    const { relationsCalc, attributesCalc } = state.structuralMetrics;
    return relationsCalc + attributesCalc;
}

export const selectRecuperationPattern = (state) => state.structuralMetrics.relationsCalc;

export const selectRedundance = (state) => state.structuralMetrics.redundance;

export default structuralMetricsSlice.reducer;
