require(
    [],
    function () {

        console.log("Yo, I am alive!");
        // Grab the div where we will put our Raphael paper
        var centerDiv = document.getElementById("centerDiv");

        // Create the Raphael paper that we will use for drawing and creating graphical objects
        var paper = new Raphael(centerDiv);

        // put the width and heigth of the canvas into variables for our own convenience
        var pWidth = paper.canvas.offsetWidth;
        var pHeight = paper.canvas.offsetHeight;
        console.log("pWidth is " + pWidth + ", and pHeight is " + pHeight);
        var xLen = 24, yLen = 12;

        // Just create a nice black background
        var bgRect = paper.rect(0,0,pWidth, pHeight);
        bgRect.attr({"fill": "white"});



        function arrCmp(arr, obj){
            var i = 0, len = arr.length;
            for(i=0; i < len;i++){
                if( arr[i].toString() == obj.toString()){
                    return 1;
                }
            }
            return -1;
        }


        var listHoles = [];
        var listSubstrates = [];
        var products = [];
        var bonds = [];
        var links = [];
        var listBoundaryProperties = [ [15,15], [15,14], [15,16], [14,15], [14,16], [14,14], [16,16], [16,15], [16,14]];
        var catalyst = {};

        function initArray(){

            var cellularArray = [];
            var i = 0, j=0, len = 30;
            for(i=0; i < len; i++){
                cellularArray[i] = [];

                for(j=0; j < len;j++){

                    var biasedRand = Math.floor(0.9 + Math.random());

                    if( arrCmp( listBoundaryProperties, [i,j] ) == 1 ){
                        cellularArray[i][j] = paper.rect(i*xLen,j*yLen,7,7);
                        cellularArray[i][j].attr({"fill": "green"});
                        cellularArray[i][j].type = "catalyst";
                        cellularArray[i][j].x = 15;
                        cellularArray[i][j].y = 15;

                    }
                    // arrCmp(listHoles,[i,j]) != -1
                    else if( biasedRand == 0) {
                        console.log("here");
                        cellularArray[i][j] = paper.rect(i*xLen,j*yLen,7,7);
                        cellularArray[i][j].attr({"fill": "white"});
                        cellularArray[i][j].x = i;
                        cellularArray[i][j].y = j;
                        cellularArray[i][j].type = "hole";
                        listHoles.push([i,j]);
                    }
                    else{
                        cellularArray[i][j] = paper.rect(i*xLen,j*yLen,7,7);
                        cellularArray[i][j].attr({"fill": "green"});
                        cellularArray[i][j].x = i;
                        cellularArray[i][j].y = j;
                        cellularArray[i][j].type = "reactant";
                        listSubstrates.push([i,j]);
                    }
                }
            }

        }

        initArray();

        //initially it is not clear what ar the holes.
        function movement(){

            //for each particle, including the catalyst,

            //hole near hole, no motion
            // hole near bonded link, no motion
            // hole near substrate, or catalyst, swap

            var i = 0,j=0, len = listHoles.length;

            for(; ++i < len;){
                for(; ++j < len;){
                    var randSel = Math.floor( 3*Math.random + 0.4);
                    switch(randSel){
                    case 0:
                        if( arrCmp(listHoles, [i,j-1]) == 1 ){
                        }
                        else if( arrCmp(listBonded, [i,j-1]) == -1 ){

                        }
                        else if (arrCmp(listProducts, [i,j-1]) == -1){

                        }
                        else{ //substrates
                            var temp = cellularArray[i][j-1];
                            cellularArray[i][j-1] = cellularArray[i][j];
                            cellularArray[i][j] = temp;
                        }
                        break;

                    case 1:
                        if( arrCmp(listHoles, [i-1,j]) == 1 ){
                        }
                        else if( arrCmp(listBonded, [i-1,j]) == -1 ){

                        }
                        else if (arrCmp(listProducts, [i-1,j]) == -1){

                        }
                        else{ //substrates
                            var temp = cellularArray[i-1][j];
                            cellularArray[i-1][j] = cellularArray[i][j];
                            cellularArray[i][j] = temp;
                        }
                        break;

                    case 2:
                        if( arrCmp(listHoles, [i,j+1]) == 1 ){
                        }
                        else if( arrCmp(listBonded, [i,j+1]) == -1 ){

                        }
                        else if (arrCmp(listProducts, [i,j+1]) == -1){

                        }
                        else{ //substrates
                            var temp = cellularArray[i][j+1];
                            cellularArray[i][j+1] = cellularArray[i][j];
                            cellularArray[i][j] = temp;
                        }
                        break;

                    case 3:
                        if( arrCmp(listHoles, [i+1,j]) == 1 ){
                        }
                        else if( arrCmp(listBonded, [i+1,j]) == -1 ){

                        }
                        else if (arrCmp(listProducts, [i+1,j]) == -1){

                        }
                        else{ //substrates
                            var temp = cellularArray[i+1][j];
                            cellularArray[i+1][j] = cellularArray[i][j];
                            cellularArray[i][j] = temp;
                        }
                        break;

                    };

                }

            }

        }

        //continuuously determine the color of the CA cells, which can be black or white
        function caRules(){

        }



        //setInterval(movement,500);
        //-------------------

        // Add some properties to dot just to keep track of it's "state"
        /////////////////////////
        // dot.xpos=pWidth/2;  //
        // dot.ypos=pHeight/2; //
        // dot.xrate=5;        //
        // dot.yrate=5;        //
        /////////////////////////

        // For counting calls to the 'draw' routine
        //var count=0;

        // // our drawing routine, will use as a callback for the interval timer
        // var draw = function(){

        //     // Count and keep track of the number of times this function is called
        //     count++;
        //     //console.log("count = " + count);
        //     //console.log("dot pos is ["+dot.xpos + "," + dot.ypos + "]");

        //     // Update the position where we want our dot to be
        //     dot.xpos += dot.xrate;
        //     dot.ypos += dot.yrate;

        //     // Now actually move the dot using our 'state' variables
        //     dot.attr({'cx': dot.xpos, 'cy': dot.ypos});

        //     //---------------------------------------------

        //     // keep the object on the paper
        //     // make a sound when the dot bounces on the edges
        //     if (dot.xpos > pWidth) {
        //         dot.xrate = -dot.xrate;
        //         snd.setParam("play", 1);
        //         snd.releaseAfter(.05);
        //     }
        //     if (dot.ypos > pHeight) {
        //         dot.yrate = - dot.yrate;
        //         snd.setParam("play", 1);
        //         snd.releaseAfter(.05);
        //     };
        //     if (dot.xpos < 0) {
        //         dot.xrate = -dot.xrate;
        //         snd.setParam("play", 1);
        //         snd.releaseAfter(.05);
        //     }
        //     if (dot.ypos < 0) {
        //         dot.yrate = - dot.yrate;
        //         snd.setParam("play", 1);
        //         snd.releaseAfter(.05);
        //     };
        // }

        // call draw() periodically
        //setInterval(draw, 20);

});
