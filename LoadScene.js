class LoadScene extends Phaser.Scene {
	constructor() {
		super({ key: "loadScene" });
	}

	preload() {
		this.progressBar = this.add.graphics();
		this.progressBox = this.add.graphics();
		this.progressBox.fillStyle(0x222222, 0.8);
		this.progressBox.fillRect(game_width / 2 - 250, game_height / 2 - 30, 500, 60);

		this.text = this.add.text(game_width / 2, (game_height / 5) * 3, "load", {
			fontSize: "40px",
			fontFamily: "pixelFont",
		});
		this.text.setOrigin(0.5, 0.5);

		//ロードが進行したときの処理
		this.load.on("progress", function (value) {
			this.progressBar.clear();
			this.progressBar.fillStyle(0xffffff, 1);
			this.progressBar.fillRect(game.scale.width / 2 - 250, game.scale.height / 2 - 30, 500 * value, 60);
		});

		//ファイルのロードに入ったときの処理
		this.load.on("fileprogress", function (file) {
			this.text.text = file.key;
		});

		//すべてのロードが完了したときの処理
		this.load.on("complete", function () {
			this.text.text = "complete";
		});

		this.load.setPath("./Resources/");

		this.load.image("player", "./Sprites/player.png?v=" + fileVersion);
		this.load.image("enemy", "./Sprites/enemy.png?v=" + fileVersion);
		this.load.image("heart", "./Sprites/heart.png?v=" + fileVersion);

		this.load.image("volume_icon01", "./Sprites/volume_icon01.png?v=" + fileVersion);
		this.load.image("volume_icon02", "./Sprites/volume_icon02.png?v=" + fileVersion);
		this.load.image("tap_area", "./Sprites/tap_area.png?v=" + fileVersion);
		this.load.image("share_icon", "./Sprites/share_icon.png?v=" + fileVersion);

		this.load.spritesheet("enemyA", "./Sprites/enemiesA.png?v=" + fileVersion, {
			frameWidth: 32,
			frameHeight: 32,
			startFrame: 0,
			endFrame: 19,
		});
		this.load.spritesheet("player_bullet", "./Sprites/missile1.png?v=" + fileVersion, {
			frameWidth: 10,
			frameHeight: 16,
		});
		this.load.spritesheet("enemy_bullet", "./Sprites/missile2.png?v=" + fileVersion, {
			frameWidth: 10,
			frameHeight: 16,
		});
		this.load.spritesheet("explosion", "./Sprites/explosion.png?v=" + fileVersion, {
			frameWidth: 32,
			frameHeight: 32,
		});

		this.load.audio("shoot1", "./Audios/Shoot1.wav");
		this.load.audio("shoot4", "./Audios/Shoot4.wav");
		this.load.audio("explosion1", "./Audios/Explosion1.wav");
		this.load.audio("bgm1", "./Audios/bgm1.ogg");
	}

	create() {
		this.scene.start("startScene");
	}
}
