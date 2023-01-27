class Rect {
    constructor(x, y, w, h) {
        this.pos = createVector(x, y);
        this.w = w;
        this.h = h;

        this.hovered = false;
        this.color = null;
    }

    getBoundingBox() {
        return get_centeredBoundingBox(this.pos, this.w, this.h);
    }

    collidesPoint(p) {
        return collidesRectPoint(this.getBoundingBox(), p);
    }

    collidesRect(r) {
        return this.pos.x < r.pos.x + r.w    &&
               this.pos.x + this.w > r.pos.x &&
               this.pos.y < r.pos.y + r.h    &&
               this.pos.y + this.h > r.pos.y;
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
        pop();
    }
}