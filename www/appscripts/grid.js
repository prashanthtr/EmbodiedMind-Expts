



//erases the current grid and creates a new grid of cells and cellular automataon


export function ( n, side ){


    var canvas = document.getElementById( 'svgCanvas' );
    var pW = canvas.clientWidth;
    var pH = canvas.clientHeight;

    console.log(pW + "  " + pH);

    var percentPerturb = 0.1;
    var percentCA = 0.1;
    var pertOn = 0;
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

    var cellularAutomaton = bittorio( create_rect, create_path, scale_w, n );

    var cells = [];

    // inititalize envrionment cells
    for (var i = 0; i < n; i++) {

        cells[i] = [];
        for(var j = 0; j< n; j++){

            cells[i][j] = {}

            cells[i][j].rect = create_rect(i,j,side, side, "#ffffff");
            cells[i][j].state = 0;

            if (  j == n/2){
                cells[i][j].rect.setAttributeNS(null, "opacity", 0);
            }
        }
    }

    for(var col = 0; col< n; col++){

        cells[col][0].state = 0;
        setColor(cells[col][0]);
        starting_config[col] = cells[col][0].state;
    }

    var ca2 = cellularAutomaton( n/2, side );

}
