import { Vector } from 'matter';
// import { Scene } from 'phaser';
import { AnimationManager } from '../AnimationManager';
import { Debug } from '../Debug';
import { Enemy } from '../Enemy';
import { GraphicsHandler } from '../GraphicsHandler';
import { InventoryUI } from '../InventoryUI';
import { Item } from '../IPickupable';
import { MyInput } from '../MyInput';
import { Particles } from '../Particles';
import { Player } from '../Player';
import { mainScene, Scene, scenesList } from './mainScene';

export default class InterfaceScene extends Phaser.Scene {
  private instance: InterfaceScene
  constructor() {
    super('InterfaceScene');
    // if (this.instance) return;
    // this.instance = this;
    // scenesList.push(this);
  }

  camera: Phaser.Cameras.Scene2D.Camera;  
  inventoryUI: InventoryUI;

  create() {
    console.log('interface scene create')
    Debug.log('INTERFACE SCENE CREATE')
    const camera = this.cameras.main;
    this.camera = camera;
    // camera.setZoom(mainScene.camera.zoom);

    this.inventoryUI = new InventoryUI(this, camera.centerX, camera.height - 50).setScale(mainScene.camera.zoom);
    this.game.events.on('onItemPickuped', this.onItemPickuped, this);

    this.input.keyboard.on('keydown-Q', () => {
      this.game.events.emit('onItemKeyDown', 0);
    })
  }

  onItemPickuped(item: Item) {
    this.inventoryUI.addItem(item);
  }
}

// export const interfaceScene = new InterfaceScene();