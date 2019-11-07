

export function createBoundaryEl(boundary,env,ca_rule){

    return function(n, N, x, y){

        var cell = {}

        cell.state = 0; // on or off (0 or 1)
        cell.color = "black" //off

        //at any one time, more than 1 cell can be active (assumption) - there will
        //be a competition for action.
        cell.active = false;

        //initialized as 0
        cell.next_cell_state = 0;
        cell.next2_next_cell_state = 0;
        cell.prev_cell_state = 0;
        cell.prev2_prev_cell_state = 0;

        cell.xind = x
        cell.yind = y

        cell.number = n;

        cell.boundary_adj = []
        cell.int_env = [];
        cell.ext_env = [];

        cell.assign_adj_cell = function(n, N){

            cell.next_cell = boundary[(n+1)%N]; //sensors for adjacent boundary
            cell.prev_cell = boundary[n-1<0?(N-1):n-1];
            // cell.next2_next_cell = boundary[(n+2)%N]; //sensors for adjacent boundary
            // cell.prev2_prev_cell = boundary[n-2<0?(N-2):n-2]; //sensors for adjacent boundary

            cell.boundary_adj = [boundary[(n+1)%N], boundary[n-1<0?(N-1):n-1]]

            var x = cell.xind
            var y =  cell.yind
            var adjacent = [ [x-1,y-1], [x-1,y], [x-1, y+1], [x, y-1], [x,y+1], [x+1,y-1], [x+1,y], [x+1,y+1] ]

            adjacent.map(function(a){
                if(on_boundary(a[0],a[1])){
                    // on boundary
                }
                else if(within_boundary(a[0],a[1])){
                    cell.int_env.push(env[x][y]);
                }
                else{
                    cell.ext_env.push(env[x][y]);
                }
            });
        }

        cell.get_adjacent_states = function(){

            // cell.next_cell_state = this.sense_next_cell(); // cell.next_cell.state
            // cell.prev_cell_state = this.sense_prev_cell() ; //cell.prev_cell.state
            //cell.next2_next_cell_state = cell.next2_next_cell.state;
            //cell.prev2_prev_cell_state = cell.prev2_prev_cell.state;

            cell.boundary_adj = this.sense_boundary_adj();
            cell.ext_env_state = this.sense_ext_env(); //cell.ext_env.state;
            cell.int_env_state = this.sense_int_env(); //cell.int_env.state;
        };

        //return on sensing
        cell.sense_boundary_adj = function(){
            return cell.boundary_adj.map((b) => {return b.state });
        }

        cell.sense_ext_env = function(){
            return cell.ext_env.map((b) => {return b.state });
        }

        cell.sense_int_env = function(){
            return cell.int_env.map((b) => {return b.state });
        }

        cell.act = function(){
            cell.get_adjacent_states();
            cell.state = ca_rule( cell.prev_cell_state, cell.state, cell.next_cell_state, cell.ext_inv.state, cell.int_env.state); //ca_rule that determines next state
        }

        return cell;
    };
}

// description for the cells interior to the cell
export function createInterior(boundary,env,ion_rule){

    return function(n, N, x, y){

        var cell = {}

        cell.state = 0; // on or off (0 or 1)
        cell.color = "black" //off

        //at any one time, more than 1 cell can be active (assumption) - there will
        //be a competition for action.
        cell.active = false;

        //initialized as 0
        cell.next_cell_state = 0;
        cell.next2_next_cell_state = 0;
        cell.prev_cell_state = 0;
        cell.prev2_prev_cell_state = 0;

        cell.xind = x
        cell.yind = y

        cell.number = n;

        cell.adjacent = []
        cell.adjacent_boundary = [];

        cell.adjacent_states = []

        cell.int_env = [];
        cell.ext_env = [];

        cell.assign_adj_cell = function(n, N){

            var x = cell.xind
            var y =  cell.yind
            var adjacent = [ [x-1,y-1], [x-1,y], [x-1, y+1], [x, y-1], [x,y+1], [x+1,y-1], [x+1,y], [x+1,y+1] ]

            adjacent.map(function(a){
                if(on_boundary(a[0],a[1])){
                    // on boundary

                    //external cells of the boundary are adjacent to the charges
                    var bind = find_boundary_el(a[0],a[1],boundary)
                    cell.adjacent_boundary.push(boundary[bind]);
                    //cell.adjacent_to_boundary.push(boundary[bind].ext_env);
                }
                else if(within_boundary(a[0],a[1])){
                    cell.adjacent.push(env[a[0]][a[1]]);
                }
                else{
                    //do not add as it does not quite fit in the model
                }
            });
        };

        cell.get_adjacent_states = function(){

            // cell.next_cell_state = this.sense_next_cell(); // cell.next_cell.state
            // cell.prev_cell_state = this.sense_prev_cell() ; //cell.prev_cell.state
            //cell.next2_next_cell_state = cell.next2_next_cell.state;
            //cell.prev2_prev_cell_state = cell.prev2_prev_cell.state;
            cell.adjacent_states = cell.adjacent.map((b) => {return b.state });
        };

        cell.act = function(){

            cell.get_adjacent_states();


            //dynamically construct neighbour for ion exchange based on open
            //channel
            for(var i=0; i<cell.adjacent.boundary.length;i++){
                if(cell.adjacent_boundary[i].state == 1){
                    cell.adjacent.concat(cell.adjacent_boundary[i].ext_env)
                }
            }

            //need to rule to say interior cell computes only when any of the adjacent boundary elements is on

            cell.state = ion_rule(cell.adjacent_states);
            // ion change rule that determines next state
        }

        return cell;
    };
}





//checks if cell within boundary
function within_boundary(  xind, yind, n ){

    var min = n/2-3;
    var max = n/2+3;

    if( xind > min  && xind < max &&  yind > min && yind < max  ){
        return 1;
    }
    else{
        return 0;
    }
}

function on_boundary( x, y , boundary ){

    var on_boundary = 0;
    for(var i = 0; i <boundary.length; i++){
        var bx = boundary[i].xind
        var by = boundary[i].yind

        if( Math.abs( x - bx ) == 0 && Math.abs( y - by ) == 0 ){
            on_boundary = 1;
        }
    }
    return on_boundary;
}


function find_boundary_el(x,y, boundary){

    var pos = -1;
    for(var i = 0; i <boundary.length; i++){
        if( x == boundary[i].xind && y == boundary[i].yind){
            pos = i;
            break;
        }
    }
    return pos;
}
