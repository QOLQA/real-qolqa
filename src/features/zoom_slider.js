import { graph } from "../graph"

export default function setup() {
    document.getElementById('zoomInButton').addEventListener('click', function() {
        graph.zoomIn()
    })

    document.getElementById('zoomOutButton').addEventListener('click', function() {
        graph.zoomOut()
    })

    document.getElementById('zoomSlider').addEventListener('input', function(event) {
        const scale = parseFloat(event.target.value)
        graph.zoomTo(scale, true)
    })
}