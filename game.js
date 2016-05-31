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

	create:
	{
		button: function (b)
		{
			button = b || {};
			button.h = button.h || 0.5;
			button.id = button.id || Object.keys (game.object).length;
			button.w = button.w || 0.5;
			button.x = button.x || 0.5;
			button.y = button.y || 0.5;

			button.click = function ()
			{
				console.log ('click');
			};

			button.draw = function ()
			{
				o = game.get.metric (button);
				game.canvas.context.fillRect (o.x, o.y, o.w, o.h);
			}

			game.object[button.id] = button;
			button.draw ();
		}
	},

	get:
	{
		metric: function (o)
		{
			object = {};
			object.h = (o.hk) ? o.hk * o.w * game.canvas.width : o.h * game.canvas.height;
			object.w = (o.wk) ? o.wk * o.h * game.canvas.height : o.w * game.canvas.width;
			object.x = (o.xk) ? o.x * game.canvas.width - o.xk * object.w : o.x * game.canvas.width;
			object.y = (o.yk) ? o.y * game.canvas.height - o.xk * object.h : o.y * game.canvas.height;
			return object;
		}
	},

	load: function ()
	{
		game.window.load ();
		game.canvas.load ();
		game.create.button ({ h: 0.1, wk: 1, x: 0.5, xk: 0.5, y: 0.5, yk: 0.5 });
	},

	object: {},

	update: function (event)
	{
		for (id in game.object)
		{
			for (method in game.object[id])
			{
				if (method == event.type)
				{
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
			window.onclick = game.update;
			window.onload = game.update;
			window.onresize = game.update;
		}
	}
}

window.onload = game.load;
