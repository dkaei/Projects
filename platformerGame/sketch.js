/* This code requires using "Collapse All" to best navigate. */

var i, j; //use for for-loops
var colourMix, colourAmt, colourTop, colourBottom;
var mountain_x=[], ground=[], trees=[], clouds=[], canyon_x=[], platforms=[], platformHeight, platformNumber, platformMove=[];
const s=50, m=100, l=170; //short/mid/long canyon sizes
var play=false, start=false, gameChar_x=100, gameChar_y=270, gameScroll=0, score=0, scoreControl=0, flags=[], checkpoint=0, redEffect=false, redControl=0, healthBar=70, gameEnd=false, endCounter=100;
var collectable_x=[], collectable_y=[], collectableBounce=0, bounceControl=0, up=false, collectableFound=[], blueEffect=false, blueControl=0, waterBar=200, waterAdd;
var isLeft=false, isRight=false, isFalling=false, isPlummeting=false, isOnPlatform=false, jump=false, gravity=2, acceleration, accelerationControl=0;
var leftArrow, rightArrow, spaceBar, ready=false, readyControl=0, wordBlink=true, blinkControl=0;
var enemiesData, enemies=[], enemyContact, enemyHit=false, hitDist=150, idleLeft=false, idleRight=false;
var jumpSound,floatSound,landSound,stepSound,waterSound,healthSound,rollSound,cdRoll=100,boinkSound,reviveSound,coughSound,cdCough=300,flagSound,cdFlag=1,fallSound,cdFall=1,bgmSound;

function preload()
{
    soundFormats('mp3','wav');
    jumpSound = loadSound('assets/jump.mp3');
    jumpSound.setVolume(0.5);
    floatSound = loadSound('assets/float.mp3');
    landSound = loadSound('assets/land.mp3');
    stepSound = loadSound('assets/step.mp3');
    waterSound = loadSound('assets/water.wav');
    healthSound = loadSound('assets/health.wav');
    rollSound = loadSound('assets/roll.mp3');
    rollSound.setVolume(0.05);
    boinkSound = loadSound('assets/boink.wav');
    reviveSound = loadSound('assets/revive.mp3');
    reviveSound.setVolume(0.3);
    coughSound = loadSound('assets/cough.mp3');
    coughSound.setVolume(0.4);
    flagSound = loadSound('assets/flag.wav');
    flagSound.setVolume(0.4);
    fallSound = loadSound('assets/fall.wav');
    bgmSound = loadSound('assets/bgm.mp3');
    bgmSound.setVolume(0.6);
}

function setup()
{
    bgmSound.loop();
    createCanvas(1024, 576); //(14 frames * 1024)
    angleMode(DEGREES);

    //insert enemies
    enemiesData=[[4980,403,300,2],[5100,403,300,-2],[5900,403,100,2],[7190,320-30,100,2],[8040,403,2,-2],[8090,403,2,2],[8800,403,300,2],[9250,403,300,-2],[10900,403,100,2],[11000,403,200,-2],[11200,403,300,2],[12000,403,100,2],[12150,403,200,-2],[12200,403,200,2],[12350,403,100,-2],[12450,403,200,-2],[12550,403,100,2],[12150,380-30,100,2],[12270,260-30,100,2],[12080,260-30,100,-2],[12450,260-30,200,-2],[12200,140-30,200,2],[12090,140-30,200,-2],[12600,403,100,2],[12650,403,200,-2],[12700,403,200,2],[12750,403,100,-2],[12770,403,200,-2],[12825,403,150,2],[12850,403,100,-2],[12900,403,90,2]];
    for (i=0; i<enemiesData.length; i++) enemies.push(new enemy(enemiesData[i][0],enemiesData[i][1],enemiesData[i][2],enemiesData[i][3]));

    //insert canyons
    canyon_x.push([500,l],[1050,m],[1680,l],[2500,s],[2600,l],[3200,m],[4000,l],[4230,l],[5770,m],[6500,m],[6650,m],[6800,l],[7220,m],[7470,m],[7970,s],[8112,s],[8600,l],[9900,4*l],[11830,m],[13000,m]);

    //insert platforms
    platforms.push([550,380,3],[1700,380,2],[3080,370,3],[3170,320,2],[4100,380,2],[4270,380,2],[6850,380,2],[7100,380,2],[7170,320,15],[7550,380,2],[7900,380,1],[8234,380,1],[8067,260,1],[7983.5,320,1],[8150.5,320,1],[12050,380,30],[12050,260,30],[12050,140,30]);
    platformMove.push([9900,1,9900,10100,380],[10450,-2,10150,10450,380],[12050,2,12050,12590,320],[12590,-2,12050,12590,200],[12750,4,12750,13100,320]);

    //insert collectables
    collectable_x.push(-400,0,400,1000,1100,1600,1865,2200,2570,2605,2630,2700,3000,3600,4470,4550,4630,5380,6800,6835,6860,6660,6690,6720,6000,7700,7800,8200,8350,8500,8650,8800,9600,9500,9750,10000,10320,10400,10600,10700,10830,11560,11420,11400,11440,11800,11900,12200,12250,12300,12350,12400,11750,11800);
    collectable_y.push(0,0,-100,-100,-20,-120,0,-100,-200,-190,-160,0,0,-100,-60,-120,-60,-120,-200,-190,-160,0,5,0,-120,-20,-120,0,-30,0,-120,0,-180,-30,-180,0,-160,-120,0,-20,0,-100,-300,-310,-310,-380,-360,-110,-120,-110,-120,-110,-70,-80);
    for (i=0; i<collectable_x.length; i++) collectableFound[i]=false; //initialise collectables' states

    //insert flags
    flags=[441,2200,4450,6200,7670,9730,11700];

    //randomize mountains
    for (i=0; i<14; i++) mountain_x[i]=random(1024*i,1024*i+1024);

    //randomize ground sparkles
    for (i=0; i<1000; i++) ground[i]={x:random(0,1024*14),y:random(440,490)};

    //randomize ground bottom beads
    for (i=1000; i<1200; i++) ground[i]={x:random(0,1024*14),y:random(521,576)};

    //randomize trees
    for (i=0; i<60; i++)
    {
        trees[i] = random(680*i-300,680*i+380); 

        for (j=0; j<canyon_x.length; j++) //to avoid having trees float over canyons
        {
            if (trees[i]>(canyon_x[j][0]*2-500) && trees[i]<(canyon_x[j][0]*2)-500+(canyon_x[j][1]*2)+280)
            {
                trees[i] += (canyon_x[j][1]*2)+280;
            }
        }
    }
    trees[0]=200; //to ensure first tree is not covering the character at spawn

    //randomize clouds
    for (i=0; i<700; i++)
    {
        clouds[i] = {x:random(146*i,146*i+146),y:random(50,100),s:random(1,1.5),height:random(20,25)};
    }
}

function mountain(x,y)
{
    push();
    fill(220,103,13);
    if (y==0) noStroke(); else stroke(0);
    triangle(0+x-(gameScroll/2),450-y,400+x-(gameScroll/2),300-y,400*2+x-(gameScroll/2),450-y);
    noStroke();
    fill(255);
    triangle(400-2+x-(gameScroll/2),300+2-y,400-15+x-(gameScroll/2),300+12-y,400-57+x-(gameScroll/2),300+25-y);
    pop();
}

function tree(x,y,s)
{
    push();
    strokeWeight(1);
    scale(s);
    translate(x,y);
    {
        beginShape();
        vertex(347,55);  vertex(353,62);  vertex(357,70);  vertex(367,63);  vertex(361,72);
        vertex(359,84);  vertex(362,95);  vertex(361,119); vertex(357,127); vertex(357,153);
        vertex(361,152); vertex(358,163); vertex(355,171); vertex(358,182); vertex(345,227);
        vertex(346,241); vertex(356,251); vertex(368,240); vertex(368,235); vertex(384,232);
        vertex(397,227); vertex(400,227); vertex(373,239); vertex(371,244); vertex(363,258);
        vertex(358,279); vertex(363,314); vertex(362,341); vertex(369,352); vertex(373,312);
        vertex(386,291); vertex(397,275); vertex(425,213); vertex(426,174); vertex(427,166);
        vertex(432,187); vertex(440,136); vertex(445,117); vertex(441,81);  vertex(446,96);
        vertex(451,98);  vertex(457,98);  vertex(452,107); vertex(450,127); vertex(467,129);
        vertex(451,136); vertex(440,186); vertex(438,200); vertex(441,201); vertex(438,207);
        vertex(437,216); vertex(429,232); vertex(446,224); vertex(466,221); vertex(468,223);
        vertex(455,227); vertex(463,230); vertex(475,233); vertex(452,230); vertex(428,246);
        vertex(416,267); vertex(408,286); vertex(391,306); vertex(385,322); vertex(385,347);
        vertex(387,355); vertex(381,402); vertex(390,405); vertex(411,380); vertex(420,363);
        vertex(422,335); vertex(435,322); vertex(466,303); vertex(495,291); vertex(504,286);
        vertex(509,286); vertex(539,275); vertex(549,269); vertex(566,265); vertex(575,256);
        vertex(586,256); vertex(590,253); vertex(587,258); vertex(578,263); vertex(584,267);
        vertex(573,267); vertex(569,269); vertex(581,280); vertex(601,292); vertex(586,285);
        vertex(578,281); vertex(566,272); vertex(522,286); vertex(525,286); vertex(523,292);
        vertex(517,292); vertex(497,302); vertex(475,308); vertex(479,316); vertex(470,317);
        vertex(467,321); vertex(460,338); vertex(462,341); vertex(457,339); vertex(449,355);
        vertex(437,365); vertex(435,370); vertex(433,380); vertex(437,380); vertex(422,402);
        vertex(397,437); vertex(394,446); vertex(388,461); vertex(382,538); vertex(396,543);
        vertex(410,551); vertex(422,551); vertex(437,550); vertex(454,554); vertex(487,555);
        vertex(434,558); vertex(467,562); vertex(439,563); vertex(421,558); vertex(399,561);
        vertex(385,558); vertex(352,560); vertex(329,564); vertex(300,577); vertex(321,562);
        vertex(315,562); vertex(292,580); vertex(289,580); vertex(312,558); vertex(261,562);
        vertex(241,566); vertex(296,555); vertex(306,552); vertex(230,554); vertex(264,550);
        vertex(309,548); vertex(328,539); vertex(343,534); vertex(355,461); vertex(352,419);
        vertex(347,405); vertex(352,403); vertex(353,393); vertex(340,361); vertex(289,317);
        vertex(241,320); vertex(222,314); vertex(220,310); vertex(195,303); vertex(180,304);
        vertex(165,314); vertex(146,323); vertex(131,326); vertex(119,334); vertex(125,327);
        vertex(144,318); vertex(171,303); vertex(191,296); vertex(230,303); vertex(244,310);
        vertex(279,309); vertex(261,296); vertex(254,274); vertex(232,257); vertex(230,253);
        vertex(216,251); vertex(227,250); vertex(239,251); vertex(242,250); vertex(248,244);
        vertex(251,232); vertex(250,210); vertex(244,206); vertex(251,207); vertex(248,193);
        vertex(254,206); vertex(257,234); vertex(252,251); vertex(264,265); vertex(279,297);
        vertex(303,305); vertex(315,315); vertex(343,340); vertex(343,323); vertex(345,320);
        vertex(343,312); vertex(338,267); vertex(329,242); vertex(326,222); vertex(328,207);
        vertex(317,204); vertex(304,194); vertex(296,192); vertex(303,191); vertex(303,180);
        vertex(282,170); vertex(276,170); vertex(263,180); vertex(265,172); vertex(273,166);
        vertex(270,163); vertex(293,166); vertex(309,177); vertex(318,197); vertex(335,198);
        vertex(337,191); vertex(345,177); vertex(338,164); vertex(322,152); vertex(329,150);
        vertex(346,160); vertex(351,157); vertex(352,121); vertex(350,117); vertex(355,116);
        vertex(351,84);  vertex(352,71);
        endShape();
    } //tree vertices   
    {
        noStroke();
        fill(255,218,185);
        beginShape();
        vertex(460,581);
        vertex(430,561);
        vertex(393,553);
        vertex(384,557);
        vertex(371,548);
        vertex(361,551);
        vertex(357,548);
        vertex(342,557);
        vertex(307,574);
        vertex(307,581);
        endShape();
    } //sand vertices
    pop();
}

