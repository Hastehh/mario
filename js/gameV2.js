//if distance and if key is down: kill dragon (console)
//look at mario code, to see how to make dragon dissappear (coin disappear)

//////////////////////////////////////////////////
// creating the main menu
//////////////////////////////////////////////////
let Menu = new Phaser.Scene('Load');

Menu.init = function(){
};

//difficulty selection
Menu.create = function(){
    this.add.text(270,50, 'Press 1, 2 or 3 test', {font: '16px Courier'});

    this.input.keyboard.once('keyup_ONE', function () {

        this.scene.start('Gamescene_Darren', {dragonSpeedMenu: 0.5});
	console.log('difficulty: easy');
	
    }, this);

    this.input.keyboard.once('keyup_TWO', function () {

        this.scene.start('Gamescene_Darren', {dragonSpeedMenu: 1.5});
	console.log('difficulty: medium');
    }, this);

    this.input.keyboard.once('keyup_THREE', function () {

        this.scene.start('Gamescene_Darren', {dragonSpeedMenu: 5});
	console.log('difficulty: hard');
	
    }, this);
    
};

////////////////////////////////////////
// creating game scene
////////////////////////////////////////
let gameScene = new Phaser.Scene('Gamescene_Darren');
gameScene.init = function(inputData) {
    this.playerSpeed = 1;
    this.dragonSpeed = inputData.dragonSpeedMenu;
    this.enemyMaxY = 280;
    this.enemyMinY = 80;

    this.keys = this.input.keyboard.addKeys({
    key_up: 'up',
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
  this.load.image('dragons', 'assets/dragon.png');
  this.load.image('treasure', 'assets/treasure.png');
};

//////////////////////////////////////////////////
// executed once, after assets were loaded
//////////////////////////////////////////////////
gameScene.create = function() {
    this.wKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.sKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.gKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.G);
    this.kKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K); 
   
    
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
	key: 'dragons',
	repeat: 5,
	setXY: {
	    x: 110,
	    y: 100,
	    stepX: 80,
	    stepY: 20
	}
    });

    Phaser.Actions.ScaleXY(this.dragons.getChildren(), -0.5,-0.5);
    //set dragons's speed
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
	dragons[i].y += dragons[i].dragonSpeed;

	////////////////////////////////////////
	//distance to enemies
	////////////////////////////////////////
	// this.off = false;
	//body.setEnable(off);
	// this.on = true;
	//body.setEnable(on);
	
	// this.killDragon = function(a){
    	//     killDragon = body.setEnable(a);
	// }
	var distance = ((this.player.x - dragons[i].x)**2 + (this.player.y - dragons[i].y)**2)**(0.5);

	console.log((this.player.x - dragons[i].x)**2);

	//if distance, if key is down
    	// for (var dragonAmount = 5; dragonAmount > 0; dragonAmount--) {

    	//     if(this.kKey.isDown && distance < 70) {

    	// 
    	// 	    console.log('Dragon killed');
    	// 	    dragonAmount-= 1;
    	// 	
		
    	//     }
	    
    	// }

	// var sss = true;

    	// if(this.kKey.isDown) {

    	//     if(pythagoras > -20 && pythagoras < 20) {
    	// 	dragonAmount-= 1;
    	// 	showAlert('dragons killed,',dragonAmount,'left.');
    	// 	console.log('dragons killed,',dragonAmount,'left.');
    	//     }
	    
    	// }
	
	
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


   
	    
   // var temp = (this.player.x-this.dragons[i].x)^2;
    //console.log(temp);


    
    if(this.wKey.isDown) {
	console.log('W');
	this.player.y -= this.playerSpeed;
    }
    if(this.aKey.isDown) {
	console.log('A');
	this.player.x -= this.playerSpeed;
    }
    if(this.sKey.isDown) {
	console.log('S');
	this.player.y += this.playerSpeed;
    }
    if(this.dKey.isDown) {
	console.log('D');
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


