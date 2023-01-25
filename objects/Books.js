class Books {
    constructor(x, y, count) {
        this.pos = createVector(x, y);
        this.count = count;
        this.bookWidth = 100;
        this.bookHeight = 500;
        this.padding = 10;
        this.books = [];
        this.activeBook = null;
        this.dragOccurred = false;
        this.colors = [
            color("#ff0000"),
            color("#ff9900"),
            color("#ffff00"),
            color("#00ff00"),
            color("#0000ff"),
            color("#4b0082"),
            color("#8000DE")
        ]
    }

    init() {
        let totalW = this.count * this.bookWidth + (this.padding * (this.count-1))
        let x = this.pos.x - totalW/2 + this.bookWidth/2;
        for (let i = 0; i < this.count; i++) {
            // this.books.push(new Book(x, this.pos.y, this.bookWidth, this.bookHeight, this.colors[i], i+1));
            let bh = random(400, this.bookHeight)
            this.books.push(new Book(x, this.pos.y + this.bookHeight/2 - bh/2, this.bookWidth, bh, this.colors[i], i+1));
            x += this.bookWidth + this.padding;
        }
        shuffleArray(this.books);
        this.repositionBooks();
    }

    repositionBooks() {
        let totalW = this.count * this.bookWidth + (this.padding * (this.count-1))
        let x = this.pos.x - totalW/2 + this.bookWidth/2;
        for (let book of this.books) {
            book.pos.x = x;
            x += this.bookWidth + this.padding;
        }
    }

    handleMousePressed() {
        if (this.activeBook) {
            bookSound2.play();
        }
    }

    handleMouseReleased() {
        if (this.activeBook && this.dragOccurred) {
            this.books.sort((a, b) => a.getBoundingBox().l - b.getBoundingBox().l);
            this.repositionBooks();
            bookSound1.play();
            this.dragOccurred = false;
        }
    }

    handleDrag(delta) {
        if (this.activeBook) {
            this.dragOccurred = delta.mag() ? true : false;
            this.activeBook.handleDrag(delta);
        }
    }

    update(m) {
        for (let book of this.books) {
            book.update(m, this.books);
            if (this.activeBook && this.activeBook.order === book.order && !book.hovered)
                this.activeBook = null;
            else if (!this.activeBook && book.hovered)
                this.activeBook = book;
            else if (this.activeBook && this.activeBook.order !== book.order && book.hovered)
                book.hovered = false;
        }
    }

    draw() {

        push();
        let totalW = this.count * this.bookWidth + (this.padding * (this.count-1))
        let x = center.x - totalW/2;
        stroke("red");
        noFill();
        rect(x, center.y - this.bookHeight/2, totalW, this.bookHeight);
        pop();

        for (let book of this.books) {
            if (this.activeBook) {
                if (book !== this.activeBook)
                    book.draw();
            } else {
                book.draw();
            }
        }

        if (this.activeBook)
            this.activeBook.draw();
    }
}

class Book extends Rect {
    constructor(x, y, w, h, _color, order) {
        super(x, y, w, h)
        this.color = _color;
        this.order = order;
        this.original_w = w;
        this.original_h = h;
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

    draw() {
        // if (this.hovered) {
        //     this.w = this.original_w * 1.1;
        //     this.h = this.original_h * 1.1;
        // } else {
        //     this.w = this.original_w;
        //     this.h = this.original_h;
        // }

        super.draw();

        push();
        textAlign(CENTER, CENTER);
        textSize(32);
        textStyle(BOLD);
        text(this.order, this.pos.x, this.pos.y - 50);
        textSize(12);
        text(Math.trunc(this.original_h), this.pos.x, this.pos.y - 75);
        pop();
    }
}