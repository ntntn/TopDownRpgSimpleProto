import { Vector } from "matter";
import { RectCollider } from "../RectCollider";
import { Debug } from "./Debug";
import { HealthBar } from "./HealthBar";
import { DEBUG_ENEMIES_COLLIDERS, mainScene } from "./scenes/mainScene";
import { MyUtils } from "./utils/MyUtils";




export enum EnemyState {
    WALK = "WALK",
    ROLL = "ROLL",
    CHASE = "CHASE",
    DEATH = "DEATH",
    IDLE = "IDLE"
}

export const debugStateDatas = [
    { state: EnemyState.WALK, color: 0x00ff00 },
    { state: EnemyState.IDLE, color: 0xffffff },
    { state: EnemyState.CHASE, color: 0xff0000 },
]

function debugState(state: EnemyState, pos: Vector) {
    const debugStateData = debugStateDatas.find(e => e.state === state);
    if (!debugStateData) return;
    const graphics = mainScene.graphicsHandler.debugGraphics;
    graphics.lineStyle(1, debugStateData.color);
    graphics.strokeCircle(pos.x, pos.y, 32);
    // MyUtils.debugRadius()
}


export class Enemy extends Phaser.GameObjects.Sprite {
    velocity = { x: 0, y: 0 }
    speed: number = 50;

    chaseStartDistance = 50;
    chaseStopDistance: number;
    chaseStopMaxDistance: number;
    chaseStarted = false;
    chaseTarget: { x: number, y: number }

    collider: RectCollider;
    healthBar: HealthBar;

    health: 6;
    maxHealth: 6;

    state: EnemyState;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string | Phaser.Textures.Texture, frame?: string | number | undefined) {
      super(scene, x, y, texture, frame);
      this.setSize(16, 16);
      
      this.chaseStopDistance = this.width * 2;
      this.chaseStopMaxDistance = this.chaseStartDistance * 2;

      this.collider = new RectCollider(x, y, this.width, this.height);
      this.healthBar = new HealthBar(scene, x, y, { health: this.health});

      this.health = 6;
      this.maxHealth = 6;
  
      scene.add.existing(this);

      this.setInteractive({ useHandCursor: true }).on('pointerover', () => {
          mainScene.player.target = this;
          this.setSelected();
      }).on('pointerout', () => {
          mainScene.player.target = undefined;
          this.setDeselected();
      });
    }

    setSelected() {
        this.setTint(0xff00000);
    }

    setDeselected() {
        this.clearTint();
    }

    updateVelocityY(y: number) {
        this.velocity.y = y;
    }

    updateVelocityX(x: number) {
        this.velocity.x = x;
    }

    updateVelocity(x: number, y: number) {
        this.velocity.x = x;
        this.velocity.y = y;
    }

    resetVelocity() {
        this.velocity = { x: 0, y: 0 }
    }

    move(delta: number, resetVelocity = true) {
        // this.setState(EnemyState.WALK);
        this.handleAnims();
        const dt = delta / 1000;
        this.setPosition(this.x + this.velocity.x * this.speed * dt, this.y + this.velocity.y * this.speed * dt);
        if (resetVelocity) {
            this.resetVelocity();
        }
    }
    
    roll() {
        this.setState(EnemyState.ROLL);
    }

    handleAnims() {
        if (this.velocity.x > 0 && this.velocity.y > 0) {
            if (this.state === EnemyState.WALK || EnemyState.CHASE) {
                this.anims.play('MobWalkDown', true)
            }
            if (this.state === EnemyState.ROLL) {
                this.anims.play('MobRollDown', true)                
            }
            return;
        }
        if (this.velocity.x > 0 && this.velocity.y < 0) {
            if (this.state === EnemyState.WALK || EnemyState.CHASE) {
                this.anims.play('MobWalkUp', true)
            }
            if (this.state === EnemyState.ROLL) {
                this.anims.play('MobRollUp', true)                
            }
            return;
        }
        if (this.velocity.x < 0 && this.velocity.y > 0) {
            if (this.state === EnemyState.WALK || EnemyState.CHASE) {
                this.anims.play('MobWalkDown', true)             
            }
            if (this.state === EnemyState.ROLL) {
                this.anims.play('MobRollDown', true)                
            }
            return;
        }
        if (this.velocity.x < 0 && this.velocity.y < 0) {
            if (this.state === EnemyState.WALK || EnemyState.CHASE) {
                this.anims.play('MobWalkUp', true)
            }
            if (this.state === EnemyState.ROLL) {
                this.anims.play('MobRollUp', true)                
            }
            return;
        }

        if (this.velocity.x > 0) {
            this.anims.play('MobWalkRight', true)
            // this.setFlipX(false);
        }
        if (this.velocity.x < 0) {
            this.anims.play('MobWalkLeft', true)
            // this.setFlipX(true);
        }

        if (this.velocity.y < 0) {
            this.anims.play('MobWalkUp', true)
        }

        if (this.velocity.y > 0) {
            this.anims.play('MobWalkDown', true)
        }
    }

    update(delta: number) {
        
        const graphics = mainScene.graphicsHandler.debugGraphics;
        MyUtils.debugRadius(graphics, this, this.chaseStartDistance);
        
        if (this.state === EnemyState.DEATH) return;
        
        if (this.state === EnemyState.CHASE) {
            this.chaseStateUpdate();
        }
        
        this.validateChaseState();
        
        this.collider.update(this.x, this.y);
        this.healthBar.update(this.x, this.y - this.height/2);
        
        if (DEBUG_ENEMIES_COLLIDERS) {
            this.collider.debug(mainScene.graphicsHandler.debugGraphics);
        }
        
        debugState(this.state, this);
    }

    validateChaseState() {
        const player = mainScene.player;
        const distance = MyUtils.getDistance(this, player);
        if (this.chaseStarted) {
            if (distance > this.chaseStopMaxDistance) {
                this.setState(EnemyState.IDLE);
                this.chaseStarted = false;
            }     
        }
        else {
            if (distance <= this.chaseStartDistance) {     
                this.chaseStarted = true;       
                this.setState(EnemyState.CHASE);
                this.chaseTarget = player;
            }
        }
        
    }

    handleHit(amount: number) {
        Debug.log('HIT DAMAGE', amount);
        this.health -= amount;
        console.log(this.health);
        console.log(this.maxHealth);
        this.healthBar.handleHit(this.health, this.maxHealth);

        if (this.health <= 0) {
            this.handleDeath();
        }
    }

    handleDeath() {
        this.setState(EnemyState.DEATH);
        mainScene.tweens.add({
            targets: this,
            alpha: 0,
            scale: 2,
            ease: 'Bounce',
            duration: 250,
            onComplete: () => {
                mainScene.enemies.splice(mainScene.enemies.indexOf(this), 1);
                this.destroy();
            }
        })
    }

    chaseStateUpdate() {
        MyUtils.debugDistance(mainScene.graphicsHandler.debugGraphics, this, this.chaseTarget);
        const distance = MyUtils.getDistanceVector(this, this.chaseTarget);
        if (distance.length() <= this.chaseStopDistance) return;
        distance.normalize();
        this.updateVelocity(distance.x, distance.y);
        this.move(mainScene.delta);
    }

    setState(state: EnemyState) {
        if (state === this.state) return this;
        super.setState(state);
        return this;
    }
  }