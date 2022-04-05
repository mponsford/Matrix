class video
{
    constructor()
    {
        this.init();
    }

   init()
   {
        this.sampleSize = 10;
        this.widthPreCorrection = window.outerWidth;
        this.heightPreCorrection = window.outerHeight;
        this.width = this.widthPreCorrection - (this.widthPreCorrection % this.sampleSize);
        this.height = this.heightPreCorrection - (this.heightPreCorrection % this.sampleSize);;
        this.columns = this.width / this.sampleSize;
        this.minFontSize = this.sampleSize - 5;
        this.columnFontSize = [];
        this.video = document.getElementById('video');
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.rawData = null;
        this.count = 1;
        this.elementCount = 1;
        this.elementArray = [];
        this.stream = null;
        this.canvasDraw = null;
        this.drawing = false;
        this.asciString = "$@`B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,\"^`'.";
        this.asci = [];
        this.asciLength = 0;
        this.setup()
        this.initialiseVideo()
        this.playCanvas()
   }

    setup()
    {
        // Dynamically Set the font size of the columns
        for (let i = 0; i < this.columns; i++) {
            this.columnFontSize[i] = this.minFontSize + (Math.floor(Math.random() * 10));
        }

        // Build the AsciArray from the asci String
        for (let i = 1; i < this.asciString.length; i++) {
            this.asci.push(this.asciString.charAt(i));
        }

        this.asciLength = this.asci.length - 1;

        // Create all the elements for display on the page.
        for (let y = 0; y < this.height; y += this.sampleSize) {
            for (let x = 0; x < this.width; x += this.sampleSize) {
                let p = new pixel();
                p.setX(x);
                p.setY(y);
                //p.setFontSize(this.columnFontSize[this.columns % x] + 'px');

                this.elementArray[this.elementCount] = p;
                this.elementCount++;
            }
        }
    }

    async initialiseVideo()
    {
        this.video.height = this.height;
        this.video.width = this.width;
        this.canvas.height = this.height;
        this.canvas.width = this.width;

        try {
            this.stream = await navigator.mediaDevices.getUserMedia(
                {
                    video: true,
                }
            );
        } catch(err) {
            console.log(err);
        }
        this.video.srcObject = this.stream;
    }

    playCanvas()
    {
        this.update.bind(this)
        this.logic = setInterval(this.update.bind(this), 34);
        this.canvasDraw = setInterval(this.draw.bind(this), 34);
    }

    async update()
    {
        this.elementCount = 1;
        this.elementArray[Math.ceil(Math.random() * this.columns)].setOpacity(1);

        for (let i = 1; i < this.elementArray.length; i++) {
            let currentElement = this.elementArray[i];
            let p = (currentElement.x + (currentElement.y * this.width)) * 4;
            let average = (0.2126 * this.rawData[p]) + (0.7152 * this.rawData[p + 1]) + (0.0722 * this.rawData[p + 2]);
            let char = this.asci[Math.floor(this.asciLength * (average / 255))];
            let aboveElement = null;

            if (i > this.columns) {
                aboveElement = this.elementArray[i - this.columns];
            }

            if (
                currentElement.getAverage() >= average + 25
                || currentElement.getAverage() <= average - 25
            ) {
                currentElement.setAverage(average);
                currentElement.setChar(char);
                currentElement.setOpacity(0.7);
            }

            // Seed Opacity
            if (
                aboveElement
                && aboveElement.getOpacity() >= 0.7
                && aboveElement.getOpacity() <= 0.8
            ) {
                currentElement.setOpacity(1);
            }

            currentElement.fade()

            this.elementArray[i] = currentElement;
        }
    }

    async draw()
    {
        if (this.drawing === true) {
            return;
        }
        this.drawing = true;
            this.ctx.drawImage(this.video, 0, 0, this.width, this.height);
            this.rawData = this.ctx.getImageData(0, 0, this.width, this.height).data;
            this.ctx.fillStyle = "rgba(0, 0, 0, 1)";
            this.ctx.fillRect(0, 0, this.width, this.height);
            for (let i = 1; i < this.elementArray.length; i++) {
                let pixel = this.elementArray[i];
                if (pixel.getOpacity() >= 0.1) {
                    this.ctx.fillStyle = "rgba(227, 233, 58," + pixel.getOpacity() + ")";
                    this.ctx.font = pixel.getFontSize() + ' Helvetica';
                    this.ctx.shadowBlur = 10;
                    this.ctx.shadowColor = "rgba(227, 233, 58, 1)";
                    this.ctx.fillText(pixel.char, pixel.x, pixel.y);
                }
            }
        this.drawing = false;
    }
}

let test = new video();