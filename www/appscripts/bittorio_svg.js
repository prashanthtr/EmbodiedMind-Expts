
// so far improving the asynchronicity of bittorio to make it responsive to the
// changes in adjacent elements at different temporal rates


import {js_clock} from "./clocks.js"

// reimplementation of bittorio with new html conventions, and svg

//introductory text
document.getElementById('userGuide').innerHTML = "<p>This is an app for exploring operational closure and structural coupling in a 1D cellular automaton (CA) CA states:</p>" ;

document.getElementById('userGuide').innerHTML += "<ol> <li>The first (top) row is the initial configuration of the CA.</li> <li>Each subsequent row is the state of the CA in a subsequent time-step</li> <li>Future states can be grey, black, or white. Cells that are black or white are treated as 'perturbations' that are 'external' to the CA.</li> </ol>"

document.getElementById('userGuide').innerHTML += "<p>CA rules:</p> <ol> <li>Usually, the state of a cell is computed based on its state and the state of its immediate neighbors during the previous time-step</li> <li>If, however, a cell encounters a “perturbation”, that cell is replaced by the state of the perturbing cell.</li> </ol>";

document.getElementById('userGuide').innerHTML += "<p>User actions:</p> <ol> <li>Initial configuration: user can click the cells on or off or drag (click and move) the mouse over them. </li> <li>Rules: user can enter a particular rule (in binary or decimal) or select certain rules from the pull-down menu. Note: the rules in the pull-down menu result in specific kinds of interesting structural coupling (eg, “odd sequence recognizer”)</li> <li>Perturbations: user can create perturbations by clicking cells on or off (or) dragging (click and move) over them.</li> </ol>";

console.log("Yo, I am alive!");
// Grab the div where we will put our Raphael paper

var svgns = "http://www.w3.org/2000/svg";
var canvas = document.getElementById( 'svgCanvas' );

var pWidth = canvas.clientWidth;
var pHeight = canvas.clientHeight;

var rafId = null;


var scale = 0.9*Math.min(pWidth, pHeight);
var pi = Math.PI;

var store_src = [];

var rect = document.createElementNS(svgns, 'rect');
rect.setAttributeNS(null, 'x', 0);
rect.setAttributeNS(null, 'y', 0);
rect.setAttributeNS(null, 'height', pHeight);
rect.setAttributeNS(null, 'width', pWidth);
rect.setAttributeNS(null, 'fill', '#000000');
canvas.appendChild(rect);

var mouseDownState = 0;


// function creaates the boundary elements of the cell wall with

// what would it mean to do this computation without a global array.

// things firing at same time?

// Each cell is a clock phasor trigger sense and act cycles every time unit
// it has three sensing devices that checks for input from various cells - and environment

// then, it has an action cycle in which it triggers an action - either
// demonstrated as computing the next state, and visually indicating it.

