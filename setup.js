const openscreen = 1;
const gameplay = 2;
const closescreen = 3;
var state = openscreen;
const canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
const colors = [ 'crimson', 'violet', 'cornflowerblue', 'darkseagreen' ];

var xh = 250;
var yh = 650;
var radius = 10;
var colorb = colors[Math.floor(Math.random() * colors.length)];
var xb = 0;
var yb = 0;
var yw = 650;
var xw = 400;
var w = 800;
var h = 780;
var speed = 0;
var g = 0;
var createobs = true;
rotspeed = 0.03;
var calc = {
	xax: function(x) {
		return x + xw;
	},
	yax: function(y) {
		return y + yw;
	}
};
var click=new Audio();
click.src="click.wav"
var bg = new Audio();
bg.src = 'bg.mp3';
bg.addEventListener(
	'ended',
	function() {
		this.currentTime = 0;
		this.play();
	},
	false
);
var move =new Audio();
move.src="move.wav"
if (!window.localStorage.hasOwnProperty('sco') || window.localStorage.getItem('sco') == undefined) {
	console.log('shh');
	window.localStorage.setItem('sco', 0);
}
var curr = 0;
var pause = false;
var change = [];
var on = false;
var off = false;
var score = 0;
var obs = [];
var img = new Image();
img.src = 'star.png';
var body = document.querySelector('body');
window.addEventListener('keydown', function(e) {
	var key = e.keyCode;
	if (key === 32) {
		console.log('j');
		if (!pause) {
			if (on === true) {
				pause = true;
				bg.pause()
			}
		} else {
			if (on === true) {
				pause = false;
				g = 0.05;
				bg.play()
			}
		}
	}
});

class Obstacle {
	constructor(xax, yax) {
		this.yo = 0;
		this.rotate = 0;
		this.next = 0;
		this.star = false;
		this.xax = xax;
		this.yax = yax * -1;
		this.xo = 250;
		this.next = yax + 150;
	}
	draw() {
		var radian = 360 / 40;
		var rotate = 0;
		var color = '';
		for (var i = 0; i < 40; i++) {
			var xdis = 80 * Math.cos(this.rotate * (Math.PI / 180)) + this.xo;
			var ydis = 80 * Math.sin(this.rotate * (Math.PI / 180)) + calc.yax(this.yax);
			if (i < 10) {
				color = 'cornflowerblue';
			} else if (i >= 10 && i < 20) {
				color = 'violet';
			} else if (i >= 20 && i < 30) {
				color = 'darkseagreen';
			} else {
				color = 'crimson';
			}
			if (xdis <= xh && xdis + 10 >= xh && ydis <= yh && ydis + 10 >= yh) {
				if (colorb !== color) {
					state = openscreen;
					location.reload();
					if (curr > window.localStorage.getItem('sco')) {
						window.localStorage.setItem('sco', curr);
					}
				}
			}
			if (xdis <= xh + radius && xdis + 10 >= xh + radius && ydis <= yh + radius && ydis + 10 >= yh + radius) {
				if (colorb !== color) {
					state = openscreen;
					location.reload();
					if (curr > window.localStorage.getItem('sco')) {
						window.localStorage.setItem('sco', curr);
					}
				}
			}
			ctx.fillStyle = color;
			ctx.strokeStyle = color;
			ctx.beginPath();
			ctx.arc(xdis, ydis, 10, 0, Math.PI * 2, false);
			ctx.stroke();
			ctx.fill();
			this.rotate += radian + rotspeed;
		}
		if (this.star == false) {
			ctx.save();
			ctx.translate(xh, calc.yax(this.yax) + 7);
			ctx.drawImage(img, 0, 0, 570, 430, -35, -28, 60, 40);
			ctx.restore();
			if (calc.yax(this.yax) + 10 >= yh) {
				this.star = true;
				curr++;
				click.play()
				if (curr >= 3 && curr <= 7) {
					rotspeed = 0.05;
				} else if (curr > 7 && curr <= 11) {
					rotspeed = 0.08;
				} else if (curr > 11 ) {
					rotspeed = 0.1;
				}

				colorb = colors[Math.floor(Math.random() * colors.length)];
			}
		}
	}
	remove(i) {
		if (calc.yax(this.yax) - 90 > h) {
			obs.splice(i, 1);
		}
	}
}
obs.push(new Obstacle(0, 350));
obs.push(new Obstacle(0, 700));

