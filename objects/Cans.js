
class Cans {
    constructor(x, y) {
        this.pos = createVector(x, y);
        this.colsAmount = 3;
        this.colWidth = 300;
        this.colHeight = 500;
        this.padding = 0;
        this.maxCansPerColumn = 5;
        this.canHeight = Math.trunc(this.colHeight/this.maxCansPerColumn);
        this.columns = [];
        this.activeCan = null;
    }

    init() {
        let totalW = this.colsAmount * this.colWidth + (this.padding * (this.colsAmount-1))
        let x = this.pos.x - totalW/2 + this.colWidth/2;
        for (let i = 0; i < this.colsAmount; i++) {
            let col = new Column(x, this.pos.y, this.colWidth, this.colHeight, this.canHeight, i);
            col.initCans(random(1, this.maxCansPerColumn-1));
            // col.initCans(2);
            this.columns.push(col);
            x += this.colWidth + this.padding;
        }
    }

    handleMousePressed() {
    }

    handleMouseReleased() {
        if (this.activeCan) {
            let handled = false;
            for (let col of this.columns) {
                let canBB = this.activeCan.getBoundingBox();
                let colBB = col.getBoundingBox();
                if (canBB.l < colBB.r && canBB.l > colBB.l) {
                    handled = true;
                    this.activeCan.column.remove(this.activeCan);
                    col.add(this.activeCan);
                }
            }
            if (!handled)
                this.activeCan.pos.set(this.activeCan.original_pos);
        }
    }

    handleDrag(delta) {
        if (this.activeCan) {
            this.activeCan.handleDrag(delta);
        }
    }

    update(m) {
        for (let col of this.columns) {
            if (!this.activeCan) {
                let can = col.update(m);
                if (can)
                    this.activeCan = can;
            } else {
                this.activeCan.update(m);
                if (!this.activeCan.hovered) {
                    this.activeCan = null;
                }
            }
        }
    }

    draw() {
        for (let col of this.columns) {
            col.draw();
        }
    }
}

class Column {
    constructor(x, y, w, h, canHeight, order) {
        this.pos = createVector(x, y);
        this.w = w;
        this.h = h;
        this.canHeight = canHeight;
        this.order = order;
        this.cans = [];
    }

    getBoundingBox() {
        return getCenteredBoundingBox(this.pos, this.w, this.h);
    }

    initCans(amount) {
        let y = this.pos.y + this.h/2 - this.canHeight/2;
        for (let i = 0; i < amount; i++) {
            let c = new Can(this.pos.x, y, this.w * 0.98, this.canHeight, color("#FF00FF55"), this.order, i, this);
            y -= this.canHeight;
            this.cans.push(c);
        }
    }

    add(can) {
        can.pos.x = this.pos.x;
        this.cans.push(can);
    }

    remove(can) {
        this.cans = this.cans.filter(c => c !== can);
    }

    update(m) {
        let activeCan = null;
        for (let can of this.cans) {
            can.update(m);
            if (can.hovered) {
                activeCan = can;
            }
        }
        return activeCan;
    }

    draw() {
        push();
        rectMode(CENTER);
        stroke(color("#8000DE"));
        noFill();
        rect(this.pos.x, this.pos.y, this.w, this.h);
        pop();

        for (let can of this.cans) {
            can.draw();
        }
    }
}

class Can extends Rect {
    constructor(x, y, w, h, _color, columnOrder, canOrder, column) {
        super(x, y, w, h);
        this.color = _color;
        this.hovered = false;
        this.columnOrder = columnOrder;
        this.order = canOrder;
        this.column = column;
        this.original_pos = this.pos.copy();
    }

    handleDrag(delta) {
        this.pos.add(delta);
    }

    draw() {
        push();
        rectMode(CENTER);
        stroke(this.hovered ? color(255, 0, 0) : "black");
        fill(this.color);
        rect(this.pos.x, this.pos.y, this.w, this.h, 0, 0, 20, 20);
        push();
        textAlign(CENTER, CENTER);
        textSize(20);
        stroke("blue");
        fill("black");
        text(`Col: ${this.columnOrder} :: Stack: ${this.order}`, this.pos.x, this.pos.y);
        pop();
        pop();
    }
}