function createBoundaryEl(n, N){

    var cell = {}
    cell.state = 0; // on or off (0 or 1)
    cell.color = "black" //off

    cell.next_cell = (n+1)%n; //sensors for adjacent cells
    cell.prev_cell = n-1<0?(N-1):n-1;
    cell.number = n;

    cell.listen = js_clock(30, 125);//listen updates that fast, all sensors have
                                   //equal speed of information gathering
    cell.act = js_clock(30, 500); //500 is a parameter to be controlled

    // cell is listening only in some phases in its listen-action cycle
    cell.listen_counter = 0;
    cell.set_early = 0; //setting the listener value earluer than it is registereedf
    cell.wait_to_set = 0;
    cell.set_early_obj= "0";

    //three sequences
    cell.next_cell_state = 0
    cell.prev_cell_state = 0
    cell.env_cell_state = 0

    //incoming event can be an update from nearby cells, and from the environment
    // either  of these affect the computation of the new state

    cell.incoming_event = false;

    cell.compute_next_state = function (now){

        cell.listen(now, function(cell){

            //time just after the threshold interval for listening was passed checks
            //if there was an event before the threshold was crossed or even within
            //the threshold window the mouse was pushed

            // there could be case where it was updated but not played, so listen
            // should have a higher window of delay compared to play?

            // At the onset of the beat, the counter checks if there the key has
            // been pressed before the onset. If a key is pressed, then
            // set_early is 1. This is used to set the note at the correct beat
            // position.
            if(cell.listen_counter % 1 == 0 ){

                //no change
                //notePressed = false;
                if( cell.set_early == 1){

                    cell.next_cell_state = cell.sense_next_cell();
                    cell.prev_cell_state = cell.sense_prev_cell();
                    cell.state = cell.sense_env_state();

                    //three sensors updating

                    cell.set_early = 0;
                    cell.last_note_set = 1;
                }
                else{

                    //if the hit was not played by the onset, there is still a
                    //chance that it might be played after the onset. We are
                    //allowing for a small window where musician plays the hit
                    //slightly after the onset. This is stored in wait-to-set.
                    //When wait-to-set is 1, the system is still waiting to
                    //register the hit that will occurr immediately.
                    cell.wait_to_set = 1;
                }

                //initialize  early object to 0
                //console.log("setting " + set_early_obj + " at " + beats);
                //userInput = utils.setCharAt(userInput, ind, set_early_obj);
            }
            else if( cell.listen_counter % 1 == 0.25){ // phase 1

                //The system is in the first phase after the onset. A new event
                //may occur due to a mistitming just after the onset.

                //A new event has not occurred, and the system no longer
                //needs to wait for a new event. So wait-to-set is set to 0
                //anyway
                //wait_to_set = 0;
                if( cell.incoming_event == true && cell.wait_to_set == 1){
                    //A new event occurs just after the onset.
                    // create the object that was just registered in the press

                    cell.next_cell_state = cell.sense_next_cell();
                    cell.prev_cell_state = cell.sense_prev_cell();
                    cell.state = cell.sense_env_state();

                    cell.incoming_event = false;
                    cell.wait_to_set = 0;
                    cell.last_note_set = 1;
                }
                else{
                    //no longer wait for a new note
                    cell.wait_to_set = 0;
                }

            }
            else if(cell.listen_counter % 1 == 0.5 ){
                //nothing happens for now
                if( cell.last_note_set == 1){
                    // last note has already been set with early events or a late event
                }
                else{
                    cell.next_cell_state = cell.sense_next_cell();
                    cell.prev_cell_state = cell.sense_prev_cell();
                    cell.state = cell.sense_env_state();
                }
                cell.last_note_set = 0;

                //now is a good time to log the last beat as no new events can change the past
                //console.log("pressed");
            }
            else{ // if listen counter is >= 0.75
                //we are in the third phase in which the user may play a note
                //earlier than it has to be sounded.
                if( cell.set_early == 1){

                    // The user has already played the hit in the previous phase
                    //period and set the note to 1. No action needs to be taken
                    //now. do nothing

                }
                else{
                    // The userpresses the hit in the third phase. This hit is
                    // meant to be sounded at the onset of the next beat, but
                    // due to timing issues, user presses it slightly before.
                    if( cell.incoming_event == true && cell.set_early == 0){

                        //set eearly oibject is a note hit
                        //set_early_obj = createControlledSoundObj({event_yes: 1, type: event_type, velocity: 0.5});
                        //set_early_obj = "1";
                        //userInput = utils.setCharAt(userInput, ind, "1");
                        cell.set_early = 1;
                        cell.incoming_event = false; //in this way even if a new note is pressed simultaneously, it wont be registered if it is in a small succession
                    }
                    else{

                        //set early obj is silence
                        // this could mean that the user
                        // has not yet played a note in this phase.
                        cell.set_early_obj = 0;
                        //userInput = utils.setCharAt(userInput, ind, "0");
                    }
                    //no change to ind
                    //update the stored source

                }
            }

            //console.log("pushed")
            //and keyboard is pushed or not pushed now?
            //lookback time of 50 seconds
            //giving a huge window
            //last_event > time - 1000/4 + 50 &&  last_event < time &

            cell.listen_counter+= 0.25;


        })(cell);


        cell.act(now, function(cell){

            console.log("play")

            let state_self = cell.sense_self_state();
            let state_next = cell.sense_next_state();
            let state_prev = cell.sense_prev_state();

            this.state = ca_rule(); //ca_rule that determines next state

            // at the end of play functin, the beat is completley over
            // play is called at the end of all the cycles of the beat
            cell.listen_counter = 0;

        })(cell);

        rafId = requestAnimationFrame(cell.compute_next_state);
    }
}