function collectable(cx,cy)
{ 
    push();
    translate(1,1);
    strokeJoin(ROUND);
    stroke(0,111);
    strokeWeight(4);
    fill(0,150);
    triangle(cx+710-gameScroll,cy+385+collectableBounce,cx+710+6-gameScroll,cy+385+15+collectableBounce,cx+710-6-gameScroll,cy+385+15+collectableBounce);
    ellipse(cx+710-gameScroll,cy+385+16+collectableBounce,12);
    pop();

    push();
    strokeJoin(ROUND);
    stroke(99, 200, 255);
    strokeWeight(3);
    fill(99, 200, 255);
    triangle(cx+710-gameScroll,cy+385+collectableBounce,cx+710+6-gameScroll,cy+385+15+collectableBounce,cx+710-6-gameScroll,cy+385+15+collectableBounce);
    ellipse(cx+710-gameScroll,cy+385+16+collectableBounce,12);
    stroke(255);
    fill(255);
    ellipse(cx+710+1-gameScroll,cy+385+16+collectableBounce,5);
    stroke(99, 200, 255);
    fill(99, 200, 255);
    ellipse(cx+710-1-gameScroll,cy+385+15+collectableBounce,6);
    pop();
}

function canyon(canyonleft,canyonsize)
{
    push();
    colourTop = color(220,103,13);
    colourBottom = color(102,51,0);
    noFill();
    for (j = 432; j < 577; j++) 
    {
        colourAmt = map(j, 432, 577, 0, 1);
        colourMix= lerpColor(colourTop, colourBottom, colourAmt);
        stroke(colourMix);
        line(canyonleft-gameScroll, j, canyonleft+canyonsize-gameScroll, j);
    }
    pop();
}

function platform(px,py,blocks,no)
{
    {
        colourTop = color(255,218,185);
        colourBottom = color(200,170,130);
        push();
        noFill();
        for (j = py; j < py+23; j++) 
        {
            colourAmt = map(j, py+5, py+20, 0, 1);
            colourMix = lerpColor(colourTop, colourBottom, colourAmt);
            stroke(colourMix);
            line(px-gameScroll, j, px-gameScroll+(20*blocks), j);
        }
        stroke(255,50);
        fill(255,50);
        rect(px-gameScroll,py,20*blocks,3);
        stroke(255);
        fill(255);
        rect(px-gameScroll,py-1,20*blocks,1);
        pop(); 
    }//draw platform

    {
        if (isFalling && gameChar_y*1.6<py && gameChar_x*1.6>px-20-gameScroll && gameChar_x*1.6<(20*blocks+px+20)-gameScroll && abs(gameChar_y*1.6-py)<60) 
        {
            isOnPlatform=true; platformHeight=py; platformNumber=no; 
        }
        if (isOnPlatform && !isFalling && !jump) 
        {
            if (platformNumber>=100)
            {
                if (gameChar_x<width*0.4/1.6 || gameChar_x>width*0.6/1.6) gameScroll+=(platformMove[platformNumber-100][1])*1.6/38;
                else gameChar_x+=(platformMove[platformNumber-100][1])/38;
            }
        }
        if (isOnPlatform && platformNumber==no && (gameChar_x*1.6<=px-20-gameScroll || gameChar_x*1.6>=(20*blocks+px+20)-gameScroll)) {isOnPlatform=false; isFalling=true;}
    }//check platform
}

function enemy(x,y,range,speed)
{
    this.initialX=x;
    this.range=range;

    this.x=x;
    this.y=y;
    this.speed=speed;

    this.update = function()
    {
        this.x+=this.speed;

        if(this.x>this.initialX+this.range+5) this.speed=-2;
        else if(this.x>this.initialX+this.range)
        {
            if (this.speed==-2) {idleRight=false; idleLeft=true;}
            else 
            {
                idleRight=true; idleLeft=false; this.speed=0.05;
            }
        }
        else if(this.x<this.initialX-5) this.speed=2;
        else if(this.x<this.initialX)
        {
            if (this.speed==2) {idleLeft=false; idleRight=true;}
            else 
            {
                idleLeft=true; idleRight=false; this.speed=-0.05;
            }
        }
        else {idleLeft=false; idleRight=false;}
    }

    this.draw = function()
    {
        this.update();
        if (idleRight==false && idleLeft==false)
        {
            if (cdRoll==100 && abs(gameChar_x*1.6+gameScroll-this.x)<50 && abs(gameChar_y*1.6-this.y)<100) {rollSound.play(); cdRoll=99;}
            if (cdRoll<100) cdRoll--; if (cdRoll==0) cdRoll=100;

            fill(103, 76, 71);
            stroke(0);
            ellipse(this.x-gameScroll,this.y+15,15*2);
            for (j=0; j<360; j+=random(10,15))
            {
                stroke(random(0,255),random(100,220));
                let go = random(0,5);
                if (go<=2)
                    line(this.x-gameScroll,this.y+15,(this.x-gameScroll)+15*cos(j),(this.y+15)+15*sin(j));
            }
            noStroke();
            fill(122,87,73);
            ellipse(this.x-gameScroll,this.y+15,10*2);

            for (j=0; j<360; j+=random(5,15))
            {
                stroke(0,random(100,220));
                let go = random(0,4);
                if (go<=2)
                    line(this.x-gameScroll,this.y+15,(this.x-gameScroll)+15*cos(j),(this.y+15)+15*sin(j));
            }
            noStroke();
            fill(99, 81, 71);
            ellipse(this.x-gameScroll,this.y+15,5*2);

            for (j=0; j<360; j+=random(0,5))
            {
                stroke(0,random(100,220));
                let go = random(0,4);
                if (go<=2)
                    line(this.x-gameScroll,this.y+15,(this.x-gameScroll)+15*cos(j),(this.y+15)+15*sin(j));
            }
        } //enemy rolling state
        if (idleRight)
        {
            fill(103, 76, 71);
            stroke(0);
            ellipse(this.x-gameScroll,this.y+15,15*2);
            fill(255);
            rect(this.x+10-gameScroll,this.y+24,3,5);
            triangle(this.x+9-gameScroll,this.y+20,this.x+15-gameScroll,this.y+13,this.x+19-gameScroll,this.y+15);
            beginShape();
            vertex(this.x+15-gameScroll,this.y+20);
            vertex(this.x+14-gameScroll,this.y+19);
            vertex(this.x+16-gameScroll,this.y+13);
            vertex(this.x+14-gameScroll,this.y+10);
            vertex(this.x+15-gameScroll,this.y+5.5);
            vertex(this.x+11-gameScroll,this.y+7);
            vertex(this.x+12-gameScroll,this.y+6);
            vertex(this.x+6-gameScroll,this.y+8);
            vertex(this.x+3-gameScroll,this.y+7);
            vertex(this.x+3-gameScroll,this.y+8);
            vertex(this.x-2-gameScroll,this.y+5.5);
            vertex(this.x-2-gameScroll,this.y+12);
            vertex(this.x-1-gameScroll,this.y+17);
            vertex(this.x-2-gameScroll,this.y+19);
            vertex(this.x-4-gameScroll,this.y+17);
            vertex(this.x-5-gameScroll,this.y+22);
            vertex(this.x-7-gameScroll,this.y+22);
            vertex(this.x-6-gameScroll,this.y+24);
            vertex(this.x-10-gameScroll,this.y+26);
            vertex(this.x-3-gameScroll,this.y+31);
            vertex(this.x+5-gameScroll,this.y+31);
            vertex(this.x+10-gameScroll,this.y+28);
            vertex(this.x+15-gameScroll,this.y+20);
            endShape();

            rect(this.x+3-gameScroll,this.y+25,3.5,6);
            noStroke();
            triangle(this.x+9-gameScroll,this.y+20,this.x+15-gameScroll,this.y+13,this.x+18-gameScroll,this.y+15);
            fill(0);
            ellipse(this.x+19-gameScroll,this.y+15,3);

            //eyes
            stroke(0);
            fill(0);
            ellipse(this.x+7-gameScroll,this.y+13,2);
            ellipse(this.x+13-gameScroll,this.y+11,2);
            stroke(255);
            fill(255);
            ellipse(this.x+6-gameScroll,this.y+12,0.5);
            ellipse(this.x+12-gameScroll,this.y+10,0.5);
        }
        if (idleLeft)
        {
            fill(103, 76, 71);
            stroke(0);
            ellipse(this.x-gameScroll,this.y+15,15*2);
            fill(255);
            rect(this.x-10-3-gameScroll,this.y+24,3,5);
            triangle(this.x-9-gameScroll,this.y+20,this.x-15-gameScroll,this.y+13,this.x-19-gameScroll,this.y+15);
            beginShape();
            vertex(this.x-15-gameScroll,this.y+20);
            vertex(this.x-14-gameScroll,this.y+19);
            vertex(this.x-16-gameScroll,this.y+13);
            vertex(this.x-14-gameScroll,this.y+10);
            vertex(this.x-15-gameScroll,this.y+5.5);
            vertex(this.x-11-gameScroll,this.y+7);
            vertex(this.x-12-gameScroll,this.y+6);
            vertex(this.x-6-gameScroll,this.y+8);
            vertex(this.x-3-gameScroll,this.y+7);
            vertex(this.x-3-gameScroll,this.y+8);
            vertex(this.x+2-gameScroll,this.y+5.5);
            vertex(this.x+2-gameScroll,this.y+12);
            vertex(this.x+1-gameScroll,this.y+17);
            vertex(this.x+2-gameScroll,this.y+19);
            vertex(this.x+4-gameScroll,this.y+17);
            vertex(this.x+5-gameScroll,this.y+22);
            vertex(this.x+7-gameScroll,this.y+22);
            vertex(this.x+6-gameScroll,this.y+24);
            vertex(this.x+10-gameScroll,this.y+26);
            vertex(this.x+3-gameScroll,this.y+31);
            vertex(this.x-5-gameScroll,this.y+31);
            vertex(this.x-10-gameScroll,this.y+28);
            vertex(this.x-15-gameScroll,this.y+20);
            endShape();

            rect(this.x-3-3.5-gameScroll,this.y+25,3.5,6);
            noStroke();
            triangle(this.x-9-gameScroll,this.y+20,this.x-15-gameScroll,this.y+13,this.x-18-gameScroll,this.y+15);
            fill(0);
            ellipse(this.x-19-gameScroll,this.y+15,3);

            //eyes
            stroke(0);
            fill(0);
            ellipse(this.x-7-gameScroll,this.y+13,2);
            ellipse(this.x-13-gameScroll,this.y+11,2);
            stroke(255);
            fill(255);
            ellipse(this.x-6-gameScroll,this.y+12,0.5);
            ellipse(this.x-12-gameScroll,this.y+10,0.5);
        }
    }

    this.checkContact = function(charX,charY)
    {
        let dX = abs(charX-this.x);
        let dY = charY-this.y;
        let dY2 = (this.y-30)-(-80*1.6+charY);

        if(dX<30 && dY>=0 && dY2>=0) return true; else return false;
    }
}

