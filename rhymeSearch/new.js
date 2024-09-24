const readline = require('readline'); //to get user input
const rl = readline.createInterface(process.stdin, process.stdout);
var fs = require('fs'); //to read text file
var array = fs.readFileSync('wordlist.txt').toString().split("\n");
//create arrays for each point value up to 7
var _2pts = [], _3pts = [], _4pts = [], _5pts = [], _6pts = [], _7pts = [];
var count = 0;

/* This function triggers the start of the Poetry Assistant */
function start() {
    console.log("<----- Poetry Assistant: Rhyme Tool ----->\t[Enter Q to Quit.]");
    getInput();
}

/* This function prompts user input - 'search word' only. */
function getInput()
{
    rl.question("Enter a word to find its rhymes:\t", (input) => {
        main(input);
    });
}

/* This function prompts user input - 'more results' and 'search word'. */
function getMore(prevInput)
{
    console.log("Did you find the perfect rhyme?\nEnter 'm' for more rhymes for ["+prevInput+"]!");
    rl.question("Else, enter another word:\t", (input) => {
        resume(input,prevInput);
    });
}


function main(input)
{
    var o_input = input; //to store original user input
    var output = [];
    
    // reset after a cycle, when user enters a new search word
    if (count!=0) {
        array = fs.readFileSync('wordlist.txt').toString().split("\n");
        _2pts.length = 0;
        _3pts.length = 0;
        _4pts.length = 0;
        _5pts.length = 0;
        _6pts.length = 0;
        _7pts.length = 0;
        count = 0;
    }

    //check if input is valid
    if (input.length<3) {
        console.log("\n\tPlease enter a word with at least 3 letters.\n");
        return getInput(); //return to user input prompt
    }
    else if (input=="Q") {
        console.log("\n\nTil next time!");
        return;
    }
    else input = reverseString(input);

    //reverse all words in array
    for (let i=0; i<array.length; i++) {
        array[i] = (reverseString(array[i]));
    }

    discardNotMatch(input); //remove all words in array with <2 end char matches
    
    shuffleArray(); //Durstenfeld shuffle algorithm
    
    var n = 2; //set initial round to 2 for _2pts
    deliverPoints(input,n); //shift words to their respective point-arrays

    //output first 20 results or all results, whichever lesser
    let m = 20;
    if (array.length<20) m = array.length;
    for (let i=0; i<m; i++) {
        output[i] = array[i];
        output[i] = reverseString(output[i]); //reverse words back to original form
    }

    console.log("\nHere are the best rhyme matches for ["+o_input+"]:");
    console.log(output);
    console.log(array.length,"total results\n");

    count++;

    if (array.length>20) {
        getMore(o_input); //allow user to get more results
    } else {
        getInput(); //prompt user to enter a new word
    }
}

function resume(input,prevInput) {
    var output = [];

    if (input!="m") {
        main(input);
    }
    else {
        let m = 20;
        if (array.length - (count*20) < 20)
            m = array.length - (count*20);

        for (let i=0; i<m; i++) {
            output[i] = array[count*20 + i];
            output[i] = reverseString(output[i]);
        }
        console.log("\nHere are more rhyme matches for ["+prevInput+"]:");
        console.log(output);
        console.log(array.length-(count*20)-m,"remaining results");

        if (m==20) {
            count++;
            getMore(prevInput);
        } else {
            console.log("There are no more matches for "+prevInput+".\n");
            getInput();
        }

    }
}

function reverseString(str) { //reverse word (e.g. "happy" -> "yppah")
    return str.split("").reverse().join(""); 
}

/* Randomize array in-place using Durstenfeld shuffle algorithm */
function shuffleArray() {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

/* This function discards all words that do not have minimally 2 character matches at the end.
This array reduction allows for quicker computation in later steps. */
function discardNotMatch(word) {

    let i = array.length-1;

    while (i>=0) {
        //if last two letters of the word do not match
        if (array[i][0]!=word.charAt(0) || array[i][1]!=word.charAt(1)) {
            array.splice(i,1); //remove the non-matching word
        }

        i--;
    }
}

/* This function awards every word <=7pts which has passed the discardNotMatch filter with points
in accordance to their number of consecutive character matches(to input) from the end.
This is done by storing them in the respective _#pts array and eliminating those stored
from further iterations. */
function deliverPoints(word,n) {

    let i = array.length-1;

    while (i>=0) {
        if (array[i].charAt(n)!=word.charAt(n)) 
        {
            if (n==2) _2pts.push(array[i]); //if 3rd char from the end do not match, award 2 points
            if (n==3) _3pts.push(array[i]); //else if 4th char from end do not match, award 3 points
            if (n==4) _4pts.push(array[i]);
            if (n==5) _5pts.push(array[i]);
            if (n==6) _6pts.push(array[i]);
            if (n==7) _7pts.push(array[i]);

            array.splice(i,1); //eliminate from main array after awarding   
        }

        i--;
    }

    if (n<7 && n<word.length) {
        n++;
        deliverPoints(word,n); //recursive function
    }
    else {
        //combine all arrays, arranged in descending order of points, eliminating the unawarded
        array.length = 0;
        array = _7pts.concat(_6pts,_5pts, _4pts, _3pts, _2pts);
        return; //terminate recursion
    }
}

console.log(start());