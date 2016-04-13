
var biggermaze    = '        '
+ '        '
+ '        '
+ '        '
+ '        '
+ '        '
+ '        '
+ 'A       ';


var maze    = '     '
+ '     '
+ '     '
+ '     '
+ 'A    ';

var columns = 5;
var rows = 5;

//Sounds

// var break2 = new Audio("break-2.wav");
var break2 = new Audio("monster_death5.wav");
var eat = new Audio("crunch.wav");



//COLORS 
var pathColor = 0xCBE0E0;
var wallColor = 0xff5256;
var playerColor = 0xBBDC2F;
var playerBorder = 0xCBE0E0;
var endColor = 0xF2F26F;


//Points Counter
var points = 20;
var housesBuilt = 0;
var hayCost = 2;
var sticksCost = 4;
var brickCost = 6;

var hayNumber = 0;
var sticksNumber = 0;
var brickNumber= 0 ;

var hayWorth = 1;
var sticksWorth = 0.5;
var brickWorth = 0.1;

var hayGain = 0;
var sticksGain = 0;
var brickGain = 0;

//Turn Variables

var turn = 2;
var totalTurns = 13;

// Graphics 
var night = new PIXI.Graphics();
var isNight = 0;

var redSq = new PIXI.Graphics();
var redRow;
var redCol;



var style = {
	font : '24px Avant Garde',
	fill : '#ffffff',
    align: 'center',
    wordWrap : true,
    wordWrapWidth : 440
}


var style2 = {
    font : '24px Avant Garde',
    fill : '#ffffff',
    // alpha : 1,
    // stroke : '#4a1850',
    // strokeThickness : 5,
    // dropShadow : true,
    // dropShadowColor : '#000000',
    // dropShadowAngle : Math.PI / 6,
    // dropShadowDistance : 6,
    wordWrap : true,
    wordWrapWidth : 440
}


//Text Settings
var pointsText = new PIXI.Text('Action' + '\n'+'Points' + '\n' + points,style);
var stage = new PIXI.Container();
var endText = new PIXI.Text('You have finished the game, and you have successfully built house for ' + (hayNumber+sticksNumber+brickNumber) + ' Piggies. Can you do better? ',style2);
var deadWolfText = new PIXI.Text('WOLF DEATH', style);





// Z indexes:
stage.zIndex = 5;



//wolf
var texture = PIXI.Texture.fromImage('http://i.imgur.com/5NWfpWq.png');
var wolf = new PIXI.Sprite(texture);
wolf.scale.x = 0.5;
wolf.scale.y = 0.5;
wolf.anchor.x = 0.5;
wolf.anchor.y = 0.5;
//wolf vars
var wolfSide = 0;
var wolfSlot = 0;
var wolfRow = 0;
var wolfCol = 0;
var changeRotation = 0;

var wolfPlayerLocation;
var iteration;
var fade;



// builder
// var builder = PIXI.Sprite.fromImage('http://i.imgur.com/GvxIRAM.png');
var builder = PIXI.Sprite.fromImage('http://i.imgur.com/U65cyN9.png'); //Jherin builder

builder.scale.x=0.35;
builder.scale.y=0.35;
// builder.scale.x=2;
// builder.scale.y=2;
builder.anchor.x=0.5;
builder.anchor.y=0.52;



var startLocation, endLocation;  //LOCATION
var wallStartX, wallStartY, wallSize; // unclear
var endAngle;  //Rotation of hexagon
var playerWonHooray;

var mario;


//runs in the beginning.
function setup() { 
    renderer.backgroundColor = wallColor; //The background is the color of the wall
    
    //ScoreBox Settings
    pointsText.anchor.set(0, 0);
    pointsText.x = renderer.width/25;
    pointsText.y = renderer.height/25;
    stage.addChild(pointsText);
    //End Text Settings
    endText.anchor.set(0.5, 0.8);
    endText.x = renderer.width/2;
    endText.y = renderer.height/2;
    //Wolf Death Text Settings
    deadWolfText.anchor.set(0.5,0.6);
    deadWolfText.x = renderer.width/2;
    deadWolfText.y = renderer.height/2;

    buildMaze(); // renders the maze
    playerLocation = {'row':startLocation.row, 'column':startLocation.column}; //takes the columns from startLocation and put them into the array  playerLocation 
    console.log('playerLocation ' + playerLocation);
    playerWonHooray = false; //Definiton of win condition
    endAngle = -90;

    mario = new Player('Mario', 0x61B136, marioOGLocation, [37,38,39,40]); // L R U D
    drawPath();
}


