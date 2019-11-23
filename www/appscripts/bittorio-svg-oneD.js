

// Lite version of ion channels with 3 charges, membrane column, and ion
// exchange.

import {js_clock} from "./clocks.js"
import {create_rect_fn,create_path_fn} from "./utils.js"
import {create_cell, on_boundary} from "./cell_spec_lite.js"


var n = 20;
var side = 16;

var gridn = 5

var canvas = document.getElementById( 'svgCanvas' );
var pW = canvas.clientWidth;
var pH = canvas.clientHeight;


var starting_config = [];

// max 5 steps for now.
var backward_computation = []; //stores the state of CA, and state of perturbing environment.

var pWidth = pW - pW%n
var pHeight = pH - pH%n

var t = 0; //as time

console.log(pWidth + "  " + pHeight);

// 40 * 40 grid
var scale_w = Math.floor(pWidth/n);
var scale_h = Math.floor(pHeight/n);

var create_rect = create_rect_fn(scale_w, scale_h, canvas);
var create_path = create_path_fn(scale_w, scale_h, canvas);

create_path( "M0" + " " + (gridn*scale_h) + " L" + pWidth + " " + gridn*scale_h + " L" + pWidth + " " + (gridn*scale_h + side+5) + " L" + 0 + " " + (gridn*scale_h + side + 5), "#ff0000" )

var rafId = null;

//cells[i][j].rect = create_rect(i,j,side, side, "#ffffff");

var cells = [];

// inititalize envrionment cells
for (var i = 0; i < n; i++) {

    cells[i] = []
    for(var j = 0; j< n; j++){

        cells[i][j] = {}

            cells[i][j].rect = create_rect(i,j,side, side, "#ffffff");
            cells[i][j].state = 0;
    }
}


for( col = 0; col< n; col++){

    if( Math.random() < 0.1){
        cells[col][0].state = 1;
    }
    else{
        cells[col][0].state = 0;
    }
    setColor(cells[col][0]);
    starting_config[col] = cells[col][0].state;
}


var boundary = [];

var row = gridn;

for (var col = 0; col < n; col++) {

    boundary[col] = {}
    boundary[col].rect = create_rect(col, row, side, side, "#ffffff");
    boundary[col].state = 0;

}

// row = gridn + 1;
// // inititalize envrionment cells
// for (var i = 0; i < n; i++) {

//     cells[i] = []
//     for(var j = gridn+1; j< n; j++){

//         cells[i][j] = {}

//         if( boundary[i].state == 1){
//             cells[i][j].rect = create_rect(i,j,side, side, "#ffffff");
//             cells[i][j].state = 1;
//         }
//         else{
//             cells[i][j].rect = create_rect(i,j,side, side, "#000000");
//             cells[i][j].state = 0;
//         }
//     }
// }


//display after every action
var display = js_clock(40, 500);
var sense = js_clock(20, 250);

//console.log(cells)

//runs simulation of cellular autonmaton
var drawLoop = function(){

    var now = Date.now();

    sense(now, function(){

        for (var bcell = 0; bcell < n; bcell++) {

            //console.log(gridn-1)

            //1. sense and indicate perturbation - before acting
            if ( boundary[bcell].state != cells[bcell][gridn-1].state){
                console.log("perturbation")
                //boundary[bcell].state = cells[bcell][gridn-1].state
                boundary[bcell].rect.setAttributeNS(null,"fill","red")
            }
            else{
                //no change
            }
        }


    })();

    //displays every 250 ms
    display(now, function(){


        //save state
        if( backward_computation.length >= 10){
            backward_computation.shift();
        }
        else{
            var env = [];
            row = gridn-1;
            for(col = 0; col < n; col++){
                env[col] = cells[col][row].state;
            }

            var last_ca = [];
            row = n-1;
            for(col = 0; col < n; col++){
                last_ca[col] = cells[col][row].state;
            }

            backward_computation.push({ "ca":  boundary.map(function(f){return f.state}),
                                        "env": env,
                                        "last_ca": last_ca
                                      });
        }

        //1. fall off the edge
        row = n;
        // inititalize envrionment cells
        for (var i = 0; i < n; i++) {

            for(var j = n-1; j> gridn+1; j--){

                cells[i][j].state = cells[i][j-1].state;
                setColor(cells[i][j]);
            }
        }

        // 2. copy current state into next state.
        for (var i = 0; i < n; i++) {
            cells[i][gridn+1].state = boundary[i].state;
            setColor(cells[i][gridn+1]);
        }

        //3. copy perturbation
        for (var col = 0; col < n; col++) {
            boundary[col].state = cells[col][gridn-1].state;
        }

        //4. compute next state;
        for (var bcell = 0; bcell < boundary.length; bcell++) {

            var prev = bcell -1, next = bcell + 1;

            if( prev < 0 ){
                prev  = n - 1
            }

            if( next == n ){
                next = 0;
            }

            boundary[bcell].state = next_state( boundary[prev].state, boundary[bcell].state, boundary[next].state, document.getElementById("carulebinary").value);

            setColor(boundary[bcell]);
        }


        //5. shift existing environment
        row = gridn-1;
        // inititalize envrionment cells
        for (var i = 0; i < n; i++) {

            for(var j = row; j> 0; j--){
                cells[i][j].state = cells[i][j-1].state;
                setColor(cells[i][j])
            }
        }


        //6. initaite new environment
        for(var i = 0; i< n; i++){

            if( Math.random() < 0.05){
                cells[i][0].state = 1;
            }
            else{
                cells[i][0].state = 0;
            }
            setColor(cells[i][0])
        }

        //continue

    })();

    rafId = requestAnimationFrame(drawLoop);

}



