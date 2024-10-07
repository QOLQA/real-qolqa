export default function moveContainedSwimlanesToBack(graph, parentSwimlane) {
    const model = graph.getModel();
    const children = graph.getChildCells(parentSwimlane);
    const containedSwimlanes = [];
  
    // Itera sobre los hijos para identificar los swimlanes contenidos.
    for (var i = 0; i < children.length; i++) {
      // Filtra los hijos que son swimlanes basados en su estilo
      const style = children[i].getStyle();
      if (style == 'table') {
        containedSwimlanes.push(children[i]);
      }
    }
  
    // Mueve cada swimlane contenida al final de la pila.
    containedSwimlanes.forEach((containedSwimlane) => {
      var lastChild = null;
      const childCount = graph.model.getChildCount(parentSwimlane);
  
      if (childCount > 0) {
        lastChild = graph.model.getChildAt(parentSwimlane, childCount - 1); // Cambio aquí
      }
  
      if (lastChild != null) {
        const lastGeometry = graph.model.getGeometry(lastChild);
        const newX = lastGeometry.x + lastGeometry.width + 20; // Puedes ajustar el espaciado horizontal aquí
        const newY = lastGeometry.y;
  
        const geometry = graph.model.getGeometry(containedSwimlane);
        geometry.x = newX;
        geometry.y = newY;
        model.setGeometry(containedSwimlane, geometry);
      }
  
      // Añade la swimlane contenida de nuevo al final de la pila.
      model.add(parentSwimlane, containedSwimlane, childCount); // Cambio aquí
    });
  }
  
  // Para usar la función en otro lugar:
  // moveContainedSwimlanesToBack(graph, parentSwimlane);
  