
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

var yellow = "#ffffa1"
var green = "#87ceeb"

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
    rect.setAttributeNS(null, 'x', 19 + x);
    rect.setAttributeNS(null, 'y', 20 + y);
    rect.setAttributeNS(null, 'height', 10);
    rect.setAttributeNS(null, 'width', 10);
    rect.setAttributeNS(null, 'fill', fill);
    rect.state = 0;
    canvas.appendChild(rect);
    return rect;
}

var cells = [];

// inititalize envrionment cells
for (var i = 0; i < 40; i++) {

    cells[i] = []

    for(var j = 0; j< 40; j++){

        var x = i*scale_w
        var y = j*scale_h

        var renv = Math.random()
        if(renv > 0.4){
            cells[i][j] = create_rect(x, y,yellow);
            cells[i][j].state = -1; //negative charge
        }
        else {
            cells[i][j] = create_rect(x,y,green);
            cells[i][j].state = 1;
        }

        cells[i][j].addEventListener("mouseover", function(e){
            this.state = this.state==1?-1:1;
            if( this.state == 1) this.setAttributeNS(null,"fill",green)
            else  this.setAttributeNS(null,"fill",yellow);
        });

        cells[i][j].setAttributeNS(null,"fill-opacity",0.9)
        cells[i][j].xpos = x
        cells[i][j].ypos = y

    }

    // cells[i].vx = -7 + Math.floor(Math.random()*15)
    // cells[i].vy = -7 + Math.floor(Math.random()*15)

}


var inner_boundary = [];
var outer_boundary = [];
var temp = []
var ext_temp = []

// inititalize cells

// var r = 40;

// for (var i = 0; i < 12; i++) {

//     var angle = i*Math.PI/6;

//     var x = pWidth/2 + Math.floor( r*Math.cos(angle) ); // to get it in units
//     var y = pHeight/2 + Math.floor( r*Math.sin(angle));

//     var rect = create_rect(x,y, 'white');
//     rect.addEventListener("mousedown", function(e){
//         this.state = 1;
//         this.setAttributeNS(null,"fill","red")
//     });
//     rect.xpos = x
//     rect.ypos = y
//     temp.push(0);
//     inner_boundary.push(rect);
// }

var r = 2.5;

for (var i = 0; i < 16; i++) {

    var angle = i*Math.PI/8;

    var x = scale_w*(20 + Math.floor( r*Math.cos(angle) )); // to get it in units
    var y = scale_h*(20 + Math.floor( r*Math.sin(angle) ));

        //pHeight/2 + Math.floor( r*Math.sin(angle));

    var rect = create_rect(x,y, 'black');
    rect.addEventListener("mousedown", function(e){
        this.state = 1;
        this.setAttributeNS(null,"fill","red")
        this.setAttributeNS(null,"fill-opacity",1); //back up

    });
    rect.xpos = x
    rect.ypos = y
    temp.push(0);
    inner_boundary.push(rect);
}



// r = 60;
// for (var i = 0; i < 12; i++) {

//     var angle = i*Math.PI/6;

//     var x = pWidth/2 + Math.floor( r*Math.cos(angle) ); // to get it in units
//     var y = pHeight/2 + Math.floor( r*Math.sin(angle));

//     var rect = create_rect(x,y, 'white');
//     rect.addEventListener("mousedown", function(e){
//         this.state = 1;
//         this.setAttributeNS(null,"fill","red")
//     });
//     rect.xpos = x
//     rect.ypos = y
//     ext_temp.push(0);
//     outer_boundary.push(rect);
// }


