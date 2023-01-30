class Kitchen extends Level {
    constructor(x, y) {
        super();
        this.pos = createVector(x, y);
        this.utensils = [];
        this.targets = [];
        this.activeUtensil = null;
        this.padding = 50;
        this.utensilsY = 250;
        this.knifeBlock = new KnifeBlock(x, height - height*0.3, width * 0.66, height * 0.15);
    }

    init() {
        let shrinkFactor = 0.7;
        // need to actually set the locations here instead of random x, y
        let targets = [openSpatulaOutline, whiskOutline, cookingForkOutline, ladelOutline, servingSpoonOutline, slottedSpatulaOutline, spiderOutline];
        for (let t of targets) {
            t.resize(t.width*shrinkFactor + 5, t.height*shrinkFactor + 5);
        }
        let targetsW = targets.map(t => t.width);
        let avgW = avgerageArray(targetsW);
        let totalW = targets.length * avgW + (this.padding * (targets.length - 1))
        let x = this.pos.x - totalW/2 + avgW/2;
        for (let t of targets) {
            this.targets.push(new UtensilFlippedTarget(x, this.utensilsY, t));
            x += avgW + this.padding;
        }
        
        let utensils = [openSpatula, whisk, cookingFork, ladel, servingSpoon, slottedSpatula, spider];
        for (let i = 0; i < utensils.length; i++) {
            let u = utensils[i];
            u.resize(u.width*shrinkFactor, u.height*shrinkFactor);
            this.utensils.push(new UtensilFlipped(random(100, width - 100), random(100, height - 100), u, this.targets[i]));
        };
        
        let knives = [cleaver, chefsKnife1, chefsKnife2, paringKnife];
        for (let i = 0; i < knives.length; i++) {
            let k = knives[i];
            k.resize(k.width*shrinkFactor, k.height*shrinkFactor);
            this.utensils.push(new Utensil(random(100, width - 100), random(100, height - 100), k, this.knifeBlock));
        };
    }

    handleMousePressed() {
        if (this.activeUtensil)
            this.activeUtensil.handleMousePressed();
    }

    handleMouseReleased() {
        if (this.activeUtensil) {
            this.activeUtensil.checkTarget();
        }
    }
    
    handleDrag(delta) {
        if (this.activeUtensil)
            this.activeUtensil.handleDrag(delta);
    }

    update(m) {
        for (let u of this.utensils) {
            u.update(m);
            if (!this.activeUtensil && u.hovered)
                this.activeUtensil = u;
            if (this.activeUtensil && this.activeUtensil === u && !u.hovered)
                this.activeUtensil = null;
        }

        this.knifeBlock.update(m);
    }

    draw() {
        push();
        translate(this.pos.x, this.pos.y);
        pop();

        for (let t of this.targets) {
            t.draw();
        }

        this.knifeBlock.draw();

        for (let u of this.utensils) {
            if (this.activeUtensil && this.activeUtensil === u)
                continue;
            u.draw();
        }

        if (this.activeUtensil)
            this.activeUtensil.draw();
    }
}

class KnifeBlock extends Rect {
    constructor(x, y, w, h) {
        super(x, y, w, h);
        this.color = color("silver");
    }

    draw() {
        push();
        translate(this.pos.x, this.pos.y);
        rectMode(CENTER);
        noStroke();
        this.color ? fill(this.color) : noFill();
        rect(0, 0, this.w, this.h);
        pop();
    }
}

class Img extends Rect {
    constructor(x, y, p5img) {
        super(x, y, p5img.width, p5img.height);
        this.pos = createVector(x, y);
        this.image = p5img;
        this.hovered = false;
    }

    handleDrag(delta) {
        this.pos.add(delta);
    }

    draw() {
        push();
        translate(this.pos.x, this.pos.y);
        rectMode(CENTER);
        noStroke();
        noFill();
        rect(0, 0, this.w, this.h);
        image(this.image, -this.w/2, -this.h/2);
        pop();
    }
}

class Handle extends Rect {
    constructor(x, y, w, h, hasHole) {
        super(x, y, w, h);
        this.hole = hasHole ? new Hole(x, y-h*0.3, w/2, h*0.25) : null;
    }

    handleDrag(delta) {
        this.pos.add(delta);
        if (this.hole)
            this.hole.pos.add(delta);
    }

