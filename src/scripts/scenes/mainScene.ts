import { Vector } from 'matter';
import { AnimationManager } from '../AnimationManager';
import { Debug } from '../Debug';
import { Enemy } from '../Enemy';
import { FireballItem } from '../Fireball';
import { GraphicsHandler } from '../GraphicsHandler';
import { InventoryUI } from '../InventoryUI';
import { MyInput } from '../MyInput';
import { Particles } from '../Particles';
import { Pickup } from '../Pickup';
import { Player } from '../Player';
import { MyUtils } from '../utils/MyUtils';
import InterfaceScene from './InterfaceScene';

export const DEBUG_ENEMIES_COLLIDERS = true;
export const DEBUG_PLAYER_COLLIDER = true;

declare type PImage = Phaser.GameObjects.Image;
declare type Test = { davay: string }

export abstract class Scene extends Phaser.Scene {
  // animTiles: { init: (map: Phaser.Tilemaps.Tilemap) => any }
  constructor(key: string) {
    super( { key: key } ); 
  }
}

export const scenesList: Scene[] = [];

type Controllable = { 
  x: number,
  y: number,
  updateVelocityY(value: number), 
  updateVelocityX(value: number),
  move(delta: number),
  update(delta: number)
}

export default class MainScene extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  map: Phaser.Tilemaps.Tilemap;
  delta: number;

  player: Player;
  enemies: Enemy[];
  pickups: Pickup[];
  myInput: MyInput; 
  graphicsHandler: GraphicsHandler;
  particles: Particles;

  controllerTarget: Controllable


  
  private instance: MainScene
  constructor() {
    super('MainScene');
    if (this.instance) return;
    this.instance = this;
    scenesList.push(this);
  }

  preload() {
    // this.load.scenePlugin({
    //   key: 'AnimatedTiles',
    //   url: 'src/assets/plugins/AnimatedTiles.js',
    //   sceneKey: 'animTiles'
    // });
    this.load.image('fireball', 'src/assets/img/skills/fireball.png')
    this.load.image('itemFrame', 'src/assets/img/UI/itemFrame.png')
    
    this.load.image('healthBarBase', 'src/assets/img/UI/healthBarBase.png')
    this.load.image('healthBarFull', 'src/assets/img/UI/healthBarFull.png')
    this.load.image('particle', 'src/assets/img/particle.png')
    this.load.image('AnimTiles', 'src/assets/img/AnimTiles.png')
    this.load.image('StaticTiles', 'src/assets/img/StaticTiles.png')
    this.load.atlas('MobWalk', 'src/assets/atlases/mob/texture.png', 'src/assets/atlases/mob/texture.json')
    this.load.atlas('HeroAttack', 'src/assets/atlases/hero/attack/texture.png', 'src/assets/atlases/hero/attack/texture.json')
    this.load.atlas('HeroRoll', 'src/assets/atlases/hero/roll/texture.png', 'src/assets/atlases/hero/roll/texture.json')
    this.load.atlas('HeroWalk', 'src/assets/atlases/hero/walk/texture.png', 'src/assets/atlases/hero/walk/texture.json')
    this.load.tilemapTiledJSON('map', 'src/assets/TiledMaps/qwe.json')

    console.log(this.game.textures);
  }

  create() {
    this.scene.add('InterfaceScene', new InterfaceScene())
    console.log(this.scene);
    this.scene.launch('InterfaceScene')
    this.enemies = [];
    this.pickups = [];
    this.graphicsHandler = new GraphicsHandler(this, { debugGraphics: this.add.graphics().setDepth(999).lineStyle(5, 0xFF00FF).fillStyle(0xFF00FF, 1) });

    const camera = this.cameras.main;
    this.camera = camera;
    this.delta = 0;

    this.particles = new Particles(this);

    const inventoryUI = new InventoryUI(this, camera.centerX, camera.centerY);

    
    camera.setZoom(4);
    
    //map creation
    const map = this.make.tilemap({ key: 'map' });
    this.map = map;
    const tiles = map.addTilesetImage('StaticTiles', 'StaticTiles')
    const layer2Tiles = map.addTilesetImage('AnimTiles', 'AnimTiles')
    console.log(layer2Tiles);
    console.log(layer2Tiles.tileData);
    const layer = map.createLayer(0, 'StaticTiles', 0, 0)
    const layer2 = map.createLayer(1, 'AnimTiles', 0, 0);
    map.setLayer(layer);
    // console.log(this.animTiles);
    // this.animTiles.init(map)
    Debug.log(layer);
    console.log(map.layer);
    console.log(this.getCenter(map.layer));

    new AnimationManager(this);

    const fireball = new Pickup(this, 50, 50, 'fireball', new FireballItem('fireball'));
    this.pickups.push(fireball);
    // const itemFrame = this.add.sprite(50, 50, 'itemFrame');

    const player = new Player(this, 100, 100, 'HeroWalk');
    this.player = player;
    player.anims.play('HeroWalkRight', true);


    const enemy = new Enemy(this, 200, 200, 'MobWalk');
    enemy.anims.play('MobWalkRight')
    this.enemies.push(enemy);

    for (let i = 0; i < 50; i++ ){
      const x = Phaser.Math.Between(0, 1000);
      const y = Phaser.Math.Between(0, 1000);
      const enemy = new Enemy(this, x, y, 'MobWalk');
      enemy.anims.play('MobWalkRight')
      this.enemies.push(enemy);
    }

    this.controllerTarget = player;


    this.setupCamera(map, this.controllerTarget);

    const keys: Phaser.Types.Input.Keyboard.CursorKeys = this.input.keyboard.createCursorKeys();


    this.setupInput();
  }

  setupCamera(map: Phaser.Tilemaps.Tilemap, obj: object & Vector) {
    this.camera.setRoundPixels(true);
    const mapCenter = this.getCenter(map.layer);
    Debug.log(mapCenter);

    this.camera.centerOn(obj.x, obj.y);
    this.camera.startFollow(obj, true);
    // this.camera.setPosition(mapCenter.x, mapCenter.y)
  }

  getCenter(obj: { widthInPixels: number, heightInPixels: number }) {
    return { x: obj.widthInPixels / 2, y: obj.heightInPixels / 2 }
  }

  setupInput() {
    this.myInput = new MyInput(this);
    this.input.on('wheel', this.handleZoom, this);
    this.input.on('keydown-F', () => {
      console.log(this.camera.x + ' ' + this.camera.y);
    })

    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      this.player.attack({ x: pointer.worldX, y: pointer.worldY });
    })
  }

  handleZoom(pointer: Phaser.Input.Pointer) {
    console.log('handleZoom');
    let zoom = this.cameras.main.zoom;
    if (pointer.deltaY < 0) {
      zoom += 0.5;
    }
    else {
      zoom -= 0.5;
    }
    this.cameras.main.setZoom(zoom);
  }

  update(time: number, delta: number) {
    this.delta = delta;
    this.graphicsHandler.update();

    // this.graphicsHandler.debugGraphics.strokeRectShape(this.player.getBounds());

    this.handleInput(this.controllerTarget);
    this.controllerTarget.update(delta);
    this.enemies.forEach(e =>{
      e.update(delta);
      this.graphicsHandler.resetStyle();
    });

    this.pickups.forEach(pickup => {
      pickup.update(this.player);
    });
  }

  handleInput(target: Controllable) {
    if (this.myInput.cursors.down.isDown) {
      target.updateVelocityY(1);
    }
    else if (this.myInput.cursors.up.isDown) {
      target.updateVelocityY(-1);
    }
    else {
      target.updateVelocityY(0);
    }

    if (this.myInput.cursors.left.isDown) {
      target.updateVelocityX(-1);
    }
    else if (this.myInput.cursors.right.isDown) {
      target.updateVelocityX(1);
    }
    else {
      target.updateVelocityX(0);
    }
  }
}

export const mainScene = new MainScene();
console.log(mainScene);

/* const timeElapsed = 0;
let fixedUpdateCount = 0;

function fixedUpdate() {
  fixedUpdateCount += 1;
}

const callsPerSecond = 50;

const deltaTimeMs = 1000 / callsPerSecond;

setInterval(() => {
  console.log('tick');
  fixedUpdate();
  if (fixedUpdateCount % callsPerSecond === 0) {
  }
}, deltaTimeMs) */


