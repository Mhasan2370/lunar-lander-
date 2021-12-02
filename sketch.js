let ground;
let lander;
var lander_img;
var bg_img;
var meteor,meteorsG, meteorImg;
var meteorTL,meteorBL,meteorBR,meteorTR;
var livesRemaining = 3;
var gameState = "ready"
var score = 0 ; 
var crashSound;
var frameGap = 90;
var meteorSize =  0.05;

var vy = 0;
var g = 0.05;

function preload()
{
  lander_img = loadImage("normal.png");
  bg_img = loadImage("bg.png");
  meteorTL = loadImage("meteorTL.png");
  meteorTR = loadImage("meteorTR.png");
  meteorBL = loadImage("meteorBL.png");
  meteorBR = loadImage("meteorBR.png");
  crashSound=loadSound("crash.mp3");
  
}

function setup() {
  createCanvas(windowWidth,windowHeight -5);
  frameRate(80);

  lander = createSprite(width/2,height/2,30,30);
  lander.addImage(lander_img);
  lander.scale = 0.1;
  lander.setCollider("rectangle",0,0,200,200)

  meteorsG = new Group ();
  

  rectMode(CENTER);
  textSize(15);
}

function draw() {
  
  background(0);

  
  if (gameState === "ready" || gameState === "collided"){
    if(keyDown("space")){
      gameState = "play";
    }
    if (gameState === "collided"){
      fill("red");
      textSize(20)

      text("Oh no!!! You got hit by a meteor. Take Care.", width/2- 170, height/2 -150);
    }
    fill(255);
    textSize(30);
    text(" Press 'space' to continue.", width/2 - 170, height/2 + 80);
  }

  
  
  if (gameState === "play"){
    background(bg_img);

    //increasing sacore 
    score = score + Math.round (getFrameRate()/100)

    //collision with meteors
    if (lander.isTouching(meteorsG)){
      handleCollision();
    }

    // checking for lives
    if (livesRemaining === 0){
      gameEnd();
    }

    //reduce gap for adaptivity
    if (score >300 && score < 600){
      meteorSize =  0.06;
      frameGap = 70;
    }
    if (score >600 && score < 900){
      meteorSize =  0.08;
      frameGap = 50;
    }


    spawnMeteors();


  }

  if(gameState==="end"){
    fill(255)
    textSize(50)
    text ("Game Over!!", width/2 - 50, height/2);
  }

  
  drawSprites();
  textSize(20)
  fill(255);
  text("Lives : "+livesRemaining, width- 150, 50);
  
  text("Score : "+score, width-150,80 );
}

function keyPressed()
{
  if(gameState==="play"){
    if(keyCode==UP_ARROW && lander.y > 50)
    {
      lander.y -= 8
      lander.changeAnimation('thrusting');
      //thrust.nextFrame()
    }
    if(keyCode==DOWN_ARROW  && lander.y < height-50)
    {
      lander.y += 8
      lander.changeAnimation('thrusting');
      //thrust.nextFrame()
    }
    if(keyCode==LEFT_ARROW && lander.x > 50)
    {
      lander.x -= 8
      lander.changeAnimation('thrusting');
      //thrust.nextFrame();
    }
    if(keyCode==RIGHT_ARROW && lander.x < width-50)
    {
      lander.x += 8
      lander.changeAnimation('thrusting');
      //thrust.nextFrame();
    }
  }
  
}



function spawnMeteors(){
  if (frameCount % frameGap ===0){

    var leftOrRight = Math.round(random(1,2));
    if(leftOrRight === 1){
      xPos=0;
      yPos = Math.round(random(0,height));
      xVel = Math.round(random(3,6))
      if(yPos < height/2){
        yVel = Math.round(random(0,5));
        meteorImg = meteorTL
      }else{
        yVel = Math.round(random(-5,0));
        meteorImg = meteorBL
      }
    }
    else{
      xPos= width;
      yPos = Math.round(random(0,height));
      xVel = -(Math.round(random(3,6)))
      if(yPos < height/2){
        yVel = Math.round(random(0,5));
        meteorImg = meteorTR;
      }else{
        yVel = Math.round(random(-5,0));
        meteorImg = meteorBR;
      }

    }
    meteor = createSprite(xPos, yPos, 30, 30);
    meteor.addImage(meteorImg)
    meteor.scale= meteorSize;
    meteor.velocityX = xVel,
    meteor.velocityY  = yVel,
    meteor.lifetime = 400;
    meteorsG.add(meteor)
  }
}

function handleCollision(){

  crashSound.play();
  gameState = "collided";
  meteorsG.destroyEach();
  livesRemaining -= 1
}

function gameEnd(){
  gameState="end";
  
  lander.destroy();
  
}

