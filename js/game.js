// - animate the character
// - further interactions with dragons
// - up and down movement
// - door into a new scene
// - difficulty selection

//////////////////////////////////////////////////
// creating the main menu
//////////////////////////////////////////////////
let Menu = new Phaser.Scene('Load');

Menu.init = function(){
};

//difficulty selection
Menu.create = function(){

    this.add.text(270,50, 'Press 1, 2 or 3', {font: '16px Courier'});

    this.input.keyboard.once('keyup_ONE', function () {

        this.scene.start('Gamescene_Darren', {dragonSpeedMenu: 0.5});
    }, this);

    this.input.keyboard.once('keyup_TWO', function () {

        this.scene.start('Gamescene_Darren', {dragonSpeedMenu: 1.5});
	    
    }, this);

    this.input.keyboard.once('keyup_THREE', function () {

        this.scene.start('Gamescene_Darren', {dragonSpeedMenu: 5});
	    
    }, this);
    
};

////////////////////////////////////////
// creating game scence
////////////////////////////////////////
let gameScene = new Phaser.Scene('Gamescene_Darren');

gameScene.init = function(inputData) {
    this.playerSpeed = 1.5;
    this.dragonSpeed = inputData.dragonSpeedMenu;
    this.enemyMaxY = 280;
    this.enemyMinY = 80;

    this.keys = this.input.keyboard.addKeys({
    key_up: 'A',
    key_down: 'down',
    key_left: 'left',
    key_right: 'right'
});
};

//////////////////////////////////////////////////
// load asset files for our game
//////////////////////////////////////////////////
gameScene.preload = function() { 
  // load images
    this.load.image('easy', 'assets/easyy.png');
    this.load.image('medium','assets/mediumm.png');
    this.load.image('hard','assets/hardd.png');
  this.load.image('background', 'assets/background.png');
  this.load.image('player', 'assets/player.png');
  this.load.image('dragon', 'assets/dragon.png');
  this.load.image('treasure', 'assets/treasure.png');
};

//////////////////////////////////////////////////
// executed once, after assets were loaded
//////////////////////////////////////////////////
gameScene.create = function() {  

    this.cameras.main.resetFX();

    
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
    //set dragon's speed
    var temp_dragons = this.dragons.getChildren()
    for (var i = 0; i < temp_dragons.length; i++) {
	var dragonNumber = i;
	temp_dragons[dragonNumber].dragonSpeed = Math.random() * this.dragonSpeed + 1;
    }
    //set limits
    this.dragonsMaxY = 275;
    this.dragonsMinY = 75;

    //player is alive
    this.isPlayerAlive = true;
    //resets camera
    this.cameras.main.resetFX();
};

//////////////////////////////////////////////////
// end the game
//////////////////////////////////////////////////
gameScene.gameOver = function() {

    //fag to set player asp dead
    this.isPlayAlive = false;
    
    console.log("end of game");

    //shake camera
    this.cameras.main.shake(2000);

    //fade camera
    this.time.delayedCall(1000, function() {
	this.cameras.main.fade(1000);
    }, [], this);
    
    //restart game
    this.time.delayedCall(2000, function() {
	This.scene.restart();
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
	dragons[i].y += dragons[i].dragonSpeed;

	//reverse movement if reached the
	if (dragons[i].y >= this.dragonsMaxY && dragons[i].dragonSpeed > 0) {
	    dragons[i].dragonSpeed *= -1; }
	else if (dragons[i].y <= this.dragonsMinY && dragons[i].dragonSpeed < 0) {
	    dragons[i].dragonSpeed *= -1;

	}
	
	//enemy collision
	if (Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), dragons[i].getBounds())) {
	    this.gameOver();
	    break;
	}
    }
	   
//if (this.input.activePointer.isDown) {
//        // check for active input
//  
//      console.log('updating always the screen');
//    // player walks
//      this.player.x += this.playerSpeed;
//  }
    
    // check for active input
    if(this.keys.key_up.isUp){
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



////////////////////////////////////////
// combine the game and menu into an executable object
////////////////////////////////////////
let config = {
  type: Phaser.AUTO,  //Phaser will decide how to render our game (WebGL or Canvas)
  width: 640, // game width
  height: 360, // game height
  scene:  [Menu, gameScene] // our newly created scene
};

let game = new Phaser.Game(config);
