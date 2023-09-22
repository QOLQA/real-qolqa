import { column, table } from "./cells"
import { selectionChanged }from "./userobjects";
import mx from "./util"
import showModalWindow from "./modal"


export function overlayForDelete(cell, graph, pathImage, offset, tooltip, alignment) {
  const overlay = addOverlay(pathImage, graph, offset, tooltip, alignment)
  
  overlay.addListener(mx.mxEvent.CLICK, (sender, evt2) => {
    console.log('sender', sender)
    console.log('evt2', evt2.properties.cell)
    graph.clearSelection()
    graph.getModel().beginUpdate()
    const r = graph.removeCells([evt2.properties.cell])
    graph.getModel().endUpdate()
  })
  
  graph.addCellOverlay(cell, overlay)
}

export function overlayForNestDoc(cell, graph, pathImage, offset, tooltip, alignment) {
  const overlay = addOverlay(pathImage, graph, offset, tooltip, alignment)

  overlay.addListener(mx.mxEvent.CLICK, (sender, evt2) => {
    graph.clearSelection()
    // Add a new document inside cell (evt2.properties.cell)
    const name = mx.mxUtils.prompt('Enter name for new document')
    if (name != null && name.trim() != '') {
      const vertex = graph.getModel().cloneCell(table)
      vertex.value.name = name
      overlayForDelete(vertex, graph, 'images/delete2.png', { x:-10, y:15 }, 'Borrar documento', mx.mxConstants.ALIGN_TOP)
      overlayForAddProp(vertex, graph, 'images/add.png', {x:-30, y:15}, 'Add property', mx.mxConstants.ALIGN_TOP)
      overlayForNestDoc(vertex, graph, 'images/handle-connect.png', {x:-50, y:15}, 'Add document', mx.mxConstants.ALIGN_TOP)
      graph.setSelectionCells(graph.importCells([vertex], 0, 0, evt2.properties.cell))
    }
  })

  graph.addCellOverlay(cell, overlay)
}

export function overlayForAddProp(cell, graph, pathImage, offset, tooltip, alignment) {

  const overlay = addOverlay(pathImage, graph, offset, tooltip, alignment)
  overlay.addListener(mx.mxEvent.CLICK, (sender, evt2) => {
    graph.clearSelection()
    
    // Creates the form from the attributes of the user object
    /*
    var form = new mx.mxForm();
    var attrs = ['Column Name','Type'];
    div.appendChild(form.getTable());
    mx.mxUtils.br(div);
    //createTextField(graph, form, attrs);
*/
    // Crear un contenedor div para el formulario
    var formContainer = document.createElement('div');

    // Crear el formulario HTML
    var form = document.createElement('form');
    form.classList.add('form-group'); // Agregar la clase 'form-group' al formulario

    var nameLabel = document.createElement('label');
    nameLabel.setAttribute('for', 'exampleInputName');
    nameLabel.textContent = 'Name';

    var nameInput = document.createElement('input');
    nameInput.setAttribute('type', 'name');
    nameInput.classList.add('form-control'); // Agregar la clase 'form-control' al campo de entrada
    nameInput.setAttribute('id', 'exampleInputName');
    nameInput.setAttribute('placeholder', 'Name');

    var emailLabel = document.createElement('label');
    emailLabel.setAttribute('for', 'exampleInputEmail1');
    emailLabel.textContent = 'E-mail';

    var emailInput = document.createElement('input');
    emailInput.setAttribute('type', 'email');
    emailInput.classList.add('form-control');
    emailInput.setAttribute('id', 'exampleInputEmail1');
    emailInput.setAttribute('aria-describedby', 'emailHelp');
    emailInput.setAttribute('placeholder', 'E-mail');

    var passwordLabel = document.createElement('label');
    passwordLabel.setAttribute('for', 'exampleInputPassword1');
    passwordLabel.textContent = 'Password';

    var passwordInput = document.createElement('input');
    passwordInput.setAttribute('type', 'password');
    passwordInput.classList.add('form-control');
    passwordInput.setAttribute('id', 'exampleInputPassword1');
    passwordInput.setAttribute('placeholder', 'Password');

    var signUpButton = document.createElement('button');
    signUpButton.setAttribute('type', 'submit');
    signUpButton.classList.add('btn', 'btn-primary');
    signUpButton.textContent = 'Sign Up';

    // Agregar todos los elementos del formulario al formulario
    form.appendChild(nameLabel);
    form.appendChild(nameInput);
    form.appendChild(emailLabel);
    form.appendChild(emailInput);
    form.appendChild(passwordLabel);
    form.appendChild(passwordInput);
    form.appendChild(signUpButton);

    // Agregar el formulario al contenedor
    formContainer.appendChild(form);
    /*
    // Crea un contenedor div para content y button01
    var container = document.createElement('div');
    container.appendChild(content);
    container.appendChild(button01);*/


    showModalWindow(graph, 'Properties', formContainer, 400, 300);

    console.log(formContainer);
    
    
    // agregar nueva columna
    const columnName = mx.mxUtils.prompt('Enter a column name') //nombre del atributo
    const columnType = mx.mxUtils.prompt('Enter a type for the column') //tipo del atributo
    if (columnName != null && columnType != null) {
      graph.getModel().beginUpdate()
      try {
        const v1 = graph.getModel().cloneCell(column)
        v1.value.name = columnName
        v1.value.type = columnType
        graph.addCell(v1, evt2.properties.cell)
        overlayForDelete(v1, graph, 'images/delete2.png', {x:-10, y:0}, 'Borrar atributo', mx.mxConstants.ALIGN_MIDDLE)
        overlayForEdit(v1, graph, 'examples/editors/images/overlays/pencil.png', {x:-30, y:0}, 'Editar atributo', mx.mxConstants.ALIGN_MIDDLE)
      } finally {
        graph.getModel().endUpdate()
      }
    }
    console.log('add prop clicked')
    
  })

  graph.addCellOverlay(cell, overlay)
}

