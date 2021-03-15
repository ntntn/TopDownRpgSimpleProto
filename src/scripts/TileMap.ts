class TileMap extends Phaser.Tilemaps.Tilemap {
    constructor(scene: Phaser.Scene, mapData: Phaser.Tilemaps.MapData) {
      super(scene, mapData);
  
      // scene.add.existing(this);
    }
  }
  
  