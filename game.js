game =
{
	canvas:
	{
		load: function ()
		{
			let canvas = window.document.createElement ('canvas');
			canvas.context = canvas.getContext ('2d');

			canvas.resize = function ()
			{
				canvas.height = window.innerHeight;
				canvas.width = window.innerWidth;
			}

			canvas.update = function (event)
			{
				switch (event.type)
				{
					case 'resize': canvas.resize (); break;
				}
			}

			delete game.canvas;
			game.canvas = canvas;

			canvas.resize ();
			window.document.body.appendChild (canvas);
		}
	},

	create:
	{
		button: function (b)
		{
			let button = b || {};
			button.h = button.h || 0.5;
			button.id = button.id || Object.keys (game.object).length;
			button.w = button.w || 0.5;
			button.x = button.x || 0.5;
			button.y = button.y || 0.5;

			button.draw = function ()
			{
				let o = game.get.metric (button);
				game.canvas.context.clearRect (o.x, o.y, o.w, o.h);
				game.canvas.context.fillRect (o.x, o.y, o.w, o.h);
			}

			button.mousedown = function (event)
			{
				game.canvas.context.fillStyle = (button.mousein (event)) ? 'red' : 'black';
				button.draw ();
			};

			button.mousein = function (event)
			{
				let c = { x: event.x, y: event.y };
				let o = game.get.metric (button);
				return ((c.x > o.x) && (c.x < o.x + o.w) && (c.y > o.y) && (c.y < o.y + o.h));
			}

			button.resize = function ()
			{
				button.draw ();
			}

			game.object[button.id] = button;
			button.draw ();
		}
	},

	get:
	{
		metric: function (o)
		{
			let object = {};
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
		game.create.button ({ h: 0.1, wk: 1, x: 0.7, xk: 0.5, y: 0.5, yk: 0.5 });
		game.create.button ({ h: 0.1, wk: 1, x: 0.3, xk: 0.5, y: 0.5, yk: 0.5 });
		game.create.button ({ h: 0.1, wk: 1, x: 0.5, xk: 0.5, y: 0.5, yk: 0.5 });
	},

	object:
	{
		update: function (event)
		{
			for (let id in game.object)
			{
				for (let method in game.object[id])
				{
					if (method == event.type)
					{
						game.object[id][method] (event);
					}
				}
			}
		}
	},

	update: function (event)
	{
		game.canvas.update (event);
		game.object.update (event);
	},

	window:
	{
		load: function ()
		{
			window.onmousedown = game.update;
			window.onmouseup = game.update;
			window.onload = game.update;
			window.onresize = game.update;
		}
	}
}

window.onload = game.load;
