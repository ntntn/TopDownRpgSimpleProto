export type LinkableGameObject = Phaser.GameObjects.Container | (Phaser.GameObjects.GameObject & Phaser.GameObjects.Components.GetBounds & Phaser.GameObjects.Components.Transform)

export const Place = {
    above: (placedObject: LinkableGameObject, ancorObject: LinkableGameObject, offset: number) => {
        placedObject.setPosition(placedObject.x, (ancorObject.y - ancorObject.getBounds().height * 0.5) - placedObject.getBounds().height * 0.5 - offset);
    },
    below: (placedObject: LinkableGameObject, ancorObject: LinkableGameObject, offset: number = 0) => {
        placedObject.setPosition(placedObject.x, (ancorObject.y + ancorObject.getBounds().height * 0.5) + placedObject.getBounds().height * 0.5 + offset);
    },
    right: (placedObject: LinkableGameObject, anchorObject: LinkableGameObject, offset: number = 0) => {
        const placedBounds = placedObject.getBounds();
        const anchorBounds = anchorObject.getBounds();
        placedObject.setPosition(anchorObject.x + anchorBounds.width * 0.5 + placedBounds.width * 0.5 + offset, placedObject.y);
    },
    left: (placedObject: LinkableGameObject, anchorObject: LinkableGameObject, offset: number = 0) => {
        const placedBounds = placedObject.getBounds();
        const anchorBounds = anchorObject.getBounds();
        placedObject.setPosition(anchorObject.x - anchorBounds.width * 0.5 - placedBounds.width * 0.5 + offset, placedObject.y);
    },
}

export const Distribute = {
    asRow: (objects: (LinkableGameObject[]), gap: number) => {
            let containerWidth = 0;
            const widthArray: number[] = [];

            for (let i = 0; i < objects.length; i++) {
                const object = objects[i];
                const objectWidth = object.getBounds().width;
                widthArray.push(objectWidth);
                containerWidth += objectWidth;
            }

            containerWidth += gap * (objects.length - 1);
            objects[0].x = 0.5 * (-containerWidth + widthArray[0]);
            let mostLeftX = objects[0].x + widthArray[0] * 0.5;

            for (let i = 1; i < objects.length; i++) {
                const object = objects[i];
                const halfObjectWidth = widthArray[i] * 0.5
                object.x = mostLeftX + halfObjectWidth + gap;
                mostLeftX = object.x + halfObjectWidth;
            }
    },
    asColumn: (objects: (LinkableGameObject[]), gap: number) => {
        if (objects.length === 0) return;
        let containerHeight = 0;
        const heightArray: number[] = [];

        for (let i = 0; i < objects.length; i++) {
            const object = objects[i];
            const objectHeight = object.getBounds().height;
            heightArray.push(objectHeight);
            containerHeight += objectHeight;
        }

        containerHeight += gap * (objects.length - 1);
        objects[0].y = 0.5 * (-containerHeight + heightArray[0]);
        let mostTopY = objects[0].y + heightArray[0] * 0.5;

        for (let i = 1; i < objects.length; i++) {
            const object = objects[i];
            const halfObjectHeight = heightArray[i] * 0.5
            object.y = mostTopY + halfObjectHeight + gap;
            mostTopY = object.y + halfObjectHeight;
        }
    }
}