export function generarJSON(graph) {
    // Inicializa la estructura base del JSON
    var jsonData = { submodels: [] };
  
    // Para guardar los documentos ya conectados
    var reviewedDocs = [];
  
    // Obtén el modelo del gráfico
    var model = graph.getModel();
  
    // Itera sobre todas las celdas en el modelo
    var cells = model.cells;

    for (var cellId in cells) {
      var cell = cells[cellId];
      // Verifica si la celda es un contenedor
      if (cell.style == "table") {
  
        var connectedCells = findConnectedCells(graph, cell);

        // Comprueba si esta lista de cell esta en connected cells
        if (!reviewedDocs.includes(cell)) {
          // Genera el documento a partir de las celdas conectadas
          var documento = generardocs(connectedCells);
  
          // Agrega el documento al submodelo correspondiente
          jsonData.submodels.push({ documents: documento });
  
          // Agrega las celdas conectadas a la lista de reviewedDocs
          reviewedDocs.push(...connectedCells);
        }
      }
    }
  
    // Devuelve el JSON resultante
    return jsonData;
    //return JSON.stringify(jsonData)
  }
  
  function findConnectedCells(graph, startCell) {
    var visited = new Set();
    var connectedCells = [];
  
    // Función recursiva para realizar la búsqueda en profundidad
    function dfs(currentCell) {
      visited.add(currentCell);
      connectedCells.push(currentCell);
  
      // Obtenemos todas las aristas salientes de la celda actual
      var edges = graph.model.getOutgoingEdges(currentCell);
  
      for (var i = 0; i < edges.length; i++) {
        var targetCell = graph.model.getTerminal(edges[i], false); // Obtenemos la celda de destino
        if (!visited.has(targetCell)) {
          dfs(targetCell);
        }
      }
    }
  
    // Iniciar la búsqueda desde la celda de inicio
    dfs(startCell);
  
    return connectedCells;
  }
  
  function generardocs(cells){
     var docs = []
     for (var cellId in cells) {
       var cell = cells[cellId];
       // Verifica si la celda es un contenedor
       if (cell.style == "table") {
         var nombreDocumento = cell.value.name; // Nombre del documento del contenedor
         var atributosDocumento = [];
         var relaciones = [];

         // Itera sobre los hijos de la celda (atributos)
         var childCount = cell.getChildCount();
         for (var i = 0; i < childCount; i++) {
           var atributo = cell.getChildAt(i);
           var nombreAtributo = atributo.value.name; // Nombre del atributo
           var tipoAtributo = atributo.value.type; // Tipo del atributo
           // Agrega el atributo al arreglo de atributos del documento
           if (atributo.value.isForeignKey){
            relaciones.push({ [nombreAtributo]: tipoAtributo });
           }
           else{
            atributosDocumento.push({ [nombreAtributo]: tipoAtributo });
        }
         }
   
         // Crea el objeto de documento
         var documento = {
           name: nombreDocumento,
           fields: atributosDocumento,
           relations: relaciones.length > 0 ? relaciones : null
         };
         docs.push(documento )
        }
    }
    return docs;
  }