class pixel
{
    constructor()
    {
        this.init();
    }

    init()
    {
        this.setFontSize(10),
        this.setOpacity(0)
        this.setAverage(255),
        this.setChar('@'),
        this.setX(0),
        this.setY(0)
    }

    /**
     * Set the fontSize of this pixel.
     *
     * @param string fontSize
     * @author Mike Ponsford
     */
    setFontSize(fontSize)
    {
        this.fontSize = fontSize;
    }

    /**
     * Get the fontSize of this pixel.
     *
     * @return string
     * @author Mike Ponsford
     */
    getFontSize()
    {
        return this.fontSize;
    }

    /**
     * Set the opacity of this Pixel.
     *
     * @param float opacity
     * @author Mike Ponsford
     */
    setOpacity(opacity)
    {
        this.opacity = opacity;
    }

    /**
     * Get the opacity of this Pixel.
     *
     * @return float
     * @author Mike Ponsford
     */
    getOpacity()
    {
        return this.opacity;
    }

    /**
     * Set the average of this pixel.
     *
     * @param int average
     * @author Mike Ponsford
     */
    setAverage(average)
    {
        this.average = average;
    }

    /**
     * Gets the average of this pixel.
     *
     * @return int
     * @author Mike Ponsford
     */
    getAverage()
    {
        return this.average;
    }

    /**
     * Set The letter used when rendering.
     *
     * @param string char
     * @author Mike Ponsford
     */
    setChar(char)
    {
        this.char = char;
    }

    /**
     * Set the X position of this pixel.
     *
     * @param int x
     * @author Mike Ponsford
     */
    setX(x)
    {
        this.x = x;
    }

    /**
     * Set the Y position of this pixel.
     *
     * @param int y
     * @author Mike Ponsford
     */
    setY(y)
    {
        this.y = y;
    }

    /**
     * Set the Y position of this pixel.
     *
     * @param int y
     * @author Mike Ponsford
     */
    fade()
    {
        if (this.getOpacity() >= 0.1) {
            this.opacity -= 0.1;
        }
    }
}