//runs simulation of cellular autonmaton
var drawLoop = function(){};


window.addEventListener("keypress", function(c){

	  console.log("char code" + c.keyCode)

    if( c.keyCode == 115){
        drawLoop();
    }

		if( c.keyCode == 114){
	      cancelAnimationFrame(rafId);
				rafId = null;
	  }




    // the cellular automaton rules that each object uses to compute
    // their states.
    function ca_rule (prev, cur, next){

        var rule = document.getElementById('carulebinary').value;
        rule = rule.split("");
        rule = rule.map(function(r){ return parseInt(r);});

        console.log("carule is" + rule);

        var castate = prev + "" +  cur + ""+ next;
        console.log(castate);
        //ca rule
        var ret = -1;
        switch(castate){
        case "000": ret = rule[0]; break;
        case "001": ret = rule[1];  break;
        case "010": ret = rule[2];  break;
        case "011": ret = rule[3];  break;
        case "100": ret = rule[4]; break;
        case "101": ret = rule[5];  break;
        case "110": ret = rule[6];  break;
        case "111": ret = rule[7];  break;
        default: ret = -1; break;
        };
        return ret;
    }

    // what rule should it select so that it maintains operational closure? 256
    // rules

    // Can it always find atleast 1 rule that allows it to maintain operational
    // closure in an environment.

    // computation: search 256 rules to find out which rules produce viable next
    // states?

    // which rules produce non-steady states over next few iterations? (16 iterations)

    // which rules produce environmentally adaptive states over next few
    // iterations? (16 iterations)

    // which rules produce cominbation of environmentally adaptive and
    // non-steady state over next 16 iterations

    // simulated resting and changing behavior - either in terms of no
    // action/no change

    //



//         paper.raphael.mousedown(function(){
//             //mouseDownState = 1;
//         });

//         paper.raphael.mouseup( function(){
//             console.log("reset because of this function");
//             mouseDownState = 0;
//         });

//         console.log(paper.canvas)

//         // put the width and heigth of the canvas into variables for our own convenience
//         var pWidth = paper.canvas.width;
//         var pHeight = paper.canvas.height;


//         console.log("pWidth is " + pWidth + ", and pHeight is " + pHeight);

//         var colLength = 40, rowLength = 80; //len-1 time units are displayed
//         var xLen = 0.9*pWidth/colLength, yLen = 0.9*pWidth/colLength, size= pWidth/colLength;

//         var xOffset = 1, yOffset = 1;
//         //24,12

//         console.log("rectangle is " + pWidth + ", " + rowLength*yLen);

//         paper.setSize(pWidth, rowLength*yLen);
//         // Just create a nice black background
//         var bgRect = paper.rect(0,0,pWidth, rowLength*yLen);
//         bgRect.attr({"fill": "black"});
//         bgRect.attr({"stroke-opacity": "0"});

//         function arrCmp(arr, obj){
//             var i = 0, len = arr.length;
//             for(i=0; i < len;i++){
//                 if( arr[i].toString() == obj.toString()){
//                     return 1;
//                 }
//             }
//             return -1;
//         }

//         var cnt = 0;
//         var timer = 1;

//         // thiknk about the clamps later

//         // the cellular automaton rules that each object uses to compute
//         // their states.
//         function caRules (prev, cur, next){

//             var rule = document.getElementById('carulebinary').value;
//             rule = rule.split("");
//             rule = rule.map(function(r){ return parseInt(r);});

//             console.log("carule is" + rule);

//             var castate = prev + "" +  cur + ""+ next;
//             console.log(castate);
//             //ca rule
//             var ret = -1;
//             switch(castate){
//             case "000": ret = rule[0]; break;
//             case "001": ret = rule[1];  break;
//             case "010": ret = rule[2];  break;
//             case "011": ret = rule[3];  break;
//             case "100": ret = rule[4]; break;
//             case "101": ret = rule[5];  break;
//             case "110": ret = rule[6];  break;
//             case "111": ret = rule[7];  break;
//             default: ret = -1; break;
//             };
//             return ret;
//         }

//         //x,y, - positions, side - of the square
//         function bitObject(x,y,s,timeOccur){

//             var obj = paper.rect(x*xLen,y*yLen,s,s);
//             obj.attr({"stroke-opacity": 0.2, "stroke-width": 1});

//             obj.type = "link";
//             obj.state = -1;
//             //calculates the state of an object using internal relation
//             //between ca cells
//             obj.updateState = caRules;

//             obj.changeColor = function(){

//                 if(this.state == -1){
//                     this.attr({"fill": "grey"});
//                 }
//                 else if(this.state == 0){
//                     this.attr({"fill": "white"});
//                 }
//                 else{
//                     this.attr({"fill": "black"});
//                 }
//             }

//             obj.changeColor();

//             obj.mousedown(function(){
//                 console.log("console" + mouseDownState);
//                 mouseDownState = 1;
//                 this.state = (this.state + 1)%2; //obj = (obj.state + 1)%2;
//                 this.changeColor();
//             });

//             obj.mouseup(function(){
//                 mouseDownState = 0;
//             });



//             //toggle state
//             obj.hover(function(){
//                 if( mouseDownState == 1){
//                     console.log("added click" + this.state);
//                     this.state = (this.state + 1)%2; //obj = (obj.state + 1)%2;
//                     this.changeColor();
//                 }

//             });

//             return obj;
//         }

//         //bittorio display on which display happens
//         var bittorio = [];
//         var row = 0, col = 0;

//         // top most row is the initialization row
//         // this has to be initialized and cannot changed afterwards
//         for(row = 0; row < rowLength; row++){
//             bittorio[row] = [];
//             for(col=0; col< colLength; col++){
//                 bittorio[row][col] = new bitObject(col+xOffset,row+yOffset,size,row);
//                 //bittorio[row][col].changeColor();
//             }
//         }

//         function init(){
//             row = 0;
//             for(col=0; col< colLength; col++){
//                 bittorio[row][col] = new bitObject(col+xOffset,row+yOffset,size,row);
//                 bittorio[row][col].state = 0;
//                 bittorio[row][col].changeColor();
//             }
//         }

//         function randomInit(){
//             reset();
//             row = 0;
//             for(col=0; col< colLength; col++){
//                 bittorio[row][col].state = Math.floor( 0.4 + Math.random());
//                 bittorio[row][col].changeColor();
//             }
//             //also sets the value of the corresponding decimal number
//             document.getElementById('configNum').value  = findInitConfigVal();
//         }

//         document.getElementById('randomConfig').onclick = randomInit;


//         function reset(){

//             for(row = 1; row < rowLength; row++){
//                 for(col=0; col< colLength; col++){
//                     bittorio[row][col].state = -1;
//                     bittorio[row][col].changeColor();
//                 }
//             }

//             row = 0;
//             for(col=0; col< colLength; col++){
//                 bittorio[row][col].state = 0;
//                 bittorio[row][col].changeColor();
//             }

//             timer = 1;
//         }


//         init();

//         // //looks ahead to update the current slide based on the perturbation
//         // function lookahead (cur, next){

//         //     var newArr = next.map( function (el,ind,arr){

//         //         if( el.state != -1){
//         //             cur = el.state;
//         //             obj.changeColor();
//         //         }
//         //     });
//         // }

//         //entering the function once, it updates the state of the
//         //bittorio and stores in the new bittorio row.
//         function caUpdate(){

//             // this whole update happes at timer-1 always
//             var arr = bittorio[timer-1];
//             var ind = 0;

//             while( ind < arr.length ){

//                 var el = bittorio[timer-1][ind];
//                 var nextCell = bittorio[timer][ind];

//                 // // as opposed to the CA encountering the accepted state,
//                 // // changing its current state (with no time lag), and
//                 // // using the changed states to generate new state

//                 if( nextCell.state != -1){
//                     console.log("perturb");
//                     // then the cell is a perturbation that has to be carried over

//                     // once carried, the carryover has to show
//                     el.state = nextCell.state;
//                     el.changeColor();
//                     //nextCell.state = -1;
//                     //nextCell.changeColor();
//                 }

//                 ind++;
//             }

//             //now, change happens at the timer
//             bittorio[timer].map( function (el,ind,arr){
//                 var prevCell =  bittorio[timer-1];
//                 //three values
//                 var prev =-1, next=-1, cur = -1;
//                 if( ind - 1 < 0){
//                     prev = prevCell[arr.length-1].state; //turn around
//                 }
//                 else {
//                     prev = prevCell[ Math.abs(ind-1)%arr.length].state; //turn around
//                 }
//                 next = prevCell[ Math.abs(ind+1)%arr.length].state;
//                 cur = prevCell[ind].state;
//                 el.state = el.updateState(prev,cur,next);
//                 el.changeColor();
//             });

//             //increment timer
//             console.log(timer);
//             timer++;
//         }

//         //converts to binary of suitable,length
//         function convert2Binary (num, len){

//             var str = "";
//             var rem = 0;

//             while( num > 1 ){
//                 rem = num % 2;
//                 str += rem;
//                 num = parseInt(num/2);
//             }
//             if( num == 0){
//                 str+=0;
//             }
//             else str+=1;

//             var i = str.length;
//             while( i < len ){
//                 str+=0;
//                 i++;
//             }

//             str = str.split("").reverse().join("");
//             return str;
//         }

//         function convert2Decimal( binArr ){

//             var sum = 0;
//             var i = binArr.length;
//             while( i -- ){
//                 sum+= binArr[i]*Math.pow(2, binArr.length-i-1);
//             }
//             return sum;
//         }

//         document.getElementById('configFix').onclick = function (){

//             //convert to binary
//             var num = parseInt(document.getElementById('configNum').value);
//             var str = convert2Binary (num, colLength);
//             str = str.split(""); //has to be an array

//             row = 0;
//             for(col=0; col< colLength; col++){
//                 bittorio[row][col] = new bitObject(col+xOffset,row+yOffset,size,row);
//                 bittorio[row][col].state = parseInt(str[col]);
//                 bittorio[row][col].changeColor();
//             }
//         };

//         document.getElementById('carule').onchange = function (){

//             //convert to binary
//             var num = parseInt(document.getElementById('carule').value);
//             var str = convert2Binary (num, 8);
//             document.getElementById('carulebinary').value = str;
//         };

//         function findInitConfigVal(){
//             row = 0;
//             var arr = [];
//             for(col=0; col< colLength; col++){
//                 arr[col] = bittorio[row][col].state;
//             }
//             return convert2Decimal(arr);
//         }

//         //current timer - or the now row
//         var run = null;
//         document.getElementById('start').addEventListener("click", function(){
//             console.log("here after reset");
//             document.getElementById('configNum').value  = findInitConfigVal();
//             if(run == null){
//                 run = setInterval(request , parseFloat(document.getElementById("loopTime").value)); // start setInterval as "run";
//             }
//         },true);


//         document.getElementById('stop').addEventListener("click", function(){
//             if(run != null){
//                 clearInterval(run); // stop the setInterval()
//                 run = null;
//             }
//         },true);

//         document.getElementById('reset').addEventListener("click", function(){
//             if(run != null){
//                 clearInterval(run); // stop the setInterval()
//             }
//             run = null;
//             reset();
//         },true);



//         function request() {
//             //console.log(); // firebug or chrome log

//             if(timer > rowLength-1){
//                 clearInterval(run); // stop the setInterval()
//             }
//             else{
//                 clearInterval(run); // stop the setInterval()
//                 caUpdate();
//                 run = setInterval(request, parseFloat(document.getElementById("loopTime").value)); // start the setInterval()
//             }
//         }

// });
