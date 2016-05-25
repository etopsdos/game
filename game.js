var window = window;

var game =
{
	create:
	{
		get canvas ()
		{
			var canvas = window.document.createElement ('canvas');
					canvas.context = canvas.getContext ('2d');

					canvas.resize = function ()
					{
						canvas.height = window.innerHeight;
						canvas.width = window.innerWidth;
					}

					canvas.set =
					{
						set background (b)
						{
							canvas.style.background = b
						}
					}

					game.event.manager = canvas;

					canvas.resize ();
					window.document.body.appendChild (canvas);
			return canvas;
		}
	},

	event:
	{
		list: ['click', 'mousedown', 'mouseup', 'resize'],

		set manager (o)
		{
			for (var i of game.event.list)
			{
				if (o[i] != undefined)
				{
					var f = o[i];
					window['on' + i] = function (event) { f (event); }
				}
			}
		}
	}
}

window.onload = function ()
{
	game.canvas = game.create.canvas;
	game.canvas.set.background = 'black';
}
