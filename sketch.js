const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

var backgroundIMG;
var melonIMG;
var rabbitIMG;

var blink;
var eat;
var sed;

var backgroundSound;
var cutSound;
var sadSound;
var eatSound;
var airSound;

let engine;
let world;

function preload() {
  backgroundIMG = loadImage("background.png");
  melonIMG = loadImage("melon.png");
  rabbitIMG = loadImage("Rabbit-01.png");

  blink = loadAnimation("blink_1.png", "blink_2.png", "blink_3.png");
  eat = loadAnimation("eat_0.png", "eat_1.png", "eat_2.png", "eat_3.png", "eat_4.png");
  sad = loadAnimation("sad_1.png", "sad_2.png", "sad_3.png");
  eat.looping = false;
  sad.looping = false;

  backgroundSound = loadSound("sound1.mp3");
  cutSound = loadSound("rope_cut.mp3");
  sadSound = loadSound("sad.wav");
  eatSound = loadSound("eating_sound.mp3");
  airSound = loadSound("air.wav");
}

function setup() {
  var detectingDevice = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if(detectingDevice) {
    canW = displayWidth;
    canH = displayHeight;
  }
  else {
    canW = windowWidth;
    canH = windowHeight;
  }
  createCanvas(canW, canH);
  //backgroundSound.play();
  backgroundSound.setVolume(0.3);
  engine = Engine.create();
  world = engine.world;

  ground = Bodies.rectangle(width/2, 700, width, 20, {isStatic: true});
  World.add(world, ground);

  blink.frameDelay = 32;
  eat.frameDelay = 8;
  sad.frameDelay = 15;
  rabbit = createSprite(600, 600);
  rabbit.addImage(rabbitIMG);
  rabbit.addAnimation("blinking", blink);
  rabbit.addAnimation("eating", eat);
  rabbit.addAnimation("sadness", sad);
  rabbit.changeAnimation("blinking");
  rabbit.scale = 0.25;

  fruit = Bodies.circle(250, 350, 20, {density: 0.002});

  rope = new Rope(6, {x: 350, y: 50});
  Matter.Composite.add(rope.body, fruit);
  link = new Link(rope, fruit);

  rope1 = new Rope(9, {x: 20, y: 30});
  Matter.Composite.add(rope1.body, fruit);
  link1 = new Link(rope1, fruit);

  rope2 = new Rope(2, {x: 400, y: 240});
  Matter.Composite.add(rope2.body, fruit);
  link2 = new Link(rope2, fruit);

  ropes = new Group();
  ropes.push(rope);
  ropes.push(rope1);
  ropes.push(rope2);

  button = createImg("cut_button.png");
  button.position(330, 50);
  button.size(40, 40);
  button.mouseClicked(drop);

  button1 = createImg("cut_button.png");
  button1.position(20, 30);
  button1.size(40, 40);
  button1.mouseClicked(drop1);

  button2 = createImg("cut_button.png");
  button2.position(370, 230);
  button2.size(40, 40);
  button2.mouseClicked(drop2);

  balloon = createImg("balloon.png");
  balloon.position(20, 200);
  balloon.size(140, 90);
  balloon.mouseClicked(blow);

  mute = createImg("mute.png");
  mute.position(canW - 100, 20);
  mute.size(50, 50);
  mute.mouseClicked(muteSound);

  rectMode(CENTER);
  imageMode(CENTER);
  ellipseMode(RADIUS);
  textSize(50)
}

function draw() {
  background(51);
  image(backgroundIMG, width/2, height/2, canW, canH);
  Engine.update(engine);
  push();
  fill("grey");
  noStroke();
  rect(ground.position.x, ground.position.y, width, 20);
  pop();

  if(fruit != null) {
    image(melonIMG, fruit.position.x, fruit.position.y, 70, 70);
  }
  if(touched(fruit, rabbit) == true) {
    eatSound.play();
    eatSound.setVolume(5);
    rabbit.changeAnimation("eating");
  }
  if(fruit != null && fruit.position.y >= 670) {
      backgroundSound.stop();
      sadSound.play();
      rabbit.changeAnimation("sadness");
      World.remove(world, fruit);
      fruit = null; 
  }

  for(i = 0; i <= 2; i++) {
    ropes[i].show();
  }
  drawSprites();
}

function drop() {
  cutSound.play();
  cutSound.setVolume(0.5);
  rope.break();
  link.detach();
}

function drop1() {
  cutSound.play();
  cutSound.setVolume(0.5);
  rope1.break();
  link1.detach();
}

function drop2() {
  cutSound.play();
  cutSound.setVolume(0.5);
  rope2.break();
  link2.detach();
}

function touched(body, sprite) {
  if(body != null) {
    var d = dist(body.position.x, body.position.y, sprite.position.x, sprite.position.y);
    if(d <= 130) {
      World.remove(world, fruit);
      fruit = null;
      return true;
    }
    else {
      return false;
    }
  }
}

function blow() {
  Matter.Body.applyForce(fruit, {x: 0, y: 0}, {x: 0.015, y: 0});
  airSound.play();
  airSound.setVolume(0.2);
}

function muteSound() {
  if(backgroundSound.isPlaying()) {
    backgroundSound.stop();
  }
  else {
    backgroundSound.play();
  }
}

