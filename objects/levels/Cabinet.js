class Cabinet extends Level {
    constructor(x, y) {
        super();
        this.pos = createVector(x, y);
        this.jars = [];
        this.activeJar = null;
        this.padding = 10;
        this.dragOccurred = false;
    }

    init() {
        let jars = [paprikaJar, garlicPowderJar, oreganoJar, saltJar];
        for (let j of jars) {
            j.resize(j.width * 0.75, j.height * 0.75);
        }
        let totalW = jars.length * jars[0].width + (this.padding * (jars.length - 1));
        let x = this.pos.x - totalW/2 + jars[0].width/2;
        let y = this.pos.y;
        for (let j of jars) {
            this.jars.push(new Img(x, y, j));
            x += j.width + this.padding;
        }
        shuffleArray(this.jars);
    }

    repositionJars() {
        let totalW = this.jars.length * this.jars[0].image.width + (this.padding * (this.jars.length - 1));
        let x = this.pos.x - totalW/2 + this.jars[0].image.width/2;
        for (let j of this.jars) {
            j.pos.x = x;
            x += j.image.width + this.padding;
        }
    }

    handleMousePressed() {
        if (this.activeJar) {
            canSound1.play();
        }
    }

    handleMouseReleased() {
        if (this.activeJar && this.dragOccurred) {
            this.jars.sort((a, b) => a.getBoundingBox().l - b.getBoundingBox().l);
            this.repositionJars();
            canSound2.play();
            this.dragOccurred = false;
            this.activeJar.original_pos = this.activeJar.pos.copy();
        }
    }

    handleDrag(delta) {
        if (this.activeJar) {
            this.activeJar.pos.x += delta.x;
            this.dragOccurred = this.activeJar.original_pos !== this.activeJar.pos;
        }
    }

    update(m) {
        for (let j of this.jars) {
            j.update(m);
            if (!this.activeJar && j.hovered)
                this.activeJar = j;
            if (this.activeJar && this.activeJar === j && !j.hovered)
                this.activeJar = null;
        }
    }

    draw() {
        for (let j of this.jars) {
            if (this.activeJar && this.activeJar === j)
                continue;
            j.draw();
        }

        if (this.activeJar)
            this.activeJar.draw();
    }
}