function draw()
{    
    //background [static]
    {
        background(0);
        noStroke();
        fill(78,214,235,100);
        ellipse(width/2,height/2,1400,900);
        fill(78,214,235,50);
        ellipse(width/2,height/2+25,1350,875);
        fill(252,115,115,10);
        ellipse(width/2,height/2+50,1300,850);
        fill(78,214,235,50);
        ellipse(width/2,height/2+75,1250,825);
        fill(252,115,115,10);
        ellipse(width/2,height/2+100,1200,800);
        fill(78,214,235,50);
        ellipse(width/2,height/2+125,1100,750);
        fill(78,214,235,50);
        ellipse(width/2,height/2+150,1000,700);

        colourTop = color(78,214,235,100);
        colourBottom = color(255);
        push();
        noFill();
        for (i = 0; i < 433; i++) 
        {
            colourAmt = map(i, 0, 433, 0, 1);
            colourMix = lerpColor(colourTop, colourBottom, colourAmt);
            stroke(colourMix);
            line(0, i, width, i);
        }
        pop();
    }

    //mountain [static + scroll]
    {
        //back layer [static]
        stroke(0);
        fill(172,91,30);
        beginShape();
        vertex(0,302);
        vertex(191,333);
        vertex(444,345);
        vertex(510,369);
        vertex(725,343);
        vertex(805,357);
        vertex(877,351);
        vertex(1024,347);
        vertex(1024,450);
        vertex(0,450);
        endShape();

        //front layer [scroll]
        for (i=0; i<mountain_x.length; i++) mountain(mountain_x[i],1);
        for(i=0; i<20; i++)
        {
            stroke(0);
            fill(220,103,13);
            rect(0,433,width,20);
            beginShape();
            vertex(0+(1024*i)-(gameScroll/2),367);
            vertex(100+(1024*i)-(gameScroll/2),350);
            vertex(179+(1024*i)-(gameScroll/2),339);
            vertex(276+(1024*i)-(gameScroll/2),330);
            vertex(408+(1024*i)-(gameScroll/2),293);
            vertex(430+(1024*i)-(gameScroll/2),296);
            vertex(516+(1024*i)-(gameScroll/2),330);
            vertex(557+(1024*i)-(gameScroll/2),342);
            vertex(621+(1024*i)-(gameScroll/2),320);
            vertex(652+(1024*i)-(gameScroll/2),316);
            vertex(833+(1024*i)-(gameScroll/2),379);
            vertex(921+(1024*i)-(gameScroll/2),393);
            vertex(1024+(1024*i)-(gameScroll/2),367);
            vertex(1024+(1024*i)-(gameScroll/2),450);
            vertex(0+(1024*i)-(gameScroll/2),450);
            endShape();
            noStroke();
            rect(0+(1024*i)-(gameScroll/2)-1,368,2,450-368);
            fill(0,50);
            beginShape();
            vertex(428+(1024*i)-(gameScroll/2),305);
            vertex(460+(1024*i)-(gameScroll/2),333);
            vertex(484+(1024*i)-(gameScroll/2),332);
            vertex(524+(1024*i)-(gameScroll/2),340);
            vertex(478+(1024*i)-(gameScroll/2),322);
            vertex(472+(1024*i)-(gameScroll/2),325);
            endShape();
        }
        for (i=0; i<mountain_x.length; i++) mountain(mountain_x[i],0);
    }

    //trees (back layer) [scroll]
    {
        for (i=1; i<60; i+=2) //light reflection
        {
            stroke(0);
            fill(0);
            tree(trees[i]+2-gameScroll*2,310+1,0.5);
        }

        for (i=1; i<60; i+=2)
        {
            stroke(0);
            fill(82,41,0);
            tree(trees[i]-gameScroll*2,310,0.5);
        }
    }

    //ground [static]
    {
        stroke(255);
        fill(255,202,133,200);
        rect(0, 432, 1024, 144);

        colourTop = color(255,218,185);
        colourBottom = color(210,180,140);
        push();
        noFill();
        for (i = 433; i < 577; i++) 
        {
            colourAmt = map(i, 433, 577, 0, 1);
            colourMix = lerpColor(colourTop, colourBottom, colourAmt);
            stroke(colourMix);
            line(0, i, width, i);
        }
        pop();

        noStroke();
        fill(255,50);
        rect(0,433,1024,5);

        //sparkles and beads [scroll]
        for (i=0; i<1200; i++)
        {
            if(ground[i].y>520)
            {
                fill(0,20);
                ellipse(ground[i].x-gameScroll,ground[i].y,5,2);
            }
            else 
            {
                fill(255,random(20,255));
                ellipse(ground[i].x-gameScroll,ground[i].y,3,random(1,3));
            }
        }
        fill(255);
        rect(0,432,1024,2);
    }

    //clouds [scroll]
    {
        for (i=0;i<350;i++)
        {
            push();
            scale(clouds[i].s);
            fill(255);
            ellipse(clouds[i].x,clouds[i].y,60,clouds[i].height);
            fill(255,200);
            ellipse(clouds[i].x+15,clouds[i].y-5,50,clouds[i].height+15);
            fill(255,150);
            ellipse(clouds[i].x+30,clouds[i].y,60,clouds[i].height);
            fill(255,100);
            ellipse(clouds[i].x+45,clouds[i].y+5,50,clouds[i].height-13);
            pop();
            clouds[i].x-=0.1; //animate clouds
        }
    }

    //canyons [scroll]
    {
        for (i=0;i<canyon_x.length;i++)
        {
            canyon(canyon_x[i][0],canyon_x[i][1]);
        }
    }

    //platforms [scroll]
    {
        for (i=0; i<platforms.length; i++)
        {
            platform(platforms[i][0],platforms[i][1],platforms[i][2],i+1);
        }

        //moving platforms
        for (i=0; i<platformMove.length; i++)
        {
            if (platformMove[i][0]>platformMove[i][3]) platformMove[i][1]=-1*abs(platformMove[i][1]);
            else if (platformMove[i][0]<platformMove[i][2]) platformMove[i][1]=1*abs(platformMove[i][1]);
            platformMove[i][0]+=platformMove[i][1]
            platform(platformMove[i][0],platformMove[i][4],3,100+i);
        }   
    }

    //collectables [scroll]
    {
        {
            if(up) bounceControl-=1;
            else bounceControl+=1;
            if (bounceControl==30) up=true;
            if (bounceControl==-30) up=false;
            collectableBounce=bounceControl*0.1;
        } //animate up-down

        for(i=0;i<collectableFound.length;i++) //collected check
        {
            if (collectableFound[i]==false && healthBar!=0)
            {
                collectable(collectable_x[i],collectable_y[i]);
                if (abs(collectable_x[i]+710-gameScroll-(1.6*gameChar_x))<30 && (397-collectableBounce+collectable_y[i])>((gameChar_y-70)*1.6) && (gameChar_y*1.6)>(397-collectableBounce+collectable_y[i]))
                {
                    if (waterBar<1) healthSound.play(); else waterSound.play(); 
                    collectableFound[i]=true; blueEffect=true;waterBar+=waterAdd;
                }
            }
        }
    } 

    //character states [static]
    {
        scale(1.6);
        if(isFalling)
        {
            stroke(255,0);
            fill(255,random(150,200));
            curve(gameChar_x-15, gameChar_y-30, gameChar_x-random(12,15), gameChar_y, gameChar_x+random(12,15), gameChar_y, gameChar_x-15, gameChar_y-30);
            fill(255,random(100,150));
            curve(gameChar_x-10, gameChar_y-25, gameChar_x-random(8,11), gameChar_y+5, gameChar_x+random(8,11), gameChar_y+5, gameChar_x-10, gameChar_y-25);
            noStroke();
        }

        if(isLeft && isFalling)
        {
            //Jumping to the left
            {

                {
                    push();
                    fill(250,221,181);
                    rect(gameChar_x-2.5,gameChar_y-55,5,4);
                    pop();
                } //neck

                {
                    push();
                    fill(0,255,128);
                    translate(gameChar_x+18,gameChar_y-11);
                    rotate(350);
                    ellipse(0,0,13,2);
                    pop();
                    push();
                    fill(0,255,128);
                    triangle(gameChar_x+13,gameChar_y-20,gameChar_x+24.8,gameChar_y-12,gameChar_x+10,gameChar_y-9);
                    stroke(0,204,102);
                    strokeWeight(0.6);
                    line(gameChar_x+13,gameChar_y-20,gameChar_x+24.6,gameChar_y-12.2);
                    stroke(0,204,102,150);
                    strokeWeight(0.4);
                    line(gameChar_x+13,gameChar_y-20,gameChar_x+23.5,gameChar_y-11.3);
                    line(gameChar_x+13,gameChar_y-20,gameChar_x+20.7,gameChar_y-10.4);
                    line(gameChar_x+13,gameChar_y-20,gameChar_x+17.8,gameChar_y-9.8);
                    line(gameChar_x+13,gameChar_y-20,gameChar_x+12,gameChar_y-9.5);
                    line(gameChar_x+13,gameChar_y-20,gameChar_x+15,gameChar_y-9.7);
                    stroke(0,204,102);
                    strokeWeight(0.5);
                    line(gameChar_x+13,gameChar_y-20,gameChar_x+22.2,gameChar_y-10.7);
                    line(gameChar_x+13,gameChar_y-20,gameChar_x+19.3,gameChar_y-9.8);
                    line(gameChar_x+13,gameChar_y-20,gameChar_x+16.5,gameChar_y-9.5);
                    line(gameChar_x+13,gameChar_y-20,gameChar_x+13.5,gameChar_y-9.4);
                    stroke(0,204,102);
                    strokeWeight(0.7);
                    line(gameChar_x+13,gameChar_y-20,gameChar_x+10,gameChar_y-9.4);
                    pop();
                    push();
                    fill(255);
                    triangle(gameChar_x+18,gameChar_y-16.1,gameChar_x+16,gameChar_y-16,gameChar_x+21,gameChar_y-14.7);
                    ellipse(gameChar_x+21,gameChar_y-14,1,0.5);
                    pop();
                    //reflection
                } //fan

                {
                    push();
                    fill(254,225,185);
                    ellipse(gameChar_x+15,gameChar_y-19,5,4);
                    fill(191,151,101,100);
                    ellipse(gameChar_x+16,gameChar_y-19.5,7,4);
                    pop();
                } //hand

                {
                    push();
                    fill(235);
                    beginShape(); //left top sleeve
                    vertex(gameChar_x+12,gameChar_y-50);
                    vertex(gameChar_x+8,gameChar_y-50);
                    vertex(gameChar_x+8,gameChar_y-44);
                    vertex(gameChar_x+11.5,gameChar_y-34);
                    vertex(gameChar_x+15,gameChar_y-30);
                    vertex(gameChar_x+17,gameChar_y-34);
                    endShape();    
                    pop();
                } //top sleeve

                {
                    push();
                    fill(220);
                    beginShape(); //left bot sleeve
                    vertex(gameChar_x+11.5,gameChar_y-34);
                    vertex(gameChar_x+17,gameChar_y-34);
                    vertex(gameChar_x+17,gameChar_y-33);
                    vertex(gameChar_x+20+random(-2,2),gameChar_y-17);
                    vertex(gameChar_x+12,gameChar_y-19);
                    endShape();
                    pop();
                } //bot sleeve

                {
                    push();
                    noStroke();
                    fill(245);
                    ellipse(gameChar_x+2,gameChar_y-50,20,5); //shoulder
                    fill(245);
                    triangle(gameChar_x,gameChar_y-20,gameChar_x+11,gameChar_y-50,gameChar_x-8,gameChar_y-50);

                    fill(150,150);
                    ellipse(gameChar_x+2,gameChar_y-51,16,3); //shoulder shadow

                    pop();
                } //shoulder

                {
                    push();
                    noStroke();
                    fill(245);
                    ellipse(gameChar_x+2,gameChar_y-50,20,5); //shoulder
                    fill(245);
                    triangle(gameChar_x,gameChar_y-20,gameChar_x+11,gameChar_y-50,gameChar_x-8,gameChar_y-50);
                    rect(gameChar_x-8,gameChar_y-50,16,50);
                    fill(150,150);
                    ellipse(gameChar_x+2,gameChar_y-51,19,3); //shoulder shadow
                    fill(245);
                    triangle(gameChar_x+7.5,gameChar_y-50,gameChar_x+7.5,gameChar_y,gameChar_x+12+random(-2,2),gameChar_y); //dress right


                    fill(220);
                    beginShape();
                    vertex(gameChar_x-8,gameChar_y-33);
                    vertex(gameChar_x-9,gameChar_y-29);
                    vertex(gameChar_x-12,gameChar_y-23);
                    vertex(gameChar_x-8,gameChar_y);
                    //bottom break
                    vertex(gameChar_x-1,gameChar_y);
                    vertex(gameChar_x-8,gameChar_y-23);
                    vertex(gameChar_x-7,gameChar_y-26);
                    vertex(gameChar_x-5,gameChar_y-29);
                    endShape(); // knee shadow
                    pop();
                } //body

                {
                    push();
                    fill(250,221,181);
                    triangle(gameChar_x+2.5,gameChar_y-53,gameChar_x-2.5,gameChar_y-53,gameChar_x-1.5,gameChar_y-48);
                    //v neck

                    fill(253,199,134,100);
                    ellipse(gameChar_x,gameChar_y-55,5,5); //neck shadow
                    pop();
                } //v neck + neck shadow

                {
                    fill(254,225,185);
                    ellipse(gameChar_x,gameChar_y-61,11,15); //head

                    fill(191,151,101);
                    ellipse(gameChar_x,gameChar_y-61,13,9); //head shadow
                } //head

                {
                    push();
                    stroke(100,0,0);
                    strokeWeight(1);
                    line(gameChar_x-2,gameChar_y-55,gameChar_x-3,gameChar_y-55.2);
                    pop();
                } //mouth

                {
                    push();
                    fill(197,175,118);
                    stroke(150,122,74);
                    ellipse(gameChar_x,gameChar_y-62,26,6); //hat bottom

                    noStroke();
                    triangle(gameChar_x,gameChar_y-62-8,gameChar_x+12,gameChar_y-62-1,gameChar_x-12,gameChar_y-62-1); //hat top
                    pop();
                } //hat

                {
                    push();
                    strokeWeight(0.5);
                    stroke(150,122,74);
                    line(gameChar_x,gameChar_y-62-8,gameChar_x-12,gameChar_y-62+1);
                    line(gameChar_x,gameChar_y-62-8,gameChar_x-10,gameChar_y-62+1.5);
                    line(gameChar_x,gameChar_y-62-8,gameChar_x-8,gameChar_y-62+2.5);
                    line(gameChar_x,gameChar_y-62-8,gameChar_x-6,gameChar_y-62+2.5);
                    line(gameChar_x,gameChar_y-62-8,gameChar_x-4,gameChar_y-62+2.5);
                    line(gameChar_x,gameChar_y-62-8,gameChar_x-2,gameChar_y-62+2.5);
                    line(gameChar_x,gameChar_y-62-8,gameChar_x,gameChar_y-62+2.5);
                    line(gameChar_x,gameChar_y-62-8,gameChar_x+12,gameChar_y-62+1);
                    line(gameChar_x,gameChar_y-62-8,gameChar_x+10,gameChar_y-62+1.5);
                    line(gameChar_x,gameChar_y-62-8,gameChar_x+8,gameChar_y-62+2.5);
                    line(gameChar_x,gameChar_y-62-8,gameChar_x+6,gameChar_y-62+2.5);
                    line(gameChar_x,gameChar_y-62-8,gameChar_x+4,gameChar_y-62+2.5);
                    line(gameChar_x,gameChar_y-62-8,gameChar_x+2,gameChar_y-62+2.5);
                    line(gameChar_x,gameChar_y-62-8,gameChar_x,gameChar_y-62+2.5);
                    pop();
                } //bamboo hat lines

                {
                    push();
                    fill(255); 
                    triangle(gameChar_x-2,gameChar_y-68,gameChar_x-7,gameChar_y-64,gameChar_x-9,gameChar_y-64); //top
                    triangle(gameChar_x-8,gameChar_y-63,gameChar_x-10,gameChar_y-63,gameChar_x-11.5,gameChar_y-62); //bot
                    pop();
                } //hat reflection
            }

        }
        else if(isRight && isFalling || enemyHit)
        {
            //Jumping to the right
            {


                {
                    push();
                    fill(250,221,181);
                    rect(gameChar_x-2.5,gameChar_y-55,5,4);
                    pop();
                } //neck

                {
                    push();
                    fill(0,255,128);
                    translate(gameChar_x-18,gameChar_y-11);
                    rotate(10);
                    ellipse(0,0,13,2);
                    pop();
                    push();
                    fill(0,255,128);
                    triangle(gameChar_x-13,gameChar_y-20,gameChar_x-24.8,gameChar_y-12,gameChar_x-10,gameChar_y-9);
                    stroke(0,204,102);
                    strokeWeight(0.6);
                    line(gameChar_x-13,gameChar_y-20,gameChar_x-24.6,gameChar_y-12.2);
                    stroke(0,204,102,150);
                    strokeWeight(0.4);
                    line(gameChar_x-13,gameChar_y-20,gameChar_x-23.5,gameChar_y-11.3);
                    line(gameChar_x-13,gameChar_y-20,gameChar_x-20.7,gameChar_y-10.4);
                    line(gameChar_x-13,gameChar_y-20,gameChar_x-17.8,gameChar_y-9.8);
                    line(gameChar_x-13,gameChar_y-20,gameChar_x-12,gameChar_y-9.5);
                    line(gameChar_x-13,gameChar_y-20,gameChar_x-15,gameChar_y-9.7);
                    stroke(0,204,102);
                    strokeWeight(0.5);
                    line(gameChar_x-13,gameChar_y-20,gameChar_x-22.2,gameChar_y-10.7);
                    line(gameChar_x-13,gameChar_y-20,gameChar_x-19.3,gameChar_y-9.8);
                    line(gameChar_x-13,gameChar_y-20,gameChar_x-16.5,gameChar_y-9.5);
                    line(gameChar_x-13,gameChar_y-20,gameChar_x-13.5,gameChar_y-9.4);
                    stroke(0,204,102);
                    strokeWeight(0.7);
                    line(gameChar_x-13,gameChar_y-20,gameChar_x-10,gameChar_y-9.4);
                    pop();
                    push();
                    fill(255);
                    triangle(gameChar_x-18,gameChar_y-16.1,gameChar_x-16,gameChar_y-16,gameChar_x-21,gameChar_y-14.7);
                    ellipse(gameChar_x-21,gameChar_y-14,1,0.5);
                    pop();
                    //reflection
                } //fan

                {
                    push();
                    fill(254,225,185);
                    ellipse(gameChar_x-15,gameChar_y-19,5,4);
                    fill(191,151,101,100);
                    ellipse(gameChar_x-16,gameChar_y-19.5,7,4);
                    pop();
                } //hand

                {
                    push();
                    fill(235);
                    beginShape(); //left top sleeve
                    vertex(gameChar_x-12,gameChar_y-50);
                    vertex(gameChar_x-8,gameChar_y-50);
                    vertex(gameChar_x-8,gameChar_y-44);
                    vertex(gameChar_x-11.5,gameChar_y-34);
                    vertex(gameChar_x-15,gameChar_y-30);
                    vertex(gameChar_x-17,gameChar_y-34);
                    endShape();    
                    pop();
                } //top sleeve

                {
                    push();
                    fill(220);
                    beginShape(); //left bot sleeve
                    vertex(gameChar_x-11.5,gameChar_y-34);
                    vertex(gameChar_x-17,gameChar_y-34);
                    vertex(gameChar_x-17,gameChar_y-33);
                    vertex(gameChar_x-20+random(-2,2),gameChar_y-17);
                    vertex(gameChar_x-12,gameChar_y-19);
                    endShape();
                    pop();
                } //bot sleeve

                {
                    push();
                    noStroke();
                    fill(245);
                    ellipse(gameChar_x-2,gameChar_y-50,20,5); //shoulder
                    fill(245);
                    triangle(gameChar_x,gameChar_y-20,gameChar_x-11,gameChar_y-50,gameChar_x+8,gameChar_y-50);

                    fill(150,150);
                    ellipse(gameChar_x-2,gameChar_y-51,16,3); //shoulder shadow

                    pop();
                } //shoulder

                {
                    push();
                    noStroke();
                    fill(245);
                    ellipse(gameChar_x-2,gameChar_y-50,20,5); //shoulder
                    fill(245);
                    triangle(gameChar_x,gameChar_y-20,gameChar_x-11,gameChar_y-50,gameChar_x+8,gameChar_y-50);
                    rect(gameChar_x-8,gameChar_y-50,16,50);
                    fill(150,150);
                    ellipse(gameChar_x-2,gameChar_y-51,19,3); //shoulder shadow
                    fill(245);
                    triangle(gameChar_x-7.5,gameChar_y-50,gameChar_x-7.5,gameChar_y,gameChar_x-12+random(-2,2),gameChar_y); //dress left


                    fill(220);
                    beginShape();
                    vertex(gameChar_x+8,gameChar_y-33);
                    vertex(gameChar_x+9,gameChar_y-29);
                    vertex(gameChar_x+12,gameChar_y-23);
                    vertex(gameChar_x+8,gameChar_y);
                    //bottom break
                    vertex(gameChar_x+1,gameChar_y);
                    vertex(gameChar_x+8,gameChar_y-23);
                    vertex(gameChar_x+7,gameChar_y-26);
                    vertex(gameChar_x+5,gameChar_y-29);
                    endShape(); // knee shadow
                    pop();
                } //body

                {
                    push();
                    fill(250,221,181);
                    triangle(gameChar_x-2.5,gameChar_y-53,gameChar_x+2.5,gameChar_y-53,gameChar_x+1.5,gameChar_y-48);
                    //v neck

                    fill(253,199,134,100);
                    ellipse(gameChar_x,gameChar_y-55,5,5); //neck shadow
                    pop();
                } //v neck + neck shadow

                {
                    fill(254,225,185);
                    ellipse(gameChar_x,gameChar_y-61,11,15); //head

                    fill(191,151,101);
                    ellipse(gameChar_x,gameChar_y-61,13,9); //head shadow
                } //head

                {
                    push();
                    stroke(100,0,0);
                    strokeWeight(1);
                    line(gameChar_x+2,gameChar_y-55,gameChar_x+3,gameChar_y-55.2);
                    pop();
                } //mouth

                {
                    push();
                    fill(197,175,118);
                    stroke(150,122,74);
                    ellipse(gameChar_x,gameChar_y-62,26,6); //hat bottom

                    noStroke();
                    triangle(gameChar_x,gameChar_y-62-8,gameChar_x+12,gameChar_y-62-1,gameChar_x-12,gameChar_y-62-1); //hat top
                    pop();
                } //hat

                {
                    push();
                    strokeWeight(0.5);
                    stroke(150,122,74);
                    line(gameChar_x,gameChar_y-62-8,gameChar_x-12,gameChar_y-62+1);
                    line(gameChar_x,gameChar_y-62-8,gameChar_x-10,gameChar_y-62+1.5);
                    line(gameChar_x,gameChar_y-62-8,gameChar_x-8,gameChar_y-62+2.5);
                    line(gameChar_x,gameChar_y-62-8,gameChar_x-6,gameChar_y-62+2.5);
                    line(gameChar_x,gameChar_y-62-8,gameChar_x-4,gameChar_y-62+2.5);
                    line(gameChar_x,gameChar_y-62-8,gameChar_x-2,gameChar_y-62+2.5);
                    line(gameChar_x,gameChar_y-62-8,gameChar_x,gameChar_y-62+2.5);
                    line(gameChar_x,gameChar_y-62-8,gameChar_x+12,gameChar_y-62+1);
                    line(gameChar_x,gameChar_y-62-8,gameChar_x+10,gameChar_y-62+1.5);
                    line(gameChar_x,gameChar_y-62-8,gameChar_x+8,gameChar_y-62+2.5);
                    line(gameChar_x,gameChar_y-62-8,gameChar_x+6,gameChar_y-62+2.5);
                    line(gameChar_x,gameChar_y-62-8,gameChar_x+4,gameChar_y-62+2.5);
                    line(gameChar_x,gameChar_y-62-8,gameChar_x+2,gameChar_y-62+2.5);
                    line(gameChar_x,gameChar_y-62-8,gameChar_x,gameChar_y-62+2.5);
                    pop();
                } //bamboo hat lines

                {
                    push();
                    fill(255); 
                    triangle(gameChar_x-2,gameChar_y-68,gameChar_x-7,gameChar_y-64,gameChar_x-9,gameChar_y-64); //top
                    triangle(gameChar_x-8,gameChar_y-63,gameChar_x-10,gameChar_y-63,gameChar_x-11.5,gameChar_y-62); //bot
                    pop();
                } //hat reflection
            }

        }
        else if(isLeft)
        {
            //Walking, turned left
            {


                {
                    push();
                    fill(250,221,181);
                    rect(gameChar_x-2.5,gameChar_y-55,5,4);
                    pop();
                } //neck

                {
                    push();
                    fill(235);
                    beginShape(); //left top sleeve
                    vertex(gameChar_x+12,gameChar_y-50);
                    vertex(gameChar_x+8,gameChar_y-50);
                    vertex(gameChar_x+8,gameChar_y-44);
                    vertex(gameChar_x+11,gameChar_y-35);
                    vertex(gameChar_x+15,gameChar_y-30);
                    vertex(gameChar_x+17,gameChar_y-35);
                    endShape();    
                    pop();
                } //top sleeve

                {
                    push();
                    fill(220);
                    beginShape(); //left bot sleeve
                    vertex(gameChar_x+11,gameChar_y-35);
                    vertex(gameChar_x+17,gameChar_y-35);
                    vertex(gameChar_x+15,gameChar_y-30);
                    vertex(gameChar_x+6,gameChar_y-20);
                    vertex(gameChar_x,gameChar_y-24);
                    endShape();
                    pop();
                } //bot sleeve

                {
                    push();
                    noStroke();
                    fill(245);
                    ellipse(gameChar_x+2,gameChar_y-50,20,5); //shoulder
                    fill(245);
                    triangle(gameChar_x,gameChar_y-20,gameChar_x+11,gameChar_y-50,gameChar_x-8,gameChar_y-50);
                    rect(gameChar_x-8,gameChar_y-50,16,50);
                    fill(150,150);
                    ellipse(gameChar_x+2,gameChar_y-51,19,3); //shoulder shadow
                    fill(245);
                    triangle(gameChar_x+7.5,gameChar_y-50,gameChar_x+7.5,gameChar_y,gameChar_x+14+random(-1,1),gameChar_y); //dress right
                    pop();
                } //body

                {
                    push();
                    fill(250,221,181);
                    triangle(gameChar_x+2.5,gameChar_y-53,gameChar_x-2.5,gameChar_y-53,gameChar_x-1.5,gameChar_y-48);
                    //v neck

                    fill(253,199,134,100);
                    ellipse(gameChar_x,gameChar_y-55,5,5); //neck shadow
                    pop();
                } //v neck + neck shadow

                {
                    fill(254,225,185);
                    ellipse(gameChar_x,gameChar_y-61,11,15); //head

                    fill(191,151,101);
                    ellipse(gameChar_x,gameChar_y-61,12.5,11); //head shadow
                } //head

                {
                    push();
                    stroke(100,0,0);
                    strokeWeight(0.5);
                    line(gameChar_x-2,gameChar_y-55,gameChar_x-3,gameChar_y-55.2);
                    pop();
                } //mouth

                {
                    push();
                    fill(197,175,118);
                    stroke(150,122,74);
                    ellipse(gameChar_x,gameChar_y-62,26,6); //hat bottom

                    noStroke();
                    triangle(gameChar_x,gameChar_y-62-8,gameChar_x+12,gameChar_y-62-1,gameChar_x-12,gameChar_y-62-1); //hat top
                    pop();
                } //hat

                {
                    push();
                    strokeWeight(0.5);
                    stroke(150,122,74);
                    line(gameChar_x,gameChar_y-62-8,gameChar_x-12,gameChar_y-62+1);
                    line(gameChar_x,gameChar_y-62-8,gameChar_x-10,gameChar_y-62+1.5);
                    line(gameChar_x,gameChar_y-62-8,gameChar_x-8,gameChar_y-62+2.5);
                    line(gameChar_x,gameChar_y-62-8,gameChar_x-6,gameChar_y-62+2.5);
                    line(gameChar_x,gameChar_y-62-8,gameChar_x-4,gameChar_y-62+2.5);
                    line(gameChar_x,gameChar_y-62-8,gameChar_x-2,gameChar_y-62+2.5);
                    line(gameChar_x,gameChar_y-62-8,gameChar_x,gameChar_y-62+2.5);
                    line(gameChar_x,gameChar_y-62-8,gameChar_x+12,gameChar_y-62+1);
                    line(gameChar_x,gameChar_y-62-8,gameChar_x+10,gameChar_y-62+1.5);
                    line(gameChar_x,gameChar_y-62-8,gameChar_x+8,gameChar_y-62+2.5);
                    line(gameChar_x,gameChar_y-62-8,gameChar_x+6,gameChar_y-62+2.5);
                    line(gameChar_x,gameChar_y-62-8,gameChar_x+4,gameChar_y-62+2.5);
                    line(gameChar_x,gameChar_y-62-8,gameChar_x+2,gameChar_y-62+2.5);
                    line(gameChar_x,gameChar_y-62-8,gameChar_x,gameChar_y-62+2.5);
                    pop();
                } //bamboo hat lines

                {
                    push();
                    fill(255); 
                    triangle(gameChar_x-2,gameChar_y-68,gameChar_x-7,gameChar_y-64,gameChar_x-9,gameChar_y-64); //top
                    triangle(gameChar_x-8,gameChar_y-63,gameChar_x-10,gameChar_y-63,gameChar_x-11.5,gameChar_y-62); //bot
                    pop();
                } //hat reflection
            }

        }
        else if(isRight)
        {
            //Walking, turned right
            {


                {
                    push();
                    fill(250,221,181);
                    rect(gameChar_x-2.5,gameChar_y-55,5,4);
                    pop();
                } //neck

                {
                    push();
                    fill(235);
                    beginShape(); //left top sleeve
                    vertex(gameChar_x-12,gameChar_y-50);
                    vertex(gameChar_x-8,gameChar_y-50);
                    vertex(gameChar_x-8,gameChar_y-44);
                    vertex(gameChar_x-11,gameChar_y-35);
                    vertex(gameChar_x-15,gameChar_y-30);
                    vertex(gameChar_x-17,gameChar_y-35);
                    endShape();    
                    pop();
                } //top sleeve

                {
                    push();
                    fill(220);
                    beginShape(); //left bot sleeve
                    vertex(gameChar_x-11,gameChar_y-35);
                    vertex(gameChar_x-17,gameChar_y-35);
                    vertex(gameChar_x-15,gameChar_y-30);
                    vertex(gameChar_x-6,gameChar_y-20);
                    vertex(gameChar_x,gameChar_y-24);
                    endShape();
                    pop();
                } //bot sleeve

                {
                    push();
                    noStroke();
                    fill(245);
                    ellipse(gameChar_x-2,gameChar_y-50,20,5); //shoulder
                    fill(245);
                    triangle(gameChar_x,gameChar_y-20,gameChar_x-11,gameChar_y-50,gameChar_x+8,gameChar_y-50);
                    rect(gameChar_x-8,gameChar_y-50,16,50);
                    fill(150,150);
                    ellipse(gameChar_x-2,gameChar_y-51,19,3); //shoulder shadow
                    fill(245);
                    triangle(gameChar_x-7.5,gameChar_y-50,gameChar_x-7.5,gameChar_y,gameChar_x-14+random(-1,1),gameChar_y); //dress left
                    pop();
                } //body

                {
                    push();
                    fill(250,221,181);
                    triangle(gameChar_x-2.5,gameChar_y-53,gameChar_x+2.5,gameChar_y-53,gameChar_x+1.5,gameChar_y-48);
                    //v neck

                    fill(253,199,134,100);
                    ellipse(gameChar_x,gameChar_y-55,5,5); //neck shadow
                    pop();
                } //v neck + neck shadow

                {
                    fill(254,225,185);
                    ellipse(gameChar_x,gameChar_y-61,11,15); //head

                    fill(191,151,101);
                    ellipse(gameChar_x,gameChar_y-61,12.5,11); //head shadow
                } //head

                {
                    push();
                    stroke(100,0,0);
                    strokeWeight(0.5);
                    line(gameChar_x+2,gameChar_y-55,gameChar_x+3,gameChar_y-55.2);
                    pop();
                } //mouth

                {
                    push();
                    fill(197,175,118);
                    stroke(150,122,74);
                    ellipse(gameChar_x,gameChar_y-62,26,6); //hat bottom

                    noStroke();
                    triangle(gameChar_x,gameChar_y-62-8,gameChar_x+12,gameChar_y-62-1,gameChar_x-12,gameChar_y-62-1); //hat top
                    pop();
                } //hat

                {
                    push();
                    strokeWeight(0.5);
                    stroke(150,122,74);
                    line(gameChar_x,gameChar_y-62-8,gameChar_x-12,gameChar_y-62+1);
                    line(gameChar_x,gameChar_y-62-8,gameChar_x-10,gameChar_y-62+1.5);
                    line(gameChar_x,gameChar_y-62-8,gameChar_x-8,gameChar_y-62+2.5);
                    line(gameChar_x,gameChar_y-62-8,gameChar_x-6,gameChar_y-62+2.5);
                    line(gameChar_x,gameChar_y-62-8,gameChar_x-4,gameChar_y-62+2.5);
                    line(gameChar_x,gameChar_y-62-8,gameChar_x-2,gameChar_y-62+2.5);
                    line(gameChar_x,gameChar_y-62-8,gameChar_x,gameChar_y-62+2.5);
                    line(gameChar_x,gameChar_y-62-8,gameChar_x+12,gameChar_y-62+1);
                    line(gameChar_x,gameChar_y-62-8,gameChar_x+10,gameChar_y-62+1.5);
                    line(gameChar_x,gameChar_y-62-8,gameChar_x+8,gameChar_y-62+2.5);
                    line(gameChar_x,gameChar_y-62-8,gameChar_x+6,gameChar_y-62+2.5);
                    line(gameChar_x,gameChar_y-62-8,gameChar_x+4,gameChar_y-62+2.5);
                    line(gameChar_x,gameChar_y-62-8,gameChar_x+2,gameChar_y-62+2.5);
                    line(gameChar_x,gameChar_y-62-8,gameChar_x,gameChar_y-62+2.5);
                    pop();
                } //bamboo hat lines

                {
                    push();
                    fill(255); 
                    triangle(gameChar_x-2,gameChar_y-68,gameChar_x-7,gameChar_y-64,gameChar_x-9,gameChar_y-64); //top
                    triangle(gameChar_x-8,gameChar_y-63,gameChar_x-10,gameChar_y-63,gameChar_x-11.5,gameChar_y-62); //bot
                    pop();
                } //hat reflection

            }

        }
        else if(isFalling || isPlummeting)
        {
            //Jumping facing forwards
            {



                {
                    push();
                    fill(250,221,181);
                    rect(gameChar_x-2.5,gameChar_y-55,5,4);
                    pop();
                } //neck

                {
                    push();
                    fill(235);
                    beginShape(); //left top sleeve
                    vertex(gameChar_x-12,gameChar_y-50);
                    vertex(gameChar_x-8,gameChar_y-51);
                    vertex(gameChar_x-7,gameChar_y-46);
                    vertex(gameChar_x-13,gameChar_y-36);
                    vertex(gameChar_x-15,gameChar_y-31);
                    vertex(gameChar_x-18,gameChar_y-36);
                    endShape();    

                    beginShape(); //right top sleeve
                    vertex(gameChar_x+12,gameChar_y-50);
                    vertex(gameChar_x+8,gameChar_y-51);
                    vertex(gameChar_x+7,gameChar_y-46);
                    vertex(gameChar_x+13,gameChar_y-36);
                    vertex(gameChar_x+15,gameChar_y-31);
                    vertex(gameChar_x+18,gameChar_y-36);
                    endShape();
                    pop();
                } //top sleeve

                {
                    push();
                    fill(220);
                    beginShape(); //left bot sleeve
                    vertex(gameChar_x-13,gameChar_y-36);
                    vertex(gameChar_x-18,gameChar_y-36);
                    vertex(gameChar_x-15,gameChar_y-31);
                    vertex(gameChar_x-8,gameChar_y-26);
                    vertex(gameChar_x+4,gameChar_y-26);
                    endShape();

                    beginShape(); //right bot sleeve
                    vertex(gameChar_x+13,gameChar_y-36);
                    vertex(gameChar_x+18,gameChar_y-36);
                    vertex(gameChar_x+15,gameChar_y-31);
                    vertex(gameChar_x+8,gameChar_y-26);
                    vertex(gameChar_x-4,gameChar_y-26);
                    endShape();
                    pop();
                } //bot sleeve

                {
                    push();
                    noStroke();
                    fill(245);
                    ellipse(gameChar_x,gameChar_y-50,24,5); //shoulder
                    fill(245);
                    triangle(gameChar_x,gameChar_y-20,gameChar_x-11,gameChar_y-50,gameChar_x+11,gameChar_y-50);

                    fill(150,150);
                    ellipse(gameChar_x,gameChar_y-51,19,3); //shoulder shadow

                    fill(245);
                    ellipse(gameChar_x-7,gameChar_y-1,14,3);

                    beginShape();
                    vertex(gameChar_x-13,gameChar_y-5);
                    vertex(gameChar_x+13,gameChar_y-5);
                    vertex(gameChar_x,gameChar_y-1);
                    vertex(gameChar_x-14,gameChar_y-1);
                    endShape();    

                    fill(200);
                    ellipse(gameChar_x+5,gameChar_y-5,16,3);

                    {
                        push();
                        fill(255);
                        ellipse(gameChar_x+3,gameChar_y-4.5,4,8);
                        fill(50);
                        ellipse(gameChar_x+3,gameChar_y-5,4,8);
                        fill(255);
                        ellipse(gameChar_x+3,gameChar_y-1,2,0.5);
                        pop();
                    }
                    //shoe

                    push();
                    fill(245);
                    rect(gameChar_x-8,gameChar_y-50,16,45);
                    triangle(gameChar_x-7.5,gameChar_y-50,gameChar_x-7.5,gameChar_y-5,gameChar_x-13,gameChar_y-5); //dress left    
                    triangle(gameChar_x+7.5,gameChar_y-50,gameChar_x+7.5,gameChar_y-5,gameChar_x+13,gameChar_y-5); //dress right

                    fill(225);
                    ellipse(gameChar_x+7,gameChar_y-24,5,7);
                    beginShape();
                    vertex(gameChar_x+7-2.5,gameChar_y-24);
                    vertex(gameChar_x+2,gameChar_y-19);
                    vertex(gameChar_x-2,gameChar_y-9);
                    vertex(gameChar_x-3,gameChar_y-6);
                    //bottom break
                    vertex(gameChar_x+7,gameChar_y-6);
                    vertex(gameChar_x+9,gameChar_y-8);
                    vertex(gameChar_x+10,gameChar_y-17);
                    vertex(gameChar_x+7+2.5,gameChar_y-24);
                    endShape(); // knee shadow


                    pop();
                } //body

                {
                    push();
                    fill(250,221,181);
                    triangle(gameChar_x-2.5,gameChar_y-53,gameChar_x+2.5,gameChar_y-53,gameChar_x,gameChar_y-48);
                    //v neck

                    fill(253,199,134,100);
                    ellipse(gameChar_x,gameChar_y-55,5,5); //neck shadow
                    pop();
                } //v neck + neck shadow

                {
                    fill(254,225,185);
                    ellipse(gameChar_x,gameChar_y-61,11,15); //head

                    fill(191,151,101);
                    ellipse(gameChar_x,gameChar_y-61,13,9); //head shadow
                } //head

                {
                    push();
                    stroke(100,0,0);
                    strokeWeight(1);
                    line(gameChar_x-0.5,gameChar_y-54.5,gameChar_x+0.5,gameChar_y-54.5);
                    pop();
                } //mouth

                {
                    push();
                    fill(197,175,118);
                    stroke(150,122,74);
                    ellipse(gameChar_x,gameChar_y-62,26,6); //hat bottom

                    noStroke();
                    triangle(gameChar_x,gameChar_y-62-8,gameChar_x+12,gameChar_y-62-1,gameChar_x-12,gameChar_y-62-1); //hat top
                    pop();
                } //hat

                {
                    push();
                    strokeWeight(0.5);
                    stroke(150,122,74);
                    line(gameChar_x,gameChar_y-62-8,gameChar_x-12,gameChar_y-62+1);
                    line(gameChar_x,gameChar_y-62-8,gameChar_x-10,gameChar_y-62+1.5);
                    line(gameChar_x,gameChar_y-62-8,gameChar_x-8,gameChar_y-62+2.5);
                    line(gameChar_x,gameChar_y-62-8,gameChar_x-6,gameChar_y-62+2.5);
                    line(gameChar_x,gameChar_y-62-8,gameChar_x-4,gameChar_y-62+2.5);
                    line(gameChar_x,gameChar_y-62-8,gameChar_x-2,gameChar_y-62+2.5);
                    line(gameChar_x,gameChar_y-62-8,gameChar_x,gameChar_y-62+2.5);
                    line(gameChar_x,gameChar_y-62-8,gameChar_x+12,gameChar_y-62+1);
                    line(gameChar_x,gameChar_y-62-8,gameChar_x+10,gameChar_y-62+1.5);
                    line(gameChar_x,gameChar_y-62-8,gameChar_x+8,gameChar_y-62+2.5);
                    line(gameChar_x,gameChar_y-62-8,gameChar_x+6,gameChar_y-62+2.5);
                    line(gameChar_x,gameChar_y-62-8,gameChar_x+4,gameChar_y-62+2.5);
                    line(gameChar_x,gameChar_y-62-8,gameChar_x+2,gameChar_y-62+2.5);
                    line(gameChar_x,gameChar_y-62-8,gameChar_x,gameChar_y-62+2.5);
                    pop();
                } //bamboo hat lines

                {
                    push();
                    fill(255); 
                    triangle(gameChar_x-2,gameChar_y-68,gameChar_x-7,gameChar_y-64,gameChar_x-9,gameChar_y-64); //top
                    triangle(gameChar_x-8,gameChar_y-63,gameChar_x-10,gameChar_y-63,gameChar_x-11.5,gameChar_y-62); //bot
                    pop();
                } //hat reflection

                {
                    push();
                    //stroke(0);
                    strokeWeight(1);
                    line(gameChar_x-8,gameChar_y-40,gameChar_x+8,gameChar_y-40); //top straight
                    line(gameChar_x-17,gameChar_y-35,gameChar_x+17,gameChar_y-35); //mid straight
                    line(gameChar_x-15,gameChar_y-30,gameChar_x+15,gameChar_y-30); //bot straight
                    line(gameChar_x-6,gameChar_y-24,gameChar_x+6,gameChar_y-24); //bot2 straight
                    line(gameChar_x-8,gameChar_y-40,gameChar_x-12,gameChar_y-35); //left slant
                    line(gameChar_x+8,gameChar_y-40,gameChar_x+12,gameChar_y-35); //right slant
                    pop();
                } //reference lines
            }

        }
        else
        {
            //Standing, facing frontwards
            {


                {
                    push();
                    fill(250,221,181);
                    rect(gameChar_x-2.5,gameChar_y-55,5,4);
                    pop();
                } //neck

                {
                    push();
                    fill(235);
                    beginShape(); //left top sleeve
                    vertex(gameChar_x-12,gameChar_y-50);
                    vertex(gameChar_x-8,gameChar_y-50);
                    vertex(gameChar_x-8,gameChar_y-44);
                    vertex(gameChar_x-12,gameChar_y-35);
                    vertex(gameChar_x-15,gameChar_y-30);
                    vertex(gameChar_x-17,gameChar_y-35);
                    endShape();    

                    beginShape(); //right top sleeve
                    vertex(gameChar_x+12,gameChar_y-50);
                    vertex(gameChar_x+8,gameChar_y-50);
                    vertex(gameChar_x+8,gameChar_y-44);
                    vertex(gameChar_x+12,gameChar_y-35);
                    vertex(gameChar_x+15,gameChar_y-30);
                    vertex(gameChar_x+17,gameChar_y-35);
                    endShape();
                    pop();
                } //top sleeve

                {
                    push();
                    fill(220);
                    beginShape(); //left bot sleeve
                    vertex(gameChar_x-12,gameChar_y-35);
                    vertex(gameChar_x-17,gameChar_y-35);
                    vertex(gameChar_x-15,gameChar_y-30);
                    vertex(gameChar_x-6,gameChar_y-20);
                    vertex(gameChar_x,gameChar_y-24);
                    endShape();

                    beginShape(); //right bot sleeve
                    vertex(gameChar_x+12,gameChar_y-35);
                    vertex(gameChar_x+17,gameChar_y-35);
                    vertex(gameChar_x+15,gameChar_y-30);
                    vertex(gameChar_x+6,gameChar_y-20);
                    vertex(gameChar_x,gameChar_y-24);
                    endShape();
                    pop();
                } //bot sleeve

                {
                    push();
                    noStroke();
                    fill(245);
                    ellipse(gameChar_x,gameChar_y-50,24,5); //shoulder
                    fill(245);
                    triangle(gameChar_x,gameChar_y-20,gameChar_x-11,gameChar_y-50,gameChar_x+11,gameChar_y-50);
                    rect(gameChar_x-8,gameChar_y-50,16,50);
                    fill(150,150);
                    ellipse(gameChar_x,gameChar_y-51,22,3); //shoulder shadow
                    fill(245);
                    triangle(gameChar_x-7.5,gameChar_y-50,gameChar_x-7.5,gameChar_y,gameChar_x-11,gameChar_y); //dress left
                    triangle(gameChar_x+7.5,gameChar_y-50,gameChar_x+7.5,gameChar_y,gameChar_x+11,gameChar_y); //dress right
                    pop();
                } //body

                {
                    push();
                    fill(250,221,181);
                    triangle(gameChar_x-2.5,gameChar_y-53,gameChar_x+2.5,gameChar_y-53,gameChar_x,gameChar_y-48);
                    //v neck

                    fill(253,199,134,100);
                    ellipse(gameChar_x,gameChar_y-55,5,5); //neck shadow
                    pop();
                } //v neck + neck shadow

                {
                    fill(254,225,185);
                    ellipse(gameChar_x,gameChar_y-61,11,15); //head

                    fill(191,151,101);
                    ellipse(gameChar_x,gameChar_y-61,12.5,11); //head shadow
                } //head

                {
                    push();
                    stroke(100,0,0);
                    strokeWeight(0.5);
                    line(gameChar_x-0.5,gameChar_y-54.5,gameChar_x+0.5,gameChar_y-54.5);
                    pop();
                } //mouth

                {
                    push();
                    fill(197,175,118);
                    stroke(150,122,74);
                    ellipse(gameChar_x,gameChar_y-62,26,6); //hat bottom

                    noStroke();
                    triangle(gameChar_x,gameChar_y-62-8,gameChar_x+12,gameChar_y-62-1,gameChar_x-12,gameChar_y-62-1); //hat top
                    pop();
                } //hat

                {
                    push();
                    strokeWeight(0.5);
                    stroke(150,122,74);
                    line(gameChar_x,gameChar_y-62-8,gameChar_x-12,gameChar_y-62+1);
                    line(gameChar_x,gameChar_y-62-8,gameChar_x-10,gameChar_y-62+1.5);
                    line(gameChar_x,gameChar_y-62-8,gameChar_x-8,gameChar_y-62+2.5);
                    line(gameChar_x,gameChar_y-62-8,gameChar_x-6,gameChar_y-62+2.5);
                    line(gameChar_x,gameChar_y-62-8,gameChar_x-4,gameChar_y-62+2.5);
                    line(gameChar_x,gameChar_y-62-8,gameChar_x-2,gameChar_y-62+2.5);
                    line(gameChar_x,gameChar_y-62-8,gameChar_x,gameChar_y-62+2.5);
                    line(gameChar_x,gameChar_y-62-8,gameChar_x+12,gameChar_y-62+1);
                    line(gameChar_x,gameChar_y-62-8,gameChar_x+10,gameChar_y-62+1.5);
                    line(gameChar_x,gameChar_y-62-8,gameChar_x+8,gameChar_y-62+2.5);
                    line(gameChar_x,gameChar_y-62-8,gameChar_x+6,gameChar_y-62+2.5);
                    line(gameChar_x,gameChar_y-62-8,gameChar_x+4,gameChar_y-62+2.5);
                    line(gameChar_x,gameChar_y-62-8,gameChar_x+2,gameChar_y-62+2.5);
                    line(gameChar_x,gameChar_y-62-8,gameChar_x,gameChar_y-62+2.5);
                    pop();
                } //bamboo hat lines

                {
                    push();
                    fill(255); 
                    triangle(gameChar_x-2,gameChar_y-68,gameChar_x-7,gameChar_y-64,gameChar_x-9,gameChar_y-64); //top
                    triangle(gameChar_x-8,gameChar_y-63,gameChar_x-10,gameChar_y-63,gameChar_x-11.5,gameChar_y-62); //bot
                    pop();
                } //hat reflection

            }

        }
        scale(0.625);
    }

    //enemies [scroll]
    {
        for (i=0; i<enemies.length; i++)
        {
            enemies[i].draw();
            enemyContact = enemies[i].checkContact(gameChar_x*1.6+gameScroll,gameChar_y*1.6);
            if (enemyContact)
            {
                enemyHit=true; hitDist=150; boinkSound.play();
            }
        }
        if(enemyHit)
        {
            if (hitDist==150) {waterBar-=50; waterBar=max(0,waterBar);}

            if (gameChar_x<width*0.4/1.6)
            {gameScroll-=0.1*hitDist; gameScroll=max(0,gameScroll);}
            else gameChar_x-=0.1*hitDist;

            hitDist-=10;
            if (hitDist==0)
            {
                isFalling=true;
                enemyHit=false;
            }
            for(i=0;i<canyon_x.length;i++)
            {
                if (gameChar_y>269 && gameChar_x>(canyon_x[i][0]+17-gameScroll)/1.6 && gameChar_x<(canyon_x[i][0]+17+canyon_x[i][1]-30-gameScroll)/1.6) 
                {
                    isPlummeting=true;
                    enemyHit=false;
                }
            }
        }
    }

    //heart symbol
    {
        push();
        stroke(0);
        ellipse(8063-gameScroll,390+collectableBounce,9);
        ellipse(8071-gameScroll,390+collectableBounce,9);
        triangle(8063-4-gameScroll,390+4.5-3+collectableBounce,8071+4-gameScroll,390+4.5-3+collectableBounce,8067-gameScroll,400+collectableBounce);
        noStroke();
        fill(255,50,50);
        ellipse(8063-gameScroll,390+collectableBounce,9);
        ellipse(8071-gameScroll,390+collectableBounce,9);
        triangle(8063-4-gameScroll,390+4.5-3+collectableBounce,8071+4-gameScroll,390+4.5-3+collectableBounce,8067-gameScroll,400+collectableBounce);
        pop();
    }

    //collected blue effect [static]
    {
        if (blueEffect)
        {
            push();
            strokeWeight(10);
            stroke(99, 200, 255,255-4*blueControl);
            noFill();
            ellipse(gameChar_x*1.6,gameChar_y*1.6-60,blueControl);
            pop();
            blueControl+=3;
            if (blueControl>60) {blueEffect=false; blueControl=0;}
        }
    }

    //home [scroll]
    {
        push();    
        fill(33,31,15);
        rect(13500-gameScroll,290,5*51,433-290);
        noFill();
        stroke(0);
        strokeWeight(2);
        triangle(13500-gameScroll,290,13500+(51*5)-gameScroll,290,13627.5-gameScroll,220);
        strokeWeight(1);
        stroke(33,31,15);
        for (i=16; i>0; i--)
        {
            if (i%2==0) fill(186-i,174-i,103-i); else fill(162-i,149-i,73-i);
            rect(13500-gameScroll,290,5+(i*i/2),433-290);
            rect(13755-gameScroll,290,-5-(i*i/2),433-290);
        }
        noFill();
        stroke(0);
        strokeWeight(2);
        rect(13500-gameScroll,290,5*51,433-290);
        strokeWeight(1);
        fill(162,149,73); stroke(33,31,15);
        for (i=0; i<13; i++)
            triangle(13500+(i*10)-gameScroll,290-i,13500-(i*10)+(51*5)-gameScroll,290-i,13627.5-gameScroll,220);
        fill(33,31,15); noStroke();
        rect(13500-gameScroll,323,10,433-325);
        pop();
    }

    //trees [scroll]
    { 
        for (i=0; i<60; i+=2) //light reflection
        {
            stroke(255);
            fill(255);
            tree(trees[i]-2-gameScroll*2,310-1,0.5);
        }	
        for (i=0; i<60; i+=2)
        {
            stroke(0);
            fill(102,51,0);
            tree(trees[i]-gameScroll*2,310,0.5);
        }      
    }

    //character actions [scroll]
    {
        stepSound.setVolume(random(0.1,0.3));
        if (!gameEnd)
        {
            if (jump)
            {
                isOnPlatform=false; isFalling=false;
                acceleration=accelerationControl*2*gravity;
                gameChar_y-=acceleration;
                accelerationControl--;
                if (accelerationControl==0) {jump=false; isFalling=true; floatSound.setVolume(1); floatSound.play();}
            }
            if (isLeft)
            {
                if (!play) 
                {
                    gameChar_x-=2;
                    if (gameChar_x<90/1.6)
                        gameChar_x=max(90/1.6,gameChar_x);
                }
                else if (gameChar_x<width*0.4/1.6)
                {gameScroll-=4; gameScroll=max(0,gameScroll); if (gameScroll==0) gameChar_x-=2; gameChar_x=max(0,gameChar_x);}
                else gameChar_x-=2;

                if (!isFalling && !jump && !isOnPlatform && gameChar_y>269)
                {
                    for(i=0;i<canyon_x.length;i++)
                    {
                        if (gameChar_x>(canyon_x[i][0]+17-gameScroll)/1.6 && gameChar_x<(canyon_x[i][0]+10+canyon_x[i][1]-30-gameScroll)/1.6) isPlummeting=true;
                    }
                }
                if (isOnPlatform || gameChar_y>269 && (gameChar_x+gameScroll)%5<1) stepSound.play();
            }
            if (isRight)
            {
                if (!play) 
                {
                    gameChar_x+=2;
                    if (gameChar_x>223/1.6)
                        gameChar_x=min(223/1.6,gameChar_x);
                }
                else if (gameChar_x>width*0.6/1.6)
                {gameScroll+=4;}
                else gameChar_x+=2;

                if (!isFalling && !jump && !isOnPlatform && gameChar_y>269)
                {
                    for(i=0;i<canyon_x.length;i++)
                    {
                        if (gameChar_x>(canyon_x[i][0]+23-gameScroll)/1.6 && gameChar_x<(canyon_x[i][0]+17+canyon_x[i][1]-30-gameScroll)/1.6) isPlummeting=true;
                    }
                }
                if (isOnPlatform || gameChar_y>269 && (gameChar_x+gameScroll)%5<1) stepSound.play();
            }
            if (isFalling)
            {
                if (gameChar_y>269)
                {
                    accelerationControl=0; gameChar_y=270;
                    isFalling=false;
                    for(i=0;i<canyon_x.length;i++)
                    {
                        if (gameChar_x>(canyon_x[i][0]+17-gameScroll)/1.6 && gameChar_x<(canyon_x[i][0]+17+canyon_x[i][1]-30-gameScroll)/1.6) isPlummeting=true;
                    }
                    if (!isPlummeting) landSound.play(); floatSound.setVolume(0.2);
                }
                else if (isOnPlatform && platformHeight-(gameChar_y*1.6)<10)
                {
                    accelerationControl=0; gameChar_y=platformHeight/1.6;
                    isFalling=false;
                    landSound.play();
                    floatSound.setVolume(0.2);
                }
                else 
                {
                    acceleration=accelerationControl*0.06*gravity;
                    gameChar_y+=acceleration;
                    gameChar_y=min(gameChar_y,270);
                    accelerationControl++;
                }

            }
            if (isPlummeting)
            {
                if (cdFall==1 && healthBar>0) {fallSound.play(); cdFall=0;}
                isLeft=false;
                isRight=false;
                isFalling=false;

                if (gameChar_y>600)
                {
                    accelerationControl=0;
                    isPlummeting=false; cdFall=1;
                    gameChar_y=270;
                    if(healthBar>0) reviveSound.play();
                    if (checkpoint==1) //teleport to checkpoint 1
                    {
                        gameScroll=0;
                        gameChar_x=441/1.6;
                    }
                    else if (checkpoint==2) ///teleport to checkpoint 2
                    {
                        gameScroll=flags[1]-500;
                        gameChar_x=500/1.6;
                    }
                    else if (checkpoint==3) ///teleport to checkpoint 3
                    {
                        gameScroll=flags[2]-500;
                        gameChar_x=500/1.6;
                    }
                    else if (checkpoint==4) ///teleport to checkpoint 4
                    {
                        gameScroll=flags[3]-500;
                        gameChar_x=500/1.6;
                    }
                    else if (checkpoint==5) ///teleport to checkpoint 5
                    {
                        gameScroll=flags[4]-500;
                        gameChar_x=500/1.6;
                    }
                    else if (checkpoint==6) ///teleport to checkpoint 6
                    {
                        gameScroll=flags[5]-500;
                        gameChar_x=500/1.6;
                    }
                    else if (checkpoint==7) ///teleport to checkpoint 7
                    {
                        gameScroll=flags[6]-500;
                        gameChar_x=500/1.6;
                    }
                    else
                    {
                        gameScroll=0;
                        gameChar_x=100;
                    }
                }
                else 
                {
                    acceleration=accelerationControl*0.3*gravity;
                    gameChar_y+=acceleration;
                    gameChar_y=min(gameChar_y,601);
                    accelerationControl++;    
                }
            } 
        }


        if (gameChar_x+gameScroll>=13150)
        {
            isRight=false;
            gameEnd=true;
            healthBar=50;
            waterBar=100;
            endCounter--;

            if (endCounter<=10 && gameChar_x+gameScroll<=13350)
            {
                isRight=true;
                gameChar_x++;
            }
        }
    }

    //flagpole checkpoint [scroll]
    {
        if (redEffect)
        {
            push();
            strokeWeight(10);
            stroke(255, 0, 0,255-4*redControl);
            noFill();
            ellipse(gameChar_x*1.6,gameChar_y*1.6-60,60-redControl);
            pop();
            redControl+=2;
            if (redControl>60) {redEffect=false; redControl=0;}
        }

        for (i=0; i<flags.length; i++)
        {
            fill(255,0,0);
            triangle(flags[i]+3-gameScroll,387+18,flags[i]+29-gameScroll+random(-0.5,0.5),387+13+random(-1,1),flags[i]+3-gameScroll,387);
            fill(0);
            rect(flags[i]-gameScroll,387,3,45);


            //check character contact with flagpole
            if (abs((gameChar_x*1.6)-(flags[i]-gameScroll))<20 && abs(gameChar_y*1.6-433)<40) 
            {
                checkpoint=i+1; redEffect=true;
                if (cdFlag==1) {cdFlag=0; flagSound.play();}
            }
            if (gameChar_x*1.6+gameScroll>flags[checkpoint-1]+1000) cdFlag=1;
        }
    }

    //water bar [static]
    {
        waterAdd=100;
        if (enemyHit && hitDist!=150 && waterBar>0)
        {
            fill(99, 200, 255,150);
            rect(34,25,waterBar+50,8);
        }
        fill(99, 200, 255);
        if (!gameEnd) rect(34,25,waterBar,8);
        if (play && !gameEnd)
        {
            if (waterBar>700) waterBar-=2;
            else if (waterBar>600) waterBar-=1.5;
            else if (waterBar>500) waterBar-=1.05;
            else if (waterBar>400) waterBar-=0.75;
            else waterBar-=0.5;
            waterBar=max(0,waterBar);
        }
    }

    //health bar [shift with character]
    {
        push();
        stroke(255);
        fill(185+healthBar,70-healthBar,70-healthBar);
        if (!gameEnd) rect(gameChar_x*1.6-37,gameChar_y*1.6-35-healthBar,5,healthBar);
        if (play && !gameEnd)
        {
            if (healthBar!=0)
            {
                if (waterBar==0)
                {
                    healthBar-=0.2;
                    if (cdCough==300) coughSound.play();
                    cdCough--; if (cdCough==0) cdCough=300;
                } 
                else {healthBar+=0.05; cdCough=300;}
            }
            healthBar=constrain(healthBar,0,70);
            if (healthBar==0) {isPlummeting=true; play=false; start=true;}
        }
        pop();
    }

    //score counter [static]
    {
        fill(255);
        textSize(30);
        text(score,885,45);
        if (healthBar!=0 && play)
        {
            if (scoreControl==5)
            {
                score=round(gameChar_x*1.6+gameScroll)-160;
                score=max(0,score);
                scoreControl=0;
            }
            else 
            {
                scoreControl++;
            }
        }
    }

    //healthBar declining overlay [static]
    {
        if (waterBar==0)
        {
            fill(healthBar*3,0,0,150-(2*healthBar));
            rect(0,0,width,height);
        }
    }

    //game over [static]
    {
        if (healthBar==0)
        {
            fill(0);
            rect(0,0,width,height);
            fill(255);
            textSize(20);
            if (score>100000) text("Score: "+score,width/2-100,height/2+30);
            else if (score>10000) text(" Score: "+score,width/2-100,height/2+30);
            else if (score>1000) text("  Score: "+score,width/2-100,height/2+30);
            else if (score>100) text("   Score: "+score,width/2-100,height/2+30);
            else if (score>10) text("    Score: "+score,width/2-100,height/2+30);
            else text("     Score: "+score,width/2-100,height/2+30);

            push();
            textAlign(CENTER);
            textSize(20);
            let away=13500-score;
            if (away<2000) {fill(255,0,0); text("You were only "+away+"m away from home.",width/2,height/2+100);} else {fill(255); text("You were "+away+"m away from home.",width/2,height/2+100);}
            fill(255);
            textSize(30);
            text("Game Over",width/2,height/2);
            pop();

            push();
            stroke(0);
            if (wordBlink) blinkControl+=2; else blinkControl-=2;
            if (blinkControl==170) wordBlink=true;
            if (blinkControl==250) wordBlink=false;

            fill(255,blinkControl);
            textSize(30);
            text("Press S to start",350+random(-0.3,0.3),530+random(-0.3,0.3));
            pop();
        }
    }

    //instruction screen [static]
    {
        if (!start)
        {
            noStroke();
            fill(30,30,40,240);
            rect(0,0,82,height);
            rect(231,0,width,height);
            {
                fill(255,0,0);
                triangle(441+3-gameScroll,387+18,441+29-gameScroll+random(-0.5,0.5),387+13+random(-1,1),441+3-gameScroll,387); //flag
                fill(0);
                rect(441-gameScroll,387,3,45); //pole
            }//flagpole
            {
                push();
                stroke(99, 200, 255);
                strokeWeight(3);
                fill(99, 200, 255);
                strokeJoin(ROUND);
                triangle(710-gameScroll,385+collectableBounce,710+6-gameScroll,385+15+collectableBounce,710-6-gameScroll,385+15+collectableBounce);
                ellipse(710-gameScroll,385+16+collectableBounce,12);
                stroke(255);
                fill(255);
                ellipse(710+1-gameScroll,385+16+collectableBounce,5);
                stroke(99, 200, 255);
                fill(99, 200, 255);
                ellipse(710-1-gameScroll,385+15+collectableBounce,6);
                pop();
                fill(0,0);
                ellipse(710-gameScroll,397+collectableBounce,1);
            }//water droplet
            {
                push();
                fill(150);
                rect(750+3,150+3,30,25);
                rect(750+3,177+3,30,25);
                rect(718+3,177+3,30,25);
                rect(782+3,177+3,30,25);

                leftArrow=0; rightArrow=0;
                if (isLeft) leftArrow=1;
                if (isRight) rightArrow=1;
                stroke(150);
                fill(255);
                rect(750,150,30,25);
                rect(750,177,30,25);
                rect(718+leftArrow,177+leftArrow,30,25);
                rect(782+rightArrow,177+rightArrow,30,25);

                fill(0);
                triangle(725+leftArrow,190+leftArrow,725+leftArrow+4,190+leftArrow+4,725+leftArrow+4,190+leftArrow-4);
                rect(725+leftArrow+4,190+leftArrow-1,7,2);
                triangle(805+rightArrow,190+rightArrow,805+rightArrow-4,190+rightArrow+4,805+rightArrow-4,190+rightArrow-4);
                rect(805+rightArrow-4-7,190+rightArrow-1,7,2);
                pop();
            }//arrow keys
            {
                push();
                noStroke();
                fill(150);
                rect(425+3,177+3,200,25);

                spaceBar=0;
                if (isFalling) spaceBar=1;
                stroke(150);
                fill(255);
                rect(425+spaceBar,177+spaceBar,200,25);

                fill(0);
                rect(518+spaceBar,195+spaceBar,14,2);

                {
                    if(isFalling)
                    {
                        strokeWeight(3);
                        stroke(0);
                        line(468,140,495,161);
                        line(526,130,526,161);
                        line(584,140,557,161);
                        ready=true;
                    }
                }
                pop();
            }//spacebar
            {
                push();
                stroke(255);
                fill(185+healthBar,70-healthBar,70-healthBar);
                rect(gameChar_x*1.6-37,gameChar_y*1.6-35-healthBar,5,healthBar);
                pop();
            }

            fill(255,255);
            textFont("Silkscreen");
            textSize(25);
            if (readyControl==0) text("jump",488+random(-1,1),240+random(-0.5,0.5)); else text("jump",488,240);
            text("                   move",488,240);
            textSize(20);
            fill(200,255);
            text("checkpoint                  add water",355,455);
            text("water bar                             score = distance travelled",240,35);
            textSize(25);
            fill(255,255);
            text("health bar",250,270*1.6-35-(0.5*70)+6);
            push();
            strokeWeight(3);
            stroke(255,random(205,255));
            noFill();
            line(250-6,270*1.6-35-(0.5*70),gameChar_x*1.6-37+2.5+7,gameChar_y*1.6-35-(0.5*70));
            ellipse(gameChar_x*1.6-37+2.5,gameChar_y*1.6-35-(0.5*healthBar),random(14,15));
            pop();

            if (ready)
            {
                noStroke();
                fill(0,readyControl*0.7);
                rect(0,0,82,height);
                rect(231,0,width,height);
                if (readyControl<255) {readyControl+=2; readyControl=min(readyControl,255);}
                push();
                stroke(0);
                if (wordBlink) blinkControl+=2; else blinkControl-=2;
                if (blinkControl==170) wordBlink=true;
                if (blinkControl==250) wordBlink=false;

                fill(255,blinkControl);
                textSize(30);
                text("Press S to start",425+random(-0.3,0.3),530+random(-0.3,0.3));
                pop();
            }
        }
    }

    //game start countdown [static]
    {
        if (start)
        {
            readyControl-=1.5;
            if (readyControl>50) 
            {
                fill(0,230-((349-readyControl)*0.65));
                rect(0,0,width,height);
                fill(255);
                textSize(40);            
                text(round(readyControl*0.01),width/2-random(-0.5,0.5),height/2-random(-0.5,0.5));
                gameChar_x=100;
            }
            else play=true;
        }
    }

    //game end screen [static]
    {
        //fade to black
        if (endCounter<=0)
        {
            push();
            fill(0,-endCounter*2);
            rect(0,0,width,height);
            pop();
        }
        if (endCounter<-150)
        {
            bgmSound.stop();
            push();
            fill(255,-150-endCounter);
            textAlign(CENTER);
            textSize(30);
            text("You made it home.",width/2,height/2);
            pop();
        }
    }
}

function keyPressed()
{
    if (keyCode == 37 && (!start||play) && !enemyHit && !gameEnd)
        isLeft = true;
    if (keyCode == 39 && (!start||play) && !enemyHit && !gameEnd)
        isRight = true;
    if (keyCode == 32 && !isFalling && !isPlummeting && (!start||play) && !enemyHit && !gameEnd)
    {
        if (gameChar_y>269 || isOnPlatform)
        {
            accelerationControl=5;
            jump=true;
            jumpSound.play();
        }

    }
    if (keyCode == 83 && ready)
    {
        readyControl=349;
        start=true;
        wordBlink=true;
    }
    if (keyCode == 83 && healthBar==0)
    {
        isPlummeting=false; start=true; play=false; readyControl=349;
        gameChar_x=100; gameChar_y=270; gameScroll=0; waterBar=200; healthBar=70; score=0; checkpoint=0; accelerationControl=0;
        for (i=0;i<collectableFound.length;i++)
            collectableFound[i]=false;
    }
}

function keyReleased()
{
    if (keyCode == 37 && !gameEnd)
        isLeft = false;
    if (keyCode == 39 && !gameEnd)
        isRight = false;
}