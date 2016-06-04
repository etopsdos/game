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
			button.a = b.a || function () {};
			button.f0 = b.f0 || 'black';
			button.f1 = b.f1 || 'red';
			button.h = b.h || 0.5;
			button.id = b.id || Object.keys (game.object).length;
			button.lw = b.lw || 10;
			button.w = b.w || 0.5;
			button.x = b.x || 0.5;
			button.y = b.y || 0.5;

			button.clear = function ()
			{
				let o = game.get.metric (button);
				game.canvas.context.clearRect (o.x, o.y, o.w, o.h);
			}

			button.destroy = function ()
			{
				button.clear ();
			}

			button.draw = function ()
			{
				let o = game.get.metric (button);
				game.canvas.context.fillRect (o.x, o.y, o.w, o.h);
			}

			button.mousedown = function (event)
			{
				if (button.mousein (event))
				{
					button.a ();
					game.canvas.context.fillStyle = button.f1;
				} else {
					game.canvas.context.fillStyle = button.f0;;
				}
				button.draw ();
			}

			button.mousein = function (event)
			{
				let c = { x: event.x, y: event.y };
				let o = game.get.metric (button);
				return ((c.x > o.x) && (c.x < o.x + o.w) && (c.y > o.y) && (c.y < o.y + o.h));
			}

			button.mouseup = function ()
			{
				game.canvas.context.fillStyle = button.f0;
				button.draw ();
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
			object.h = (o.hk) ? o.hk * o.w * game.canvas.width >> 0 : o.h * game.canvas.height >> 0;
			object.w = (o.wk) ? o.wk * o.h * game.canvas.height >> 0 : o.w * game.canvas.width >> 0;
			object.x = (o.xk) ? o.x * game.canvas.width - o.xk * object.w >> 0 : o.x * game.canvas.width >> 0;
			object.y = (o.yk) ? o.y * game.canvas.height - o.xk * object.h >> 0 : o.y * game.canvas.height >> 0;
			return object;
		}
	},

	load: function ()
	{
		game.window.load ();
		game.canvas.load ();
		game.create.button ({ a: function () { console.log ('click'); }, h: 0.1, wk: 1, x: 0.7, xk: 0.5, y: 0.5, yk: 0.5 });
		game.create.button ({ h: 0.1, wk: 1, x: 0.3, xk: 0.5, y: 0.5, yk: 0.5 });
		game.create.button ({ h: 0.1, wk: 1, x: 0.5, xk: 0.5, y: 0.5, yk: 0.5 });
	},

	object:
	{
		set destroy (id)
		{
			if (game.object[id])
			{
				if (game.object[id].destroy)
				{
					game.object[id].destroy ();
					delete game.object[id];
				} else {
					delete game.object[id];
				}
			}
		},

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

	scene:
	{
		set next (name)
		{
			game.scene[name] ();
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
			window.onmousemove = game.update;
			window.onmouseup = game.update;
			window.onload = game.update;
			window.onresize = game.update;
		}
	}
}

window.onload = game.load;
