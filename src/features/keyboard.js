import { store } from "../app/store";
import mx from "../util";
import { updateMatrix } from "./queries/queries-slice";
import { updateCountRelations } from "./structural-metrics/structural-metrics-slice";

export default function setup(graph) {
    const keyhandler = new mx.mxKeyHandler(graph);

    keyhandler.bindKey(46, deleteSelectedEdges);
    keyhandler.bindKey(8, deleteSelectedEdges);

    function deleteSelectedEdges() {
        if (graph.isEnabled() && !graph.isSelectionEmpty()) {
            var cells = graph.getSelectionCells();
            var edges = cells.filter(function(cell) {
                return graph.getModel().isEdge(cell);
            });

            edges.forEach(({source, target}) => {
                let targetUpdated = target.value.clone();
                targetUpdated.to = targetUpdated.to.filter(id => id !== source.id);
                graph.getModel().setValue(target, targetUpdated);
            })

            const relatedAttributes = edges.map(edge => graph.getModel().getCell(edge.value.generatedAttr));

            if (edges.length > 0) {
                // Deletes the selected edges
                graph.removeCells([...edges, ...relatedAttributes]);
                store.dispatch(updateMatrix());
                store.dispatch(updateCountRelations());
            }
        }
    }
}

