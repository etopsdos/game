var window = window;

var game =
{
	create:
	{
		button: function (o)
		{
			var button = o || {};
					button.id = o.id || game.id++;
					button.text = o.text || '';
					button.x = o.x || game.random ();
					button.y = o.y || game.random ();

					button.draw = function ()
					{

					}

					button.show = function ()
					{
						button.draw ();
					}

					button.set =
					{
						set x (x)
						{
							button.x = x;
							button.show ();
						},

						set y (y)
						{
							button.y = y;
							button.show ();
						}
					}

			return button;
		},

		canvas: function (o)
		{
			var o = o || {};
			var canvas = window.document.createElement ('canvas');
					canvas.background = o.background || 'transparent';
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
							canvas.background = b;
							canvas.style.background = b;
						}
					}

					game.event.manager = canvas;

					canvas.set.background = canvas.background;
					canvas.resize ();
					window.document.body.appendChild (canvas);
			return canvas;
		}
	},

	event:
	{
		list: ['click', 'mousedown', 'mousemove', 'mouseup', 'resize'],

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
},

id: 0,

random: function (a, b, c)
{
	var random = Math.random ();
	return random;
},

window.onload = function ()
{
	game.canvas = game.create.canvas ({ background: 'gray' });
}
