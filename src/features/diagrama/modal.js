var wnd = null;
export default function showModalWindow(graph, title, content, width, height)
		{
			// // var background = document.createElement('div');
			var background = document.getElementById('background-add-property');
			background.appendChild(content);
			console.log('showing modal window for add property');
		};

export { wnd };