class Player extends Phaser.GameObjects.Image {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        this.scene = scene;
        this.scene.add.existing(this);

        this.x = x;
        this.y = y;
        this.texture = texture;
        //this.frame = frame;
    }

    update(...args) {
        super.update(...args);

        console.log(args[0]);
    }

    setMaxHP(hp) {
        this.maxHP = hp;
    }

    setHP(hp) {
        this.hp = hp;
    }
}
