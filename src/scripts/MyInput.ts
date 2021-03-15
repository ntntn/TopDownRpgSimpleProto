import { Debug } from "./Debug";

type Cursors = {
    left: Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
    up: Phaser.Input.Keyboard.Key;
    down: Phaser.Input.Keyboard.Key;
}

export class MyInput {
    cursors: Cursors;
    actionKey: Phaser.Input.Keyboard.Key;
    constructor(scene: Phaser.Scene) {
        this.cursors = {
            up: scene.input.keyboard.addKey('W'),
            left: scene.input.keyboard.addKey('A'),
            down: scene.input.keyboard.addKey('S'),
            right: scene.input.keyboard.addKey('D'),
        }
        this.actionKey = scene.input.keyboard.addKey('E');
        scene.input.keyboard.on('keydown-E', () => {
            Debug.log('Keydown-E');
            scene.events.emit('onActionKeyDown');
        })
    }
}

// export const input = new Input(mainScene)