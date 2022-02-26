/**
 * Author : Button501
 * License : MIT License
 */
"use strict";
const game_width = 540;
const game_height = 960;

const DebugMode = true;

let fileVersion = new Date().getTime();
if (!DebugMode) fileVersion = "0001";

let makeSounds = false;

let isClick = false;
let fadeTime = 0;
let fade;

let player;
let player_bullets = [];

let enemies = [];
let enemy_bullets = [];

let explosions = [];

let distance = { x: 0, y: 0 };
let isDown = false;

let score_text;
let heart = [];

let se = {};
let bgm = {};

let is_gameover = false;

class GameScene extends Phaser.Scene {
	constructor() {
		super({ key: "gameScene" });
	}

	create() {
		this.spawnTime = 0;
		this.score = 0;

		player = this.add.sprite(game_width / 2, 800, "player");
		player.timer = 0;
		player.max_hp = 3;
		player.hp = player.max_hp;
		player.cool_time = 0;
		for (let i = player.max_hp - 1; i >= 0; i--) {
			heart[i] = this.add.image(game_width - 64 * i - 32, 32, "heart");
			heart[i].scale = 2;
		}

		se.shoot_1 = this.sound.add("shoot1");
		se.shoot_4 = this.sound.add("shoot4");
		se.explosion_1 = this.sound.add("explosion1");
		se.shoot_1.volume = 0.1;
		se.shoot_4.volume = 0.2;
		se.explosion_1.volume = 0.2;

		bgm.battle1 = this.sound.add("bgm1", { loop: true });
		bgm.battle1.volume = 0.2;
		if (!makeSounds) {
			bgm.battle1.volume = 0;
			se.shoot_1.volume = 0;
			se.shoot_4.volume = 0;
			se.explosion_1.volume = 0;
		}

		bgm.battle1.play();

		this.anims.create({
			key: "explode",
			frames: this.anims.generateFrameNumbers("explosion", {
				start: 0,
				end: 4,
			}),
			frameRate: 10,
			repeat: 0,
		});
		this.anims.create({
			key: "enemy1_shoot",
			frames: this.anims.generateFrameNumbers("enemyA", {
				start: 5,
				end: 9,
			}),
			frameRate: 10,
			repeat: 0,
		});
		this.anims.create({
			key: "enemy2_shoot",
			frames: this.anims.generateFrameNumbers("enemyA", {
				start: 10,
				end: 14,
			}),
			frameRate: 10,
			repeat: 0,
		});
		this.anims.create({
			key: "enemy3_shoot",
			frames: this.anims.generateFrameNumbers("enemyA", {
				start: 15,
				end: 19,
			}),
			frameRate: 10,
			repeat: 0,
		});

		score_text = this.add.text(10, 10, "SCORE：" + this.score, {
			fontSize: "40px",
			fontFamily: "pixelFont",
		});
		score_text.updateText();
	}

