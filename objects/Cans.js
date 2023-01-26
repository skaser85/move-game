class Cans {
    constructor(x, y) {
        this.pos = createVector(x, y);
        this.colsAmount = 3;
        this.colWidth = 300;
        this.colHeight = 600;
        this.padding = 0;
        this.maxCansPerColumn = 5;
        this.canHeight = Math.trunc(this.colHeight/this.maxCansPerColumn);
        this.columns = [];
        this.activeCan = null;
        let FOOD = new Category("food", color(255, 0, 0, 128));
        let HAIR = new Category("hair", color(255, 255, 0, 128));
        let MINT = new Category("mint", color(0, 255, 128, 128));
        this.products = [
            new Product("Cat Food", FOOD),
            new Product("Dog Food", FOOD),
            new Product("Fish Food", FOOD),
            new Product("Dapper Dan", HAIR),
            new Product("FOP", HAIR),
            new Product("Old Spice", HAIR),
            new Product("Altoids", MINT),
            new Product("Life Savers", MINT),
            new Product("Andes", MINT),
        ]
    }

    init() {
        shuffleArray(this.products);
        let totalW = this.colsAmount * this.colWidth + (this.padding * (this.colsAmount-1))
        let x = this.pos.x - totalW/2 + this.colWidth/2;
        for (let i = 0; i < this.colsAmount; i++) {
            let col = new Column(x, this.pos.y, this.colWidth, this.colHeight, this.canHeight, i);
            let cansAmount = 3;
            // if (this.products.length - 1 < cansAmount)
            //     cansAmount = this.products.length - 1;
            // console.log(cansAmount);
            let products = [];
            for (let k = 0; k < cansAmount; k++) {
                products.push(this.products.pop());
            }
            col.initCans(cansAmount, products);
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
                if (this.activeCan.column === col) {
                    continue;
                }
                let moveDir = Math.sign(p5.Vector.sub(this.activeCan.pos, this.activeCan.original_pos).x);
                let canBB = this.activeCan.getBoundingBox();
                let colBB = col.getBoundingBox();
                let isInNewCol = false;
                if (moveDir < 1) {
                    isInNewCol = canBB.l < colBB.r && canBB.l > colBB.l && canBB.b <= colBB.b;
                } else {
                    isInNewCol = canBB.r > colBB.l && canBB.r < colBB.r && canBB.b <= colBB.b;
                }
                if (isInNewCol) {
                    if (col.cans.length === this.maxCansPerColumn) {
                        handled = true;
                        this.activeCan.pos.set(this.activeCan.original_pos);
                        continue;
                    }
                    handled = true;
                    this.activeCan.column.remove(this.activeCan);
                    col.add(this.activeCan);
                    this.activeCan.original_pos = this.activeCan.pos.copy();
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

    initCans(amount, products) {
        let y = this.pos.y + this.h/2 - this.canHeight/2;
        for (let i = 0; i < amount; i++) {
            let c = new Can(this.pos.x, y, this.w * 0.98, this.canHeight, this.order, i, this, products[i]);
            y -= this.canHeight;
            this.cans.push(c);
        }
    }

    repositionCans() {
        let y = this.pos.y + this.h/2 - this.canHeight/2;
        for (let can of this.cans) {
            can.pos.y = y;
            y -= this.canHeight;
        }
    }

    add(can) {
        can.pos.x = this.pos.x;
        can.column = this;
        this.cans.push(can);
        this.repositionCans();
    }

    remove(can) {
        this.cans = this.cans.filter(c => c !== can);
        this.repositionCans();
    }

    update(m) {
        let activeCan = null;
        // allow for any can to be selected
        // for (let can of this.cans) {
        //     can.update(m);
        //     if (can.hovered) {
        //         activeCan = can;
        //     }
        // }
        // allow for only the top can to be selected
        if (this.cans.length) {
            this.cans[this.cans.length-1].update(m)
            if (this.cans[this.cans.length-1].hovered)
                activeCan = this.cans[this.cans.length-1];
        }
        return activeCan;
    }

    draw() {
        push();
        rectMode(CENTER);
        stroke(color("#8000DE"));
        noFill();
        // rect(this.pos.x, this.pos.y, this.w, this.h);
        pop();

        for (let can of this.cans) {
            can.draw();
        }
    }
}

class Can extends Rect {
    constructor(x, y, w, h, columnOrder, canOrder, column, product) {
        super(x, y, w, h);
        this.hovered = false;
        this.columnOrder = columnOrder;
        this.order = canOrder;
        this.column = column;
        this.product = product;
        this.original_pos = this.pos.copy();
    }

    handleDrag(delta) {
        this.pos.add(delta);
    }

    draw() {
        push();
        rectMode(CENTER);
        stroke(this.hovered ? color(255, 0, 0) : "black");
        fill(this.product.category.color);
        rect(this.pos.x, this.pos.y, this.w, this.h, 0, 0, 20, 20);
        stroke("white");
        fill(color(200, 255));
        rect(this.pos.x, this.pos.y - this.h/2 + this.h/10, this.w, this.h/5, 0, 0, 20, 20);
        push();
        textAlign(CENTER, CENTER);
        textSize(20);
        stroke("blue");
        fill("black");
        text(this.product.name, this.pos.x, this.pos.y);
        pop();
        pop();
    }
}

class Category {
    constructor(name, _color) {
        this.name = name;
        this.color = _color;
    }
}

class Product {
    constructor(name, category) {
        this.name = name;
        this.category = category;
    }
}