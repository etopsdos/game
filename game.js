game =
{
	canvas:
	{
		load: function ()
		{
			canvas = window.document.createElement ('canvas');
			canvas.context = canvas.getContext ('2d');

			canvas.resize = function ()
			{
				canvas.height = window.innerHeight;
				canvas.width = window.innerWidth;
			}

			delete game.canvas;
			game.canvas = canvas;

			game.object.canvas = canvas;

			canvas.resize ();
			window.document.body.appendChild (canvas);
		}
	},

	load: function ()
	{
		game.window.load ();
		game.canvas.load ();
	},

	object: {},

	update: function (event)
	{
		for (id in game.object)
		{
			for (var method in game.object[id])
			{
				if (method == event.type)
				{
					console.log (method);
					game.object[id][method] ();
					return;
				}
			}
		}
	},

	window:
	{
		load: function ()
		{
			window.onload = game.update;
			window.onresize = game.update;
		}
	}
}

window.onload = game.load;
