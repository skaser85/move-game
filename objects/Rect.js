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

    collidesRect(r) {
        let bb = this.getBoundingBox();
        let rbb = r.getBoundingBox();
        return bb.l <= rbb.r &&
               bb.r >= rbb.l &&
               bb.t <= rbb.b &&
               bb.b >= rbb.t;

    }

    update(m) {
        this.hovered = this.collidesPoint(m);
    }

    draw() {
        push();
        translate(this.pos.x, this.pos.y);
        rectMode(CENTER);
        stroke(this.hovered ? color(0, 255, 0) : "black");
        this.color ? fill(this.color) : noFill();
        rect(0, 0, this.w, this.h);
        pop();
    }
}