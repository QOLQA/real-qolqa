export default function setup(graph) {
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