class Books extends Level {
    constructor(x, y) {
        super();
        this.pos = createVector(x, y);
        this.count = 7;
        this.bookWidth = 100;
        this.bookHeight = 500;
        this.padding = 2;
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
        this.titles = [
            "The Terrifying Tales of Terror",
            "Spooky Stories to Get Spooked By",
            "Boo!",
            "Things to Do With Leftover Ham",
            "*Slaps Bookshelf*",
            "This Baby Can Hold So Many Books",
            "The Dictionary"
        ]
    }

    init() {
        let totalW = this.count * this.bookWidth + (this.padding * (this.count-1))
        let x = this.pos.x - totalW/2 + this.bookWidth/2;
        for (let i = 0; i < this.count; i++) {
            let bh = random(400, this.bookHeight)
            this.books.push(new Book(x, this.pos.y + this.bookHeight/2 - bh/2, this.bookWidth, bh, this.colors[i], i+1, this.titles[i]));
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
            this.original_pos = this.pos.copy();
        }
    }

    handleDrag(delta) {
        if (this.activeBook) {
            this.activeBook.handleDrag(delta);
            this.dragOccurred = this.original_pos !== this.pos;
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
        let x = _center.x - totalW/2;
        stroke("red");
        noFill();
        rect(x, _center.y - this.bookHeight/2, totalW, this.bookHeight);
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
    constructor(x, y, w, h, _color, order, title) {
        super(x, y, w, h)
        this.color = _color;
        this.order = order;
        this.title = title;
        this.original_pos = this.pos.copy();
        this.original_w = w;
        this.original_h = h;
        this.textColor = rgb_brightness(_color) < 128 ? "white" : "black";
    }

    handleDrag(delta) {
        this.pos.x += delta.x;
    }

    draw() {
        super.draw();

        push();
        translate(this.pos.x, this.pos.y);
        rotate(PI/2);
        textAlign(CENTER, CENTER);
        textSize(18);
        textStyle(BOLD);
        fill(this.textColor);
        text(this.title, 0, 0);
        pop();
    }
}