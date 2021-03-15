// let texture: HTMLCanvasElement;
// let recolor: HTMLCanvasElement;

// export const createLayeredCanvas = (_images: HTMLImageElement[], _data: LayeredItemConfig[]) =>
// {
// 	if (!texture) texture = document.createElement('canvas');
// 	if (!recolor) recolor = document.createElement('canvas');

// 	const images = _images.slice().reverse();
// 	const data = _data.slice().reverse();

// 	const w = images[0].width;
// 	const h = images[0].height;

// 	texture.width = w;
// 	texture.height = h;

// 	const ctx = texture.getContext('2d');

// 	if (!ctx)
// 		return null;

// 	ctx.clearRect(0, 0, w, h);


// 	data.forEach((layer, i) => {
// 		const img = images[i];

// 		if (!layer.color) {
// 			ctx.drawImage(img, 0, 0);
// 			return;
// 		}

// 		const rw = img.width;
// 		const rh = img.height;

// 		recolor.width = rw;
// 		recolor.height = rh;

// 		const rctx = recolor.getContext('2d');

// 		if (!rctx)
// 			return;

// 		rctx.globalCompositeOperation = 'source-over';

// 		rctx.clearRect(0, 0, rw, rh);
// 		rctx.drawImage(img, 0, 0);

// 		rctx.globalCompositeOperation = 'source-in';

// 		rctx.fillStyle = layer.color;
// 		rctx.fillRect(0, 0, rw, rh);

// 		ctx.drawImage(recolor, 0, 0);
// 	});


// 	return texture;
// };
