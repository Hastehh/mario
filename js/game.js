// create a new scene named "Game"
let gameScene = new Phaser.Scene('Game');


//////////////////////////////////////////////////
// our game's configuration
//////////////////////////////////////////////////
let config = {
  type: Phaser.AUTO,  //Phaser will decide how to render our game (WebGL or Canvas)
  width: 640, // game width
  height: 360, // game height
  scene: gameScene // our newly created scene
};

////////////////////////////////////////////////// 
// create the game, and pass it the configuration
//////////////////////////////////////////////////
let game = new Phaser.Game(config);

//////////////////////////////////////////////////
// some parameters for our scene (our own customer variables - these are NOT part of the Phaser API)
//////////////////////////////////////////////////
gameScene.init = function() {
  this.playerSpeed = 1.5;
  this.enemyMaxY = 280;
  this.enemyMinY = 80;
};

//////////////////////////////////////////////////
// load asset files for our game
//////////////////////////////////////////////////
gameScene.preload = function() { 
  // load images
  this.load.image('background', 'assets/background.png');
  this.load.image('player', 'assets/player.png');
  this.load.image('dragon', 'assets/dragon.png');
  this.load.image('treasure', 'assets/treasure.png');
};

//////////////////////////////////////////////////
// executed once, after assets were loaded
//////////////////////////////////////////////////
gameScene.create = function() {  

    
    // background
    let bg = this.add.sprite(0, 0, 'background');
 
    // change origin to the top-left of the sprite
    bg.setOrigin(0,0);

    // player
    this.player = this.add.sprite(40, this.sys.game.config.height / 2, 'player');
 
    // scale down
    this.player.setScale(0.5);

     // goal
    this.treasure = this.add.sprite(this.sys.game.config.width - 80, this.sys.game.config.height / 2, 'treasure');
    this.treasure.setScale(0.6);

    //dragons
    this.dragons = this.add.group({
	key: 'dragon',
	repeat: 5,
	setXY: {
	    x: 110,
	    y: 100,
	    stepX: 80,
	    stepY: 20
	}
    });

    Phaser.Actions.ScaleXY(this.dragons.getChildren(), -0.5,-0.5);
    //set speeds
    var temp_dragons = this.dragons.getChildren()
    for (var i = 0; i < temp_dragons.length; i++) {
	var dragonNumber = i;
	temp_dragons[dragonNumber].speed = Math.random() * 2 + 1;
    }
    //set limits
    this.dragonsMaxY = 275;
    this.dragonsMinY = 75;

    //player is alive
    this.isPlayerAlive = true;
};

//////////////////////////////////////////////////
// end the game
//////////////////////////////////////////////////
gameScene.gameOver = function() {

    //fag to set player as dead
    this.isPlayAlive = false;
    
    console.log("end of game");
    
    //shake camera
    this.cameras.main.shake(2000);

    //restart game
    this.time.delayedCall(2000, function() {
	this.scene.restart();
    }, [], this);
    
};

//////////////////////////////////////////////////
// executed on every frame (60 times per second)
//////////////////////////////////////////////////
gameScene.update = function() {

    if (!this.isPlayerAlive) {
	return;
    }
    
    //enemy movement
    let dragons = this.dragons.getChildren();
    let numDragons = dragons.length;

    for (let i = 0; i < numDragons; i++) {

	//move enemies
	dragons[i].y += dragons[i].speed;

	//reverse movement if reached the
	if (dragons[i].y >= this.dragonsMaxY && dragons[i].speed > 0) {
	    dragons[i].speed *= -1; }
	else if (dragons[i].y <= this.dragonsMinY && dragons[i].speed < 0) {
	    dragons[i].speed *= -1;

	}
	
	//enemy collision
	if (Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), dragons[i].getBounds())) {
	    this.gameOver();
	    break;
	}
    }
	   
    
  // check for active input
  if (this.input.activePointer.isDown) {
        // check for active input
  
      console.log('updating always the screen');
    // player walks
      this.player.x += this.playerSpeed;
  }
// treasure collision
  if (Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), this.treasure.getBounds())) {
    this.gameOver();
  }
};