    draw() {
        push();
        translate(this.pos.x, this.pos.y);
        rectMode(CENTER);
        noStroke();
        noFill();
        // stroke("red");
        rect(0, 0, this.w, this.h);
        pop();
        
        if (this.hole)
            this.hole.draw();
    }
}

class Hole extends Rect {
    constructor(x, y, w, h) {
        super(x, y, w, h);
    }

    draw() {
        push();
        translate(this.pos.x, this.pos.y);
        rectMode(CENTER);
        noStroke();
        noFill();
        // stroke("yellow");
        rect(0, 0, this.w, this.h);
        pop();
    }
}

class Peg extends Rect {
    constructor(x, y, w, h) {
        super(x, y, w, h);
    }

    draw() {
        push();
        translate(this.pos.x, this.pos.y);
        rectMode(CENTER);
        noStroke();
        noFill();
        // stroke("white");
        rect(0, 0, this.w, this.h);
        pop();
    }
}

class UtensilFlipped extends Img {
    constructor(x, y, p5img, target) {
        super(x, y, p5img);
        this.target = target;
        if (p5img === ladel)
            x -= p5img.width*0.41;
        this.handle = new Handle(x, y-p5img.height/2+48, 25, 92, true);
    }

    update(m) {
        this.handle.update(m);
        this.hovered = this.handle.hovered;
    }

    handleMousePressed() {
        kitchen1.play();
    }

    handleDrag(delta) {
        this.pos.add(delta);
        this.handle.handleDrag(delta);
    }

    checkTarget() {
        if (this.handle.hole.collidesRect(this.target.peg)) {
            let delta = p5.Vector.sub(this.target.peg.pos, this.handle.hole.pos);
            this.handleDrag(delta);
        }

        kitchen2.play();
    }

    draw() {
        push();
        translate(this.pos.x, this.pos.y);
        rectMode(CENTER);
        rotate(PI);
        noStroke();
        noFill();
        rect(0, 0, this.w, this.h);
        image(this.image, -this.w/2, -this.h/2);
        pop();

        this.handle.draw();
    }
}

class UtensilFlippedTarget extends Img {
    constructor(x, y, p5img) {
        super(x, y, p5img);
        if (p5img === ladelOutline)
            x -= p5img.width*0.38;
        this.peg = new Peg(x, y-p5img.height*0.44, p5img.width*0.2, p5img.height*0.1);
    }

    draw() {
        push();
        translate(this.pos.x, this.pos.y);
        rotate(PI);
        rectMode(CENTER);
        noStroke();
        noFill();
        rect(0, 0, this.w, this.h);
        image(this.image, -this.w/2, -this.h/2);
        pop();

        this.peg.draw();
    }
}

class Utensil extends Img {
    constructor(x, y, p5img, target) {
        super(x, y, p5img);
        this.target = target;
    }

    handleMousePressed() {
        knife1.play();
    }

    handleDrag(delta) {
        this.pos.add(delta);
    }

    checkTarget() {
        if (this.collidesRect(this.target)) {
            let pos = createVector(0, 0);
            switch (this.image) {
                case cleaver    : pos = createVector(this.target.pos.x - this.target.w/2 + this.target.w*0.2, this.target.pos.y); break;
                case chefsKnife1: pos = createVector(this.target.pos.x - this.target.w/2 + this.target.w*0.4, this.target.pos.y); break;
                case chefsKnife2: pos = createVector(this.target.pos.x - this.target.w/2 + this.target.w*0.6, this.target.pos.y); break;
                case paringKnife: pos = createVector(this.target.pos.x - this.target.w/2 + this.target.w*0.8, this.target.pos.y); break;
            }
            this.pos.set(pos);
        }
        knife2.play();
    }

    collidesRect(r) {
        let bb = this.getBoundingBox();
        let rbb = r.getBoundingBox();
        return bb.l <= rbb.r &&
               bb.r >= rbb.l &&
               bb.t <= rbb.b &&
               bb.b >= rbb.t;

    }

    draw() {
        push();
        translate(this.pos.x, this.pos.y);
        rectMode(CENTER);
        noStroke();
        noFill();
        rect(0, 0, this.w, this.h);
        image(this.image, -this.w/2, -this.h/2);
        pop();
    }
}