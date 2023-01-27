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
        this.blueberryR = this.plateR * 0.075/2;

        // targets
        this.toastTarget = new Rect(0, 0, this.toastDim, this.toastDim);
        this.eggTarget = new EggTarget(0, 0, this.eggR/2);
        this.strawberryTargets = [
            new StrawberryTarget(0, 0, this.strawberryDim, this.strawberryDim, -45, this.plateR/2 - this.strawberryDim*0.8),
            new StrawberryTarget(0, 0, this.strawberryDim, this.strawberryDim, 45, this.plateR/2 - this.strawberryDim*0.8),
            new StrawberryTarget(0, 0, this.strawberryDim, this.strawberryDim, 135, this.plateR/2 - this.strawberryDim*0.8),
            new StrawberryTarget(0, 0, this.strawberryDim, this.strawberryDim, 225, this.plateR/2 - this.strawberryDim*0.8)
        ];
        this.blueberryTargets = [
            new BlueberryTarget(0, 0, this.blueberryR, -90, this.toastDim/2 + this.blueberryR),
            new BlueberryTarget(0, 0, this.blueberryR, 0, this.toastDim/2 + this.blueberryR),
            new BlueberryTarget(0, 0, this.blueberryR, 90, this.toastDim/2 + this.blueberryR),
            new BlueberryTarget(0, 0, this.blueberryR, 180, this.toastDim/2 + this.blueberryR)
        ];
        this.orangeSliceTargets = [
            new OrangeSliceTarget(0, 0, this.orangeW, this.orangeH, -90, this.plateR/2 - this.orangeH * 0.75),
            new OrangeSliceTarget(0, 0, this.orangeW, this.orangeH, 0, this.plateR/2 - this.orangeH * 0.75),
            new OrangeSliceTarget(0, 0, this.orangeW, this.orangeH, 90, this.plateR/2 - this.orangeH * 0.75),
            new OrangeSliceTarget(0, 0, this.orangeW, this.orangeH, 180, this.plateR/2 - this.orangeH * 0.75),
        ]
        
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
        this.egg = new Egg(random(width), random(height), this.eggR/2);
        for (let i = 0; i < this.strawberryTargets.length; i++) {
            this.strawberries.push(new Strawberry(random(width), random(height), this.strawberryDim, this.strawberryDim));
        }
        for (let i = 0; i < this.blueberryTargets.length; i++) {
            this.blueberries.push(new Blueberry(random(width), random(height), this.blueberryR));
        }
        for (let i = 0; i < this.orangeSliceTargets.length; i++) {
            this.orangeSlices.push(new OrangeSlice(random(width), random(height), this.orangeW, this.orangeH));
        }
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
                        if (d < this.strawberryDim/2) {
                            this.activeFood.pos.set(st.pos.copy());
                            this.activeFood.angle = st.angle;
                        }
                    }
                }
            } else if (this.blueberries.includes(this.activeFood)) {
                for (let bt of this.blueberryTargets) {
                    if (this.activeFood.collidesEllipse(bt)) {
                        let d = p5.Vector.dist(this.activeFood.pos, bt.pos);
                        if (d < this.blueberryR)
                            this.activeFood.pos.set(bt.pos.copy());
                    }
                }
            } else if (this.activeFood === this.egg) {
                this.eggTarget.pos.add(_center);
                if (this.activeFood.collidesEllipse(this.eggTarget)) {
                    let d = p5.Vector.dist(this.activeFood.pos, this.eggTarget.pos);
                    if (d < this.eggR/2) {
                        this.activeFood.pos.set(this.eggTarget.pos.copy());
                        this.activeFood.yolk.pos.set(this.eggTarget.pos.copy());
                    }
                }
                this.eggTarget.pos.sub(_center);
            } else if (this.orangeSlices.includes(this.activeFood)) {
                for (let ot of this.orangeSliceTargets) {
                    ot.pos.add(_center);
                    if (this.activeFood.collidesRect(ot)) {
                        let d = p5.Vector.dist(this.activeFood.pos, ot.pos);
                        if (d < this.orangeW/2) {
                            // console.log(ot.angle);
                            this.activeFood.pos.set(ot.pos.copy());
                            this.activeFood.angle = ot.angle;
                        }
                    }
                    ot.pos.sub(_center);
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
            this.egg.update(m);
            if (this.egg.hovered)
                this.activeFood = this.egg;
        }

        if (!this.activeFood) {
            for (let s of this.strawberries) {
                s.update(m);
                if (s.hovered && !this.activeFood)
                    this.activeFood = s;
            }
        }

        if (!this.activeFood) {
            for (let b of this.blueberries) {
                b.update(m);
                if (b.hovered && !this.activeFood)
                    this.activeFood = b;
            }
        }

        if (!this.activeFood) {
            for (let o of this.orangeSlices) {
                o.update(m);
                if (o.hovered && !this.activeFood)
                    this.activeFood = o;
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

        // draw the orange slices targets
        push();
        translate(this.pos.x, this.pos.y);
        for (let o of this.orangeSliceTargets) {
            o.draw();
        }
        pop();

        // draw toast target
        push();
        translate(this.pos.x, this.pos.y);
        this.toastTarget.draw();
        pop();
        
        // draw egg target
        push();
        translate(this.pos.x, this.pos.y);
        this.eggTarget.draw();
        pop();
        
        // draw strawberry targets
        for (let st of this.strawberryTargets) {
            st.draw();
        }
        
        // draw the blueberry targets
        for (let bt of this.blueberryTargets) {
            bt.draw();
        }

        // draw toast
        if ((!this.activeFood) || (this.activeFood && this.activeFood !== this.toast))
            this.toast.draw();
        
        // draw strawberries
        for (let s of this.strawberries) {
            if ((!this.activeFood) || (this.activeFood && this.activeFood !== s))
                s.draw();
        }

        // draw blueberries
        for (let b of this.blueberries) {
            if ((!this.activeFood) || (this.activeFood && this.activeFood !== b))
                b.draw();
        }

        // draw orange slices
        for (let o of this.orangeSlices) {
            if ((!this.activeFood) || (this.activeFood && this.activeFood !== o))
                o.draw();
        }

        // draw the egg
        if ((!this.activeFood) || (this.activeFood && this.activeFood !== this.egg))
            this.egg.draw();

        // draw activeFood if we have one
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
        this.angle = null;
    }

    handleDrag(delta) {
        this.pos.add(delta);
    }

    draw() {
        push();
        rectMode(CENTER);
        translate(this.pos.x, this.pos.y);
        if (this.angle)
            rotate(radians(this.angle) - PI/2 - PI);
        stroke(this.hovered ? color(0, 255, 0) : "black");
        fill("red");
        rect(0, 0, this.w, this.h);
        noStroke();
        fill(0, 200, 0);
        rect(0, -this.h/2+this.h/8, this.w, this.h/4);
        pop();
    }
}

class StrawberryTarget extends Rect {
    constructor(x, y, w, h, angle, len) {
        super(x, y, w, h);
        this.pos = p5.Vector.fromAngle(radians(angle), len).add(_center);
        this.angle = angle;
    }

    draw() {
        push();
        translate(this.pos.x, this.pos.y);
        rectMode(CENTER);
        noFill();
        rotate(radians(this.angle) - PI/2);
        rect(0, 0, this.w, this.h);
        pop();
    }
}

class Blueberry extends Circle {
    constructor(x, y, r) {
        super(x, y, r);
        this.color = color("#4f86f7");
    }

    handleDrag(delta) {
        this.pos.add(delta);
    }
}

class BlueberryTarget extends Circle {
    constructor(x, y, r, angle, len) {
        super(x, y, r);
        this.pos = p5.Vector.fromAngle(radians(angle), len).add(_center);
    }
}

class Egg extends Circle {
    constructor(x, y, r) {
        super(x, y, r);
        this.color = color("white");
        this.yolk = new Circle(x, y, r * 0.5);
        this.yolk.color = color(255, 175, 0);
    }

    handleDrag(delta) {
        this.pos.add(delta);
        this.yolk.pos.add(delta);
    }

    draw() {
        super.draw();

        this.yolk.draw();
    }
}

class EggTarget extends Circle {
    constructor(x, y, r) {
        super(x, y, r);
    }
}

class OrangeSlice extends Rect {
    constructor(x, y, w, h) {
        super(x, y, w, h);
        this.angle = null;
    }

    handleDrag(delta) {
        this.pos.add(delta);
    }

    draw() {
        push();
        rectMode(CENTER);
        translate(this.pos.x, this.pos.y);
        if (this.angle !== null)
            rotate(radians(this.angle) - PI/2);
        stroke(this.hovered ? color(0, 255, 0) : "black");
        fill("#FA8128");
        rect(0, 0, this.w, this.h, 0, 0, this.h, this.h);
        noStroke();
        fill("#ED7014");
        rect(0, -this.h/2+this.h/8, this.w, this.h/4);
        pop();
    }
}

class OrangeSliceTarget extends Rect {
    constructor(x, y, w, h, angle, len) {
        super(x, y, w, h);
        this.pos = p5.Vector.fromAngle(radians(angle), len);
        this.angle = angle;
    }

    draw() {
        push();
        translate(this.pos.x, this.pos.y);
        rectMode(CENTER);
        noFill();
        rotate(radians(this.angle) - PI/2);
        rect(0, 0, this.w, this.h, 0, 0, this.h, this.h);
        pop();
    }
}