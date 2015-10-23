require(
    [],
    function () {

        console.log("Yo, I am alive!");
        // Grab the div where we will put our Raphael paper
        var centerDiv = document.getElementById("centerDiv");

        // Create the Raphael paper that we will use for drawing and creating graphical objects
        var paper = new Raphael(centerDiv);
        var mouseDownState = 0;

        paper.raphael.mousedown(function(){
                mouseDownState = 1;
        });

        paper.raphael.mouseup( function(){
            mouseDownState = 0;
        })


        // put the width and heigth of the canvas into variables for our own convenience
        var pWidth = paper.canvas.offsetWidth;
        var pHeight = paper.canvas.offsetHeight;
        console.log("pWidth is " + pWidth + ", and pHeight is " + pHeight);
        var xLen = 18, yLen = 9;
        var xOffset = 1, yOffset = 3;
        //24,12
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

        var cellularArray = [];
        var listBoundaryProperties = [ [14,14], [15,14], [16,14], [16,15], [16,16], [15,16], [14,16], [14,15] ];
        var listNeighbours = [ [[13,14],[14,13]], [[15,13]], [[16,13],[17,14]], [[17,15]], [[17,16],[16,17]], [[15,17]], [[14,17],[13,16],], [[13,15]] ];

        var cnt = 0;
        var timer = 0;

        var bittorio = [];
        var i = 0, len = 49; //49 time units are displayed
        for(; ++i < len;){
            cnt = 0;

            var bittorioRow = listBoundaryProperties.map (function (arr,ind){
                var obj = paper.rect((cnt++ + xOffset)*xLen,((i+3)%53)*(yLen-2),7,7);
                obj.type = "link";
                obj.x = arr[0]%14;
                obj.y = arr[1]%14;
                obj.ind = ind;
                //obj.attr({"fill": "red"});
                obj.state = 1;
                //updates the states of the cell based on adjacent values and environmental values

                obj.updateState = function(prev, cur, next){
                    var castate = prev + "" +  cur + ""+ next;
                    //ca rule
                    switch(castate){
                    case "000": this.attr({"fill": "red"}); this.state = 1; break;
                    case "001": this.attr({"fill": "white"}); this.state = 0; break;
                    case "010": this.attr({"fill": "white"}); this.state = 0; break;
                    case "011": this.attr({"fill": "red"}); this.state = 1;break;
                    case "100": this.attr({"fill": "white"}); this.state = 0; break;
                    case "101": this.attr({"fill": "white"}); this.state = 0; break;
                    case "110": this.attr({"fill": "white"}); this.state = 0; break;
                    case "111": this.attr({"fill": "white"}); this.state = 0; break;
                    };
                }
                obj.updateState(1,obj.state,1);

                obj.mousedown(function(){
                    mouseDownState = 1;
                });

                obj.mouseup(function(){
                    mouseDownState = 0;
                });

                //toggle state
                obj.hover(function(){
                    console.log("added click" + this.state);

                    if( mouseDownState == 1 ){
                        this.state = (this.state + 1)%2; //obj = (obj.state + 1)%2;
                        if(this.state == 1){
                            this.attr({"fill": "white"})
                        }
                        else{
                            this.attr({"fill": "red"})
                        }
                    }

                });
                obj.updateState();
                return obj;
            });
            bittorio.push(bittorioRow);
        }

        function caUpdate(){
            console.log("updating");
            console.log(timer%48);
            bittorio[timer%48] = bittorio[timer%48].map( function (el,ind,arr){
                var prev = [];
                if( ind - 1 < 0){
                    prev = arr[arr.length-1].state;
                }
                else {
                    prev = arr[ Math.abs(ind-1)%arr.length].state;
                }
                var next = arr[ Math.abs(ind+1)%arr.length].state;
                el.updateState( prev , el.state, next);
                return el;
            });
        }


        var run = setInterval(request , parseFloat(document.getElementById("loopTime").value)); // start setInterval as "run"
        function request() {
            //console.log(); // firebug or chrome log
            clearInterval(run); // stop the setInterval()
            caUpdate();
            timer++;
            run = setInterval(request, parseFloat(document.getElementById("loopTime").value)); // start the setInterval()
        }

        // setInterval(function(){
        //     caUpdate();
        //     timer++;
        // }, parseFloat(document.getElementById("loopTime").value));

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

});
