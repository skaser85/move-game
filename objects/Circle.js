class Circle {
    constructor(x, y, r) {
        this.pos = createVector(x, y);
        this.r = r;

        this.hovered = false;
        this.color = null;
    }

    collidesPoint(p) {
        return collidesPointEllipse(p, this.pos.x, this.pos.y, this.r);
    }

    collidesEllipse(e) {
        return collidesEllipseEllipse(this.pos, e.pos, this.r, e.r);
    }

    collidesRect(r) {
        return collidesRectEllipse(r.getBoundingBox(), this.pos.x, this.pos.y, this.r);
    }

    update(m) {
        this.hovered = this.collidesPoint(m);
    }

    draw() {
        push();
        translate(this.pos.x, this.pos.y);
        stroke(this.hovered ? color(0, 255, 0, 255) : "black");
        this.color ? fill(this.color) : noFill();
        circle(0, 0, this.r*2);
        pop();
    }
}