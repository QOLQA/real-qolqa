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

            edges.forEach(({source, target}) => {
                let targetUpdated = target.value.clone();
                targetUpdated.to = targetUpdated.to.filter(id => id !== source.id);
                graph.getModel().setValue(target, targetUpdated);
            })

            const relatedAttributes = edges.map(edge => graph.getModel().getCell(edge.value.generatedAttr));

            if (edges.length > 0) {
                // Deletes the selected edges
                graph.removeCells([...edges, ...relatedAttributes]);
                updateChart();
                // console.log(graph.getModel().cells);
            }
        }
    }
}

