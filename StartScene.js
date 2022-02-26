class StartScene extends Phaser.Scene {
	constructor() {
		super({ key: "startScene" });
	}

	create() {
		this.title = this.add.text(game_width / 2, game_height / 4, "ShootingGame", {
			fontSize: "80px",
			fontFamily: "pixelFont",
		});
		this.title.setOrigin(0.5, 0.5);

		this.tapText = this.add.text(game_width / 2, game_height * 0.7, "Tap to Start", {
			fontSize: "30px",
			fontFamily: "pixelFont",
		});
		this.tapText.setOrigin(0.5, 0.5);

		this.versionText = this.add.text(10, game_height - 10, "Version：0.0.1", {
			fontSize: "30px",
			fontFamily: "pixelFont",
		});
		this.versionText.setOrigin(0, 1);

		this.copyrightText = this.add.text(game_width - 10, game_height - 10, "©2021 Button501", {
			fontSize: "30px",
			fontFamily: "pixelFont",
		});
		this.copyrightText.setOrigin(1, 1);

		this.tapArea = this.add.image(0, 0, "tap_area");
		this.tapArea.setSize(game_width, game_height);
		this.tapArea.setInteractive();

		this.tapArea.on(
			"pointerdown",
			function () {
				this.fade = this.add.graphics();
				this.fade.fillStyle(0x000000, 1).fillRect(0, 0, game_width, game_height);
				this.fade.alpha = 0;
				this.tweens.add(
					{
						targets: this.fade,
						alpha: 1,
						duration: 1000,
						ease: "Power2",
					},
					this
				);
				this.isClick = true;
			},
			this
		);

		let volumeIcon = this.add.image(game_width - 40, 40, "volume_icon02");
		volumeIcon.setOrigin(1, 0);
		volumeIcon.setScale(2, 2);
		volumeIcon.setInteractive();

		volumeIcon.on(
			"pointerdown",
			function () {
				if (makeSounds) {
					volumeIcon.setTexture("volume_icon02");
					makeSounds = false;
				} else {
					volumeIcon.setTexture("volume_icon01");
					makeSounds = true;
				}
			},
			this
		);

		let shareIcon = this.add.image(game_width - 100, 40, "share_icon");
		shareIcon.setOrigin(1, 0);
		shareIcon.setScale(2, 2);
		shareIcon.setInteractive();

		shareIcon.on("pointerdown", async function () {
			if (navigator.share !== undefined) {
				let shareData = {
					title: "ShootingGame",
					text: "Phaser3で制作したシューティングゲーム",
					url: "https://sodebutton.github.io/apps/stg/",
				};
				await navigator.share(shareData);
			} else {
				window.alert("ブラウザが対応していません。");
			}
		});
	}

	update(time, delta) {
		this.title.updateText();
		this.tapText.updateText();
		this.versionText.updateText();
		this.copyrightText.updateText();

		if (this.isClick) {
			this.fadeTime += delta / 1000;
			if (this.fadeTime >= 1.0) {
				this.scene.start("gameScene");
			}
		}
	}
}
