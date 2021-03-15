import { Vector } from "matter";
import { Debug } from "./Debug";
// import { Item } from "./IPickupable";
import { Distribute } from "./utils/utils";

interface Item {
    use(): Item;
    iconTexture: string;
}

export class InventoryCell extends Phaser.GameObjects.Container {
    item: Item | undefined;
    frame: Phaser.GameObjects.Sprite;
    icon: Phaser.GameObjects.Sprite;
    // hotkey: 
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
        super(scene, x, y);
        scene.add.existing(this);

        this.frame = this.scene.add.sprite(0, 0, texture);
        this.icon = this.scene.add.sprite(0, 0, 'fireball').setVisible(false);

        this.add([this.frame, this.icon]);
        // item
    }

    setItem(item: Item) {
        if (this.item) return;
        Debug.log('setItem');
        this.item = item;
        this.icon.setTexture(item.iconTexture).setVisible(true);
    }

    PlaceInCell(pos: Vector) {
        pos.x = this.x;
        pos.y = this.y;
    }

    isFree() {
        return this.item === undefined;
    }
}

export class InventoryUI extends Phaser.GameObjects.Container {
    frames: InventoryCell[] = [];
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y)
        scene.add.existing(this);
        const frames: InventoryCell[] = [];
        const hotkeys = ['key']
        for (let i = 0; i < 4; i++) {
            const frame = new InventoryCell(scene, 0, 0, 'itemFrame');
            frames.push(frame);
        }

        Distribute.asRow(frames, 1);

        this.frames = frames;

        this.add(frames);
    }

    addItem(item: Item) {
        const cell = this.getFreeCell();
        if (!cell) {
            this.handleNotEnoughSpace();
            return;
        }

        cell.setItem(item);
    }

    getFreeCell() {
        return this.frames.find(e => e.isFree());
    }

    handleNotEnoughSpace() {

    }    
}