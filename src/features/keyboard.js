import { graph } from "../graph";
import mx from "../util";
import { updateChart } from "./update_chart";

export default function setup() {
    const keyhandler = new mx.mxKeyHandler(graph);

    keyhandler.bindKey(46, deleteSelectedEdges);
    keyhandler.bindKey(8, deleteSelectedEdges);

    function deleteSelectedEdges() {
        if (graph.isEnabled() && !graph.isSelectionEmpty()) {
            var cells = graph.getSelectionCells();
            var edges = cells.filter(function(cell) {
                return graph.getModel().isEdge(cell);
            });

            if (edges.length > 0) {
                // Deletes the selected edges
                graph.removeCells(edges);
                updateChart();
            }
        }
    }
}

