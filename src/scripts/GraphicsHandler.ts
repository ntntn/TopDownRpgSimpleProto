export type GraphicsHandlerConfig = {
    debugGraphics: Phaser.GameObjects.Graphics;
}

export class GraphicsHandler extends Phaser.GameObjects.GameObject {
    // config: GraphicsHandlerConfig;
    debugGraphics: Phaser.GameObjects.Graphics;
    debugStaticGraphics: Phaser.GameObjects.Graphics;
    constructor(scene: Phaser.Scene, config: GraphicsHandlerConfig) {
        // this.config = config;
        super(scene, 'GraphicsHandler');
        this.debugGraphics = config.debugGraphics;
        this.debugStaticGraphics = scene.add.graphics().setDepth(999);

        scene.add.existing(this);
    }
    
    preUpdate(time: number, delta: number) {
        // console.log('preUpdate');
        // this.debugGraphics.clear();
    }

    resetStyle() {
        this.debugGraphics.lineStyle(1, 0xff00ff, 1)
        this.debugGraphics.fillStyle(0xff00ff, 1)
    }    

    update() {
        this.debugGraphics.clear();
        this.resetStyle();
    }
}