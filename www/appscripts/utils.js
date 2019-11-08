

var svgns = "http://www.w3.org/2000/svg";
var canvas = document.getElementById( 'svgCanvas' );

//mapping from position to screen coordinates
//needs the svg context for height and width
export function create_rect_fn(scale_x, scale_y, canvas){
    return function(x,y,width,height,fill){
        // Grid is 100 by 100
        var rect = document.createElementNS(svgns, 'rect');
        rect.setAttributeNS(null, 'x', 3 + x*scale_x);
        rect.setAttributeNS(null, 'y', 2 + y*scale_y);
        rect.setAttributeNS(null, 'height', height);
        rect.setAttributeNS(null, 'width', width);
        rect.setAttributeNS(null, 'fill', fill);
        rect.state = 0;
        canvas.appendChild(rect);
        return rect;
    }
}



//checks if cell within boundary
export function within_boundary(  xind, yind, n ){

    var min = n/2-3;
    var max = n/2+3;

    if( xind > min  && xind < max &&  yind > min && yind < max  ){
        return 1;
    }
    else{
        return 0;
    }
}

export function on_boundary( x, y , boundary ){

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


export function find_boundary_el(x,y, boundary){

    var pos = -1;
    for(var i = 0; i <boundary.length; i++){
        if( x == boundary[i].xind && y == boundary[i].yind){
            pos = i;
            break;
        }
    }
    return pos;
}
