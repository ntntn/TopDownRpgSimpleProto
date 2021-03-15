import { MyUtils } from "./scripts/utils/MyUtils";

export class RectCollider {
    x: number;
    y: number;
    width: number;
    height: number;
    top: number;
    left: number;
    constructor(x: number, y: number, width: number, height: number) {
        this.width = width;
        this.height = height;
        this.update(x,y);
    }

    update(x: number, y: number) {
        this.x = x - this.width/2;
        this.y = y - this.height/2;
        this.top = y;
        this.left = x;
    }

    debug(graphics: Phaser.GameObjects.Graphics) {
        MyUtils.drawBounds(graphics, this as unknown as Phaser.Geom.Rectangle);
    }
}