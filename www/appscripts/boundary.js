


// bittorio cells that lies at a certain position in the grid

import {setColor} from "./utils.js"

export function bittorio ( create_rect, create_path, n ){


    return function(row, side ){


        var ca = {}; //cells of cellular automaton

        ca.cells = [];
        ca.perturbed = 0;
        ca.perturbCount = 0;

        for (var col = 0; col < n; col++) {

            ca.cells[col] = {}
            ca.cells[col].rect = create_rect(col, row, side, side, "#ffffff");
            ca.cells[col].path = create_path(col, row, side, side,  "#ff0000");

            if( Math.random() < 0.2){
                ca.cells[col].state = 1
            }
            else{
                ca.cells[col].state = 0;
            }
            setColor(ca.cells[col]);
        }


        ca.sense = function( pertOn, perturbRow ){

            var perturbed = 0;
            ca.cells.map(function(cell, ind){

                if( pertOn == 1){

                    //1. sense and indicate perturbation - before acting
                    if ( cell.state != perturbRow[ind]){
                        //console.log("perturbation")
                        //cell.state = cells[bcell][gridn-1].state
                        //cell.rect.setAttributeNS(null,"fill","red")
                        cell.path.setAttributeNS(null, 'stroke', "#0000ff");
                        cell.path.setAttributeNS(null, 'stroke-width', 2);
                    }
                    else{
                        //no change
                        cell.path.setAttributeNS(null, 'stroke', "#ff0000");
                        cell.path.setAttributeNS(null, 'stroke-width', 1);
                    }
                }
            });
        };



        ca.nextState = function( ){

            //copy prev row
            // if( pertOn == 1){

            // }

            //4. compute next state;
            for (var col = 0; col < n; col++) {

                var prev = col -1, next = col + 1;

                if( prev < 0 ){
                    prev  = n - 1
                }

                if( next == n ){
                    next = 0;
                }

                ca.cells[col].state = next_state( ca.cells[prev].state, ca.cells[col].state, ca.cells[next].state, document.getElementById("carulebinary").value);
                setColor(ca.cells[col]);
            }
        }

        ca.getState = function(){
            return ca.cells.map(function(c){return c.state});
        }

        ca.reconfigure = function(perturbRow){
            for (var col = 0; col < n; col++) {
                ca.cells[col].state = perturbRow[col]
                setColor(ca.cells[col]);
            }
        }

        ca.clear = function(){
            for (var col = 0; col < n; col++) {
                ca.cells[col].path.setAttributeNS(null, 'stroke', "#ff0000");
                ca.cells[col].path.setAttributeNS(null, 'stroke-width', 1);
            }
        }

        return ca;

    }

}


function next_state (prev, cur, next, ruleString){

    var rule = ruleString.split("");
    rule = rule.map(function(r){ return parseInt(r);});

    //console.log("carule is" + rule);

    var castate = prev + "" +  cur + ""+ next;
    // console.log(castate);
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

    // console.log("CA state" )
    // console.log("next state is " + ret);

    return ret;
}
