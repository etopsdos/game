game =
{
	animate:
	{
		set play (o)
		{
			let delay = o.a.time / Object.keys (o.a.image).length;
			let i = game.get.metric (o);
			let step = 0;
			let steps = Object.keys (o.a.image).length;
			window.setTimeout
			(
				function ()
				{
					if (step < steps)
					{
						game.canvas.context.drawImage (o.a.image[step++], i.x, i.y, i.w, i.h);
						window.setTimeout (arguments.callee, delay);
					} else {
						if (o.clear) { game.canvas.context.clearRect (i.x, i.y, i.w, i.h); }
					}
				},
				0
			);
		}
	},

	canvas:
	{
		load: function ()
		{
			let canvas = window.document.createElement ('canvas');
			canvas.context = canvas.getContext ('2d');
			canvas.font = { face: 'Monospace', size: 14 };

			canvas.clear = function ()
			{
				canvas.context.clearRect (0, 0, canvas.width, canvas.height);
			}

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
		set button (b)
		{
			let button = b || {};
			button.a = b.a || function () {};
			button.color = {};
			button.color.background = b.f0 || 'white';
			button.color.text = b.t0 || 'black';
			button.f0 = b.f0 || 'white';
			button.f1 = b.f1 || 'white';
			button.h = b.h || 0.5;
			button.i = b.i || undefined;
			button.id = b.id || Object.keys (game.object).length;
			button.lw = b.lw || 10;
			button.over = false;
			button.t = b.t || ' ';
			button.t0 = b.t0 || 'black';
			button.t1 = b.t1 || 'black';
			button.tk = b.tk || 1;
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
					context.imageSmoothingEnabled = false;
				let o = game.get.metric (button);

				context.fillStyle = button.color.background;
				context.fillRect (o.x, o.y, o.w, o.h);

				if (button.i)
				{
					context.drawImage (button.i, o.x, o.y, o.w, o.h);
				}

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
					button.color.background = button.f1;
					button.color.text = button.t1;
					button.draw ();
					button.a ();
				} else {
					button.color.background = button.f0;
					button.color.text = button.t0;
					button.draw ();
				}
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

			button.draw ();
			game.object[button.id] = button;
		},

		set player (p)
		{
			let player = p || {};
			player.id = p.id || Object.keys (game.object).length;

			game.object[player.id] = player;
		}
	},

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

	image: {},

	load: function ()
	{
		game.window.load ();
		game.canvas.load ();
		game.run ();
	},

	object: {},

	set play (o)
	{
		let audio = new Audio (o.src);
			audio.volume = o.volume || 1;
			audio.play ();
	},

	random: function (a, b, c)
	{
		let r;

		if (a)
		{
			if (b)
			{
				if (b == true)
				{
					r = Math.random () * a >> 0;
				} else {
					r = Math.random () * (b - a) + a;
					if (c == true)
					{
						r = (Math.random () * (b - a + 1)) >> 0 + a;
					}
				}
			} else {
				r = Math.random () * a;
			}
		}

		return r;
	},

	scene:
	{
		set next (name)
		{
			game.wipe ();
			game.scene[name] ();
		}
	},

	set:
	{
		load:
		{
			set animate (o)
			{
				for (let id in o)
				{
					let animate = o[id];
					for (let id in animate.image)
					{
						let image = new Image ();
							image.src = animate.image[id];
						delete animate.image[id];
						animate.image[id] = image;
					}
					game.animate[id] = animate;
				}
			},

			set image (o)
			{
				for (let id in o)
				{
					let image = new Image ();
						image.src = o[id];
					game.image[id] = image;
				}
			}
		}
	},

	update: function (event)
	{
		game.canvas.update (event);
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
	},

	wipe: function ()
	{
		delete game.object;
		game.object = {};
		game.canvas.clear ();
	}
}

window.onload = game.load;

game.set.load.animate =
{
	tester:
	{
		image: { 0: 'data/tester.png', 1: 'data/tester_test.png' },
		loop: true,
		time: 1000
	}
}

game.set.load.image =
{
	tester: 'data/tester.png',
	tree: 'data/tree.png'
}

game.run = function ()
{
	game.scene.begin = function ()
	{
		game.create.button =
		{
			a: function ()
			{
				game.animate.play = { a: game.animate.tester, clear: true, h: 0.1, wk: 0.5, x: 0.1, y: 0.5 };
				game.play = { src: 'data/pow.ogg' };
				game.scene.next = 'start';
			},
			f0: 'transparent',
			h: 0.1,
			i: game.image.tree,
			t0: 'black',
			tk: 1,
			wk: 0.5,
			x: 0.5,
			xk:
			0.5,
			y: 0.5,
			yk: 0.5
		}
	}

	game.scene.start = function ()
	{
		game.create.button =
		{
			a: function ()
			{
				game.play = { src: 'data/pow.ogg' };
				game.scene.next = 'begin';
			},
			f0: 'transparent',
			h: 0.1,
			t: 'start',
			t0: 'black',
			tk: 1,
			wk: 2,
			x: 0.5,
			xk: 0.5,
			y: 0.5,
			yk: 0.5
		}
	}
	game.scene.next = 'start';
}
