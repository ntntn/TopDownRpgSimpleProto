import { Debug } from "./Debug";
import { IPickupable, Item } from "./IPickupable";
import { Player } from "./Player";
import { mainScene } from "./scenes/mainScene";
import { MyUtils } from "./utils/MyUtils";

export class Pickup extends Phaser.GameObjects.Sprite implements IPickupable {
    item: Item;
    playerInDistance = false;
    pickupDistance = 16;
    pickupText: Phaser.GameObjects.Text;

    pickupHandler: Function;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, item: Item) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        this.item = item;
        this.pickupText = scene.add.text(0, 0, 'Press [E] to pick up', { fontSize: '64px'}).setVisible(false).setOrigin(0.5).setAlign('center').setScale(0.1);
        // this.pickupText = scene.add.bitmapText(0, 0, 'Press [E] to pick up').setVisible(false).setOrigin(0.5).setAlign('center');
        this.pickupHandler = () => this.pickUp(mainScene.player);
        scene.events.on('onActionKeyDown', this.pickupHandler);
    }
    
    pickUp(player: Player) {
        if (!this.playerInDistance) return;
        Debug.log('PICKUP');
        player.pickUp(this.item);

        mainScene.pickups.splice(mainScene.pickups.indexOf(this), 1);
        this.scene.events.off('onActionKeyDown', this.pickupHandler);
        this.pickupText.destroy();
        this.destroy();
    }

    update(player: Player) {
        const distance = MyUtils.getDistance(player, this);
        if (distance <= this.pickupDistance) {
            if (this.playerInDistance) return;
            this.playerInDistance = true;
            this.showPickupText();
        }
        else {
            this.playerInDistance = false;
            this.hidePickupText();
        }
    }

    showPickupText() {
        this.pickupText.setPosition(this.x , this.y - this.height / 2);
        this.pickupText.setVisible(true);
    }

    hidePickupText() {
        this.pickupText.setVisible(false);
    }
}