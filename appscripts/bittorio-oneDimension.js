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
        var xLen = 8, yLen = 6;
        var xOffset = 1, yOffset = 1;
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
        var timer = 1;

        //bittorio display on which display happens
        var bittorio = [];
        var row = 0, col = 0, len = 60; //len-1 time units are displayed
        var colLength = 80;
        for(row = 0; row < len-1; row++){
            bittorio[row] = [];
            for(col=0; col< colLength; col++){
                bittorio[row][col] = paper.rect((col+xOffset)*xLen,(row+yOffset)*yLen,7,7);
                bittorio[row][col].attr({"fill": "white"});
                bittorio[row][col].state = 0;
                bittorio[row][col].update = function(){
                    if( this.state == 0){
                        this.attr({"fill": "white"});
                    }
                    else{
                        this.attr({"fill": "black"});
                    }
                }
            }
        }

        bittorio[len-1] = [];
        for(col=0; col< colLength; col++){

            bittorio[len-1][col] = paper.rect((col+xOffset)*xLen,(len+1+yOffset)*yLen,8,8);
            bittorio[len-1][col].type = "link";
            bittorio[len-1][col].state = 1;

            //console.log(bittorio[len-1][col].state);
            //updates the states of the cell based on adjacent values and environmental values
            bittorio[len-1][col].updateState = function(prev, cur, next){
                var castate = prev + "" +  cur + ""+ next;
                console.log(castate);
                //ca rule
                switch(castate){
                case "000": this.state = 1; this.attr({"fill": "black"}); break;
                case "001": this.state = 0; this.attr({"fill": "white"}); break;
                case "010": this.state = 0; this.attr({"fill": "white"}); break;
                case "011": this.state = 1; this.attr({"fill": "black"});break;
                case "100": this.state = 0; this.attr({"fill": "white"});break;
                case "101": this.state = 0; this.attr({"fill": "white"}); break;
                case "110": this.state = 0; this.attr({"fill": "white"}); break;
                case "111": this.state = 0; this.attr({"fill": "white"}); break;
                };
            }
            //bittorio[len-1][col].updateState(0,bittorio[len-1][col].state,0);

            bittorio[len-1][col].mousedown(function(){
                mouseDownState = 1;
            });

            bittorio[len-1][col].mouseup(function(){
                mouseDownState = 0;
            });

            //toggle state
            bittorio[len-1][col].hover(function(){
                console.log("added click" + this.state);
                this.state = (this.state + 1)%2; //bittorio[len-1][col] = (bittorio[len-1][col].state + 1)%2;
                if(this.state == 1){
                    this.attr({"fill": "white"})
                }
                else{
                    this.attr({"fill": "black"})
                }
            });

        }

        //entering the function once, it updates the state of the
        //bittorio and stores in the new bittorio row.
        function caUpdate(){

            //creating the new array from the last array
            var newArr = bittorio[len-1].map( function (el,ind,arr){
                var prev = [];
                if( ind - 1 < 0){
                    prev = arr[arr.length-1].state; //turn around
                }
                else {
                    prev = arr[ Math.abs(ind-1)%arr.length].state; //turn around
                }
                var next = arr[ Math.abs(ind+1)%arr.length].state;
                //console.log("ind is" + ind + "," + prev + ", " + next);
                el.updateState( prev , el.state, next);
                return el;
            });

            //updating all the previous arrays
            var row = 0;
            while( row < bittorio.length-1 ){

                for(col=0; col < bittorio[row].length; col++){
                    bittorio[row][col].state = bittorio[row+1][col].state;
                    bittorio[row][col].update();
                }
                row++;
            }

            //updating the last array
            for(col=0; col < bittorio[row].length; col++){
                bittorio[bittorio.length-1][col] = newArr[col];
            }
            console.log(timer);
        }

        //current timer - or the now row
        var run = null;

        document.getElementById('start').addEventListener("click", function(){
            if(run == null){
                run = setInterval(request , parseFloat(document.getElementById("loopTime").value)); // start setInterval as "run";
            }
        },true);


        document.getElementById('stop').addEventListener("click", function(){
            if(run != null){
                clearInterval(run); // stop the setInterval()
                run = null;
            }
        },true);


        function request() {
            //console.log(); // firebug or chrome log
            clearInterval(run); // stop the setInterval()
            caUpdate();
            timer++;
            run = setInterval(request, parseFloat(document.getElementById("loopTime").value)); // start the setInterval()
        }


});