//display after every action
var display = js_clock(10, 400);

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
            //ext_temp[i] = ca_rule(outer_boundary[prev].state, outer_boundary[i].state, outer_boundary[next].state);
        }

        for(var i = 0; i<inner_boundary.length;i++){
            inner_boundary[i].state = temp[i];
            //outer_boundary[i].state = ext_temp[i];
        }


        // inititalize cells
        for (var i = 0; i < inner_boundary.length; i++) {

            if( inner_boundary[i].state == 1){
                inner_boundary[i].setAttributeNS(null,"fill","red")
                //inner_boundary[i].setAttributeNS(null,"fill-opacity",0.5)
            }
            else{
                //wall
                inner_boundary[i].setAttributeNS(null,"fill-opacity",1)
                inner_boundary[i].setAttributeNS(null,"fill","black")
            }

            // if( outer_boundary[i].state == 1){
            //     outer_boundary[i].setAttributeNS(null,"fill","red")
            // }
            // else{
            //     outer_boundary[i].setAttributeNS(null,"fill","white")
            // }

        }

        // console.log("CA => " + boundary.map(function(f){return f.state}).join("-"));

        for(i = 0; i< cells.length;i++){

            for( j=0; j< cells[i].length; j++){

                var neighbour = [];
                //edges
                if( i == 0 || i == cells.length-1 || j == 0 || j == cells[i].length-1 ){
                    //do not compute
                }
                else if( within_boundary(cells[i][j]) ){
                    //do not compute
                }
                else{
                    var sum = cells[i-1][j-1].state  + cells[i-1][j].state + cells[i-1][j+1].state + cells[i][j+1].state + cells[i+1][j+1].state + cells[i+1][j].state + cells[i+1][j-1].state + cells[i][j].state

                    if( sum >= 0){ //sorrounded by more than 4 possitive charges, positive
                        cells[i][j].state = 1;
                        cells[i][j].setAttributeNS(null,"fill",green)
                    }
                    else{
                        //negative charge
                        cells[i][j].state = -1;
                        cells[i][j].setAttributeNS(null,"fill",yellow)
                    }

                }

                if( onboundary(cells[i][j],inner_boundary)){

                    var sum = neighbours_sum(cells[i][j],inner_boundary);

                    //var sum = neighbours.reduce(function(a,b){return a+b});

                    if( sum >= 0){ //sorrounded by more than 4 possitive charges, positive
                        cells[i][j].state = 1;
                        cells[i][j].setAttributeNS(null,"fill",green)
                    }
                    else{
                        //negative charge
                        cells[i][j].state = -1;
                        cells[i][j].setAttributeNS(null,"fill",yellow)
                    }

                }

            }

        }

        // if( cells[i].xpos < 5) cells[i].vx = -cells[i].vx
        // if( cells[i].xpos > pWidth-5) cells[i].vx = -cells[i].vx
        // if ( cells[i].ypos < 10) cells[i].vy = -cells[i].vy
        // if ( cells[i].ypos > pHeight-10) cells[i].vy = -cells[i].vy

        // // interaction between cells - collide and move away with 75% speed
        // for( var j=0; j < cells.length; j++){
        //     if( j!=i){
        //         var euclid = Math.pow(cells[i].xpos - cells[j].xpos,2) + Math.pow(cells[i].ypos - cells[j].ypos,2)
        //         if( Math.sqrt(euclid) < 10){
        //             cells[i].vx = -cells[i].vx
        //             cells[i].vy = -cells[i].vy
        //             cells[j].vx = -cells[j].vx
        //             cells[j].vy = -cells[j].vy
        //         }
        //     }
        // }

        // // interaction between cells - and outer boundary
        // for( var j=0; j < outer_boundary.length; j++){

        //     var euclid = Math.pow(cells[i].xpos - outer_boundary[j].xpos,2) + Math.pow(cells[i].ypos - outer_boundary[j].ypos,2);
        //     if( Math.sqrt(euclid) < 18 && outer_boundary[j].state == 0){ //blocked
        //         cells[i].vx = -cells[i].vx
        //         cells[i].vy = -cells[i].vy
        //     }
        //     else{
        //         // pass through if inner boundary is also red

        //         for( var k=0; k < inner_boundary.length; k++){

        //             var euclid = Math.pow(cells[i].xpos - inner_boundary[k].xpos,2) + Math.pow(cells[i].ypos - inner_boundary[k].ypos,2);
        //             if( Math.sqrt(euclid) < 18 && inner_boundary[k].state == 0){ //blocked
        //                 cells[i].vx = -0.75*cells[i].vx //trapped inside
        //                 cells[i].vy = -0.75*cells[i].vy
        //             }
        //             else{
        //                 //let is pass in the samee direction

        //             }
        //         }

        //     }
        // }

        // cells[i].xpos = cells[i].xpos + cells[i].vx
        // cells[i].ypos = cells[i].ypos + cells[i].vy
        // cells[i].setAttribute('x', cells[i].xpos)
        // cells[i].setAttribute('y', cells[i].ypos)

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


function within_boundary(  cell ){

    if( cell.xpos > 17*scale_w  && cell.xpos < 23*scale_w &&  cell.ypos > 17*scale_h && cell.ypos < 23*scale_h  ){
        //console.log("within")
        return 1;

    }
    else{
        return 0;
    }

}

function onboundary(  cell, boundary ){

    var near_boundary = 0;
    for(var i = 0; i <boundary.length; i++){
        var cx = cell.xpos/scale_w
        var cy = cell.ypos/scale_h
        var bx = boundary[i].xpos/scale_w
        var by = boundary[i].ypos/scale_h

        if( (Math.abs( cx - bx ) <= 1 && Math.abs( cx - bx ) != 0) ||  (Math.abs( cy - by ) <= 1 && Math.abs( cy - by ) != 0) ){
            near_boundary = 1;
        }
    }
    return near_boundary;
}

function neighbours_sum ( cell, boundary ){


    var n_arr = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,0],[0,1],[1,-1],[1,0],[1,1]];
    var sum = 0;
    var pos = -1;

    for(var i =0; i<n_arr.length; i++){
        var bool_check = 0;
        for(var j=0; j<boundary.length; j++){

            var cx = cell.xpos/scale_w
            var cy = cell.ypos/scale_h
            var bx = boundary[j].xpos/scale_w
            var by = boundary[j].ypos/scale_h

            if( cx + n_arr[i][0] == bx && cy + n_arr[i][1] == by){
                bool_check = 1
                pos = j
                console.log("found nearest boundary for cell " + cx + "," + cy + " at " + bx + "," + by);
            }
        }
        if(bool_check == 1){
            sum += boundary[pos].state;
        }
    }
    return sum;

}


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
