class Img extends Rect {
    constructor(x, y, p5img) {
        super(x, y, p5img.width, p5img.height);
        this.pos = createVector(x, y);
        this.image = p5img;
        this.hovered = false;
        this.original_pos = this.pos.copy();
    }

    resize(w, h) {
        this.image.resize(w, h);
    }

    handleDrag(delta) {
        this.pos.add(delta);
    }

    draw() {
        push();
        translate(this.pos.x, this.pos.y);
        rectMode(CENTER);
        noStroke();
        noFill();
        rect(0, 0, this.w, this.h);
        image(this.image, -this.image.width/2, -this.image.height/2);
        pop();
    }
}