//runs continously 
function update() {
    // graphics.clear(); //clears the graphics
    //draws the players and stores their current location into variables
    if (playerWonHooray == false) {
    	marioLocation = mario.drawPlayer(); 
    } else {
        //nothing here yet
    }
    //checks for win condition 
    checkWin(); 

    pointsText.text ='Action' + '\n' + 'Points' + '\n' + points;
    checkTurn();
}


//Key events 
  function onKeyDown(event) { //ignores the array we created in the player function for now.

  	switch (event.keyCode) {
        case 37: // Left Arrow
        if (playerWonHooray == false) {mario.moveLeft();}
        drawPath();

        // console.log('left');
        break;


        case 38: // Up Arrow
        if (playerWonHooray == false) {mario.moveUp();}
        drawPath();

        break;

        case 39: // Right Arrow
        if (playerWonHooray == false) {mario.moveRight();}
        drawPath();
        // console.log(maze);

        break;

        case 40: // Down Arrow
        if (playerWonHooray == false) {mario.moveDown();}
        drawPath();

        break;

        case 84: // T for Teleport -- Disable before production
        // lastAction = 'P';
        break;

        case 49: // key 1 - hay
        // console.log("hay");
        var cr = mario.playerLocation.row;
        var cc = mario.playerLocation.column;
        if (isHouse(cr, cc)) {
            return;
        } else if (points >= hayCost) {
            addHouse('hay'); //adds a house made out of hay
            drawPath();
            // console.log("points: " + points);
        }
        break;

        case 50: // key 2 - sticks
        var cr = mario.playerLocation.row;
        var cc = mario.playerLocation.column;
        if (isHouse(cr, cc)) {
            return;
        } else if (points >= sticksCost) {
            addHouse('sticks'); //adds a house made out of hay
            drawPath();
        }
        break;

        case 51: // key 3 - brick
        var cr = mario.playerLocation.row;
        var cc = mario.playerLocation.column;
        if (isHouse(cr, cc)) {
            return;
        } else if (points >= brickCost) {
            addHouse('brick'); //adds a house made out of hay
            drawPath();
        }
        break;

        case 80: //P for Pass Turn
        housesBuilt = 3;
        break;


        // case 77: // M for Change Maze
        // changeMaze(maze2);
        // break;

        // default:
        // console.log (event.keyCode);
        // prints the key pressed
    }
}