function createTextField(graph, form, attribute) //DOM
		{
        for (var i = 0; i < attribute.length; i++)
        {
          
				var input = form.addText(attribute[i] + ':', attribute.nodeValue);

				var applyHandler = function()
				{
					var newValue = input.value || '';
          if (newValue != null ) {
            graph.getModel().beginUpdate()
            try {
              const v1 = graph.getModel().cloneCell(column)
              if (i==0)
                v1.value.name = newValue
              else if (i == 1)
                v1.value.type = newValue
              graph.addCell(v1, evt2.properties.cell)
              overlayForDelete(v1, graph, 'images/delete2.png', {x:-10, y:0}, 'Borrar atributo', mx.mxConstants.ALIGN_MIDDLE)
              overlayForEdit(v1, graph, 'examples/editors/images/overlays/pencil.png', {x:-30, y:0}, 'Editar atributo', mx.mxConstants.ALIGN_MIDDLE)
            } finally {
              graph.getModel().endUpdate()
            }
          }					
				}; 

				mx.mxEvent.addListener(input, 'keypress', function (evt)
				{
					// Needs to take shift into account for textareas
					if (evt.keyCode == /*enter*/13 &&
						!mx.mxEvent.isShiftDown(evt))
					{
						input.blur();
					}
				});

				if (mx.mxClient.IS_IE)
				{
					mx.mxEvent.addListener(input, 'focusout', applyHandler);
				}
				else
				{
					// Note: Known problem is the blurring of fields in
					// Firefox by changing the selection, in which case
					// no event is fired in FF and the change is lost.
					// As a workaround you should use a local variable
					// that stores the focused field and invoke blur
					// explicitely where we do the graph.focus above.
					mx.mxEvent.addListener(input, 'blur', applyHandler);
				}
      }
		}


export function overlayForEdit(cell, graph, pathImage, offset, tooltip, alignment) {
  const overlay = addOverlay(pathImage, graph, offset, tooltip, alignment)

  overlay.addListener(mx.mxEvent.CLICK, (sender, evt2) => {
    graph.clearSelection()
    // abrir menu Funcion
    selectionChanged(graph,evt2.properties.cell);
    if(document.getElementById('tipoValueTable')){
      var selectElement = document.getElementById('tipoValueTable');
      selectElement.value = evt2.properties.cell.value.type;
    }
  })
  

  graph.addCellOverlay(cell, overlay)
}

export const addOverlay = (pathImage, graph, offset, tooltip, alignment) => {
  let overlay = new mx.mxCellOverlay(new mx.mxImage(pathImage, 15, 15), tooltip)
  overlay.cursor = 'hand'
  overlay.verticalAlign = alignment
  overlay.offset = new mx.mxPoint(offset.x, offset.y)

  overlay.addListener('pointerdown', (sender, eo) => {
    let evt2 = eo.getProperty('event')
    let state = eo.getProperty('state')

    graph.popupMenuHandler.hideMenu()
    graph.stopEditing(false)

    let pt = mx.mxUtils.convertPoint(
      graph.container,
      mx.mxEvent.getClientX(evt2),
      mx.mxEvent.getClientY(evt2)
    )

    graph.connectionHandler.start(state, pt.x, pt.y)
    graph.isMouseDown = true
    graph.isMouseTrigger = mx.mxEvent.isMouseEvent(evt2)
    mx.mxEvent(evt2)
  })

  return overlay
}

