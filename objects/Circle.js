class Circle {
    constructor(x, y, r, _color) {
        this.pos = createVector(x, y);
        this.r = r;

        this.hovered = false;
        this.color = _color;
    }

    collidesPoint(p) {
        return collidesPointEllipse(p, this.pos.x, this.pos.y, this.r);
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
        fill(this.color);
        circle(this.pos.x, this.pos.y, this.r*2);
        pop();
    }
}