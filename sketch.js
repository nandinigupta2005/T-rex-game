var gamestate=0
var trex ,trex_running;
function preload(){
  trexAnimation=loadAnimation("trex1.png","trex3.png","trex4.png")
  groundImage=loadImage("ground2.png")
  cloudImage=loadImage("cloud.png")
  cactus1Image=loadImage("obstacle1.png")
  cactus2Image=loadImage("obstacle2.png")
  cactus3Image=loadImage("obstacle3.png")
  cactus4Image=loadImage("obstacle4.png")
  cactus5Image=loadImage("obstacle5.png")
  cactus6Image=loadImage("obstacle6.png")

  trexCollided=loadAnimation("trex_collided.png")

  gameOverImage=loadImage("gameOver.png")
  restartImage=loadImage("restart.png")

  checkpointSound=loadSound("checkpoint.mp3")
  dieSound=loadSound("die.mp3")
  jumpSound=loadSound("jump.mp3")
}

function setup(){
  createCanvas(windowWidth,windowHeight)
  
  trex=createSprite(50,height-100,20,20)
  trex.addAnimation("playing",trexAnimation)
  trex.addAnimation("collided",trexCollided)
  trex.scale=0.5

  trex.debug=false 
  trex.setCollider("circle",0,0,50)
   
  ground=createSprite(width/2,height-110,600,10)
  ground.addImage("running",groundImage)
  ground.scale=1.3

  ground2=createSprite(300,height-100,600,10)
  ground2.visible=false

  var number=Math.round(random(1,10))
  console.log(number)

  score=0

  cactusgroup=createGroup()
  cloudsgroup=createGroup()

  gameOver=createSprite(width/2,height/2)
  gameOver.addImage(gameOverImage)

  restart=createSprite(width/2,height/2+50)
  restart.addImage(restartImage)
  restart.scale=0.5

  
}

function draw(){
  background("orange")
  drawSprites()

  //console.log(getFrameRate()) 

  trex.collide(ground2)

  

  textSize(15)
  fill("green")
  text("Score:"+score,width-100,20)
  

  if(gamestate==0){
    clouds()

    cacti()

    ground.velocityX=-(5+score/100)

    if(touches.length>0||keyDown("space")&&trex.y>height-150){
      console.log(touches)
      trex.velocityY=-15 
      jumpSound.play()
      touches=[]
    }
    trex.velocityY+=0.8  

    if(ground.x<0){
      ground.x=ground.width/2     
    }

    
    score=score+Math.round(getFrameRate()/60)

    if(cactusgroup.isTouching(trex)){
      gamestate=1
      dieSound.play()
      //trex.velocityY=-15 
      //jumpSound.play()
    }

    gameOver.visible=false
    restart.visible=false

    if(score%100==0&&score!=0){
      checkpointSound.play()
    }
  }
  else if(gamestate==1){
    ground.velocityX=0

    cactusgroup.setVelocityXEach(0)
    cloudsgroup.setVelocityXEach(0)

    cactusgroup.setLifetimeEach(-5)

    trex.changeAnimation("collided")

    gameOver.visible=true
    restart.visible=true

    trex.velocityY=0  

    if(mousePressedOver(restart)||touches.length>0){
      reset()
      touches=[]
    }
  }

}

function reset(){
  gamestate=0
  cactusgroup.destroyEach()
  cloudsgroup.destroyEach()
  score=0
  trex.changeAnimation("playing")
}

function clouds(){
  if(frameCount%60==0){
    cloud=createSprite(width+50,50,50,20)
    cloud.velocityX=-5

    cloud.addImage("running",cloudImage)

    cloud.y=Math.round(random(20,height/2-50))
    cloud.scale=random(0.5,1)

    
    console.log(cloud.depth)
    trex.depth=cloud.depth+1
    gameOver.depth=cloud.depth+1

    cloudsgroup.add(cloud)

    if(cloud.x<0){
      cloud.lifetime=700/5
    }
  
  }
}

function cacti(){
  if(frameCount%70==0){
    cactus=createSprite(width+50,height-130,20,60)
    cactus.velocityX=-(5+score/100)

    var numbers=Math.round(random(1,6))
    switch(numbers){
      case 1:cactus.addImage(cactus1Image)
      break; 
      case 2:cactus.addImage(cactus2Image)
      break;
      case 3:cactus.addImage(cactus3Image)
      break;
      case 4:cactus.addImage(cactus4Image)
      break;
      case 5:cactus.addImage(cactus5Image)
      break;
      case 6:cactus.addImage(cactus6Image)
      break;
      default:break
    }
    cactus.scale=0.6

    cactus.lifetime=width/5

    cactusgroup.add(cactus)

    //cactus.debug=true
    //cactus.setCollider("circle",0,0,60)
  }
}