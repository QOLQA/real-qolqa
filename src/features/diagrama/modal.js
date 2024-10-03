var wnd = null;
export default function showModalWindow(graph, title, content, width, height)
		{
			// // var background = document.createElement('div');
			var background = document.getElementById('background-add-property');
			background.appendChild(content);
			// background.style.position = 'absolute';
			// background.style.left = '0px';
			// background.style.top = '0px';
			// background.style.right = '0px';
			// background.style.bottom = '0px';
			// background.style.background = 'black';
			// mx.mxUtils.setOpacity(background, 50);
			// document.body.appendChild(background);
			
			// if (mx.mxClient.IS_IE)
			// {
			// 	new mx.mxDivResizer(background);
			// }
			
			// var x = Math.max(0, document.body.scrollWidth/2-width/2);
			// var y = Math.max(10, (document.body.scrollHeight ||
			// 			document.documentElement.scrollHeight)/2-height*2/3);
			// wnd = new mx.mxWindow(title, content, x, y, width, height, false, true); //crear el DOM para el content del modal
			// wnd.setClosable(true);
			
			// // Fades the background out after after the window has been closed
			// wnd.addListener(mx.mxEvent.DESTROY, function(evt)
			// {
			// 	graph.setEnabled(true);
			// 	mx.mxEffects.fadeOut(background, 50, true, 
			// 		10, 30, true);
			// });

			// graph.setEnabled(false);
			// graph.tooltipHandler.hide();
			// wnd.setVisible(true);
			console.log('showing modal window for edit');
		};

export { wnd };