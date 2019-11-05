

// so far improving the asynchronicity of bittorio to make it responsive to the
// changes in adjacent elements at different temporal rates

import {js_clock} from "./clocks.js"


var svgns = "http://www.w3.org/2000/svg";
var canvas = document.getElementById( 'svgCanvas' );

var pWidth = canvas.clientWidth;
var pHeight = canvas.clientHeight;

console.log(pWidth + "  " + pHeight)

// 40 * 40 grid
var scale_w = Math.floor(pWidth/40);
var scale_h = Math.floor(pHeight/40);

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


//mapping from position to screen coordinates
//needs the svg context for height and width
function create_rect(x,y, fill){
    // Grid is 100 by 100
    var rect = document.createElementNS(svgns, 'rect');
    rect.setAttributeNS(null, 'x', 5 + x);
    rect.setAttributeNS(null, 'y', 20 + y);
    rect.setAttributeNS(null, 'height', 10);
    rect.setAttributeNS(null, 'width', 10);
    rect.setAttributeNS(null, 'fill', fill);
    rect.state = 0;
    canvas.appendChild(rect);
    return rect;
}



var inner_boundary = [];
var outer_boundary = [];
var temp = []
var ext_temp = []

// inititalize cells

var r = 40;

for (var i = 0; i < 12; i++) {

    var angle = i*Math.PI/6;

    var x = pWidth/2 + Math.floor( r*Math.cos(angle) ); // to get it in units
    var y = pHeight/2 + Math.floor( r*Math.sin(angle));

    var rect = create_rect(x,y, 'white');
    rect.addEventListener("mousedown", function(e){
        this.state = 1;
        this.setAttributeNS(null,"fill","red")
    });
    temp.push(0);
    inner_boundary.push(rect);
}

r = 60;
for (var i = 0; i < 12; i++) {

    var angle = i*Math.PI/6;

    var x = pWidth/2 + Math.floor( r*Math.cos(angle) ); // to get it in units
    var y = pHeight/2 + Math.floor( r*Math.sin(angle));

    var rect = create_rect(x,y, 'white');
    rect.addEventListener("mousedown", function(e){
        this.state = 1;
        this.setAttributeNS(null,"fill","red")
    });
    ext_temp.push(0);
    outer_boundary.push(rect);
}


var cells = [];

// inititalize envrionment cells
for (var i = 0; i < 40; i++) {

    var x = Math.random()*pWidth
    var y = Math.random()*pHeight

    var renv = Math.random()
    if(renv > 0.4){
        cells[i] = create_rect(x, y,'yellow');
    }
    else {
        cells[i] = create_rect(x,y,'green');
    }

    cells[i].vx = -5 + Math.floor(Math.random()*10)
    cells[i].vy = -5 + Math.floor(Math.random()*10)
    cells[i].xpos = x
    cells[i].ypos = y
}



//display after every action
var display = js_clock(10, 60);


//runs simulation of cellular autonmaton
var drawLoop = function(){

    var now = Date.now();

    //displays every 125,ms
    display(now, function(){

        for (var i = 0; i < inner_boundary.length; i++) {

            if( i == 0){
                var prev = inner_boundary.length-1
                var next = 1;
            }
            else if( i == inner_boundary.length-1){
                var next = 0
                var prev = inner_boundary.length-2
            }
            else {
                var next = i + 1
                var prev = i - 1
            }

            temp[i] = ca_rule(inner_boundary[prev].state, inner_boundary[i].state, inner_boundary[next].state);
            ext_temp[i] = ca_rule(outer_boundary[prev].state, outer_boundary[i].state, outer_boundary[next].state);
        }

        for(var i = 0; i<inner_boundary.length;i++){
            inner_boundary[i].state = temp[i];
            outer_boundary[i].state = ext_temp[i];
        }


        // inititalize cells
        for (var i = 0; i < inner_boundary.length; i++) {

            if( inner_boundary[i].state == 1){
                inner_boundary[i].setAttributeNS(null,"fill","red")
            }
            else{
                inner_boundary[i].setAttributeNS(null,"fill","white")
            }

            if( outer_boundary[i].state == 1){
                outer_boundary[i].setAttributeNS(null,"fill","red")
            }
            else{
                outer_boundary[i].setAttributeNS(null,"fill","white")
            }

        }

        // console.log("CA => " + boundary.map(function(f){return f.state}).join("-"));

        for(i = 0; i<cells.length;i++){

            if( cells[i].xpos < 5) cells[i].vx = -cells[i].vx
            if( cells[i].xpos > pWidth-5) cells[i].vx = -cells[i].vx
            if ( cells[i].ypos < 10) cells[i].vy = -cells[i].vy
            if ( cells[i].ypos > pHeight-10) cells[i].vy = -cells[i].vy

            cells[i].xpos = cells[i].xpos + cells[i].vx
            cells[i].ypos = cells[i].ypos + cells[i].vy
            cells[i].setAttribute('x', cells[i].xpos)
            cells[i].setAttribute('y', cells[i].ypos)
        }

    })();

    rafId = requestAnimationFrame(drawLoop);
};


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





// the cellular automaton rules that each object uses to compute
// their states.
function ca_rule (prev, cur, next){

    var rule = document.getElementById('carulebinary').value;
    rule = rule.split("");
    rule = rule.map(function(r){ return parseInt(r);});

    //console.log("carule is" + rule);

    var castate = prev + "" +  cur + ""+ next;
    //console.log(castate);
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
