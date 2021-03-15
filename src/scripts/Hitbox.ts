import { Debug } from "./Debug";
import { Enemy } from "./Enemy";
import { mainScene } from "./scenes/mainScene";
import { MyUtils } from "./utils/MyUtils";

//TODO: change to class Weapon ???
export class HitBox {
    active: boolean = false;
    x: number;
    y: number;
    width: number;
    height: number;
    //TODO: change to Entities
    //TODO: change to faster structure than array (octree???)
    enteredCollisionEnemies: Enemy[] = [];

    attackDamage = 2;

    constructor(x: number, y: number, width: number, height: number) { 
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.attackDamage = 2;
    }

    setActive(value: boolean) {
        this.active = value;
        if (this.active === false) {
            this.enteredCollisionEnemies = [];
        }
    }

    setPosition(x: number, y: number) {
        // this.x = x;
        // this.y = y;
        this.x = x - this.width/2;
        this.y = y - this.height/2;
    }

    update(x: number, y: number) {
        if (!this.active) return;
        // this.setPosition(x, y);
    }

    processCollision(e: Enemy) {
        if (this.enteredCollisionEnemies.includes(e)) return;
        this.enteredCollisionEnemies.push(e);

        mainScene.particles.testParticlesExplodeFX(e.x, e.y);

        e.setTintFill(0xffffff);
        // e.setTint(0x999999, 0x999999, 0x999999, 0xaaaaaa);
        mainScene.time.delayedCall(50, () => {
            e.clearTint();
        });

        e.handleHit(this.attackDamage);
    }

    testCollision() {
        mainScene.enemies.forEach(e =>{
            const hitBox = this;
            if (hitBox.active) {
              //TODO: write own RectToRect function (steal from phaser source code rofl)
              // const hitboxCollider = hitBox as unknown as Phaser.Geom.Rectangle;
              // const enemyCollider = e.collider as unknown as Phaser.Geom.Rectangle;
              const hitboxCollider = new Phaser.Geom.Rectangle(hitBox.x, hitBox.y, hitBox.width, hitBox.height);
              const enemyCollider = new Phaser.Geom.Rectangle(e.collider.x, e.collider.y, e.collider.width, e.collider.height)
              const collision = Phaser.Geom.Intersects.RectangleToRectangle(hitboxCollider, enemyCollider);
            //   Debug.log(collision);
      
              const graphics = mainScene.graphicsHandler.debugGraphics;
              MyUtils.drawBounds(graphics, hitboxCollider);
              MyUtils.drawBounds(graphics, enemyCollider);
      
              if (collision === true) {
                //change to processCollision(Entity/Component) ??
                hitBox.processCollision(e)
              }
            }
          })
    }
}