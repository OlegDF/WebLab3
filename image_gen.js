function getRandomInRange(min, max) {
	return min + Math.random() * (max - min);
}

var ctx;
var quoteText;
var anchor;
var canvas;

function makeImage() {
	anchor = document.createElement("a");
	document.body.appendChild(anchor);
	
	canvas = document.createElement("canvas");
	canvas.width = 600;
	canvas.height = 800;
	anchor.appendChild(canvas);
	
	border_width = Math.round(getRandomInRange(canvas.width * 0.25, canvas.width * 0.75))
	border_height = Math.round(getRandomInRange(canvas.height * 0.25, canvas.height * 0.75))
	
	var img1 = new Image();
	fetch("https://source.unsplash.com/collection/212915/" + border_width + "x" + border_height + "?r=1").then((response) => {
		response.blob().then ((blob) => {
			const objectURL = URL.createObjectURL(blob);
			img1.src = objectURL;
		});
	});
	
	var img2 = new Image();
	fetch("https://source.unsplash.com/collection/212915/" + (canvas.width - border_width) + "x" + border_height + "?r=1").then((response) => {
		response.blob().then ((blob) => {
			const objectURL = URL.createObjectURL(blob);
			img2.src = objectURL;
		});
	});
	
	var img3 = new Image();
	fetch("https://source.unsplash.com/collection/212915/" + border_width + "x" + (canvas.height - border_height) + "?r=1").then((response) => {
		response.blob().then ((blob) => {
			const objectURL = URL.createObjectURL(blob);
			img3.src = objectURL;
		});
	});
	
	var img4 = new Image();
	fetch("https://source.unsplash.com/collection/212915/" + (canvas.width - border_width) + "x" + (canvas.height - border_height) + "?r=1").then((response) => {
		response.blob().then ((blob) => {
			const objectURL = URL.createObjectURL(blob);
			img4.src = objectURL;
		});
	});
	
	if(canvas.getContext) {
		ctx = canvas.getContext("2d");
		imagesDone = 0;
		ctx.fillStyle = "white";
		ctx.fillRect(0, 0, 600, 800);
		img1.onload = function(){
			ctx.globalAlpha = 0.5;
			ctx.drawImage(img1, 0, 0, border_width, border_height);
			imagesDone++;
		}
		img2.onload = function(){
			ctx.globalAlpha = 0.5;
			ctx.drawImage(img2, border_width, 0, canvas.width - border_width, border_height);
			imagesDone++;
		}
		img3.onload = function(){
			ctx.globalAlpha = 0.5;
			ctx.drawImage(img3, 0, border_height, border_width, canvas.height - border_height);
			imagesDone++;
		}
		img4.onload = function(){
			ctx.globalAlpha = 0.5;
			ctx.drawImage(img4, border_width, border_height, canvas.width - border_width, canvas.height - border_height);
			imagesDone++;
		}
		loadText();
	}
}

function parseQuote(response) {
	quoteText = response.quoteText + " (" + response.quoteAuthor + ")";
}

function loadText() {
	if(imagesDone < 4) {
		window.setTimeout(loadText, 100);
		console.log("Waiting for images...")
	} else {
		var qtag = document.createElement("script");
		qtag.src = "http://api.forismatic.com/api/1.0/?method=getQuote&format=jsonp&jsonp=parseQuote&lang=ru";
		document.head.appendChild(qtag);
		drawText();
    }
}

function drawText() {
	if(quoteText == null) {
		window.setTimeout(drawText, 100);
		console.log("Waiting for text...")
	} else {
		ctx.fillStyle = "black";
		ctx.globalAlpha = 1;
		ctx.font = "48px sans-serif";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		var words = quoteText.split(' ');
		var line = '';
		var maxWidth = 550;
		newText = [];
		for(var i = 0; i < words.length; i++) {
			var newLine = line + words[i] + ' ';
			if(ctx.measureText(newLine).width > maxWidth && i > 0) {
				newText.push(line);
				line = words[i] + ' ';
			} else {
				line = newLine;
			}
		}
		newText.push(line);
		for(var i = 0; i < newText.length; i++) {
			ctx.fillText(newText[i], 300, 400 + (i - newText.length / 2) * 48, maxWidth);
		}
		anchor.setAttribute("href", canvas.toDataURL());
		anchor.setAttribute("download", "newCanvas.jpeg");
	}
}