

// in order to mdoel the cellular homeostasis, the rules of the should
// incorporate the distribution of the charges of the neighbouring cells. This
// is a difference from original bittorio.

// A CA-rule then is a combination of charges/values of the adjacent cells,
// charges of the adjacent ions, much like the rule of a cell in the game of
// life. The interpretation though is matter of Ionic channel - that is, red
// cells mean, open chanels, and black cells mean closed channels.

// The representation of the CA rule in terms of charges/charge values is
// important so it is possible to describe the homeostatic behavior of the cell
// in terms of the conservation of ion charge inside the cell. - maintaining a
// membrane potential.

// Another way is to consider the cells as perturbartions - green cells as
// perturbations, and yellow as non-perturbations. Again, this feels a little
// bit arbitrary (and a desgigner choice).

// This allows us to observe one important aspect of this system (have to name
// it) - the ability to alter the envrionment thorugh action coupling. This is
// an ability that is observed in the game of life simulations but also often
// resulted in the destruction of the glider/other entities. Here, it is an
// example, in which the cell maintains operational closure, but affects
// envrionment through interaction based on changes in alterations in membrane
// potential. This is far more accurate model of the cell.

//// Now we can explore whether different cells will be able to form mutually
//// influencing perturbations in a same environment.

// computational science -

import {js_clock} from "./clocks.js"

var svgns = "http://www.w3.org/2000/svg";
var canvas = document.getElementById( 'svgCanvas' );

var pW = canvas.clientWidth;
var pH = canvas.clientHeight;

var n = 20;
var side = 16;

var positive = 1;
var negative = -1;
var b_charge = +1;
var neutral = 0;

var pWidth = pW - pW%n
var pHeight = pH - pH%n

console.log(pWidth + "  " + pHeight);

// 40 * 40 grid
var scale_w = Math.floor(pWidth/n);
var scale_h = Math.floor(pHeight/n);

var rafId = null;

var yellow = "#ffffa1"
var green = "#98ee90"

var scale = 0.9*Math.min(pWidth, pHeight);
var pi = Math.PI;

var store_src = [];

var rect = document.createElementNS(svgns, 'rect');
rect.setAttributeNS(null, 'x', 0);
rect.setAttributeNS(null, 'y', 0);
rect.setAttributeNS(null, 'height', pHeight);
rect.setAttributeNS(null, 'width', pWidth);
rect.setAttributeNS(null, 'fill', 'white');
canvas.appendChild(rect);

//mapping from position to screen coordinates
//needs the svg context for height and width
function create_rect(x,y, fill){
    // Grid is 100 by 100
    var rect = document.createElementNS(svgns, 'rect');
    rect.setAttributeNS(null, 'x', 3 + x);
    rect.setAttributeNS(null, 'y', 2 + y);
    rect.setAttributeNS(null, 'height', side);
    rect.setAttributeNS(null, 'width', side);
    rect.setAttributeNS(null, 'fill', fill);
    rect.state = 0;
    canvas.appendChild(rect);
    return rect;
}

var cells = [];

// inititalize envrionment cells
for (var i = 0; i < n; i++) {

    cells[i] = []

    for(var j = 0; j< n; j++){

        var x = i*scale_w;
        var y = j*scale_h;

        var renv = Math.random()
        if(renv > 0.4){
            cells[i][j] = create_rect(x, y,yellow);
            cells[i][j].state = negative; //negative charge
        }
        else {
            cells[i][j] = create_rect(x,y,green);
            cells[i][j].state = positive;
        }

        cells[i][j].addEventListener("mouseover", function(e){
            this.state = this.state==negative?positive:negative;
            if( this.state == positive) this.setAttributeNS(null,"fill",green)
            else this.setAttributeNS(null,"fill",yellow);
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

    var x = scale_w*(n/2 + Math.floor( r*Math.cos(angle) )); // to get it in units
    var y = scale_h*(n/2 + Math.floor( r*Math.sin(angle) ));

    //pHeight/2 + Math.floor( r*Math.sin(angle));

    var rect = create_rect(x,y, 'black');
    rect.addEventListener("mousedown", function(e){
        this.state = b_charge;
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
var display = js_clock(10, 800);

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

            if( inner_boundary[i].state == b_charge){
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

                    if( onboundary(cells[i][j],inner_boundary)){
                        var sum = neighbours_sum(cells[i][j],inner_boundary);
                    }
                    else{
                        var sum = cells[i-1][j-1].state  + cells[i-1][j].state + cells[i-1][j+1].state + cells[i][j+1].state + cells[i+1][j+1].state + cells[i+1][j].state + cells[i+1][j-1].state + cells[i][j].state
                    }
                    //var sum = neighbours.reduce(function(a,b){return a+b});

                    if( sum >= 0){ //sorrounded by 4 or more possitive charges, positive
                        // or 2 or more boundary cells that is lighted red
                        cells[i][j].state = positive;
                        cells[i][j].setAttributeNS(null,"fill",green)
                    }
                    // else if( sum > 2){ //sorrounded by more than 4 possitive charges, positive
                    //     cells[i][j].state = 2*positive;
                    //     cells[i][j].setAttributeNS(null,"fill",green)
                    // }
                    else{ //sorounded by 4 or less negative charges
                        //negative charge
                        cells[i][j].state = negative;
                        cells[i][j].setAttributeNS(null,"fill",yellow)
                    }
                }
                else{
                    var sum = cells[i-1][j-1].state  + cells[i-1][j].state + cells[i-1][j+1].state + cells[i][j+1].state + cells[i+1][j+1].state + cells[i+1][j].state + cells[i+1][j-1].state + cells[i][j].state

                    if( sum >= -1){ //sorrounded by more than 3 possitive charges, positive
                        cells[i][j].state = positive;
                        cells[i][j].setAttributeNS(null,"fill",green)
                    }
                    else{
                        //negative charge
                        cells[i][j].state = negative;
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

    var min = n/2-3;
    var max = n/2+3;

    if( cell.xpos > min*scale_w  && cell.xpos < max*scale_w &&  cell.ypos > min*scale_h && cell.ypos < max*scale_h  ){
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
            sum += 2*boundary[pos].state; //twice the charge
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
