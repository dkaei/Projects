var c; //canvas
var onIntro = true, started = false; //for homepage intro
var scrolled = false;
var count; //animation control
var page = 0;

function setup() {
    //canvas setup, to follow window size
    c = createCanvas(windowWidth, windowHeight);
    c.position(0,0);
    c.style('z-index', -1); //position canvas behind the html elements
    rectMode(CENTER);
    textAlign(CENTER);

    //set current page number
    if (document.URL.includes("about.html")) {
        page=2;
    }
    else if (document.URL.includes("works.html")) {
        page=3;
    }
    else if (document.URL.includes("resources.html")) {
        page=4;
    }
    else if (document.URL.includes("contact.html")) {
        page=5;
    }
    else page=1;
    
    //make footer visible if it is not homepage
    const footer = document.getElementById('footer');
    if (page!=1) footer.style.visibility = 'visible';

    /*>>> Page 1 - Home <<<*/

    if (page==1) {
        //switch setup
        const switchBox = document.getElementsByClassName('slider');
        //switch is immediately visible on smaller screens
        if (windowWidth<1050) switchBox[0].style.backgroundColor = 'rgb(140,105,222)';
        switchBox[0].addEventListener('mouseover', function() {
            switchBox[0].style.backgroundColor = 'rgb(140,105,222)'; //switch becomes highlighted after mouseover
        });
        switchBox[0].addEventListener('click', function() {
            switchBox[0].style.backgroundColor = 'rgb(244,243,246)';
            started = true; //upon clicking on switch, activate introduction
            count = 90;
            document.body.style.cursor = "url('./styles/cursors/cursorDark.png') 10 10, auto"; //set to site default cursor
        });
    }

    /*>>> Page 3 - Works <<<*/

    else if (page==3) {
        // 1. minivan
        // to play and pause the videos on mouseover and mouseout respectively
        const vanVideo = document.getElementById('vanVideo2');
        const vanVideo2 = document.getElementById('vanVideo');
        vanVideo.addEventListener('mouseover', function() {
            vanVideo.currentTime = 0;
            vanVideo.play();
            started=true;
        });
        vanVideo.addEventListener('mouseout', function() {
            started=false;
        });
        vanVideo2.addEventListener('mouseover', function() {
            vanVideo2.currentTime = 0;
            vanVideo2.play();
            started=true;
        });
        vanVideo2.addEventListener('mouseout', function() {
            started=false;
        });

        // 2. drone
        // to switch the images on mouseover and revert on mouseout
        const droneImg = document.getElementById('droneImg');
        const droneImg2 = document.getElementById('droneImg2');
        droneImg.addEventListener('mouseover', function() {
            droneImg.src="assets/drone/4.png";
        });
        droneImg.addEventListener('mouseout', function() {
            droneImg.src="assets/drone/3r.png";
        });
        droneImg2.addEventListener('mouseover', function() {
            droneImg2.src="assets/drone/2.png";
        });
        droneImg2.addEventListener('mouseout', function() {
            droneImg2.src="assets/drone/1r.png";
        });

        //3. biopackaging
        // to switch the images on mouseover and revert on mouseout
        const bioImg = document.getElementById('bioImg');
        const bioImg2 = document.getElementById('bioImg2');
        bioImg.addEventListener('mouseover', function() {
            bioImg.src="assets/biopackaging/4r.png";
        });
        bioImg.addEventListener('mouseout', function() {
            bioImg.src="assets/biopackaging/5r.png";
        });
        bioImg2.addEventListener('mouseover', function() {
            bioImg2.src="assets/biopackaging/2r.png";
        });
        bioImg2.addEventListener('mouseout', function() {
            bioImg2.src="assets/biopackaging/1r.png";
        });

        //4. energy
        // to switch the images on mouseover and revert on mouseout
        const energyImg = document.getElementById('energyImg');
        const energyImg2 = document.getElementById('energyImg2');
        energyImg.addEventListener('mouseover', function() {
            energyImg.src="assets/energy/1.png";
        });
        energyImg.addEventListener('mouseout', function() {
            energyImg.src="assets/energy/4.png";
        });
        energyImg2.addEventListener('mouseover', function() {
            energyImg2.src="assets/energy/2.png";
        });
        energyImg2.addEventListener('mouseout', function() {
            energyImg2.src="assets/energy/3.png";
        });

        // 5. streetlights
        // to play and pause the video on mouseover and mouseout respectively
        const lightVideo = document.getElementById('lightVideo');
        lightVideo.addEventListener('mouseover', function() {
            console.log("played");
            lightVideo.play();
        });
        lightVideo.addEventListener('mouseout', function() {
            lightVideo.pause();
        });
        // to switch the image on mouseover and revert on mouseout
        const lightImg = document.getElementById('lightImg');
        lightImg.addEventListener('mouseover', function() {
            lightImg.src="assets/streetlight/1.png";
        });
        lightImg.addEventListener('mouseout', function() {
            lightImg.src="assets/streetlight/4.png";
        });
    }

    /*>>> Page 5 - Contact <<<*/

    else if (page==5) {
        
        // contact form
        // when submit button is clicked, check validity and return accordingly
        const contactSubmit = document.getElementById('contactSubmit');
        contactSubmit.addEventListener('click', function() {
            let cname = document.forms["myForm"]["cname"].value;
            if (cname!="") {
                //include user's name for a more personalised feedback message
                document.getElementById("automated").innerHTML = "Hello " + cname + ", thank you for reaching out!"; 
                // if submission valid, hide beforeSubmit and show afterSubmit elements
                var beforeSubmit = document.getElementsByClassName('beforeSubmit');
                for (let i=0; i<beforeSubmit.length; i++) {beforeSubmit[i].style.display = 'none';}
                var afterSubmit = document.getElementsByClassName('afterSubmit');
                for (let i=0; i<afterSubmit.length; i++) {
                    afterSubmit[i].style.display = 'block';
                    afterSubmit[i].style.animation = 'shiftUp 1s ';
                }

            } else {
                //if submission invalid, show snackbar to alert
                var s2 = document.getElementById("snackbar2");
                s2.className = "show";
                //after 3 seconds, hide the snackbar
                setTimeout(function(){ s2.className = s2.className.replace("show", ""); }, 3000);
            }
        });
        
        // email form
        // when submit button is clicked, check validity and return accordingly
        const emailSubmit2 = document.getElementById('emailSubmit2');
        const email2 = document.getElementById('email2');
        emailSubmit2.addEventListener('click', function() {
            if (email2.value!="") {
                document.getElementsByClassName("emailForm2")[0].reset();
                // if submission valid, hide beforeSubmit and show afterSubmit elements
                var beforeSubmit2 = document.getElementsByClassName('beforeSubmit2');
                for (let i=0; i<beforeSubmit2.length; i++) {beforeSubmit2[i].style.display = 'none';}
                var afterSubmit2 = document.getElementsByClassName('afterSubmit2');
                for (let i=0; i<afterSubmit2.length; i++) {
                    afterSubmit2[i].style.display = 'block';
                    afterSubmit2[i].style.animation = 'shiftUp 1s forwards';
                }
            } else {
                //if submission is empty, blink red to alert
                email2.style.backgroundColor = 'rgb(255, 123, 123)';
                setTimeout(function(){ email2.style.backgroundColor = 'rgb(244,243,246)'; }, 200);
            }
        });
    }

    /*>>> Common code (all pages) <<<*/
    
    //upon email submission, show snackbar
    const emailSubmit = document.getElementById('emailSubmit');
    const email = document.getElementById('email');
    emailSubmit.addEventListener('click', function() {
        if (email.value!="") {
            var s1 = document.getElementById("snackbar");
            s1.className = "show";
            //after 3 seconds, hide the snackbar
            setTimeout(function(){ s1.className = s1.className.replace("show", ""); }, 3000);
            email.value="";
        } else {
            //if submission is empty, blink red to alert
            email.style.backgroundColor = 'rgb(255, 123, 123)';
            setTimeout(function(){ email.style.backgroundColor = 'rgb(244,243,246)'; }, 200);
        }
    });
}

