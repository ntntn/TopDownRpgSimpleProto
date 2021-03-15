import { Debug } from "./Debug";

export function resize(scaleManager: Phaser.Scale.ScaleManager) {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const gameWidth = scaleManager.width;
    const gameHeight = scaleManager.height;

    Debug.log(gameWidth);

    const widthRatio = windowWidth / gameWidth;
    const heightRatio = windowHeight / gameHeight;

    const scale = Math.max(widthRatio, heightRatio);
    // const scale = widthRatio;
    console.log(scale);

    scaleManager.resize(gameWidth * scale, gameHeight * scale);
}


/* type Viewport = {
  isPortrait: boolean,
  width: number,
  height: number,
  scale: number
}

const viewport: Viewport = {
  isPortrait: true,
}

const gameResizeFunc = (scaleManager: Phaser.Scale.ScaleManager, viewport: Viewport) => {
  let gameScale=  0
  const {width, height, scale} = viewport;
  const {config: {baseVerticalWidth, baseHorizontalHeight}} = viewport;
  const {minWidth: minw, maxWidth: maxw, minHeight: minh, maxHeight: maxh} = resize;

  if (viewport.isPortrait)
    gameScale = (baseVerticalWidth/verticalWidth) * scale;
  else
    gameScale = (baseHorizontalHeight/horizontalHeight) * scale;

  const w = clamp(Math.round(width/gameScale), minw, maxw);
  const h = clamp(Math.round(height/gameScale), minh, maxh);

  scaleManager.resize(w, h);
}; */