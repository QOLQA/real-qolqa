import mx from "./util";
/**
			 *  Actualiza el panel de propiedades
			 */
export function selectionChanged(graph, cell)
//Se define una función llamada selectionChanged que toma un argumento graph, que se supone que es una instancia del gráfico mxGraph.
{
  var elemento = document.querySelector('#properties');

  // Aplica el estilo CSS
  if (elemento) {
    elemento.style.display = 'block';
  }
  

  var div = document.getElementById('properties');
  //Se obtiene una referencia al elemento HTML con el ID 'properties'. Esto se utiliza para manipular el contenido del panel de propiedades.

  // Forces focusout in IE : Cuando un elemento HTML, como un campo de entrada de texto (<input>), un área de texto (<textarea>), un botón u otro elemento interactivo, pierde el foco, el evento focusout se activa. Esto puede ocurrir cuando el usuario hace clic en otro elemento, presiona la tecla "Tab" para cambiar el enfoque a otro elemento o realiza alguna otra acción que haga que el elemento actual ya no esté seleccionado.
  // graph.container.focus();
  //Se fuerza el enfoque en el contenedor del gráfico. Esto se hace para garantizar que cualquier evento de pérdida de foco (focusout) se dispare en navegadores Internet Explorer (IE). Esto podría ser necesario para garantizar la consistencia del comportamiento del panel de propiedades en diferentes navegadores.

  // Clears the DIV the non-DOM way
  div.innerHTML = '';
  //Se borra el contenido del elemento con el ID 'properties'. Esto limpia el panel de propiedades antes de agregar nuevos datos.

  // Gets the selection cell
  // var cell = graph.getSelectionCell();
  // Se obtiene la celda actualmente seleccionada en el gráfico utilizando el método getSelectionCell() del objeto graph. Esto proporciona la celda que está actualmente seleccionada en el gráfico.
  if (cell == null )
  {
    mx.mxUtils.writeln(div, 'Nothing selected.');
  }
  else{
    // Writes the title
    var center = document.createElement('center');
    //Se crea un elemento HTML <center> para centrar el contenido que se agregará al panel de propiedades.

    // mx.mxUtils.writeln(center, cell.value.name + ' (' + cell.id + ')');
    mx.mxUtils.writeln(center,'Celda: '+ cell.value.name);
    //Se utiliza mxUtils.writeln para escribir el nombre del nodo de cell.value y su ID entre paréntesis en el elemento <center>. Esto crea un título para la propiedad que se muestra en el centro del panel de propiedades.

    div.appendChild(center);
    //Se agrega el elemento <center> al elemento con el ID 'properties' para mostrar el título centrado.

    mx.mxUtils.br(div);
    //Se agrega una línea en blanco al panel de propiedades utilizando 

    // Creates the form from the attributes of the user object
    var form = new mx.mxForm();
    //Se crea un nuevo formulario (mxForm) que se utilizará para mostrar las propiedades del elemento seleccionado.

    // var attrs = cell.value.attributes;
    // //Se obtienen los atributos del objeto cell.value. Estos atributos se asumen como los datos que se mostrarán en el panel de propiedades.
    
    // console.log("Si corre hasta aqui");


    // for (var i = 0; i < attrs.length; i++)
    // {
    //   createTextField(graph, form, cell, attrs[i]);
    // }
    //Un bucle for itera a través de los atributos y llama a la función createTextField(graph, form, cell, attrs[i]); para crear campos de texto para cada atributo en el formulario.
    
    createTextField( graph,form, cell);

    div.appendChild(form.getTable());
    //Se agrega el formulario al panel de propiedades.

    mx.mxUtils.br(div);
    //Se agrega una línea en blanco adicional al final del panel de propiedades.
  }
}

/**
 * Creates the textfield for the given property.
 */
// function createTextField(graph, form, cell, attribute)
function createTextField( graph,form, cell)
{
  // var input = form.addText(cell.value.name + ':', attribute.nodeValue);
  var input = form.addText('Nombre' + ': ', cell.value.name);
  
  
  if (cell.value.type){
    // Crear el elemento select
    var valores = ['String', 'Integer', 'Boolean', 'Double', 'Arrays', 'Timestamp', 'Object', 'Null', 'Symbol',  'Date'];

    // Crear el elemento select
    var select = document.createElement('select');
    select.id = 'tipoValueTable';

    // Agregar las opciones al select usando un bucle for
    for (var i = 0; i < valores.length; i++) {
      var option = document.createElement('option');
      option.text = valores[i];
      select.add(option);
    }

    // Agregar un evento de cambio al elemento select
    select.addEventListener('change', function () {
      // Obtener y guardar el valor seleccionado en una variable
      var selectedValue = select.value;
      // Puedes usar selectedValue según tus necesidades
    });

    // Agregar el select al formulario
    var input2 = form.addField('Tipo' + ': ', select);
    // var input2 = form.addText('Tipo' + ': ', cell.value.type);
  }

  // ####
  
  var applyHandler = function()
  {
    var newValue = input.value;
    if (cell.value.type){
      var newValue2 = input2.value;
    }

    var oldValue = cell.getAttribute(cell.value.name, '');
    var oldValue2 = cell.getAttribute(cell.value.type, '');

    

    if (newValue != oldValue || newValue2 != oldValue2)
    {
      graph.getModel().beginUpdate();
                  
        try
        {
          if (newValue != oldValue){cell.value.name = newValue;}
          if (newValue2 != oldValue2){cell.value.type = newValue2;}
              graph.updateCellSize(cell);
        }
        finally
        {
          
            graph.getModel().endUpdate();
        }  
  }
  };

  configurarEventosInput(input);
  if(input2){
    configurarEventosInput(input2);
  }
  


  function configurarEventosInput(input) {
    // Evento para Enter sin Shift
    mx.mxEvent.addListener(input, 'keypress', function (evt) {
      if (evt.keyCode == 13 && !mx.mxEvent.isShiftDown(evt)) {
        input.blur();
      }
    });
  
    // Evento de desenfoque
    // if (mx.mxClient.IS_IE) {
    //   mx.mxEvent.addListener(input, 'focusout', applyHandler);
    // } else {
    //   mx.mxEvent.addListener(input, 'blur', applyHandler);
    // }

    // Evento para cambios en el input
    mx.mxEvent.addListener(input, 'input', function () {
      applyHandler();
    });
  }
}