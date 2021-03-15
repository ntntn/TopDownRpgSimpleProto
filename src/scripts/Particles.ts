export class Particles {
    testParticle: Phaser.GameObjects.Particles.ParticleEmitterManager;
    constructor(scene: Phaser.Scene) {
        this.testParticle = scene.add.particles('particle').setDepth(999);
    }

    testParticlesExplodeFX(x: number, y: number) {
        const cont = Phaser.Math.Between(5, 10);
        const emitter = this.testParticle.createEmitter({
            x: x,
            y: y,
            // scale: () => Phaser.Math.Between(0.1, 0.4),
            // scale: Phaser.Math.Between(0.1, 0.3),
            // scale: { min: 0.15, max: 0.5 },
            tint: 0x800000,
            scale: { start: 1, end: 0.2 },
            // angle: { min: -25, max: 25 },
            speed: 30,
            alpha: { start: 1, end: 1 },
            // accelerationY: () => Phaser.Math.Between(-100, 100),
            // accelerationX: 400,
            // gravityY: 15,
            lifespan: 1250,
            blendMode: 'ADD',
        }).explode(25, x, y);
    }
}