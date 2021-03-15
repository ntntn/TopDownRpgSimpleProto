import { Bodies, Vector } from "matter";
import { RectCollider } from "../RectCollider";
import { Debug } from "./Debug";
import { Enemy } from "./Enemy";
import { HealthBar } from "./HealthBar";
import { HitBox } from "./Hitbox";
import { Item } from "./IPickupable";
import { DEBUG_PLAYER_COLLIDER, mainScene } from "./scenes/mainScene";
import { MyUtils } from "./utils/MyUtils";




export enum PlayerState {
    WALK = "WALK",
    ROLL = "ROLL",
    ATTACK = "ATTACK",
    IDLE = "IDLE"
}

export enum Direction {
    RIGHT = "RIGHT",
    LEFT = "LEFT",
    UP = "UP",
    DOWN = "DOWN",
    UP_RIGHT = "UP_RIGHT",
    UP_LEFT = "UP_LEFT",
    DOWN_LEFT = "DOWN_LEFT",
    DOWN_RIGHT = "DOWN_RIGHT",
}


export class Player extends Phaser.GameObjects.Sprite {
    velocity = { x: 0, y: 0 }
    speed: number = 100;

    direction: Direction;
    directionVector = { x: 0, y: 0}

    hitBox: HitBox;
    attackRange = 16;
    hitboxActiveDuration = 250;

    health: 6;
    maxHealth: 6;

