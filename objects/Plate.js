class Plate extends Level {
    constructor(x, y) {
        super();
        this.pos = createVector(x, y);
        this.plateR = width * 0.55;
        
        // target dims
        this.orangeW = this.plateR * 0.45;
        this.orangeH = this.orangeW * 0.35;
        this.toastDim = this.plateR * 0.45;
        this.eggR = this.plateR * 0.35;
        this.strawberryDim = this.plateR * 0.1;
        this.blueberryR = this.plateR * 0.075;

        // targets
        this.toastTarget = new Rect(0, 0, this.toastDim, this.toastDim);
        this.strawberryTargets = [
            new StrawberryTarget(0, 0, this.strawberryDim, this.strawberryDim, -45, this.plateR/2 - this.strawberryDim*0.8),
            new StrawberryTarget(0, 0, this.strawberryDim, this.strawberryDim, 45, this.plateR/2 - this.strawberryDim*0.8),
            new StrawberryTarget(0, 0, this.strawberryDim, this.strawberryDim, 135, this.plateR/2 - this.strawberryDim*0.8),
            new StrawberryTarget(0, 0, this.strawberryDim, this.strawberryDim, 225, this.plateR/2 - this.strawberryDim*0.8)
        ];
        
        // food
        this.orangeSlices = [];
        this.toast = null;
        this.strawberries = [];
        this.blueberries = [];

        // misc
        this.activeFood = null;
        this.temp = false;
    }

    init() {
        this.toast = new Toast(random(width), random(height), this.toastDim, this.toastDim);
        this.strawberries.push(new Strawberry(random(width), random(height), this.strawberryDim, this.strawberryDim));
    }

    handleMouseReleased() {
        if (this.activeFood) {
            if (this.activeFood === this.toast) {
                let toastTargetPos = this.toastTarget.pos.copy().add(_center);
                let tempToast = new Rect(toastTargetPos.x, toastTargetPos.y, this.toastDim, this.toastDim);
                if (this.toast.collidesRect(tempToast)) {
                    let d = p5.Vector.dist(this.toast.pos, tempToast.pos);
                    if (d < this.toastDim/2) {
                        this.toast.pos.set(tempToast.pos.copy());
                    }
                }
            } else if (this.strawberries.includes(this.activeFood)) {
                for (let st of this.strawberryTargets) {
                    if (this.activeFood.collidesRect(st)) {
                        let d = p5.Vector.dist(this.activeFood.pos, st.pos);
                        if (d < this.strawberryDim/2)
                            this.activeFood.pos.set(st.pos.copy());
                    }
                }
            }
        }
    }

    handleDrag(delta) {
        if (this.activeFood)
            this.activeFood.handleDrag(delta);
    }

    update(m) {
        if (this.activeFood)
            this.activeFood.update(m);
        if (this.activeFood && !this.activeFood.hovered)
            this.activeFood = null;

        if (!this.activeFood) {
            this.toast.update(m);
            if (this.toast.hovered)
                this.activeFood = this.toast;
        }

        if (!this.activeFood) {
            for (let s of this.strawberries) {
                s.update(m);
                if (s.hovered && !this.activeFood)
                    this.activeFood = s;
            }
        }
    }

    draw() {
        // draw plate
        push();
        translate(this.pos.x, this.pos.y);
        stroke("black");
        fill(color(255, 75));
        circle(0, 0, this.plateR);
        pop();

        
        // draw orange slices targets
        push();
        translate(this.pos.x, this.pos.y);
        noFill();
        rectMode(CENTER);
        rect(0, -this.plateR/2 + this.orangeH * 0.75, this.orangeW, this.orangeH, this.orangeH, this.orangeH, 0, 0);
        rotate(PI/2);
        rect(0, -this.plateR/2 + this.orangeH * 0.75, this.orangeW, this.orangeH, this.orangeH, this.orangeH, 0, 0);
        rotate(PI/2);
        rect(0, -this.plateR/2 + this.orangeH * 0.75, this.orangeW, this.orangeH, this.orangeH, this.orangeH, 0, 0);
        rotate(PI/2);
        rect(0, -this.plateR/2 + this.orangeH * 0.75, this.orangeW, this.orangeH, this.orangeH, this.orangeH, 0, 0);
        rotate(PI/2); // complete the rotation so we're back to facing up
        pop();

        // draw toast target
        push();
        translate(this.pos.x, this.pos.y);
        this.toastTarget.draw();
        pop();
        
        // draw egg target
        push();
        noFill();
        translate(this.pos.x, this.pos.y);
        circle(0, 0, this.eggR);
        pop();
        
        // draw strawberry targets
        for (let st of this.strawberryTargets) {
            st.draw();
        }
        
        // draw the blueberry targets
        push();
        translate(this.pos.x, this.pos.y);
        noFill();
        circle(0, -this.toastDim/2 - this.blueberryR/2, this.blueberryR);
        rotate(PI/2);
        circle(0, -this.toastDim/2 - this.blueberryR/2, this.blueberryR);
        rotate(PI/2);
        circle(0, -this.toastDim/2 - this.blueberryR/2, this.blueberryR);
        rotate(PI/2);
        circle(0, -this.toastDim/2 - this.blueberryR/2, this.blueberryR);
        rotate(PI/2); // complete the rotation so we're back to facing up
        pop();

        if ((!this.activeFood) || (this.activeFood && this.activeFood !== this.toast))
            this.toast.draw();
        for (let s of this.strawberries) {
            if ((!this.activeFood) || (this.activeFood && this.activeFood !== s))
                s.draw();
        }

        if (this.activeFood)
            this.activeFood.draw();
    }
}

class Toast extends Rect {
    constructor(x, y, w, h) {
        super(x, y, w, h);
    }

    handleDrag(delta) {
        this.pos.add(delta);
    }

    draw() {
        push();
        rectMode(CENTER);
        translate(this.pos.x, this.pos.y);
        stroke(this.hovered ? color(0, 255, 0) : "black");
        fill("#65350F");
        rect(0, 0, this.w, this.h);
        pop();
    }
}

class Strawberry extends Rect {
    constructor(x, y, w, h) {
        super(x, y, w, h);
    }

    handleDrag(delta) {
        this.pos.add(delta);
    }

    draw() {
        push();
        rectMode(CENTER);
        translate(this.pos.x, this.pos.y);
        stroke(this.hovered ? color(0, 255, 0) : "black");
        fill("red");
        rect(0, 0, this.w, this.h);
        fill(0, 200, 0);
        rect(0, -this.h/2+this.h/8, this.w, this.h/4);
        pop();
    }
}

class StrawberryTarget extends Rect {
    constructor(x, y, w, h, angle, len) {
        super(x, y, w, h);
        this.pos = p5.Vector.fromAngle(radians(angle), len).add(_center);
    }

    draw() {
        push();
        rectMode(CENTER);
        noFill();
        rect(this.pos.x, this.pos.y, this.w, this.h);
        pop();
    }
}