function Player(name, color, ogLocation, keys) {

	this.playerLocation = ogLocation;
	this.name = name;
	this.playerColor = color;
	this.ogLocation = ogLocation;
	this.keys = keys;
	console.log('name' + name + ' player color: ' + color + ' ogLocation: ' + ogLocation + ' keys: ' + keys);


    this.drawPlayer = function() { //Draws the player
        //centers the shape
        builder.x = wallStartX + this.playerLocation.column * wallSize + wallSize/2;
        builder.y = wallStartY + this.playerLocation.row * wallSize + wallSize/2;  
        if (isNight != 1) {
            stage.addChild(builder);
        } else {
            stage.removeChild(builder);
        }

        deltaRow = 0;
        deltaColumn = 0;

        // console.log("row: " + this.playerLocation.row + "column: " + this.playerLocation.column); // prints the current location
        return this.playerLocation; //returns the location to the variables


    };

    this.moveRight = function() {
    	deltaColumn = +1;
        // Look at the location we want to move to. if it's out of bounds or
        // there's a wall, cancel the move.
        var nr = this.playerLocation.row + deltaRow;
        var nc = this.playerLocation.column + deltaColumn;

        if (nr<0 || nr>=rows || nc<0 || nc>=columns || isWall(nr, nc)) {
        	deltaRow = 0;
        	deltaColumn = 0;
        }
        if (isWall(nr, nc) && !(nr<0) && !(nr>=rows) && !(nc<0) && !(nc>=columns)) {
        	blockedCounter += 1;
        // console.log('***BLOCKED***');

    } else {
        	blockedCounter = 0; // resets blockedCounter if player moves sucessfully
        }

        this.playerLocation = {
        	'row': this.playerLocation.row + deltaRow,
        	'column': this.playerLocation.column + deltaColumn
        }

        // console.log('moved right');
        // console.log(playerLocation);
    };


    this.moveLeft = function() {

       deltaColumn = -1;

    // Look at the location we want to move to. if it's out of bounds or
    // there's a wall, cancel the move.
    var nr = this.playerLocation.row + deltaRow;
    var nc = this.playerLocation.column + deltaColumn;
    if (nr<0 || nr>=rows || nc<0 || nc>=columns || isWall(nr, nc)) {
        deltaRow = 0;
        deltaColumn = 0;
    }
    if (isWall(nr, nc) && !(nr<0) && !(nr>=rows) && !(nc<0) && !(nc>=columns)) {
        blockedCounter += 1;
    // console.log('***BLOCKED***');
} else {
        blockedCounter = 0; // resets blockedCounter if player moves sucessfully
    }

    this.playerLocation = {
    	'row': this.playerLocation.row + deltaRow,
    	'column': this.playerLocation.column + deltaColumn
    }

    // console.log('moved right');
    // console.log(playerLocation);
};


this.moveUp = function() {

	deltaRow = -1;

    // Look at the location we want to move to. if it's out of bounds or
    // there's a wall, cancel the move.
    var nr = this.playerLocation.row + deltaRow;
    var nc = this.playerLocation.column + deltaColumn;
    if (nr<0 || nr>=rows || nc<0 || nc>=columns || isWall(nr, nc)) {
        deltaRow = 0;
        deltaColumn = 0;
    }
    if (isWall(nr, nc) && !(nr<0) && !(nr>=rows) && !(nc<0) && !(nc>=columns)) {
        blockedCounter += 1;
    // console.log('***BLOCKED***');

} else {
        blockedCounter = 0; // resets blockedCounter if player moves sucessfully
    }

    this.playerLocation = {
    	'row': this.playerLocation.row + deltaRow,
    	'column': this.playerLocation.column + deltaColumn
    }

    // console.log('moved right');
    // console.log(playerLocation);
};


this.moveDown = function() {

	deltaRow = +1;

    // Look at the location we want to move to. if it's out of bounds or
    // there's a wall, cancel the move.
    var nr = this.playerLocation.row + deltaRow;
    var nc = this.playerLocation.column + deltaColumn;
    if (nr<0 || nr>=rows || nc<0 || nc>=columns || isWall(nr, nc)) {
        deltaRow = 0;
        deltaColumn = 0;


    } else {
        blockedCounter = 0; // resets blockedCounter if player moves sucessfully
    }

    this.playerLocation = {
    	'row': this.playerLocation.row + deltaRow,
    	'column': this.playerLocation.column + deltaColumn
    }

};

this.teleport = function () {
	var nr = getRandomArbitrary(0,10);
	var nc = getRandomArbitrary(0,12);
	if (isWall(nr, nc) || (nr == mario.playerLocation.row && nc == mario.playerLocation.column) ) {
		this.teleport();
	}
	else {
		this.playerLocation = {
			'row': nr,
			'column': nc
		};

	}

	// console.log('row: ' + this.playerLocation.row + ' column: ' + this.playerLocation.column );
}

}

