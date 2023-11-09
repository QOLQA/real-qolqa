export function generarJSON(graph) {
    // Inicializa la estructura base del JSON
    var jsonData = { submodels: [] };
  
    // Obtén el modelo del gráfico
    var model = graph.getModel();
  
    // Itera sobre todas las celdas en el modelo
    var cells = model.cells;

    // Para guardar los documentos ya conectados
    var reviewedDocs = [];

    for (var cellId in cells) {
      var cell = cells[cellId];
      var parentCell = model.getParent(cell)
      // Verifica si la celda es un contenedor .... y si no es un hijo contenido..
      if ((cell.style == "table") && (parentCell.style!= "table")){

        var connectedCells = findConnectedCells(graph, cell);

        // Comprueba si esta lista de cell esta en connected cells
        if (!reviewedDocs.includes(cell)) {
          // Genera el documento a partir de las celdas conectadas
          var documento = generardocs(graph,connectedCells);
  
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
  
  function generardocs(graph,cells){
     var docs = []
     var model = graph.getModel();
     for (var cellId in cells) {
       var cell = cells[cellId];
       // Verifica si la celda es un contenedor
       if (cell.style == "table") {
         var parentCell = model.getParent(cell)
         var nombreDocumento = cell.value.name; // Nombre del documento del contenedor
         var atributosDocumento = [];
         //var relaciones = [];
         var relacionesInternas = [];
         var relacionesExternas = [];

         // Itera sobre los hijos de la celda (atributos)
         var childCount = cell.getChildCount();
         for (var i = 0; i < childCount; i++) {
           var atributo = cell.getChildAt(i);
           var nombreAtributo = atributo.value.name; // Nombre del atributo
           var tipoAtributo = atributo.value.type; // Tipo del atributo
           // Agrega el atributo al arreglo de atributos del documento
           if (atributo.value.isForeignKey) {
            relacionesExternas.push({ [nombreAtributo]: tipoAtributo });
          } else {
            // Si no es una clave foránea, verifica si es un contenedor interno (doc)
            if (atributo.style === "table") {
              //reviewedDocs.push(atributo)
              var documentoInterno = generardocs(graph,[atributo]);
              relacionesInternas.push(documentoInterno[0]);
            } else {
              // Si no es una clave foránea ni un contenedor interno, es un atributo normal
              atributosDocumento.push({ [nombreAtributo]: tipoAtributo });
            }
          }
         }
         // Crea el objeto de documento
         
         if (parentCell.style!= "table"){
         var documento = {
           name: nombreDocumento,
           fields: atributosDocumento,
           relations: {
            inner_relations: relacionesInternas.length > 0 ? relacionesInternas : null,
            outer_relations: relacionesExternas.length > 0 ? relacionesExternas : null
           }
         };
        }
         else {
          documento = {
            name: nombreDocumento,
            fields: atributosDocumento,
            nested_docs: relacionesInternas.length > 0 ? relacionesInternas : null,
          };
         }
         docs.push(documento )
        }
    }
    return docs;
  }