	update(time, delta) {
		if (player.active) {
			player.timer += delta / 1000;
			if (player.cool_time > 0) {
				player.cool_time -= delta / 1000;
				if (player.cool_time <= 0) {
					player.cool_time = 0;
					player.alpha = 1;
				} else {
					player.alpha = Math.sin((player.cool_time * 90 * 15 * Math.PI) / 180.0);
				}
			}
			if (player.timer >= 0.1) {
				player.timer -= 0.1;
				let bullet = this.add.sprite(player.x, player.y, "player_bullet");
				bullet.dx = 0;
				bullet.dy = -10;
				bullet.angle = 180;
				player_bullets.push(bullet);
				se.shoot_1.play();
			}

			let pointer = this.input.activePointer;
			if (pointer.isDown) {
				if (!isDown) {
					isDown = true;
					distance.x = player.x - pointer.x;
					distance.y = player.y - pointer.y;
				} else {
					player.x = distance.x + pointer.x;
					player.y = distance.y + pointer.y;
				}
			} else {
				isDown = false;
			}

			if (player.x < player.width / 2) player.x = player.width / 2;
			if (player.x > game_width + player.width / 2) player.x = game_width - player.width / 2;
			if (player.y < player.height / 2) player.y = player.height / 2;
			if (player.y > game_height + player.height / 2) player.y = game_height - player.height / 2;
		} else {
			delta = 0;
			if (!is_gameover) {
				let gameOverText = this.add.text(game_width / 2, game_height / 3, "GAME OVER", {
					color: "red",
					fontSize: "100px",
					fontFamily: "pixelFont",
				});
				gameOverText.setOrigin(0.5, 0.5);

				let retryButton = this.add.text(game_width / 2, gameOverText.y + 400, "Continue", {
					color: "green",
					fontSize: "50px",
					fontFamily: "pixelFont",
				});

				retryButton.setOrigin(0.5, 0.5);
				retryButton.setInteractive();
				retryButton.on(
					"pointerdown",
					() => {
						bgm.battle1.stop();
						this.scene.start("gameScene");
					},
					this
				);

				let tweetButton = this.add.text(game_width / 2, retryButton.y + 100, "Tweet", {
					color: "royalblue",
					fontSize: "50px",
					fontFamily: "pixelFont",
				});

				tweetButton.setOrigin(0.5, 0.5);
				tweetButton.setInteractive();
				tweetButton.on(
					"pointerdown",
					() => {
						bgm.battle1.stop();
						let text =
							"https://twitter.com/intent/tweet?text=あなたのスコアは" +
							this.score +
							"点でした!%0a" +
							"sodebutton.github.io/apps/stg/" +
							"%0a%23STG";
						window.open(text, "_blank");
					},
					this
				);

				is_gameover = true;
			}
		}

		this.spawnTime += delta / 1000;
		if (this.spawnTime >= 2.0) {
			this.spawnTime -= 2.0;
			let enemy = this.add.sprite(Math.floor(Math.random() * (game_width - 32)) + 16, -32, "enemyA", 0);
			enemy.dx = 0;
			enemy.dy = 3;
			enemy.timer = 0;
			enemy.bulletAngle = [];
			enemy.bulletAngle[0] = 0;
			enemies.push(enemy);
		}

		for (let enemy of enemies) {
			if (enemy.active) {
				enemy.x += enemy.dx * delta * 0.1;
				enemy.y += enemy.dy * delta * 0.1;

				let rad = Math.atan2(enemy.y - player.y, enemy.x - player.x);
				let deg = (rad * 180.0) / Math.PI;
				enemy.angle = deg - 90;
				enemy.bulletAngle[0] = deg + 60;
				enemy.timer += delta / 1000;
				if (enemy.timer >= 1.0) {
					enemy.timer -= 1.0;
					enemy.anims.play("enemy1_shoot", true);

					for (let i = 0; i < 360; i += 120) {
						let bullet = this.add.sprite(enemy.x, enemy.y, "enemy_bullet");
						bullet.dx = 6 * Math.cos(((enemy.bulletAngle[0] + i) * Math.PI) / 180.0);
						bullet.dy = 6 * Math.sin(((enemy.bulletAngle[0] + i) * Math.PI) / 180.0);
						bullet.angle = enemy.bulletAngle[0] + i - 90;
						enemy_bullets.push(bullet);
						se.shoot_4.play();
					}
				}
				if (enemy.y > game_height + enemy.height / 2) enemy.destroy();

				if (player.active && player.cool_time <= 0) {
					if (
						enemy.x - enemy.width / 2 < player.x + player.width / 2 &&
						enemy.x + enemy.width / 2 > player.x - player.width / 2 &&
						enemy.y - enemy.height / 2 < player.y + player.height / 2 &&
						enemy.y + enemy.height / 2 > player.y - player.height / 2
					) {
						enemy.destroy();
						player.hp--;
						heart[player.hp].destroy();
						if (player.hp <= 0) player.destroy();
						player.cool_time = 1.0;
						se.explosion_1.play();

						let effect = this.add.sprite(enemy.x, enemy.y, "explosion");
						effect.anims.play("explode", true);
						effect.endTime = 0.6;
						explosions.push(effect);
					}
				}
			} else {
				enemies.some((v, i) => {
					if (v === enemy) enemies.splice(i, 1);
				});
			}
		}

		for (let bullet of player_bullets) {
			if (bullet.active) {
				bullet.x += bullet.dx * delta * 0.1;
				bullet.y += bullet.dy * delta * 0.1;

				if (
					bullet.y > game_height + bullet.height / 2 ||
					bullet.y < 0 - bullet.height / 2 ||
					bullet.x > game_width + bullet.width / 2 ||
					bullet.x < 0 - bullet.width / 2
				)
					bullet.destroy();
			} else {
				player_bullets.some((v, i) => {
					if (v === bullet) player_bullets.splice(i, 1);
				});
			}

			for (let enemy of enemies) {
				if (enemy.active) {
					if (
						bullet.x - bullet.width / 2 < enemy.x + enemy.width / 2 &&
						bullet.x + bullet.width / 2 > enemy.x - enemy.width / 2 &&
						bullet.y - bullet.height / 2 < enemy.y + enemy.height / 2 &&
						bullet.y + bullet.height / 2 > enemy.y - enemy.height / 2
					) {
						bullet.destroy();
						enemy.destroy();
						this.score += 100;
						score_text.text = "SCORE：" + this.score;
						se.explosion_1.play();
						let effect = this.add.sprite(enemy.x, enemy.y, "explosion");
						effect.anims.play("explode", true);
						effect.endTime = 0.6;
						explosions.push(effect);
						break;
					}
				}
			}
		}

		for (let bullet of enemy_bullets) {
			if (bullet.active) {
				bullet.x += bullet.dx * delta * 0.1;
				bullet.y += bullet.dy * delta * 0.1;

				if (
					bullet.y > game_height + bullet.height / 2 ||
					bullet.y < 0 - bullet.height / 2 ||
					bullet.x > game_width + bullet.width / 2 ||
					bullet.x < 0 - bullet.width / 2
				)
					bullet.destroy();

				if (player.active && player.cool_time <= 0) {
					if (
						bullet.x - bullet.width / 2 < player.x + player.width / 2 &&
						bullet.x + bullet.width / 2 > player.x - player.width / 2 &&
						bullet.y - bullet.height / 2 < player.y + player.height / 2 &&
						bullet.y + bullet.height / 2 > player.y - player.height / 2
					) {
						bullet.destroy();
						player.hp--;
						heart[player.hp].destroy();
						if (player.hp <= 0) player.destroy();
						player.cool_time = 1.0;
						se.explosion_1.play();
						let effect = this.add.sprite(player.x, player.y, "explosion");
						effect.anims.play("explode", true);
						effect.endTime = 0.6;
						explosions.push(effect);
					}
				}
			} else {
				enemy_bullets.some((v, i) => {
					if (v === bullet) enemy_bullets.splice(i, 1);
				});
			}
		}

		for (let explosion of explosions) {
			if (explosion.active) {
				explosion.endTime -= delta / 1000;
				if (explosion.endTime <= 0) {
					explosion.destroy();
				}
			} else {
				explosions.some((v, i) => {
					if (v === explosion) explosions.splice(i, 1);
				});
			}
		}
	}
}

const config = {
	type: Phaser.AUTO,
	parent: "canvas",
	width: 540,
	height: 960,
	scale: {
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
	},
	pixelArt: true,
	physics: {
		default: "arcade",
		arcade: {
			gravity: { y: 0 },
		},
	},
	scene: [LogoScene, AttentionScene, LoadScene, StartScene, GameScene],
};

const game = new Phaser.Game(config);
