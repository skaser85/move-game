class Rect {
    constructor(x, y, w, h) {
        this.pos = createVector(x, y);
        this.w = w;
        this.h = h;

        this.hovered = false;
        this.color = null;
    }

    getBoundingBox() {
        return getCenteredBoundingBox(this.pos, this.w, this.h);
    }

    collidesPoint(p) {
        return collidesRectPoint(this.getBoundingBox(), p);
    }

    collidesRect(rbb) {
        return collidesRectRect(this.getBoundingBox, rbb);
    }

    update(m) {
        this.hovered = this.collidesPoint(m);
    }

    draw() {
        push();
        rectMode(CENTER);
        stroke(this.hovered ? color(0, 255, 0) : "black");
        this.color ? fill(this.color) : noFill();
        rect(this.pos.x, this.pos.y, this.w, this.h);
        fill("black");
        circle(this.pos.x, this.pos.y, 30);
        pop();
    }
}