function draw() {
    clear();
    c.position(0,window.scrollY);
    
    /*>>> Page 1 - Home <<<*/

    if (page==1) {
        //show introduction
        if (onIntro) {
            if (!started) {
                document.body.style.cursor = 'none';
                fill(83,62,160);
                noStroke();
                ellipse(mouseX, mouseY, 200+random(-3,3));
            }
            //start animation once 'started' (switch has been clicked)
            else { 
                if (count>0) count--; else onIntro=false; //after animation, end 'onIntro'
                
                //flashing animation of first line of introduction
                if (count<60) {
                    const intro1 = document.getElementById('intro1');
                    intro1.style.backgroundColor = 'rgb(140,105,222)';

                    if (count>50 && count<55) {
                        intro1.style.backgroundColor = '';
                    }

                    if (count>45 && count<47) {
                        intro1.style.backgroundColor = '';
                    }
                }
                
                //flashing animation of third line of introduction
                if (count<15) {
                    const intro3 = document.getElementById('intro3');
                    intro3.style.backgroundColor = 'rgb(140,105,222)';

                    if (count>7 && count<12) {
                        intro3.style.backgroundColor = '';
                    }
                    //hide switch and lines
                    const switchBox = document.getElementsByClassName('switch');
                    switchBox[0].style.display = 'none';
                    const lines = document.getElementsByClassName('line');
                    for (let i=0; i<lines.length; i++) lines[i].style.display = 'none';
                } 
            }
        }
        //animation of content after 'onIntro' has ended
        else {
            //reveal "Latest Work:" and Airiva video
            const airivaText = document.getElementsByClassName('airivaText');
            airivaText[0].style.display = 'block';
            airivaText[0].style.animation = 'moveUp 5s forwards';
            const airiva = document.getElementById('airiva');
            airiva.style.display = 'block';
            airiva.style.animation = 'moveUp 5s forwards';

            if (windowWidth>1050) {
                //resizing and shifting of intro texts according to scroll
                const intro2 = document.getElementById('intro2');
                if (window.scrollY>99) {
                    scrolled = true;
                    intro1.style.animation = 'shiftIntro 3s forwards';
                    intro2.style.animation = 'shiftIntro2 3s forwards';
                    intro3.style.animation = 'shiftIntro 3s forwards';
                } else if (scrolled) {
                    intro1.style.animation = 'rshiftIntro 3s forwards';
                    intro2.style.animation = 'rshiftIntro2 3s forwards';
                    intro3.style.animation = 'rshiftIntro 3s forwards';
                    scrolled = false;
                }
                //reveal Airiva image
                if (window.scrollY>299) {
                    document.getElementsByClassName('airivaImg')[0].style.display = 'block';
                    document.getElementsByClassName('airivaImg')[0].style.animation = 'moveUp 5s forwards';
                }
                //reveal Airiva text
                if (window.scrollY>999) {
                    airivaText[1].style.display = 'block';
                    airivaText[1].style.animation = 'moveUp 5s forwards';
                }
            }
            else { //if window width <1050
                if (scrolled) {
                    //if window was resized after scroll, reverse the effect on intro texts upon scroll
                    intro1.style.animation = 'rshiftIntro 3s forwards';
                    intro2.style.animation = 'rshiftIntro2 3s forwards';
                    intro3.style.animation = 'rshiftIntro 3s forwards';
                }
                //reveal Airiva image
                if (window.scrollY>199) {
                    document.getElementsByClassName('airivaImg')[0].style.display = 'block';
                    document.getElementsByClassName('airivaImg')[0].style.animation = 'moveUp 5s forwards';
                }
                //reveal Airiva text
                if (window.scrollY>500) {
                    airivaText[1].style.display = 'block';
                    airivaText[1].style.animation = 'moveUp 5s forwards';
                }
            }
            footer.style.visibility = 'visible';
        }
    }

    /*>>> Page 2 - About <<<*/

    else if (page==2) {
        if (window.scrollY<1599) {
            //draw double down arrows to prompt scrolling 
            push();
            stroke(0,150,136);
            strokeWeight(2);
            noFill();
            beginShape();
            vertex(width/2-20, height-50+12);
            vertex(width/2, height-50+24);
            vertex(width/2+20, height-50+12);
            endShape();
            beginShape();
            vertex(width/2-20, height-50);
            vertex(width/2, height-50+12);
            vertex(width/2+20, height-50);
            endShape();
            fill(0,150,136);
            noStroke();
            text("keep scrolling",width/2,height-10);
            pop();
        }

        //animation of About cards (slide in and out on scroll down and up respectively)
        //animation is alternated (one card right, next card left)
        const abouts = document.getElementsByClassName('about');
        abouts[0].style.animation = 'moveRight 1s forwards';
        abouts[1].style.animation = 'moveLeft 1s forwards';
        if (window.scrollY>99) {
            abouts[2].style.animation = 'moveRight 1s forwards';
        } else abouts[2].style.animation = 'rmoveRight 1s forwards';
        if (window.scrollY>1099) {
            abouts[3].style.animation = 'moveLeft 1s forwards';
        } else abouts[3].style.animation = 'rmoveLeft 1s forwards';
        if (window.scrollY>1399) {
            abouts[4].style.animation = 'moveRight 1s forwards';
        } else abouts[4].style.animation = 'rmoveRight 1s forwards';
        if (window.scrollY>1599) { 
            abouts[5].style.animation = 'moveLeft 1s forwards';
        } else abouts[5].style.animation = 'rmoveLeft 1s forwards';
    }

    /*>>> Page 3 - Works <<<*/

    else if (page==3) {
        // 1. minivan
        const vanVideo = document.getElementById('vanVideo2');
        const vanVideo2 = document.getElementById('vanVideo');
        if (!started) {
            // pause video on load
            vanVideo.pause();
            vanVideo2.pause();
            // pause video on document scroll (stops autoplay once scroll started)
            window.onscroll = function(){
                vanVideo.currentTime = (window.scrollY/125)%3; //allow for control of video keyframe using scroll
                vanVideo.pause();
                vanVideo2.currentTime = (window.scrollY/400)%1; //allow for control of video keyframe using scroll
                vanVideo2.pause();
            };  
        }
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight); //resize canvas when window is resized
}