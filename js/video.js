class video
{
    constructor()
    {
        this.init();
    }

   init()
   {
        this.sampleSize = 15;
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
        this.asciString = "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,\"^`'.";
        this.asci = [];
        this.asciLength = 0;
        this.container = document.getElementById('container');
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
        for (var i = 0; i < (Math.floor(this.width / this.sampleSize) * Math.floor(this.height / this.sampleSize)); i++) {
            this.makeElement();
        }
    }

    makeElement()
    {
        let elementData = {
            fontSize: this.columnFontSize[this.elementCount % this.columns] + 'px',
            opacity: 0.4,
            average: 255,
            char: '!',
            x: 0,
            y: 0,
        }

        this.elementArray[this.elementCount] = elementData;
        this.elementCount++;
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

    updateDiv(char, status)
    {

    }

    update()
    {
        this.elementCount = 1;

        this.elementArray[Math.ceil(Math.random() * this.columns)].opacity = 1;

        for (let y = 0; y < this.height; y += this.sampleSize) {
            for (let x = 0; x < this.width; x += this.sampleSize) {
                let p = (x + (y * this.width)) * 4;
                // let average = (0.299 * this.rawData[p]) + (0.587 * this.rawData[p + 1]) + (0.114 * this.rawData[p + 2]);
                let average = (0.2126 * this.rawData[p]) + (0.7152 * this.rawData[p + 1]) + (0.0722 * this.rawData[p + 2]);
                let char = this.asci[Math.floor(this.asciLength * (average / 255))];

                if (
                    this.elementArray[this.elementCount].average >= average + 30
                    || this.elementArray[this.elementCount].average <= average - 30
                ) {
                    this.elementArray[this.elementCount].char = char;
                    this.elementArray[this.elementCount].opacity = 0.7;
                }

                if (
                    this.elementCount > this.columns
                    && this.elementArray[this.elementCount - this.columns].opacity >= 0.7
                    && this.elementArray[this.elementCount - this.columns].opacity <= 0.8
                ) {
                    this.elementArray[this.elementCount].opacity = 1;
                }

                this.elementArray[this.elementCount].average = average
                this.elementArray[this.elementCount].x = x;
                this.elementArray[this.elementCount].y = y;

                if (this.elementArray[this.elementCount].opacity >= 0.1) {
                    this.elementArray[this.elementCount].opacity -= 0.1;
                }

                this.elementCount ++;
            }
        }
    }

    draw()
    {
        if (this.drawing) {
            return;
        }

        this.drawing = true;
            this.ctx.drawImage(this.video, 0, 0, this.width, this.height);
            this.rawData = this.ctx.getImageData(0, 0, this.width, this.height).data;
            this.ctx.fillStyle = "rgba(0, 0, 0, 1)";
            this.ctx.fillRect(0, 0, this.width, this.height);
            for (let i = 1; i < this.elementArray.length; i++) {

                // Letter
                if (this.elementArray[i].opacity > 0.1) {
                    this.ctx.fillStyle = "rgba(227, 233, 58," + this.elementArray[i].opacity + ")";
                    this.ctx.font = this.elementArray[i].fontSize + ' Helvetica';
                    this.ctx.shadowBlur = 2;
                    this.ctx.shadowColor = "rgba(227, 233, 58, 1)";
                    this.ctx.fillText(this.elementArray[i].char, this.elementArray[i].x, this.elementArray[i].y);
                }
            }
        this.drawing = false;
    }
}

let test = new video();