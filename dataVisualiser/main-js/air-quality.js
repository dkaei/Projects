function AirQuality() {

    // Name for the visualisation to appear in the menu bar.
    this.name = 'Air Quality by Country: 2010 vs 2019';

    // Each visualisation must have a unique ID with no special characters.
    this.id = 'air-quality';

    // Property to represent whether data has been loaded.
    this.loaded = false;

    // Padding around the main content for margins and labels.
    this.pad = 20;

    // Preload the CSV data for air quality. This is called by the gallery system.
    this.preload = function() {
        var self = this;
        this.data = loadTable(
            '../data/air-quality/air-quality.csv', 'csv', 'header',
            // Callback function to confirm data load.
            function(table) {
                self.loaded = true;
            });
    };

    // Setup method to initialise the visualisation, including slider and particles.
    this.setup = function() {
        // Default text values
        textAlign(CENTER, CENTER);
        textSize(12);
        fill(0);
        stroke(0);
        strokeWeight(1);

        // Slider setup
        this.Slider = createSlider(1,
                                   23456,
                                   0,
                                   0);
        this.Slider.position(330, height-this.pad);
        this.Slider.size(width-2*this.pad,10);

        this.particles = []; //array to hold particle objects for animation

        // Arrays to hold circle interactions
        this.onCircle = [];
        this.selectedCircle = [];
        this.selectedCircle2 = [];

        // Variables to manage arrow and keyboard controls
        this.goRight = false;
        this.goLeft = false;

        // State of instructions and information display
        this.instructionOn = true;
        this.informationOn = false;
        this.icounter = 0;
        this.targetOn = false;
        this.targetClose = false;
        this.tcounter = 0;
        this.targetImg = loadImage("./assets/who-interim-target.png");
        
        // Display search bar for searching country codes
        document.getElementsByTagName("p")[0].style.display="block";
        this.matched = 0; //state of search effect
    };

    // Removes slider and hides search bar when the visualisation is destroyed
    this.destroy = function() {
        this.Slider.remove();
        document.getElementsByTagName("p")[0].style.display="none";
    };

    // Particle constructor to create animated particles in the visualisation
    function Particle() {
        // Initialise particle at a random position and diameter
        this.x = random(4*20,width-4*20);
        this.y = random(4*20,height-4*20);
        this.dia = random(6,14); //diameter
        this.spd = this.dia*this.dia*this.dia/(16*16*16); //speed is proportional to the cube of the diameter

        // Particle moves away from the center of the canvas
        this.distFromCenterX = (width/2-this.x)/100;
        this.distFromCenterY = (height/2-this.y)/200;
        this.moveX = -this.distFromCenterX*this.spd;
        this.moveY = -this.distFromCenterY*this.spd;

        // Initial alpha value for transparency animation
        this.alpha = 0;
        this.maxAlpha = this.dia*20; //max transparency based on size
        
        // Particle acceleration
        this.acc = 1;
        
        // Set age of particle, for removal if lingered for too long
        this.age = 0; 

        // Update particle position and transparency
        this.update = function() {
            this.x += this.moveX * this.acc;
            this.y += this.moveY * this.acc;
            this.alpha+=4;
        }
        
        // Pulser effect for particles
        this.mCount=0; //animation keyframe count
        this.m=0; //value of diameter change
        this.s=0; //rate of diameter change
        this.show = function() {

            // Handle pulsing animation for particles
            if (this.mCount==0) {
                this.s = this.dia/200;
            }
            else if (this.mCount<30) {
                this.m+=this.s;
            }
            else if (this.mCount<59) {
                this.m-=this.s;
            }

            // Draw the particle with pulsing effect
            push();
            noStroke();
            fill(100,min(this.alpha-100,this.maxAlpha-100)); //outer layer
            ellipse(this.x,this.y,this.dia*1.5+this.m,this.dia*1.5+this.m);
            fill(80,min(this.alpha,this.maxAlpha)); //inner layer
            ellipse(this.x,this.y,this.dia+this.m,this.dia+this.m);
            pop();

            this.mCount++; //next keyframe
            if (this.mCount==59) {
                this.mCount=1; //reset once limit hit
                this.age++; //increase age after every pulse (cycle of animation)
            }
        }
    };

    this.draw = function() {
        if (!this.loaded) {
            console.log('Data not yet loaded');
            return;
        }

        // Get data from the loaded CSV file.
        const countries = this.data.getColumn('country');
        const codes = this.data.getColumn('countryCode');
        var values2019 = this.data.getColumn('value2019');
        var valuesLow2019 = this.data.getColumn('valueLow2019');
        var valuesHigh2019 = this.data.getColumn('valueHigh2019');
        var values2010 = this.data.getColumn('value2010');
        const indicator = this.data.getColumn('indicator')[0];

        // Convert numerical data from strings to numbers.
        values2019 = stringsToNumbers(values2019);
        valuesLow2019 = stringsToNumbers(valuesLow2019);
        valuesHigh2019 = stringsToNumbers(valuesHigh2019);
        values2010 = stringsToNumbers(values2010);

        // Draw the gradient background (top to center, center to bottom)
        push();
        noFill();
        for (let i = 4*this.pad; i <= height-4*this.pad; i++) {
            let inter = map(i, 4*this.pad, height-4*this.pad, 0, 1);
            let c1 = color(255,50);
            let c2 = color(150,150+this.Slider.value()/234.56);
            let c = lerpColor(c2, c1, inter);
            if (i>height/2) {
                inter = map(i, 4*this.pad, height-4*this.pad, 0, 1);
                c = lerpColor(c1, c2, inter);
            } 
            stroke(c);
            line(this.pad*4, i, width-this.pad*4, i); 
        }
        pop();

        // Handle particle generation
        let n; 
        if (this.Slider.value()<4000) n = 30; //set initial limit
        else n = round(this.Slider.value()*30/4000); //set limits for varying slider values
        if (this.particles.length<n) {
            let p = new Particle(); //create a new particle
            this.particles.push(p);
        }      

        // Update and display each particle
        for (let i=0; i<this.particles.length; i++) {
            this.particles[i].acc = max(1,this.Slider.value()/10000); //adjust particle acceleration based on slider
            this.particles[i].update(); //update particle position
            this.particles[i].show(); //draw the particle

            // Remove out-of-bounds particles
            // Remove aged particles (after 50 pulses)
            if (this.particles[i].x<4*this.pad-16 || this.particles[i].x>width-4*this.pad+16 || this.particles[i].y<4*this.pad-16 || this.particles[i].y>height-4*this.pad+16 || this.particles[i].age>50) {
                this.particles.splice(i,1);
                i--;
            }
        }
        // Remove excess particles
        if (this.particles.length>n) {
            this.particles.splice(0,1);
        }
        
        var circlesPosition = []; //array to store circle positions for user search return
        
        // Create circles for each country
        var control = this.Slider.value(); //scroll control
        var xoffset = 0;
        cursor(ARROW);
        for (let i = 0; i < this.data.getRowCount(); i++) {
            let diameter = map(values2019[i],0,90,0,height-2.5*this.pad);
            xoffset+=diameter;
            push();
            // If mouse is on a circle, display bigger circles. Restrict interaction to within borders.
            if (mouseX>=this.pad*4 && mouseX<=width-this.pad*4 && dist(this.pad*4+10+xoffset-control,height/2,mouseX,mouseY)<diameter/2) {this.onCircle[i]=true;} else this.onCircle[i]=false;
            
            // Draw highlighted circles if selected or hovered
            if (this.onCircle[i] || this.selectedCircle[i] || this.selectedCircle2[i])
            {
                // Draw the bigger circle (high value)
                fill(5*valuesHigh2019[i],255-5*valuesHigh2019[i],10,50);
                noStroke();
                ellipse(this.pad*4+10+xoffset-control,
                        height/2,
                        map(valuesHigh2019[i],0,90,0,height-2*this.pad)+random(-2,2));

                // Show range (low to high)
                textStyle(BOLD);
                let diff = (valuesHigh2019[i]-valuesLow2019[i])/valuesLow2019[i];
                fill(diff*255-50,255-(diff*255)-50,0); //colour according to diff (%)
                stroke(255,100);
                text(valuesLow2019[i]+" ~ "+valuesHigh2019[i],this.pad*4+10+xoffset-control,height/2-diameter/2-10);

                stroke(255,150);
                strokeWeight(6);

            } else stroke(0,150);

            // Draw the main circle (avg value)
            fill(min(220,5*values2019[i]),255-5*values2019[i],10); //max 220 for Red to reduce glare/eye discomfort
            ellipse(this.pad*4+10+xoffset-control,
                    height/2,
                    diameter);
            pop();
            
            // Store circle positions for user search return
            circlesPosition.push(this.pad*4+10+xoffset-control);

            if (this.onCircle[i] || this.selectedCircle[i] || this.selectedCircle2[i])
            {
                // Draw the smaller circle (low value)
                push();    
                fill(255,50);
                noStroke();
                ellipse(this.pad*4+10+xoffset-control,
                        height/2,
                        map(valuesLow2019[i],0,90,0,height-2*this.pad)+random(-2,2));
                pop();
            }

            // Display country code and value in each circle
            push();
            fill(50);
            stroke(50);
            text(codes[i]+"\n"+values2019[i],this.pad*4+10+xoffset-control,height/2);
            pop();
        }

        // Create white borders and rect outline to hold circles
        push();
        fill(255);
        noStroke();
        rect(0,0,this.pad*4,height); //left border
        rect(width-this.pad*4,0,this.pad*4,height); //right border
        rect(0,0,width,this.pad*4); //top border
        rect(0,height-this.pad*4,width,this.pad*4); //bottom border
        noFill();
        stroke(0);
        rect(this.pad*4,4*this.pad,width-this.pad*8,height-8*this.pad);
        pop();

        // Check if mouse is on a circle. If it is, change cursor and display info.
        for (let i = 0; i < this.data.getRowCount(); i++) {
            if (this.onCircle[i]) {
                cursor(HAND);
                push();
                textSize(16);
                noStroke();
                textStyle(BOLD);
                let arrow = " \u{1F87D} "; //up-right arrow
                fill(200,10,10);
                if (values2019[i]<values2010[i]) {
                    arrow = " \u{1F87E} "; //down-right arrow
                    fill(10,200,10);
                }

                text(countries[i]+"\n"+"2010: "+values2010[i]+arrow+"2019: "+values2019[i],width/2,height-2.5*this.pad);
                pop();
            } 
            if (this.selectedCircle[i]) {
                push();
                textSize(16);
                noStroke();
                textStyle(BOLD);
                let arrow = " \u{1F87D} "; //up-right arrow
                fill(200,10,10);
                if (values2019[i]<values2010[i]) {
                    arrow = " \u{1F87E} "; //down-right arrow
                    fill(10,200,10);
                }

                text(countries[i]+"\n"+"2010: "+values2010[i]+arrow+"2019: "+values2019[i],width/4,height-2.5*this.pad);
                pop();
            }
            if (this.selectedCircle2[i]) {
                push();
                textSize(16);
                noStroke();
                textStyle(BOLD);
                let arrow = " \u{1F87D} "; //up-right arrow
                fill(200,10,10);
                if (values2019[i]<values2010[i]) {
                    arrow = " \u{1F87E} "; //down-right arrow
                    fill(10,200,10);
                }

                text(countries[i]+"\n"+"2010: "+values2010[i]+arrow+"2019: "+values2019[i],width*3/4,height-2.5*this.pad);
                pop();
            } 
        }

        // Display title
        push();
        textStyle(BOLD);
        textSize(24);
        noStroke();
        text(indicator+" by Country   ",width/2,2*this.pad);
        pop();

        // Label the slider
        push();
        textSize(16);
        noStroke();
        text(values2019[0]+"μg/m\u00B3",3*this.pad,height-2*this.pad); //\u00B3 = superscript 3
        text(values2019[values2019.length-1]+"μg/m\u00B3",width-3*this.pad,height-2*this.pad);
        pop();

        // Prev and Next arrows
        this.rightArrow = { 
            x : width-this.pad*3-3,
            y : height/2-3,
            width : 25,
            height : 45
        };
        this.leftArrow = {
            x : this.pad*3+3,
            y : height/2-3,
            width: 25,
            height: 45
        };
        // Draw the arrows
        push();
        textSize(50);
        fill(50);
        noStroke();
        text("\u{2771}",this.rightArrow.x+3,this.rightArrow.y+3);
        text("\u{2770}",this.leftArrow.x-3,this.leftArrow.y+3);
        pop();
        // Detect hover and change cursor
        if ((abs(mouseX-this.rightArrow.x)<=this.rightArrow.width/2 
             && abs(mouseY-this.rightArrow.y)<=this.rightArrow.height/2)
            || (abs(mouseX-this.leftArrow.x)<=this.leftArrow.width/2 
                && abs(mouseY-this.leftArrow.y)<=this.leftArrow.height/2)) { 
            cursor(HAND);
        }
        // Adjust slider value according to the arrow pressed
        if (this.goRight) this.Slider.value(this.Slider.value()+4);
        if (this.goLeft) this.Slider.value(this.Slider.value()-4); 
  
        // Search by Country Code
        const inputCode = document.getElementById("countryCode"); //get input value
        for (let i=0; i<codes.length; i++) {
            if (inputCode.value===codes[i]) { //check input against database
                if (this.matched==0) this.matched=1;
                let shift = width/2 - circlesPosition[i];
                this.Slider.value(this.Slider.value()-shift); //update slider value to move searched country to center
            }
        }
        // Animation for successful search
        push();
        if (this.matched>0 && this.matched<255) {
            stroke(255,255-this.matched);
            strokeWeight(8);
            noFill();
            ellipse(width/2,height/2,this.matched);
            this.matched+=2;
        }
        pop();
        // End animation and reset input
        if (this.matched>=255) {
            inputCode.value="";
            this.matched=0;
        } 
        
        // instructionOn: Immediate display, click to close.
        if (this.instructionOn) {
            push();
            fill(255,245);
            rect(width-this.pad*4-300,this.pad*4-20,300,35);
            noStroke();
            fill(10);
            text("\u{2716}",width-this.pad*4-9,this.pad*4-8);
            text("Mouse over country's circle for more information.\nSelect up to two for comparison.",width-this.pad*4-160,this.pad*4-1);
            pop();

            if (mouseX>=width-this.pad*4-19 && mouseX<=width-this.pad*4-19+18 && mouseY>=this.pad*4-19 && mouseY<=this.pad*4-19+18) {
                cursor(HAND);
            }
        }

        // informationOn: Click (i) icon for information on PM2.5.
        push();
        textSize(24);
        noStroke();
        text("\u{1F6C8}",width-this.pad*8,2*this.pad);
        pop();
        if (dist(mouseX,mouseY,width-this.pad*8,2*this.pad-2)<=18/2) {
            cursor(HAND);
        }
        if (this.informationOn) {
            if (this.icounter<64) this.icounter++;
            let mv = this.icounter/5; //move
            let av = this.icounter*4; //alpha
            push();
            stroke(0,av);
            strokeWeight(5);
            fill(10,min(av,220));
            rect(this.pad*5,4.5*this.pad+64/5-mv,width-this.pad*10,this.pad*6);
            fill(50,150);
            noStroke();
            ellipse(width-this.pad*8,2*this.pad-2,18,17);
            textStyle(BOLD);
            textSize(16);
            fill(245,av);
            text("PM2.5 refers to fine particulate matter in the air that is less than 2.5 micrometers in diameter. Considered one of the main air pollutants, it poses significant health risks due to its ability to penetrate deep into the respiratory system and enter the bloodstream, leading to various respiratory and cardiovascular diseases. Reducing PM2.5 levels is a key focus of air quality management and environmental health efforts worldwide.",(this.pad*6),5.6*this.pad+64/5-mv,width-(this.pad*12));
            pop();
        }

        // targetOn: Click target icon for more information.
        push();
        textSize(24);
        noStroke();
        text("\u{1F3AF}",width-this.pad*2.5,height-5*this.pad);
        textSize(12);
        text("WHO\nGlobal\nGuidelines\n(2021)",width-this.pad*2.5,height-7.3*this.pad);
        pop();
        // Detect hover and change cursor
        if (dist(mouseX,mouseY,width-this.pad*2.5,height-5*this.pad)<=25/2) {
            cursor(HAND);
        }
        // Display the WHO interim targets
        if (this.targetOn) { 
            if (this.tcounter<60) this.tcounter+=2; else if (this.tcounter<74) this.tcounter++;
            let mc = min(width/2,this.tcounter*7); 
            push();
            noStroke();
            image(this.targetImg,width-this.pad*4-mc,height-this.pad*10,0+mc,this.pad*6);
            fill(50,150);
            ellipse(width-this.pad*2.5,height-5*this.pad,25);
            pop();
        }
        // Hide the WHO interim targets
        if (this.targetClose) { 
            if (this.tcounter<60) this.tcounter+=2; else if (this.tcounter<74) this.tcounter++;
            let mc = min(width/2,this.tcounter*7);
            push();
            if (mc<width/2) 
                image(this.targetImg,width/2-this.pad*4+mc,height-this.pad*10,width/2-mc,this.pad*6);
            pop();
        }
    }

    this.mouseClicked = function() {

        // Close the instruction box when the 'X' button is clicked
        if (mouseX>=width-this.pad*4-19 && mouseX<=width-this.pad*4-19+18 && mouseY>=this.pad*4-19 && mouseY<=this.pad*4-19+18) {
            this.instructionOn = false;
        }

        // Allow user to select (and deselect) up to two circles for comparison.
        if (mouseX>=this.pad*4 && mouseX<=width-this.pad*4 && mouseY>=this.pad*4 && mouseY<=height-this.pad*4) {

            let firstEmpty=true;
            let secondEmpty=true;
            // Check if any circles are already selected
            for (let i = 0; i < this.data.getRowCount(); i++) {
                if (this.selectedCircle[i]) firstEmpty=false; //check if first selection is made
                if (this.selectedCircle2[i]) secondEmpty=false; //check if second selection is made
            }
            
             // Logic to manage selection of circles
            for (let i = 0; i < this.data.getRowCount(); i++) {

                //if first selection is not made
                if (firstEmpty) {
                    if (this.onCircle[i]) {
                        if (this.selectedCircle2[i]) this.selectedCircle2[i]=false;
                        else this.selectedCircle[i]=true;
                    }
                }

                //if first selection is made and second selection is not made
                if (!firstEmpty && secondEmpty) {
                    if (this.onCircle[i]) {
                        if (this.selectedCircle[i]) this.selectedCircle[i]=false;
                        else this.selectedCircle2[i]=true;
                    }
                }

                //if both selections have been made
                if (!firstEmpty && !secondEmpty) {
                    if (this.onCircle[i]) {
                        if (this.selectedCircle[i]) this.selectedCircle[i]=false;
                        else if (this.selectedCircle2[i]) this.selectedCircle2[i]=false;
                        else {
                            for (let j = 0; j < this.data.getRowCount(); j++) {
                                this.selectedCircle[j]=false; //reset both selections
                                this.selectedCircle2[j]=false;
                            }
                            this.selectedCircle[i]=true;
                        }
                    }
                }
            }
        }

        // Toggle PM2.5 information display when info icon is clicked
        if (dist(mouseX,mouseY,width-this.pad*8,2*this.pad-2)<=18/2) {
            this.icounter = 0; //reset animation counter
            this.informationOn = !this.informationOn; //toggle information display
        }

        // Toggle WHO target image display when target icon is clicked
        if (dist(mouseX,mouseY,width-this.pad*2.5,height-5*this.pad)<=25/2) {
            this.tcounter = 0; //reset animation counter
            if (this.targetOn) {
                this.targetClose = true; //close target display
                this.targetOn = false;
            } else {
                this.targetClose = false;
                this.targetOn = true; 
            }
        }
    };

    this.mousePressed = function() {
        // Check if the right arrow is pressed and activate scrolling
        if (abs(mouseX-this.rightArrow.x)<=this.rightArrow.width/2 
            && abs(mouseY-this.rightArrow.y)<=this.rightArrow.height/2) {
            this.goRight=true;
        }
        // Check if the left arrow is pressed and activate scrolling
        if(abs(mouseX-this.leftArrow.x)<=this.leftArrow.width/2 
           && abs(mouseY-this.leftArrow.y)<=this.leftArrow.height/2) {
            this.goLeft=true;
        }
    }

    this.mouseReleased = function() {
        // Deactivate scrolling
        this.goRight=false;
        this.goLeft=false;
    }

    this.keyPressed = function() {
        // Check if left or right key is pressed and activate scrolling
        if (keyCode == 39) this.goRight=true;
        else if (keyCode == 37) this.goLeft=true;
    }

    this.keyReleased = function() {
        // Deactivate scrolling
        this.goRight=false;
        this.goLeft=false;
    }
};