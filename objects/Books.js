class Books {
    constructor(x, y, count) {
        this.pos = createVector(x, y);
        this.count = count;
        this.bookWidth = 100;
        this.bookHeight = 500;
        this.padding = 10;
        this.books = [];
        this.activeBook = null;
        this.colors = [
            color("red"),
            color("blue"),
            color("green"),
            color("yellow"),
            color("cyan"),
            color("orange"),
            color("purple")
        ]
    }

    init() {
        let totalW = this.count * this.bookWidth + (this.padding * (this.count-1))
        let x = this.pos.x - totalW/2 + this.bookWidth/2;
        for (let i = 0; i < this.count; i++) {
            this.books.push(new Book(x, this.pos.y, this.bookWidth, this.bookHeight, this.colors[i], i+1));
            x += this.bookWidth + this.padding;
        }
    }

    handleMouseReleased() {
        this.books.sort((a, b) => a.getBoundingBox().l - b.getBoundingBox().l);
        for (let i = 0; i < this.books.length; i++) {
            this.books[i].order = i + 1;
        }
    
        let totalW = this.count * this.bookWidth + (this.padding * (this.count-1))
        let x = this.pos.x - totalW/2 + this.bookWidth/2;
        for (let book of this.books) {
            book.pos.x = x;
            x += this.bookWidth + this.padding;
        }
    }

    handleDrag(delta) {
        if (this.activeBook)
            this.activeBook.handleDrag(delta);
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
                    book.draw(this.bookWidth, this.bookHeight);
            } else {
                book.draw(this.bookWidth, this.bookHeight);
            }
        }

        if (this.activeBook)
            this.activeBook.draw(this.bookWidth, this.bookHeight);
    }
}