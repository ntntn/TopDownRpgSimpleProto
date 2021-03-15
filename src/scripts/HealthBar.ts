import { Debug } from "./Debug";
import { mainScene } from "./scenes/mainScene";

type HealthBarConfig = {
    health: number
}

export class HealthBar extends Phaser.GameObjects.Container {
    healthBarBase: Phaser.GameObjects.Image;
    healthBarFull: Phaser.GameObjects.Image;
    maxHealth: number;
    constructor(scene: Phaser.Scene, x: number, y: number, config: HealthBarConfig) {
        super(scene, x, y);
        scene.add.existing(this);

        this.healthBarBase = mainScene.add.image(0, 0, 'healthBarBase').setOrigin(0, 0.5);
        this.healthBarFull = mainScene.add.image(0, 0, 'healthBarFull').setOrigin(0, 0.5);

        this.add([this.healthBarBase, this.healthBarFull]);
        this.setDepth(999);

        this.maxHealth = config.health;

        const bounds = this.getBounds();
        this.setSize(bounds.width, bounds.height);
    }

    handleHit(currentHealth: number, maxHealth: number) {
        const scale = currentHealth/maxHealth;
        Debug.log(scale);
        this.setScale(scale, 1);
    }

    update(x: number, y: number) {
        this.setPosition(x - this.width/2, y);
    }
}