class Kitchen extends Level {
    constructor(x, y) {
        super();
        this.pos = createVector(x, y);
    }

    draw() {
        push();
        translate(this.pos.x, this.pos.y);
        rotate(PI);
        image(openSpatula, -100, 0);
        image(whisk, 100, 0);
        pop();
    }
}