//randomized a number between the min and max 
function getRandomArbitrary(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

//shows the hint
function displayHint() {
    endText.text = ('You have finished the game, and you have successfully built houses for ' + (hayNumber+sticksNumber+brickNumber) + ' Piggies. Can you do better?');
    stage.addChild(endText);
    renderer.render(stage);
}


function buildMaze() { //Runs once in setup

    // Calculate the best-fit size of a wall block based on the canvas size
    // and number of columns or rows in the grid.
    wallSize = Math.min(renderer.width/(columns+2), renderer.height/(rows+2));

    // Calculate the starting position when drawing the maze.
    wallStartX = (renderer.width - (wallSize*columns)) / 2;
    wallStartY = (renderer.height - (wallSize*rows)) / 2;

    // Find the start and end locations.
    for (var r=0; r<rows; r++) {
    	for (var c=0; c<columns; c++) {
    		var i = (r * columns) + c;
    		// console.log('location ' + i);

    		var ch = maze[i];
    		if (ch == 'A') {
                startLocation = {'row':r, 'column':c}; // Defines where ogLocation is. Writes down "this is start location"
                // console.log('startLocation: ' + startLocation);
                marioOGLocation = {'row':r, 'column':c};
            } 
        }
    }
}

function drawPath() {
    // var stage = new PIXI.Container();
    var path = new PIXI.Graphics();
    if ((isNight == 0) && (playerWonHooray != 1)) {
    for (var r=0; r<rows; r++) { //for all the rows
        for (var c=0; c<columns; c++) { //and all columns - meaning every spot
        	var i = (r * columns) + c;


        	var ch = maze[i];
            // The start and end locations are also on the path,
            // so check for them too.
            if (ch==' ' || ch=='A') { //if space, draw the path. 
                var x = wallStartX + c * wallSize;
                var y = wallStartY + r * wallSize;
                path.beginFill(pathColor,1);
                path.lineStyle(1 ,wallColor, 1);
                path.drawRect(x, y, wallSize, wallSize, pathColor);
                path.endFill();
                stage.addChild(path);
            }

            if (ch == 'B') {
                // hay
                var hay = PIXI.Sprite.fromImage('http://i.imgur.com/DRcue8L.png');
                hay.scale.x=1;
                hay.scale.y=1;
                hay.anchor.x=0.5;
                hay.anchor.y=0.5;
                hay.x = wallStartX+wallSize/2 + c * wallSize;
                hay.y = wallStartY+wallSize/2 + r * wallSize;
                stage.addChild(hay);
                
            }

            if (ch == 'C') {
                // Sticks
                var sticks = PIXI.Sprite.fromImage('http://i.imgur.com/CcwTxSl.png');
                sticks.scale.x=0.6;
                sticks.scale.y=0.6;
                sticks.anchor.x=0.5;
                sticks.anchor.y=0.5;
                sticks.x = wallStartX+wallSize/2 + c * wallSize;
                sticks.y = wallStartY+wallSize/2 + r * wallSize;
                stage.addChild(sticks);
                
            }

            if (ch == 'D') {
                // Bricks
                var brick = PIXI.Sprite.fromImage('http://i.imgur.com/8nx69Xg.png');
                brick.scale.x=0.6;
                brick.scale.y=0.6;
                brick.anchor.x=0.5;
                brick.anchor.y=0.5;
                brick.x = wallStartX+wallSize/2 + c * wallSize;
                brick.y = wallStartY+wallSize/2 + r * wallSize;
                stage.addChild(brick);
                
            }


            
        }
    }
}
}







//this funciton checks if there's a wall in a specific location.
//used in the moving action for the player and blocks it. 

function isWall(r, c) { 
	var i = (r * columns) + c;
	var ch = maze[i];
	return ((ch != ' ') && (ch != 'A') && (ch != 'B') && (ch != 'C') && (ch != 'D'));
}

function isHouse(r, c) { 
    var i = (r * columns) + c;
    var ch = maze[i];
    // console.log(maze[i]);
    // return ((ch != ' ') && (ch !='A'));
    if ((ch != ' ') && (ch !='A')) {
        return ch;
    }
}


//changes the conditions if the player won.
function checkWin() { 
    if (playerWonHooray) // if already won, skip the rest of the function    	
        return;

    if (turn > totalTurns) {
        playerWonHooray = 1;
        drawNight();
        drawNight();
        displayHint();
    }

}

function checkTurn() { 
    if ((housesBuilt == 3)) { // if 3 houses built or not enough money left, make night happen, and reset.
        nightTime();
        // for (i = 0; i >= 1; i + 0.01) {
            // console.log("opacity: " + i);
        // }
        housesBuilt = 0;
    }
}

function checkPoints() {
    if ((points < hayCost) && (playerWonHooray != 1)) { // if 3 houses built or not enough money left, make night happen, and reset.
        nightTime();
        // for (i = 0; i >= 1; i + 0.01) {
            // console.log("opacity: " + i);
        // }
        housesBuilt = 0;
    }
}

function drawNight() { //draws the night
    night.beginFill(0x000000,0.7);
    night.drawRect(0, 0, renderer.width, renderer.height, pathColor); 
    stage.addChild(night); 
}

function nightTime() {
    isNight = 1; //sets the global parameter to let functions know it's night.
    if (playerWonHooray == 1) {
        return;
    }
    drawNight();

    //call wolves
    wolfSide = getRandomArbitrary(0,4); //The side the wolf will come from. 0 = top, 1 = right, 2 = bottom, 3 = left
    // wolfSide = 0; //for testing purposes - only come from above.
    wolfSlot = getRandomArbitrary(0,5); // randomizes slot on the row/column

    // console.log("slot: " + wolfSlot);
    // console.log("side: " + wolfSide);

    if (wolfSide == 1) {
        // console.log("wallStartY: " + wallStartY);
        // console.log("wallStartX: " + wallStartX);

        wolf.scale.x = -0.5;
        wolfCol = columns;
        wolfRow = wolfSlot;

        wolf.x = wallStartX + (wolfCol) * wallSize + wallSize/2;
        wolf.y = wallStartY + (wolfSlot) * wallSize + wallSize/2;

    }
    if (wolfSide == 3) {
        // console.log("wallStartY: " + wallStartY);
        // console.log("wallStartX: " + wallStartX);
        // wolf.rotation = -90;
        wolf.scale.x = 0.5;

        wolfCol = -1;
        wolfRow = wolfSlot;

        wolf.x = wallStartX + (wolfCol) * wallSize + wallSize/2;
        wolf.y = wallStartY + (wolfSlot) * wallSize + wallSize/2;
    }

    if (wolfSide == 2) {
        // console.log("wallStartY: " + wallStartY);
        // console.log("wallStartX: " + wallStartX);

        // wolf.rotation = +90;
        wolfCol = wolfSlot;
        wolfRow = rows;

        wolf.y = wallStartY + (wolfRow) * wallSize + wallSize/2;
        wolf.x = wallStartX + (wolfSlot) * wallSize + wallSize/2;

    }

    if (wolfSide == 0) {

        wolfCol = wolfSlot;
        wolfRow = -1;
        changeRotation = -90; 

        // console.log("wallStartY: " + wallStartY);
        // console.log("wallStartX: " + wallStartX);

        // wolf.rotation = -90;

        wolf.y = wallStartY + (wolfRow) * wallSize + wallSize/2;
        wolf.x = wallStartX + (wolfSlot) * wallSize + wallSize/2;
    }

    wolfPlayerLocation = {
        'row': wolfRow,
        'column': wolfCol
    }

    stage.addChild(wolf);

    iteration = 0;
    setTimeout(wolfMove, 500)
}

    var myLoop = function() {           //  create a loop function
        setTimeout(wolfMove, 500)
    }

    function morning() {
        pointsCalc();
        pointsShow();
        turn++;
        night.clear();  
        isNight = 0; 
        iteration = 0;
        drawPath();
        if (playerWonHooray != 1) {
            checkPoints();
        }
    }

    function pointsShow() {

        // TURNS

        var turnDiv = document.getElementById('turn');
        turnDiv.innerHTML = turn;

        // HOUSE COUNTS 

        var haysDiv = document.getElementById('hays');
        haysDiv.innerHTML = hayNumber;
        // console.log("hayNumber: " + hayNumber);

        var sticksDiv= document.getElementById('stickss');
        sticksDiv.innerHTML = sticksNumber;
        // console.log("sticksNumber: " + sticksNumber);

        var bricksDiv = document.getElementById('bricks');
        bricksDiv.innerHTML = brickNumber;
        // console.log("brickNumber: " + brickNumber);

        //GAINS

        var hayGainSpan = document.getElementById('hayGain');
        hayGainSpan.innerHTML = hayGain;
        // console.log("hayNumber: " + hayNumber);

        var sticksGainSpan= document.getElementById('sticksGain');
        sticksGainSpan.innerHTML = sticksGain;
        // console.log("sticksNumber: " + sticksNumber);

        var bricksGainSpan = document.getElementById('brickGain');
        bricksGainSpan.innerHTML = brickGain;
        // console.log("brickNumber: " + brickNumber);

    }

    function pointsCalc() {
        hayNumber = 0;
        sticksNumber = 0;
        brickNumber = 0;

        hayGain = 0;
        sticksGain = 0;
        brickGain = 0;

        for (var r=0; r<rows; r++) {
            for (var c=0; c<columns; c++) {
                var i = (r * columns) + c;
                var ch = maze[i];
                if (ch == 'B') {
                    hayNumber++;
                }   else if (ch == 'C') {
                    sticksNumber++;
                }   else if (ch == 'D') {
                    brickNumber++;
                }
            }
        }

        hayGain = hayNumber * hayWorth;
        sticksGain = sticksNumber * sticksWorth;
        brickGain = brickNumber * brickWorth;

        hayGain = Math.round(hayGain*100)/100;
        sticksGain = Math.round(sticksGain*100)/100;
        brickGain = Math.round(brickGain*100)/100;

        // points = points + 1 + hayGain+sticksGain+brickGain;
        points = points + hayGain+sticksGain+brickGain;
        points = Math.round(points*100)/100;

    }

    function wolfMove() {
        if (playerWonHooray == 1) {
            return;
        }
        console.log("moving wolf from side "+ wolfSide);

        var wDeltaRow = 0;
        var wDeltaColumn = 0;

        if (wolfSide == 0) {
            wDeltaRow = +1;
        }

        if (wolfSide == 1) {
            wDeltaColumn = -1;
        }

        if (wolfSide == 2) {
            wDeltaRow = -1;
        }

        if (wolfSide == 3) {
            console.log("moving wolf Right");
            wDeltaColumn = +1;
        }
        // Look at the location we want to move to. if it's out of bounds or
        // there's a wall, cancel the move.
        var nr = wolfPlayerLocation.row + wDeltaRow;
        var nc = wolfPlayerLocation.column + wDeltaColumn;
        // console.log ("nr: " + nr);
        // console.log ("nc: " + nc);




        // if (nr<0 || nr>=rows || nc<0 || nc>=columns || isWall(nr, nc)) {
        //     deltaRow = 0;
        //     deltaColumn = 0;
        // }
        // if (isWall(nr, nc) && !(nr<0) && !(nr>=rows) && !(nc<0) && !(nc>=columns)) {
        //     blockedCounter += 1;
        // console.log('***BLOCKED***');

    // } else {
    //     }

    wolfPlayerLocation = {
        'row': wolfPlayerLocation.row + wDeltaRow,
        'column': wolfPlayerLocation.column + wDeltaColumn


        // console.log('moved right');
        // console.log(playerLocation);
    }

    wolf.x = wallStartX + wolfPlayerLocation.column * wallSize + wallSize/2;
    wolf.y = wallStartY + wolfPlayerLocation.row * wallSize + wallSize/2;  

    var cr = wolfPlayerLocation.row;
    var cc = wolfPlayerLocation.column;

    if (isHouse(cr,cc) && (cr >= 0) && (cr<=rows-1) && (cc>= 0) && (cc<=columns-1)) {
        console.log("wolf hit house");
         var houseType = isHouse(cr,cc);
         var houseNumber = cr * columns + cc; // formula that is used to create the walls
         console.log("type of house is " + houseType + " at " + houseNumber);
         if (houseType == 'B') { //Hay
            maze = maze.replaceAt(houseNumber, " "); // puts house in Maze
            buildMaze();
            eat.play(); //play Sound
            isNight = 0;
            drawPath();
            isNight = 1;
            night.clear();
            drawNight();
            // console.log("oh haaay");
         } else if (houseType == 'C') { //Sticks
            fade = 0;
            redRow = wallStartX + cr * wallSize;
            redCol = wallStartY + cc * wallSize; 
            eat.play(); //play Sound 
            blinkRed();
            maze = maze.replaceAt(houseNumber, " "); // puts house in Maze
            buildMaze();
            setTimeout(playDeathSound,300);
            stage.removeChild(wolf);
            setTimeout(morning, 650);
            return;
         } else if (houseType == 'D') { //Bricks
            fade = 0;
            blinkRed();
            setTimeout(playDeathSound,300);
            stage.removeChild(wolf);
            setTimeout(morning, 650);
            return;
        }
    } 
    stage.addChild(wolf);

    iteration++;                     //  increment the counter
    if (iteration >= (rows*2 - 2)) {
        //call Morning
        setTimeout(morning, 500);
    }
    else if (iteration < (rows *2 - 2)) {            //  if the counter < 10, call the loop function
        myLoop();             //  ..  again which will trigger another 
    }
}

function blinkRed () {
    console.log("WOLF DEATH");
    if ((fade < 20) && (playerWonHooray != 1)) {
        setTimeout(redLoop, 10)
        fade ++;
    } else {
        setTimeout(removeDeathText,300);
    }
}

function redLoop() {
    console.log("looping");
    console.log("fade value: " + fade);
    console.log("fade value: " + fade/100);
    redSq.beginFill(0xCC1100,fade/100-0.02);
    redSq.drawRect(wallStartX, wallStartY, rows*wallSize, columns*wallSize, pathColor); 
    stage.addChild(redSq); 
    stage.addChild(deadWolfText);
    // renderer.render(stage);
    blinkRed();
}

function removeDeathText() {
    // drawPath();
    stage.removeChild(deadWolfText);
    stage.removeChild(redSq); 

}

function playDeathSound() {
        break2.play(); //play Sound
}



//changes the maze to the another maze
//takes the new maze variable as input
var changeMaze = function(newMaze) {
    maze = newMaze; //changes the maze variable to hold another maze
    buildMaze(); //rebuilds the maze

}

var addHouse = function(type) {
    if (isNight == 1) {
        return;
    }
    if (type == "hay") {
        var pathToBuild = mario.playerLocation.row * columns + mario.playerLocation.column; // formula that is used to create the walls
        maze = maze.replaceAt(pathToBuild, "B"); // puts house in Maze
        points = points - hayCost;
        points = Math.round(points*100)/100;
        housesBuilt = housesBuilt + 1;
        console.log("Houses Built: " + housesBuilt);
        buildMaze(); // rebuilds maze 
        drawPath();
        checkPoints();

    }

    if (type == "sticks") {
        var pathToBuild = mario.playerLocation.row * columns + mario.playerLocation.column; // formula that is used to create the walls
        maze = maze.replaceAt(pathToBuild, "C"); // replace old maze with new maze that has broken wall
        points = points - sticksCost;
        points = Math.round(points*100)/100;
        housesBuilt = housesBuilt + 1;
        console.log("Houses Built: " + housesBuilt);
        buildMaze(); // rebuilds maze 
        drawPath();
        checkPoints();

    }

    if (type == "brick") {
        var pathToBuild = mario.playerLocation.row * columns + mario.playerLocation.column; // formula that is used to create the walls
        maze = maze.replaceAt(pathToBuild, "D"); // replace old maze with new maze that has broken wall
        points = points - brickCost;
        points = Math.round(points*100)/100;
        housesBuilt = housesBuilt + 1;
        console.log("Houses Built: " + housesBuilt);
        buildMaze(); // rebuilds maze 
        drawPath()
        checkPoints();
    }
}


String.prototype.replaceAt=function(index, character) {
	return this.substr(0, index) + character + this.substr(index+character.length);
}


stage.updateLayersOrder = function () {
    stage.children.sort(function(a,b) {
        a.zIndex = a.zIndex || 0;
        b.zIndex = b.zIndex || 0;
        return b.zIndex - a.zIndex
    });
};

