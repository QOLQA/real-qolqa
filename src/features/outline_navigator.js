import mx from "../util"

export default function setup(container, graph) {
    const outlineNavigator = document.getElementById('outlineContainer')

    mx.mxEvent.disableContextMenu(container)

    const outln = new mx.mxOutline(graph, outlineNavigator)
}

// new mx.mxDivResizer(container)
// new mx.mxDivResizer(outlineNavigator)