class Setup {
	constructor() {
		this.eventList();

		this.createobs();
	}

	draw() {
		ctx.fillStyle = 'black';
		ctx.fillRect(xb, yb, w, h);
		ctx.save();
		ctx.fillStyle = colorb;
		ctx.strokeStyle = colorb;
		ctx.beginPath();
		ctx.arc(xh, yh, radius, 0, Math.PI * 2, false);
		ctx.stroke();
		ctx.fill();
		ctx.restore();

		if (yh > 400) {
			yh += speed - g;
		} else {
			if (speed - g < 0) {
				yw -= speed - g;
			} else {
				yh += speed - g;
			}
		}
		if (on === true) {
			g -= 0.2;
		}

		if (yh + radius >= h && off === false) {
			ctx.clearRect(0, 0, w, h);
			state = openscreen;
			if (curr > window.localStorage.getItem('sco')) {
				window.localStorage.setItem('sco', curr);
			}
			xh = 250;
			yh = 650;
			radius = 10;
			colorb = colors[Math.floor(Math.random() * colors.length)];
			off = true;
			on = false;
			location.reload();
		}
	}
	obsdandc() {
		for (var i = 0; i < obs.length; i++) {
			obs[i].draw(i);
		}
		for (var i = 0; i < obs.length; i++) {
			obs[i].remove(i);
		}
	}
	createobs() {
		if (createobs == true) {
			obs.push(new Obstacle(0, obs[obs.length - 2].next + 550));
		}
	}
	eventList() {
		var game = this;
		canvas.addEventListener('click', function() {
			switch (state) {
				case openscreen:
					state = gameplay;
					off = false;
					bg.play();
					break;
				case gameplay:
					g = 0;
					speed = -4;
					move.play()
					on = true;
					off = false;
					break;
			}
		});
	}

	start() {
		var game = this;

		window.requestAnimationFrame(function() {
			game.gameLoop();
		});
	}
	gameLoop() {
		var game = this;
		switch (state) {
			case openscreen:
				game.drawOpenScreen();
				break;
			case gameplay:
				game.drawGamePlay();
				break;
		}
		window.requestAnimationFrame(function() {
			game.gameLoop();
		});
	}
	drawOpenScreen() {
		ctx.fillStyle = '#047bca';
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = 'crimson';
		ctx.font = '50px Fredoka One';
		ctx.fillText('The Last Draw', canvas.width / 2 - 180, 100);
		ctx.fillStyle = 'white';
		ctx.font = '20px Fredoka One';
		ctx.fillText('Instructions:', canvas.width / 2 - 200, 190);
		ctx.fillText('1.Right click to move the ball upwards', canvas.width / 2 - 200, 230);
		ctx.fillText('2.Collect the stars to gain points', canvas.width / 2 - 200, 270);
		ctx.fillText('3.Collecting stars will change the ', canvas.width / 2 - 200, 310);
		ctx.fillText('color of the ball ', canvas.width / 2 - 200, 350);
		ctx.fillText('4.Press Spacebar to pause the game', canvas.width / 2 - 200, 390);
		ctx.fillText('5.The speed of the obstacles increases', canvas.width / 2 - 200, 430);
		ctx.fillText('when you collect stars', canvas.width / 2 - 200, 470);
		ctx.fillStyle = 'black';
		ctx.font = '40px Fredoka One';
		ctx.fillText('Click to Start', canvas.width / 2 - 130, 560);
		ctx.font = '50px Fredoka One';
		ctx.fillText('Current Best:' + window.localStorage.getItem('sco'), canvas.width / 2 - 170, 650);
	}

	drawGamePlay() {
		if (!pause) {
			ctx.clearRect(0, 0, w, h);
			if (off === false) {
				this.draw();
				ctx.font = '20px Fredoka One';
				ctx.fillStyle = 'white';
				ctx.fillText('Score: ' + curr, 30, 40);
			}

			this.obsdandc();
			if (calc.yax(obs[obs.length - 1].next * -1) >= 0) {
				this.createobs();
			}
		}
	}
}
window.onload = function() {
	var game = new Setup();
	game.start();
};

