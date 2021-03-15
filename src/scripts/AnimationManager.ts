export class AnimationManager {
    scene: Phaser.Scene;
    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        const config = { frameRate: 8 };
        scene.anims.create({
            key: 'HeroAttackRight',
            frameRate: config.frameRate,
            frames: scene.anims.generateFrameNames('HeroAttack', {
                start: 0,
                end: 4,
                prefix: 'attack_right',
                // zeroPad: 
            }),
            // repeat: -1,
        })
        scene.anims.create({
            key: 'HeroAttackLeft',
            frameRate: config.frameRate,
            frames: scene.anims.generateFrameNames('HeroAttack', {
                start: 0,
                end: 4,
                prefix: 'attack_left'
                // zeroPad: 
            }),
            // repeat: -1,
        })
        scene.anims.create({
            key: 'HeroAttackUp',
            frameRate: config.frameRate,
            frames: scene.anims.generateFrameNames('HeroAttack', {
                start: 0,
                end: 4,
                prefix: 'attack_up'
                // zeroPad: 
            }),
            // repeat: -1,
        })
        scene.anims.create({
            key: 'HeroAttackDown',
            frameRate: config.frameRate,
            frames: scene.anims.generateFrameNames('HeroAttack', {
                start: 0,
                end: 4,
                prefix: 'attack_down'
                // zeroPad: 
            }),
            // repeat: -1,
        })
        scene.anims.create({
            key: 'HeroWalkRight',
            frameRate: config.frameRate,
            frames: scene.anims.generateFrameNames('HeroWalk', {
                start: 0,
                end: 4,
                prefix: 'walk_right',
                // zeroPad: 
            }),
            repeat: -1,
        })
        scene.anims.create({
            key: 'HeroWalkLeft',
            frameRate: config.frameRate,
            frames: scene.anims.generateFrameNames('HeroWalk', {
                start: 0,
                end: 4,
                prefix: 'walk_left'
                // zeroPad: 
            }),
            repeat: -1,
        })
        scene.anims.create({
            key: 'HeroWalkUp',
            frameRate: config.frameRate,
            frames: scene.anims.generateFrameNames('HeroWalk', {
                start: 0,
                end: 4,
                prefix: 'walk_up'
                // zeroPad: 
            }),
            repeat: -1,
        })
        scene.anims.create({
            key: 'HeroWalkDown',
            frameRate: config.frameRate,
            frames: scene.anims.generateFrameNames('HeroWalk', {
                start: 0,
                end: 4,
                prefix: 'walk_down'
                // zeroPad: 
            }),
            repeat: -1,
        })

        scene.anims.create({
            key: 'HeroRollRight',
            frameRate: config.frameRate,
            frames: scene.anims.generateFrameNames('HeroRoll', {
                start: 0,
                end: 4,
                prefix: 'roll_right',
                // zeroPad: 
            }),
            repeat: -1,
        })
        scene.anims.create({
            key: 'HeroRollLeft',
            frameRate: config.frameRate,
            frames: scene.anims.generateFrameNames('HeroRoll', {
                start: 0,
                end: 4,
                prefix: 'roll_left'
                // zeroPad: 
            }),
            repeat: -1,
        })
        scene.anims.create({
            key: 'HeroRollUp',
            frameRate: config.frameRate,
            frames: scene.anims.generateFrameNames('HeroRoll', {
                start: 0,
                end: 4,
                prefix: 'roll_up'
                // zeroPad: 
            }),
            repeat: -1,
        })
        scene.anims.create({
            key: 'HeroRollDown',
            frameRate: config.frameRate,
            frames: scene.anims.generateFrameNames('HeroRoll', {
                start: 0,
                end: 4,
                prefix: 'roll_down'
                // zeroPad: 
            }),
            repeat: -1,
        })

        scene.anims.create({
            key: 'MobWalkRight',
            frameRate: config.frameRate,
            frames: scene.anims.generateFrameNames('MobWalk', {
                start: 6,
                end: 9,
                // prefix: 'walk_right',
                zeroPad: 2
            }),
            repeat: -1,
        })
        scene.anims.create({
            key: 'MobWalkLeft',
            frameRate: config.frameRate,
            frames: scene.anims.generateFrameNames('MobWalk', {
                start: 3,
                end: 5,
                // prefix: 'walk_left'
                zeroPad: 2
            }),
            repeat: -1,
        })
        scene.anims.create({
            key: 'MobWalkUp',
            frameRate: config.frameRate,
            frames: scene.anims.generateFrameNames('MobWalk', {
                start: 9,
                end: 12,
                // prefix: 'walk_up'
                zeroPad: 2
            }),
            repeat: -1,
        })
        scene.anims.create({
            key: 'MobWalkDown',
            frameRate: config.frameRate,
            frames: scene.anims.generateFrameNames('MobWalk', {
                start: 0,
                end: 2,
                // prefix: 'walk_down'
                zeroPad: 2
            }),
            repeat: -1,
        })


        console.log(scene.anims);
    }

    createFourDirectionsAnim(prefix: string, config: FourDirectionsAnimConfig, directions = ['up', 'left', 'down', 'right']) {
        directions.forEach(dir => {
            this.scene.anims.create({
                key: 'HeroWalkDown',
                frameRate: config.frameRate,
                frames: this.scene.anims.generateFrameNames(prefix + config.jsonKey, {
                    start: 0,
                    end: 4,
                    prefix: 'walk_down'
                    // zeroPad: 
                }),
                repeat: -1,
            })
        })
    }
}

type FourDirectionsAnimConfig = {
    jsonKey: string,
    prefix: string,
    frameRate: number,
}