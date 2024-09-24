function SafeWater() {

    // Name for the visualisation to appear in the menu bar.
    this.name = 'Safe Drinking Water by Country: 2004-2022';

    // Each visualisation must have a unique ID with no special characters.
    this.id = 'safe-water';

    // Property to represent whether data has been loaded.
    this.loaded = false;

    // Padding around the main content for margins and labels.
    this.pad = 20;

    // Preload the CSV data for water quality. This is called by the gallery system.
    this.preload = function() {
        var self = this;
        this.data = loadTable(
            '../data/safe-water/safe-water.csv', 'csv', 'header',
            // Callback function to confirm data load.
            function(table) {
                self.loaded = true;
            });
    };
    
    // Setup method to initialise the visualisation, including background image and slider.
    this.setup = function() {
        //Text setup
        textAlign(CENTER, CENTER);
        textSize(12);
        
        // Background image
        this.worldMapImg = loadImage("./assets/equidistant-world-map.png");
        
        // Slider setup
        this.yearSlider = createSlider(2004,
                                       2022,
                                       2022,
                                       1);
        this.yearSlider.position(330, 10);
        this.yearSlider.size(width-2*this.pad,10);
        
        // State of instruction
        this.instructionOn = true;
    };
    
    // Removes slider when the visualisation is destroyed
    this.destroy = function() {
        this.yearSlider.remove();
    };

    this.draw = function() {
        if (!this.loaded) {
            console.log('Data not yet loaded');
            return;
        }
        
        cursor(ARROW); //set default cursor

        this.yearSelected = this.yearSlider.value();

        // Draw the world map image and a border around it
        image(this.worldMapImg, 0+this.pad, 0+this.pad, width-(2*this.pad), height-(2*this.pad));
        push();
        noFill();
        stroke(0);
        rect(0+this.pad, 0+this.pad, width-(2*this.pad), height-(2*this.pad));
        pop();

        // Get data from the loaded CSV file.
        const countries = this.data.getColumn('country');
        const codes = this.data.getColumn('code');
        var cx = this.data.getColumn('x');
        var cy = this.data.getColumn('y');
        var waterData = this.data.getColumn(str(this.yearSelected));

        // Convert string data to numerical values.
        cx = stringsToNumbers(cx);
        cy = stringsToNumbers(cy);
        waterData = stringsToNumbers(waterData);
        
        // Get the average water data from the last row of the data
        const avgData=waterData[waterData.length-1];

        // Set the minimum and maximum values for longitude (x) and latitude (y)
        const cxMin = -180;
        const cxMax = 180;
        const cyMin = -90;
        const cyMax = 90;
        
        // Set default size for country squares
        const size = 30;
        
        // Initialise default fill and stroke values
        fill(255);
        stroke(0);
        strokeWeight(1);

        // Draw the average water level rectangle
        push();
        fill(28,163,236,100); //semi-transparent blue fill
        rect(this.pad,height-this.pad,width-2*this.pad,-map(avgData,0,100,this.pad,height-this.pad));
        pop();

        // Draw a white square for each country on the map
        for (let i = 0; i < this.data.getRowCount()-1; i++) {
            let rx = map(cx[i], cxMin, cxMax, this.pad, width - this.pad); //map longitude to x-axis
            let ry = map(cy[i], cyMin, cyMax, height - this.pad, this.pad); //map latitude to y-axis
            push();
            fill(255);
            rect(
                rx-(size/2),
                ry-(size/2),
                size,size); 

            fill(0);
            text(codes[i],rx,ry); //display country code inside square
            pop();
        };

        // Check if the mouse is over any country square and display additional info
        for (let i = 0; i < this.data.getRowCount()-1; i++) {
            let rx = map(cx[i], cxMin, cxMax, this.pad, width - this.pad);
            let ry = map(cy[i], cyMin, cyMax, height - this.pad, this.pad);
            let extrasize = 5*countries[i].length - size; //size callouts according to country name length
            push();

            // Check if the mouse is over the current country's square
            let rxLeft = rx-(size/2), rxRight = rx+(size/2), ryUp = ry-(size/2), ryDown = ry+(size/2);
            if ((mouseX>=rxLeft) && (mouseX<=rxRight) && (mouseY>=ryUp) && (mouseY<=ryDown))
            {
                let offsetx=0;
                let offsety=0;
                let lineStart=0;
                
                // Invert colors of the square and country code for hover effect
                fill(0);            
                rect(
                    rx-(size/2),
                    ry-(size/2),
                    size,size);
                fill(255);
                text(codes[i],rx,ry);
                
                // Adjust callout position to prevent it from going off-screen
                if (rx>width-this.pad-(size*3/2))
                {
                    offsetx = -size*3/2;
                }
                else if (rx<this.pad+(size*3/2))
                {
                    offsetx = size*3/2;
                }
                if (ry-(4*size)<4*this.pad)
                {
                    offsety = 6*size;
                    lineStart = size;
                }
                // Draw line connecting the square to the callout
                strokeWeight(3);
                line(rx,ry-(size/2)+lineStart,rx+offsetx,ry-(2*size)+offsety);
                
                // Draw the callout box
                rect(rx+offsetx-(size*3/2)-(extrasize/2),ry-(4*size)+offsety,size*3+extrasize,size*2);
                
                // Fill the callout with the water level data
                noStroke();
                fill(28,163,236,100); //semi-transparent blue fill
                let waterLevel = map(waterData[i],0,100,0,size*2); //water level for the current country
                rect(rx+offsetx-(size*3/2)-(extrasize/2),
                     ry-(4*size)+(size*2)+offsety-waterLevel,
                     size*3+extrasize,
                     waterLevel);
                strokeWeight(1);
                
                // Display the country name and water % in the callout
                fill(0);
                textAlign(CENTER, BOTTOM);
                text(countries[i],rx+offsetx,ry+offsety-(3*size)-3);
                textAlign(CENTER, TOP);
                text(waterData[i]+"%",rx+offsetx,ry+offsety-(3*size)+3);
            }
            pop();
        };
        
        // Draw informative text boxes at the top and bottom
        push();
        fill(255);
        stroke(0);
        rect(this.pad+10,height-(this.pad*5)-10,width-(this.pad*2)-20,this.pad*4); //bottom textbox
        rect(this.pad*15,this.pad+10,width-30*this.pad,2*this.pad); //top textbox
        fill(0);
        noStroke();
        textSize(18);
        text("Population drinking water from an improved source that is accessible on premises, available when needed and free from faecal and priority chemical contamination. Improved water sources include piped water, boreholes or tubewells, protected dug wells, protected springs, rainwater, and packaged or delivered water.",(this.pad*2),height-(this.pad*4)-10,width-(this.pad*4));
        textSize(20);
        strokeWeight(1);
        stroke(0);
        // Display the selected year and average water level
        text(this.yearSelected+" Average: "+ avgData.toFixed(2) +"%",this.pad*15,this.pad+10,width-30*this.pad,2*this.pad);
        pop();


        // Display instructions if still enabled
        if (this.instructionOn) {
            let offsetX = 60;
            let offsetY = -40;
            push();
            fill(255,245);
            rect(width-this.pad*4-300+offsetX,this.pad*4-20+offsetY,300,20);
            noStroke(); //instruction box
            fill(10);
            text("\u{2716}",width-this.pad*4-9+offsetX,this.pad*4-8+offsetY); //close button (X symbol)
            text("Mouse over country's square for more information.",width-this.pad*4-160+offsetX,this.pad*4-8+offsetY);
            pop();
            // Detect hover over close button and change cursor
            if (mouseX>=width-this.pad*4-19+offsetX && mouseX<=width-this.pad*4-19+18+offsetX && mouseY>=this.pad*4-19+offsetY && mouseY<=this.pad*4-19+18+offsetY) {
                cursor(HAND);
            }
        }
    }
    
    // Check if the close button (X) is clicked to turn off the instruction
    this.mouseClicked = function() {
        let offsetX = 60;
        let offsetY = -40;
        if (mouseX>=width-this.pad*4-19+offsetX && mouseX<=width-this.pad*4-19+18+offsetX && mouseY>=this.pad*4-19+offsetY && mouseY<=this.pad*4-19+18+offsetY) {
            this.instructionOn = false; //close the instruction
        }
    }
};
