import { Debug } from "./Debug";
import { Enemy } from "./Enemy";
import { IPickupable, Item } from "./IPickupable";
import { Player } from "./Player";
import { mainScene } from "./scenes/mainScene";
import { MyUtils } from "./utils/MyUtils";

type FireballConfig = {
    target: Enemy;
    damage: number;
}

export class FireballBehaviour extends Phaser.GameObjects.Container {
    sprite: Phaser.GameObjects.Sprite;
    speed = 0.1;
    config: FireballConfig;
    target: Enemy;
    velocity = { x: 0, y: 0 }
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, config: FireballConfig) {
        super(scene, x, y);
        scene.add.existing(this);

        this.sprite = scene.add.sprite(0, 0, texture);
        this.add(this.sprite);

        // this.speed = 1;

        this.config = config;        
        this.target = config.target;
    }

    updateVelocity(x: number, y: number) {
        this.velocity = { x: x, y: y }
    }

    move(dt: number) {
        mainScene.graphicsHandler.debugStaticGraphics.clear();
        MyUtils.debugVelocity(mainScene.graphicsHandler.debugStaticGraphics, this, 0.2);
        this.velocity.x *= dt;
        this.velocity.y *= dt;
        this.setPosition(this.x + this.velocity.x * this.speed, this.y + this.velocity.y * this.speed);
    }

    preUpdate(time: number, delta: number) {
        console.log('preupdate');
        // const distance = MyUtils.getDistanceVector(this, this.target);
        const distance = new Phaser.Math.Vector2(this.target.x - this.x, this.target.x - this.y);
        // const length = Math.sqrt(distance.x * distance.x + distance.y * distance)
        if (distance.length() <= 2) {
            this.applyHit();
            this.destroy();
        }
        // distance.x = distance.normalize().x;
        // distance.y = distance.normalize().y;
        // const moveVector = MyUtils.moveTowardsVector(this, this.config.target, this.speed);
        // const moveVector = { x: this.x + distance.x, y: this.y + distance.y}
        // this.updateVelocity(moveVector.x, moveVector.y);
        this.move(delta / 1000);
        this.setPosition(this.x + distance.x / distance.x || 1, this.y + distance.y / distance.x  || 1);
        MyUtils.debugDistance(mainScene.graphicsHandler.debugStaticGraphics, this, this.target)
    }

    applyHit() {
        this.config.target.handleHit(this.config.damage);
    }
}

export class FireballItem implements Item {
    iconTexture: string;
    constructor(texture: string) {
        this.iconTexture = texture;
    }

    use() {
        Debug.log('use', mainScene.player.target);
        if (mainScene.player.target === undefined) return this;
        new FireballBehaviour(mainScene, mainScene.player.x, mainScene.player.y, 'fireball', { target: mainScene.player.target, damage: 6 })
        return this;
    }
}