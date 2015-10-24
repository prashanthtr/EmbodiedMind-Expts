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
        var xLen = 10, yLen = 9;
        var xOffset = 1, yOffset = 1, size=9;
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

        var cnt = 0;
        var timer = 1;

        // thiknk about the clamps later

        // the cellular automaton rules that each object uses to compute
        // their states.
        function caRules (prev, cur, next){
            var castate = prev + "" +  cur + ""+ next;
            console.log(castate);
            //ca rule
            var ret = -1;
            switch(castate){
            case "000": ret = 1; break;
            case "001": ret = 0;  break;
            case "010": ret = 0;  break;
            case "011": ret = 1;  break;
            case "100": ret = 0; break;
            case "101": ret = 0;  break;
            case "110": ret = 0;  break;
            case "111": ret = 0;  break;
            default: ret = -1; break;
            };
            return ret;
        }

        // document.getElementById('setInitConfig').addEventListener('click',function(){
        //     if(document.getElementById('setInitConfig').value == "set the configuration"){
        //         document.getElementById('setInitConfig').value = "Fixed initial configuration";
        //     }
        //     else{
        //         document.getElementById('setInitConfig').value = "set the configuration";
        //     }
        // });


        //x,y, - positions, side - of the square
        function bitObject(x,y,s,timeOccur){

            var obj = paper.rect(x*xLen,y*yLen,s,s);
            obj.type = "link";
            obj.state = -1;
            //calculates the state of an object using internal relation
            //between ca cells
            obj.updateState = caRules;

            obj.changeColor = function(){

                if(this.state == -1){
                    this.attr({"fill": "grey"});
                }
                else if(this.state == 0){
                    this.attr({"fill": "white"});
                }
                else{
                    this.attr({"fill": "black"});
                }
            }

            obj.changeColor();

            obj.mousedown(function(){
                mouseDownState = 1;
            });

            obj.mouseup(function(){
                    mouseDownState = 0;
            });

            //toggle state
            obj.hover(function(){
                if( mouseDownState == 1){
                    console.log("added click" + this.state);
                    this.state = (this.state + 1)%2; //obj = (obj.state + 1)%2;
                    this.changeColor();
                }

            });

            return obj;
        }

        //bittorio display on which display happens
        var bittorio = [];
        var row = 0, col = 0, rowLength = 50; //len-1 time units are displayed
        var colLength = 60;

        // top most row is the initialization row
        // this has to be initialized and cannot changed afterwards
        for(row = 0; row < rowLength; row++){
            bittorio[row] = [];
            for(col=0; col< colLength; col++){
                bittorio[row][col] = new bitObject(col+xOffset,row+yOffset,size,row);
                bittorio[row][col].changeColor();
            }
        }

        function init(){
            row = 0;
            for(col=0; col< colLength; col++){
                bittorio[row][col] = new bitObject(col+xOffset,row+yOffset,size,row);
                bittorio[row][col].state = 0;
                bittorio[row][col].changeColor();
            }
        }

        init();

        // //looks ahead to update the current slide based on the perturbation
        // function lookahead (cur, next){

        //     var newArr = next.map( function (el,ind,arr){

        //         if( el.state != -1){
        //             cur = el.state;
        //             obj.changeColor();
        //         }
        //     });
        // }

        //entering the function once, it updates the state of the
        //bittorio and stores in the new bittorio row.
        function caUpdate(){

            //creating the new array from the first array
            bittorio[timer-1].map( function (el,ind,arr){

                var nextCell = bittorio[timer][ind];

                var prev =-1, next=-1, cur = -1;
                if( ind - 1 < 0){
                    prev = arr[arr.length-1].state; //turn around
                }
                else {
                    prev = arr[ Math.abs(ind-1)%arr.length].state; //turn around
                }
                next = arr[ Math.abs(ind+1)%arr.length].state;
                cur = el.state;

                // // as opposed to the CA encountering the accepted state,
                // // changing its current state (with no time lag), and
                // // using the changed states to generate new state

                if( nextCell.state != -1){
                    console.log("perturb");
                    // then the cell is a perturbation that has to be carried over
                    cur = nextCell.state;
                    // once carried, then color has to change
                    el.state = nextCell.state;
                    el.changeColor();
                }
                else {
                    console.log("previous object state")
                    cur = el.state; //previous object state
                }

                nextCell.state = nextCell.updateState(prev,cur,next);
                nextCell.changeColor();

                //console.log("ind is" + ind + "," + prev + ", " + next);
                //upddating the state of the new object.
            });

            // none of this business needed
            // //updating all the previous arrays
            // var row = bittorio.length-1;
            // while( row > 1 ){

            //     for(col=0; col < bittorio[row].length; col++){
            //         bittorio[row][col].state = bittorio[row-1][col].state;
            //         bittorio[row][col].changeColor();
            //     }
            //     row++;
            // }

            // // updating from the first array
            // for(col=0; col < bittorio[row].length; col++){
            //     bittorio[bittorio.length-1][col] = newArr[col];
            // }

            //increment timer
            console.log(timer);
            timer++;
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

            if(timer > rowLength-1){
                clearInterval(run); // stop the setInterval()
            }
            else{
                clearInterval(run); // stop the setInterval()
                caUpdate();
                run = setInterval(request, parseFloat(document.getElementById("loopTime").value)); // start the setInterval()
            }
        }

});
