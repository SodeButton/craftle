class AttentionScene extends Phaser.Scene {
	constructor() {
		super({ key: "attentionScene" });
	}

	preload() {}

	create() {
		this.attentionText = this.add.text(game_width / 2, (game_height / 5) * 2, "音が出ます\nThis game makes sounds", {
			fontSize: "40px",
			fontFamily: "pixelFont",
		});
		this.attentionText.setOrigin(0.5, 0.5);
		this.attentionText.alpha = 0;
		this.tweens.add({
			targets: this.attentionText,
			alpha: 1,
			duration: 1000,
			ease: "Power2",
		});
		this.isClick = true;
		this.fadeTime = 0;
	}

	update(time, delta) {
		this.fadeTime += delta / 1000;
		if (this.isClick) {
			if (this.fadeTime >= 2) {
				this.fadeTime = 0;
				this.isClick = false;
				this.tweens.add({
					targets: this.attentionText,
					alpha: 0,
					duration: 1000,
					ease: "Power2",
				});
			}
		} else {
			if (this.fadeTime >= 1) {
				this.fadeTime = 0;
				this.isClick = false;
				this.scene.start("loadScene");
			}
		}
	}
}
