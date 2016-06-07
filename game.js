game =
{
	canvas:
	{
		load: function ()
		{
			let canvas = window.document.createElement ('canvas');
			canvas.context = canvas.getContext ('2d');
			canvas.font = { face: 'Arial', size: 14 };

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
			button.color = {};
			button.color.background = b.f0 || 'black';
			button.color.text = b.t0 || 'white';
			button.f0 = b.f0 || 'black';
			button.f1 = b.f1 || 'red';
			button.h = b.h || 0.5;
			button.id = b.id || Object.keys (game.object).length;
			button.lw = b.lw || 10;
			button.over = false;
			button.t = b.t || ' ';
			button.t0 = b.t0 || 'white';
			button.t1 = b.t1 || 'black';
			button.tk = b.tk || 0.6;
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
				button.clear ();
				let context = game.canvas.context;
				let o = game.get.metric (button);

				context.fillStyle = button.color.background;
				context.fillRect (o.x, o.y, o.w, o.h);

				context.fillStyle = button.color.text;
				context.font = game.get.font.size (button.t, button.tk * o.w) + 'px ' + game.canvas.font.face;
				context.textAlign = 'center';
				context.textBaseline = 'middle';
				context.fillText (button.t, o.x + 0.5 * o.w, o.y + 0.5 * o.h);
			}

			button.mousedown = function (event)
			{
				if (button.mousein (event))
				{
					button.a ();
					button.color.background = button.f1;
					button.color.text = button.t1;
				} else {
					button.color.background = button.f0;
					button.color.text = button.t0;
				}
				button.draw ();
			}

			button.mousein = function (event)
			{
				let c = { x: event.x, y: event.y };
				let o = game.get.metric (button);
				return ((c.x > o.x) && (c.x < o.x + o.w) && (c.y > o.y) && (c.y < o.y + o.h));
			}

			button.mousemove = function (event)
			{
				if (button.mousein (event))
				{
					if (!button.over)
					{
						button.over = true;
						window.document.body.style.cursor = 'pointer';
						button.draw ();
					}
				} else {
					if (button.over)
					{
						button.over = false;
						window.document.body.style.cursor = 'default';
						button.draw ();
					}
				}
			}

			button.mouseup = function ()
			{
				button.color.background = button.f0;
				button.color.text = button.t0;
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
		font:
		{
			size: function (text, width)
			{
				let fs = 8;
				game.canvas.context.font = fs++ + 'px ' + game.canvas.font.face;
				let w = game.canvas.context.measureText (text).width;
				while (w < width)
				{
					game.canvas.context.font = fs++ + 'px ' + game.canvas.font.face;
					w = game.canvas.context.measureText (text).width;
				}
				return --fs;
			}
		},

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
		game.run ();
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

game.run = function ()
{
	game.scene.start = function ()
	{
		game.create.button ({ a: function () { console.log ('click'); }, f0: 'transparent', h: 0.1, t: 'start', t0: 'black', tk: 1, wk: 2, x: 0.5, xk: 0.5, y: 0.5, yk: 0.5 });
	}
	game.scene.next = 'start';
}
