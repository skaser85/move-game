let levels;
let level;

let bookSound1;
let bookSound2;
let canSound1;
let canSound2;

let levelSelectTitle;
let levelSelect;

function preload() {
    soundFormats("mp3");
    bookSound1 = loadSound("sounds/book-1.mp3");
    bookSound2 = loadSound("sounds/book-2.mp3");
    canSound1 = loadSound("sounds/glass-1.mp3");
    canSound2 = loadSound("sounds/glass-1.mp3");
}

function setup() {
    createCanvas(1440, 960);

    _center = createVector(width/2, height/2);

    pallete = new Pallete();
    pallete.init();

    bkg_color = color(100, 200, 200);

    levels = ["books", "jars", "plate"];

    levelSelectTitle = createP("Select Level");
    
    levelSelectTitle.style("fontFamily", "sans-serif");
    levelSelectTitle.style("fontSize", "20px");
    levelSelectTitle.style("userSelect", "none");
    
    levelSelectTitle.position(12, 5);

    levelSelect = createSelect();
    
    levelSelect.style("padding", "10px");
    levelSelect.style("width", "150px");
    levelSelect.style("fontFamily", "sans-serif");
    levelSelect.style("fontSize", "20px");
    
    levelSelect.position(10, 50);

    levelSelect.option("Books", "books");
    levelSelect.option("Jars", "jars");
    levelSelect.option("Plate", "plate");
    
    levelSelect.changed(() => {
        let index = levels.indexOf(levelSelect.selected());
        level = createLevel(levels[index]);
        level.init();
    });

    level = createLevel("plate");
    level.init();
}

function draw() {
    background(bkg_color);

    line(_center.x, 0, _center.x, height);
    line(0, _center.y, width, _center.y);

    let m = getMousePos();

    level.update(m);
    level.draw();
}

function keyPressed() {
}

function mousePressed() {
    level.handleMousePressed();
    // don't do a return false here because it will make any HTML elements not function
}

function mouseDragged() {
    let delta = getMouseMoved();
    level.handleDrag(delta);
    return false;
}

function mouseReleased() {
    level.handleMouseReleased();
    return false;
}

function getMousePos() {
    return createVector(mouseX, mouseY);
}

function getMouseMoved() {
    return createVector(movedX, movedY);
}

function pushEmitter(pos, _color) {
    let e = new Emitter(pos.x, pos.y, _color);
    e.init();
    emitters.push(e);
}

function pushFader(pos, label) {
    faders.push(new Fader(pos.x, pos.y, label));
}

function collidesPointEllipse(p, ex, ey, r) {
    let pos = createVector(ex, ey);
    let d = p5.Vector.dist(p, pos);
    return d <= r;
}

function collidesRectPoint(rbb, p) {
    return ((p.x >= rbb.l) && (p.x <= rbb.r)) &&
           ((p.y >= rbb.t) && (p.y <= rbb.b));
}

function collidesRectEllipse(rbb, ex, ey, r) {
    return ((ex + r >= rbb.l) && (ex - r <= rbb.r)) &&
           ((ey + r >= rbb.t) && (ey - r <= rbb.b));
}

function collidesRectEllipseLR(rbb, ex, ey, r) {
    return ((ex + r >= rbb.l) && (ex - r <= rbb.r));
}

function collidesRectEllipseTB(rbb, ex, ey, r) {
    return ((ey + r >= rbb.t) && (ey - r <= rbb.b));
}

function collidesRectRect(r1bb, r2bb) {
    return r1bb.r >= r2bb.l &&
           r1bb.l <= r2bb.r &&
           r1bb.b >= r2bb.t &&
           r1bb.t <= r2bb.b;
}

function collidesRectRectLR(r1bb, r2bb) {
    let r1 = r1bb.r;
    let r2 = r2bb.r;
    let l1 = r1bb.l;
    let l2 = r2bb.l;
    return (l1 < r2 && l1 < l2) ||
           (r1 > l2 && r1 < r2);
}

function getBoundingBox(vec, w, h) {
    return {
        t: vec.y,
        r: vec.x + w,
        b: vec.y + h,
        l: vec.x
    }
}

function get_centeredBoundingBox(vec, w, h) {
    let hw = w/2;
    let hh = h/2;
    return {
        t: vec.y - hh,
        r: vec.x + hw,
        b: vec.y + hh,
        l: vec.x - hw
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function rgb_brightness(c) {
    // https://www.nbdtech.com/Blog/archive/2008/04/27/calculating-the-perceived-brightness-of-a-color.aspx
    // stolen from the link above and then modified to work with how p5.js works with color
    return Math.sqrt(
        red(c) * red(c) * .241 +
        green(c) * green(c) * .691 +
        blue(c) * blue(c) * .068
    );
}

function createLevel(levelName) {
    switch (levelName) {
        case "books": return new Books(_center.x, _center.y);
        case "jars": return new Cans(_center.x, _center.y);
        case "plate": return new Plate(_center.x, _center.y);
    }
}