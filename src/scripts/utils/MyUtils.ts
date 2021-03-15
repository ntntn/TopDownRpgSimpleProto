
// declare function debugDistance(graphics: Phaser.GameObjects.Graphics, point1: Point2D, point2: Point2D)
// declare function debugDistance(distance: )

import { Vector } from "matter";

export type Point2D = { x: number, y: number }

export function testRng(percent: number) {
    return Phaser.Math.Between(0, 100) <= percent;
}

export class MyUtils {
    static debugVelocity(debugGraphics: Phaser.GameObjects.Graphics, keeper: Vector & { velocity: { x: number, y: number }}, scale = 1) {
        const velocty = new Phaser.Geom.Line(keeper.x, keeper.y, keeper.x + keeper.velocity.x * scale, keeper.y + keeper.velocity.y * scale);
        debugGraphics.strokeLineShape(velocty);
    }
    constructor() {
    }

    static scaleByWidth(transform: (Phaser.GameObjects.Components.Size & Phaser.GameObjects.Components.Transform) | Phaser.GameObjects.Container, width: number) {
        // if (transform instanceof Phaser.GameObjects.Container) {
            // transform.setScale(width/transform.width);
        // }
        console.log(transform);
        transform.setScale(width/transform.width);
    }

    static scaleByHeight(transform: Phaser.GameObjects.Components.Size & Phaser.GameObjects.Components.Transform, width: number) {
        transform.setScale(width/transform.height);
    }

    // static scaleTo(transform: Phaser.GameObjects.Components.Size & Phaser.GameObjects.Components.Transform, size: Phaser.GameObjects.Components.Size) {
    //     transform.setScale(width/transform.height);
    // }

    static debugRect(scene: Phaser.Scene, rect: Phaser.Geom.Rectangle) {
        return scene.add.rectangle(rect.x, rect.y, rect.width, rect.height, 0xff0000, 0.3);
    }

    static debugBounds(scene: Phaser.Scene, bounds: Phaser.Geom.Rectangle, color = 0x00FF11) {
        const rect = scene.add.rectangle(bounds.x, bounds.y, bounds.width, bounds.height, 0xff, 0).setOrigin(0, 0).setDepth(999);
        rect.isStroked = true;
        rect.strokeColor = color;
        return rect;
    }

    static drawBounds(graphics: Phaser.GameObjects.Graphics, bounds: Phaser.Geom.Rectangle, color = 0xFF00FF) {
        // graphics.lineStyle(5, color, 1);
        graphics.strokeRectShape(bounds);
    }

    static debugPoint(graphics: Phaser.GameObjects.Graphics, point: Point2D, color = 0xFF00FF) {
        graphics.fillStyle(color, 1);
        // graphics.lineStyle(5, color, 1);
        const rect = new Phaser.Geom.Rectangle(point.x, point.y, 32, 32);
        graphics.fillRectShape(rect);
    }

    static getDistance(point1: Point2D, point2: Point2D) {
        return new Phaser.Math.Vector2(point2).distance(new Phaser.Math.Vector2(point1));
    }

    static moveTowardsVector(point1: Point2D, point2: Point2D, speed: number) {
        const distance = this.getDistanceVector(point1, point2).normalize();
        return { x: point1.x + distance.x * speed, y: point1.y + distance.y * speed }
    }

    static getDistanceVector(point1: Point2D, point2: Point2D) {
        return new Phaser.Math.Vector2(point2).subtract(new Phaser.Math.Vector2(point1));
    }

    static debugDistance(graphics: Phaser.GameObjects.Graphics, point1: Point2D, point2: Point2D) {
        // const distance = this.getDistanceVector(point1, point2);
        graphics.strokeLineShape(new Phaser.Geom.Line(point1.x, point1.y, point2.x, point2.y));
    }

    static debugRadius(graphics: Phaser.GameObjects.Graphics, point1: Point2D, radius: number) {
        const circle = new Phaser.Geom.Circle(point1.x, point1.y, radius);
        graphics.strokeCircleShape(circle);
    }

    moveTo(target: Vector) {
        // const distance = 
    }

    // static getDistance

    static scaleByInitialSize(size: { width: number, height: number }, image: Phaser.GameObjects.Image | Phaser.GameObjects.Sprite) {
        const bounds = image.getBounds();
        // console.log(bounds);
        const widthRatio = size.width / bounds.width;
        const heightRatio = size.height / bounds.height;
        let scale = Math.min(widthRatio, heightRatio);
        // if (bounds.width >= bounds.height - 10 && bounds.width <= bounds.height + 10) {
        //     scale *= 0.7;
        // }
        scale *= 0.7;
        console.log(scale);
        return scale;
    }

    static makeResizableOnPointerOver(object: Phaser.GameObjects.Container | Phaser.GameObjects.Rectangle | Phaser.GameObjects.Sprite) {
        // object.
        let scale = object.scale;
        object.on('pointerover', () => {
            object.setScale(scale + 0.15);
        }).on('pointerout', () => {
            object.setScale(scale);
        });
    }

    static scaleTo(scalingObj: { width: number, height: number }, scaleToObj: { width: number, height: number }) {
        const widthRatio = scaleToObj.width / scalingObj.width
        const heightRatio = scaleToObj.height / scalingObj.height
        return Math.max(widthRatio, heightRatio);
    }

    static setDraggable(obj: Phaser.GameObjects.Sprite, scene: Phaser.Scene) {
        obj.setInteractive( { useHandCursor: true });
        scene.input.setDraggable(obj);
        // console.log(scene.input.eventNames());
        if (!scene.input.eventNames().includes('drag')) {
            scene.input.on('drag', (pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Image, dragX: number, dragY: number) => {
                gameObject.x = dragX;
                gameObject.y = dragY;
            })
        }
    }

    static setInteractive(container: Phaser.GameObjects.Container) {
        const bounds = container.getBounds();
        container.setSize(bounds.width, bounds.height);
        container.setInteractive({ useHandCursor: true });
        return container;
    }

    static log(string: string, color = '#137921') {
        // const obj = { value:  1 };
        // return console.log.bind(window.console);
        // console.log(color)
        // window.console.log.bind(console, 'davay');
        console.log('%c'+string, `color: ${color};background: #ffaaaa`)
    }

    static log1(self: any, obj: any) {
        console.log.bind(window.console, '%c' + obj, 'color: #000000, background: #ef0f8').bind(self);
    }
}

type ParticleKeypair = {
    /**
     * Ключ файла
     */
    key: string;
    /**
    * Путь к файлу
    */
    path: string[];
    particle?: Phaser.GameObjects.Particles.ParticleEmitterManager;
}


/**
 *
 * @param scene
 * @param Particles { key: ParticleKeypairobj }
 */
export function createParticles(scene: Phaser.Scene, Particles: any) {
    (Object.values(Particles) as ParticleKeypair[]).forEach((asset) => {
        asset.particle = scene.add.particles(asset.key);
    });
    console.log('CREATE PARTICLES')
    console.log(Particles);
}