    collider: RectCollider;
    healthBar: HealthBar;
    items: Item[] = [];
    target?: Enemy;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string | Phaser.Textures.Texture, frame?: string | number | undefined) {
        super(scene, x, y, texture, frame);
        this.direction = Direction.RIGHT;

        this.setSize(16, 16);
        this.height = 16;

        this.healthBar = new HealthBar(scene, x, y, { health: this.health});
        
        this.hitBox = new HitBox(x, y, 16, 16);
        const bounds = this.getBounds();
        this.collider = new RectCollider(x, y, this.width, this.height);

        scene.add.existing(this);

        scene.game.events.on('onItemKeyDown', (index: number) => {
            const item = this.items[index];
            if (!item) return;
            item.use();
        })
    }

    pickUp(item: Item) {
        this.items.push(item);
        this.scene.game.events.emit('onItemPickuped', item);
    }

    updateVelocityY(y: number) {
        this.velocity.y = y;
        // this.directionVector.y = y;
    }

    updateVelocityX(x: number) {
        this.velocity.x = x;
        // this.directionVector.x = x;
    }

    updateVelocity(x: number, y: number) {
        this.velocity.x = x;
        this.velocity.y = y;
        // this.directionVector.x = x;
        // this.directionVector.y = y;
    }

    resetVelocity() {
        this.velocity = { x: 0, y: 0 }
    }

    update(delta: number) {
        this.move(delta);
        this.collider.update(this.x, this.y);
        this.healthBar.update(this.x , this.y - this.height/4);
        if (DEBUG_PLAYER_COLLIDER) {
            this.collider.debug(mainScene.graphicsHandler.debugGraphics);
        }
    }

    makeTurn(pos: Vector) {
        console.log('makeTurn', pos)
        if (pos.x > 0 && pos.y > 0) {
            this.setDirection(Direction.DOWN_RIGHT);
            return;
        }
        if (pos.x > 0 && pos.y < 0) {
            this.setDirection(Direction.UP_RIGHT);
            return;
        }
        if (pos.x < 0 && pos.y > 0) {
            this.setDirection(Direction.DOWN_LEFT);
            return;
        }
        if (pos.x < 0 && pos.y < 0) {
            this.setDirection(Direction.UP_LEFT);
            return;
        }

        if (pos.x > 0) {
            this.setDirection(Direction.RIGHT);
        }
        if (pos.x < 0) {
            this.setDirection(Direction.LEFT);
        }

        if (pos.y < 0) {
            this.setDirection(Direction.UP);
        }

        if (pos.y > 0) {
            this.setDirection(Direction.DOWN);
        }
    }

    attack(pos: Vector) {
        if (this.state === PlayerState.ATTACK) return;
        this.setState(PlayerState.ATTACK);
        this.anims.stop();
        const mousePosDebugRect = MyUtils.debugRect(mainScene, new Phaser.Geom.Rectangle(pos.x, pos.y, 16, 16))
        const targetPos = MyUtils.getDistanceVector(this, pos).normalize()
        this.makeTurn(targetPos);
        MyUtils.debugDistance(mainScene.graphicsHandler.debugStaticGraphics, this, pos);
        targetPos.x = this.x + targetPos.x * this.attackRange;
        targetPos.y = this.y + targetPos.y * this.attackRange;
        this.hitBox.setPosition(targetPos.x, targetPos.y);
        this.hitBox.setActive(true);
        const hitboxDebugRect = MyUtils.debugBounds(this.scene, this.hitBox as unknown as Phaser.Geom.Rectangle);

        this.hitBox.testCollision();

        this.scene.time.delayedCall(this.hitboxActiveDuration, () => {
            mainScene.graphicsHandler.debugStaticGraphics.clear();
            mousePosDebugRect.destroy();
            hitboxDebugRect.destroy();
            this.hitBox.setActive(false);

            this.setState(PlayerState.IDLE);
        })

        switch(this.direction) {
            case Direction.UP:
                this.anims.play('HeroAttackUp', true);
                break;
            case Direction.LEFT:
                this.anims.play('HeroAttackLeft', true);
                break;
            case Direction.DOWN:
                this.anims.play('HeroAttackDown', true);
                break;
            case Direction.RIGHT:
                this.anims.play('HeroAttackRight', true);
                break;
            case Direction.UP_LEFT:
                this.anims.play('HeroAttackUp', true);
                break;
            case Direction.UP_RIGHT:
                this.anims.play('HeroAttackUp', true);
                break;
            case Direction.DOWN_LEFT:
                this.anims.play('HeroAttackDown', true);
                break;
            case Direction.DOWN_RIGHT:
                this.anims.play('HeroAttackDown', true);
                break;
        }
    }

    move(delta: number, resetVelocity = true) {
        if (this.state === PlayerState.ATTACK) return;
        this.setState(PlayerState.WALK);
        this.handleState();
        const dt = delta / 1000;
        this.setPosition(this.x + this.velocity.x * this.speed * dt, this.y + this.velocity.y * this.speed * dt);
        if (resetVelocity) {
            this.resetVelocity();
        }
    }

    roll() {
        this.setState(PlayerState.ROLL);
    }

    handleState() {
        if (this.velocity.x > 0 && this.velocity.y > 0) {
            this.setDirection(Direction.DOWN_RIGHT);
            if (this.state === PlayerState.WALK) {
                this.anims.play('HeroWalkDown', true)
            }
            if (this.state === PlayerState.ROLL) {
                this.anims.play('HeroRollDown', true)
            }
            return;
        }
        if (this.velocity.x > 0 && this.velocity.y < 0) {
            this.setDirection(Direction.UP_RIGHT);
            if (this.state === PlayerState.WALK) {
                this.anims.play('HeroWalkUp', true)
            }
            if (this.state === PlayerState.ROLL) {
                this.anims.play('HeroRollUp', true)
            }
            return;
        }
        if (this.velocity.x < 0 && this.velocity.y > 0) {
            this.setDirection(Direction.DOWN_LEFT);
            if (this.state === PlayerState.ROLL) {
                this.anims.play('HeroWalkDown', true)
            }
            if (this.state === PlayerState.ROLL) {
                this.anims.play('HeroRollDown', true)
            }
            return;
        }
        if (this.velocity.x < 0 && this.velocity.y < 0) {
            this.setDirection(Direction.UP_LEFT);
            this.anims.play('HeroWalkUp', true)
            if (this.state === PlayerState.ROLL) {
                this.anims.play('HeroRollUp', true)
            }
            return;
        }

        if (this.velocity.x > 0) {
            this.setDirection(Direction.RIGHT);
            this.anims.play('HeroWalkRight', true)
            // this.setFlipX(false);
        }
        if (this.velocity.x < 0) {
            this.setDirection(Direction.LEFT);
            this.anims.play('HeroWalkLeft', true)
            // this.setFlipX(true);
        }

        if (this.velocity.y < 0) {
            this.setDirection(Direction.UP);
            this.anims.play('HeroWalkUp', true)
        }

        if (this.velocity.y > 0) {
            this.setDirection(Direction.DOWN);
            this.anims.play('HeroWalkDown', true)
        }
    }

    setDirection(direction: Direction) {
        switch(direction) {
            case Direction.UP:
                this.directionVector = { x: 0, y: -1 }
                break;
            case Direction.LEFT:
                this.directionVector = { x: -1, y: 0 }
                break;
            case Direction.DOWN:
                this.directionVector = { x: 0, y: 1 }
                break;
            case Direction.RIGHT:
                this.directionVector = { x: 1, y: 0 }
                break;
            case Direction.UP_LEFT:
                this.directionVector = { x: -1, y: -1 }
                break;
            case Direction.UP_RIGHT:
                this.directionVector = { x: 1, y: -1 }
                break;
            case Direction.DOWN_LEFT:
                this.directionVector = { x: -1, y: 1 }
                break;
            case Direction.DOWN_RIGHT:
                this.directionVector = { x: 1, y: 1 }
                break;
        }
        this.direction = direction;
    }
}