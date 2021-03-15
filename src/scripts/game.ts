import 'phaser'
import { resize } from './resize'
import MainScene, { mainScene, scenesList } from './scenes/mainScene'
// import 'phaser-animated-tiles';
// import animatedTiles from 'phaser-animated-tiles/'
// anim

const DEFAULT_WIDTH = 320
const DEFAULT_HEIGHT = 180

const config: Phaser.Types.Core.GameConfig & { backgroundColor?: string } = {
  type: Phaser.AUTO,
  // backgroundColor: '#ffff  ff',
  scale: {
    parent: 'phaser-game',
    mode: Phaser.Scale.NONE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
  },
  scene: scenesList, 
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: { y: 400 }
    }
  },
  pixelArt: true,
  roundPixels: true,
  plugins: {
		// scene: [
		// 	{
		// 		key: 'AnimatedTiles',
		// 		plugin: 'phaser-animated-tiles',
		// 		mapping: 'phaser-animated-tiles',
		// 	}
		// ],
  }
  // zoom: 4
}

window.addEventListener('load', () => {
  const game = new Phaser.Game(config);
  resize(game.scale);
  window.addEventListener('resize', () => {
    resize(game.scale);
  })
})
