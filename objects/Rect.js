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

class Book extends Rect {
    constructor(x, y, w, h, _color, order) {
        super(x, y, w, h)
        this.color = _color;

        this.order = order;
    }

    handleDrag(delta) {
        this.pos.x += delta.x;
    }

    update(m, books) {
        super.update(m);

        // if (this.hovered) {
        //     books = books.filter(b => b !== this);
        //     for (let book of books) {
        //         let d = p5.Vector.dist(this.pos, book.pos);
        //         if (d < (this.w/2 + book.w/2)) {
        //             push();
        //             stroke(color("red"));
        //             strokeWeight(5);
        //             line(this.pos.x, this.pos.y, book.pos.x, book.pos.y);
        //             pop();
        //         }
        //     }
        // }
    }

    draw(bw, bh) {
        if (this.hovered) {
            this.w = bw * 1.1;
            this.h = bh * 1.1;
        } else {
            this.w = bw;
            this.h = bh;
        }

        super.draw();

        push();
        textAlign(CENTER, CENTER);
        textSize(32);
        textStyle(BOLD);
        text(this.order, this.pos.x, this.pos.y - 50);
        pop();
    }
}