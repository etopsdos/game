game =
{
	canvas:
	{
		load: function ()
		{
			let canvas = window.document.createElement ('canvas');
			canvas.context = canvas.getContext ('2d');
			canvas.font = { face: 'Monospace', size: 14 };
			canvas.z = 0;

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
			button.id = game.get.id;
			button.lw = b.lw || 10;
			button.over = false;
			button.t = b.t || ' ';
			button.t0 = b.t0 || 'black';
			button.t1 = b.t1 || 'black';
			button.tk = b.tk || 1;
			button.w = b.w || 0.5;
			button.x = b.x || 0;
			button.y = b.y || 0;
			button.z = b.z || 0;

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
				let draw = {};
				draw.id = 'button' + button.id;
				draw.z = button.z;

				draw.draw = function ()
				{
					let context = game.canvas.context;
						//context.globalCompositeOperation = 'source-over';
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

				button.clear ();
				game.draw = draw;
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
			player.color = {};
			player.color.background = p.f0 || 'transparent';
			player.h = p.h || 0.1;
			player.i = p.i || game.image.tester;
			player.id = 'player';
			player.s = 0.05;
			player.sa = 0.01;
			player.sd = 0.1;
			player.w = p.w || 0.1;
			player.x = p.x || game.random ();
			player.y = p.y || game.random ();
			player.z = p.z || 0;

			player.clear = function ()
			{
				let o = game.get.metric (player);
				game.canvas.context.clearRect (o.x, o.y, o.w, o.h);
			}

			player.draw = function ()
			{
				let draw = {};
				draw.id = 'player' + player.id;
				draw.z = player.z;

				draw.draw = function ()
				{
					let context = game.canvas.context;
						context.imageSmoothingEnabled = false;
					let o = game.get.metric (player);

					context.fillStyle = player.color.background;
					context.fillRect (o.x, o.y, o.w, o.h);

					if (player.i)
					{
						context.drawImage (player.i, o.x, o.y, o.w, o.h);
					}

					/*
					context.fillStyle = button.color.text;
					context.font = game.get.font.size (button.t, button.tk * o.w) + 'px ' + game.canvas.font.face;
					context.textAlign = 'center';
					context.textBaseline = 'middle';
					context.fillText (button.t, o.x + 0.5 * o.w, o.y + 0.5 * o.h);
					*/
				}

				player.clear ();
				game.draw = draw;
			}

			player.keydown = function (event)
			{
				player.s = (player.s < player.sd * 2) ? player.s + player.sa : player.s;
				switch (event.keyCode)
				{
					case 37: player.move.left (); player.i = game.image.girl2; break;
					case 38: player.move.top (); break;
					case 39: player.move.right (); player.i = game.image.tester; break;
					case 40: player.move.down (); break;
				}
				player.move.behind ();
			}

			player.keyup = function (event)
			{
				player.s = player.sd;
			}

			player.move =
			{
				behind: function ()
				{
					for (let id in game.object)
					{
						let o = game.object[id];
						if (o.type == 'decor')
						{
							if ((Math.abs (o.y - player.y) < 0.5 * player.h) && (Math.abs (o.x - player.x) < 0.5 * player.w))
							{
								o.clear ();
								o.z = (o.y < player.y) ? 0 : 2;
								o.draw ();
							}
						}
					}
				},

				down: function ()
				{
					player.clear ();
					player.y += player.s * player.h;
					player.draw ();
				},

				left: function ()
				{
					player.clear ();
					player.x -= player.s * player.w;
					player.draw ();
				},

				right: function ()
				{
					player.clear ();
					player.x += player.s * player.w;
					player.draw ();
				},

				top: function ()
				{
					player.clear ();
					player.y -= player.s * player.h;
					player.draw ();
				}
			}

			player.resize = function ()
			{
				player.draw ();
			}

			player.draw ();
			game.object[player.id] = player;
		},

		set unit (u)
		{
			let unit = u || {};
			unit.color = {};
			unit.color.background = u.f0 || 'transparent';
			unit.h = u.h || 0.1;
			unit.i = u.i || game.image.tester;
			unit.id = game.get.id;
			unit.name = u.name || 'unite';
			unit.type = u.type || 'decor';
			unit.w = u.w || 0.1;
			unit.x = u.x || game.random (1);
			unit.xk = u.xk;
			unit.y = u.y || game.random (1);
			unit.yk = u.yk;
			unit.z = u.z || 0;

			unit.clear = function ()
			{
				if (game.draws[unit.z]) if (game.draws[unit.z]['unit' + unit.id]) delete game.draws[unit.z]['unit' + unit.id];
				let o = game.get.metric (unit);
				game.canvas.context.clearRect (o.x, o.y, o.w, o.h);
			}

			unit.destroy = function ()
			{
				unit.clear ();
			}

			unit.draw = function ()
			{
				let draw = {};
				draw.id = 'unit' + unit.id;
				draw.z = unit.z;

				draw.draw = function ()
				{
					let context = game.canvas.context;
						context.imageSmoothingEnabled = false;
					let o = game.get.metric (unit);

					context.fillStyle = unit.color.background;
					context.fillRect (o.x, o.y, o.w, o.h);

					if (unit.i)
					{
						context.drawImage (unit.i, o.x, o.y, o.w, o.h);
					}
				}

				unit.clear ();
				game.draw = draw;
			}

			unit.resize = function ()
			{
				unit.draw ();
			}

			unit.draw ();
			game.object[unit.id] = unit;
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

	set draw (o)
	{
		if (game.draws[o.z] == undefined)
		{
			game.draws[o.z] = {};
		}

		game.draws[o.z][o.id] = o;

		for (let z in game.draws)
		{
			for (let id in game.draws[z])
			{
				game.draws[z][id].draw ();
			}
		}
	},

	draws: {},

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

		get id ()
		{
			return game.id++;
		},

		metric: function (o)
		{
			let object = {};
			object.h = (o.hk) ? o.hk * o.w * game.canvas.width >> 0 : o.h * game.canvas.height >> 0;
			object.w = (o.wk) ? o.wk * o.h * game.canvas.height >> 0 : o.w * game.canvas.width >> 0;
			object.x = (o.xk) ? o.x * game.canvas.width - o.xk * object.w >> 0 : o.x * game.canvas.width >> 0;
			object.y = (o.yk) ? o.y * game.canvas.height - o.yk * object.h >> 0 : o.y * game.canvas.height >> 0;
			return object;
		}
	},

	id: 0,

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
						r = Math.floor((Math.random () * (b - a + 1))) + a;
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
			window.onkeydown = game.update;
			window.onkeyup = game.update;
			window.onload = game.update;
			window.onmousedown = game.update;
			window.onmousemove = game.update;
			window.onmouseup = game.update;
			window.onresize = game.update;
			game.window.ontick = game.update;
		},

		set ontick (f)
		{
			game.window.clock = window.setInterval
			(
				function ()
				{
					f ({ tick: game.window.tick, time: game.window.time, type: 'tick' });
					game.window.time += game.window.tick;
				},
				game.window.tick * 100
			)
		},

		tick: 1,
		time: 0
	},

	wipe: function ()
	{
		delete game.object;
		game.draws = {};
		game.object = {};
		game.canvas.clear ();
		window.document.body.style.cursor = 'default';
	}
}

window.onload = game.load;

game.set.load.image =
{
	girl2: 'data/girl2.png',
	back: 'data/back.png',
	tester: 'data/girl.png',
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
				game.play = { src: 'data/pow.ogg' };
				game.scene.next = 'start';
			},
			f0: 'transparent',
			h: 0.04,
			i: game.image.back,
			t0: 'black',
			tk: 1,
			wk: 1.25,
			x: 0,
			y: 0,
			z: 2
		}

		game.create.player =
		{
			h: 0.15,
			i: game.image.tester,
			wk: 0.3,
			x: 0.5,
			y: 0.5,
			z: 1
		}

		for (let i = 10; i--;)
		game.create.unit =
		{
			h: 0.15,
			i: game.image.tree,
			type: 'decor',
			wk: 0.5
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
