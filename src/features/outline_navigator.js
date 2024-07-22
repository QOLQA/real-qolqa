import { container, graph } from "../graph"
import mx from "../util"

const outlineNavigator = document.getElementById('outlineContainer')

mx.mxEvent.disableContextMenu(container)

const outln = new mx.mxOutline(graph, outlineNavigator)

new mx.mxDivResizer(container)
new mx.mxDivResizer(outlineNavigator)