function next_state (prev, cur, next, ruleString){

    var rule = ruleString.split("");
    rule = rule.map(function(r){ return parseInt(r);});

    //console.log("carule is" + rule);

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

    console.log("CA state" )
    console.log("next state is " + ret);

    return ret;
}

window.addEventListener("keypress", function(c){

    //need to have a state that prevents too quick key presses/holding

	  //console.log("char code" + c.keyCode + "timestamp" + c.timeStamp)

    if( c.keyCode == 115){
        drawLoop();
    }
    else if( c.keyCode == 114){
	      cancelAnimationFrame(rafId);
				rafId = null;
    }
});


document.getElementById("reset").addEventListener("click",function(e){

    starting_config.map(function(s,ind,arr){

        cells[ind][0].state = s;
        setColor(cells[ind][0])
    });

    for( row = 1; row < gridn; row++){
        for(col = 0; col <n; col++){
            cells[col][row].state = 0;
            setColor(cells[col][row]);
        }
    }

});

document.getElementById("stop").addEventListener("click",function(e){

    cancelAnimationFrame(rafId);
		rafId = null;
});

document.getElementById("start").addEventListener("click",function(e){
    drawLoop();
});


document.getElementById("randomConfig").addEventListener("click",function(e){

    //later control proportion of white and black
    //generate new random sequence
    for(var i = 0; i< n; i++){

        if( Math.random() < 0.8){
            cells[i][0].state = 1;
        }
        else{
            cells[i][0].state = 0;
        }
        setColor(cells[i][0])
    }

});

document.getElementById("back").addEventListener("click", function(e){

    if( backward_computation.length == 0){
        //do not pop
    }
    else{

        var last_state = backward_computation.pop();

        console.log(last_state);

        for(var col = 0 ; col < n; col++){
            boundary[col].state = last_state.ca[col];
            setColor( boundary[col]);
        }

        for( row = 0; row < gridn-1; row++){
            for(col=0; col < n; col++){
                cells[col][row].state = cells[col][row+1].state
                setColor(cells[col][row]);
            }
        }

        for(var col = 0 ; col < n; col++){
            cells[col][gridn-1].state = last_state.env[col];
            setColor( cells[col][gridn-1]);
        }

        for( row = gridn+1; row < n-1; row++){
            for(col=0; col < n; col++){
                cells[col][row].state = cells[col][row+1].state
                setColor(cells[col][row]);
            }
        }

        row = n-1;
        for(col=0; col < n; col++){
            cells[col][row].state = last_state.last_ca[col];
            setColor(cells[col][row]);
        }


        for (var col = 0; col < boundary.length; col++) {

            var prev = col -1, next = col + 1;

            if( prev < 0 ){
                prev  = n - 1
            }

            if( next == n ){
                next = 0;
            }

            cells[col][gridn+1].state = next_state( boundary[prev].state, boundary[col].state, boundary[next].state, document.getElementById("carulebinary").value);
            setColor(cells[col][gridn+1]);
        }

        for (var bcell = 0; bcell < n; bcell++) {

            //sense perturbation
            if ( boundary[bcell].state != cells[bcell][gridn-1].state){
                boundary[bcell].rect.setAttributeNS(null,"fill","red")
            }
            else{
                //no change
            }
        }


    }


});



function setColor( cell ){

    if(cell.state == 1){
        cell.rect.setAttributeNS(null,"fill","#000000")
    }
    else{
        cell.rect.setAttributeNS(null,"fill","#ffffff")
    }
}
