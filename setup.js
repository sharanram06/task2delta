const openscreen = 1,
	gameplay = 2,
	closescreen = 3;
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
var calc = {
	xax: function(x) {
		return x + xw;
	},
	yax: function(y) {
		return y + yw;
	}
};
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
			}
		} else {
			if (on === true) {
				pause = false;
				g = 0.05;
			}
		}
	}
});
function getRndInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

class Obstacle {
	constructor(x_ax, y_ax) {
		this.xpos = 230;
		this.ypos = 0;

		this.rot = 0;
		this.w = 20;
		this.h = 2;
		this.speed = 0.005;

		this.switched = false;
		this.x_axis = x_ax;
		this.y_axis = y_ax * -1;

		this.next = y_ax + 220;
	}

	draw() {
		var rad = 360 / 400;
		var color = 0;
		for (var i = 0; i < 400; i++) {
		this.ypos = calc.yax(this.y_axis);
		var xx = 40 * Math.cos((40-this.rot) * (Math.PI / 180)) + this.xpos;
		var yy = 40 * Math.sin((40-this.rot) * (Math.PI / 180)) + this.ypos
		var rot = Math.atan2(yy - this.ypos, xx - this.xpos);
		var tx = xh + radius  - xx+1.5;
		var ty = yh + radius - yy -85	;
		var d = Math.sqrt(tx * tx + ty * ty);

			if (i < 100) {
				color = 'violet';
			} else if (i >= 100 && i < 200) {
				color = 'cornflowerblue';
			} else if (i >= 200 && i < 300) {
				color = 'darkseagreen';
			} else {
				color = 'crimson';
			}


			if (d<=1) {
			    if (colorb !== color ) {
					console.log(color)
					state=openscreen;
				}
			}
			ctx.save();
			ctx.translate(xx + this.w, yy);
			ctx.rotate(rot);
			ctx.fillStyle = color;
			ctx.fillRect(this.w + 40, 0, this.w, this.h);
			ctx.restore();

			this.rot += rad + this.speed;
		}
		if (this.switched == false) {
			ctx.save();
			ctx.translate(xh, calc.yax(this.y_axis));
			ctx.drawImage(img, 0, 0, 570, 430, -35, -20, 60, 40);
			ctx.restore();
			if (calc.yax(this.y_axis + 15) >= yh) {
				this.switched = true;
				colorb = colors[Math.floor(Math.random() * colors.length)];
				score++;
			}
		}
	}
	check(i) {
		if (this.ypos - 160 > h) {
			obs.splice(i, 1);
		}
	}
}

obs.push(new Obstacle(0, 350));
obs.push(new Obstacle(0, 750));

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
		ctx.lineWidth = 0;
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
			state = openscreen;
			xh = 250;
			yh = 650;
			radius = 10;
			colorb = colors[Math.floor(Math.random() * colors.length)];
			off=true
			on=false
		}
	}
	obsdandc() {
		//we loop it if ther i did not meet the condition and we draw the obstacles
		for (var i = 0; i < obs.length; i++) {
			obs[i].draw(i);
		}
		for (var i = 0; i < obs.length; i++) {
			obs[i].check(i);
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
					break;
				case gameplay:
					g = 0;
					speed = -4;
					on = true;
					off=false
					break;
				case closescreen:
					console.log(state);
					var xh = 250;
					var yh = 650;
					state = openscreen;

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
			case closescreen:
				game.drawCloseScreen();
				break;
		}
		window.requestAnimationFrame(function() {
			game.gameLoop();
		});
	}
	drawOpenScreen() {
		// ctx.clearRect(0, 0, canvas.width, canvas.height);
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
		ctx.fillStyle = 'black';
		ctx.font = '40px Fredoka One';
		ctx.fillText('Click to Start', canvas.width / 2 - 130, 500);
		ctx.font = '50px Fredoka One';
		ctx.fillText('Current Best:' + curr, canvas.width / 2 - 170, 600);
	}

	drawGamePlay() {
		if (!pause) {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			if (off === false) {
				this.draw();
			}

			this.obsdandc();
			// player_death_paticle_draw_();
			if (calc.yax(obs[obs.length - 1].next * -1) >= 0) {
				this.createobs();
			}
		}
	}
	drawCloseScreen() {
		// ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = 'blue';
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = 'white';
		ctx.font = '40px Fredoka One';
		ctx.fillText('Gameover', canvas.width / 2 - 130, canvas.height / 2);
	}
}
window.onload = function() {
	var game = new Setup();
	game.start();
};
