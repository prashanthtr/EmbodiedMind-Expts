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

        var colLength = 40, rowLength = 20; //len-1 time units are displayed
        var xLen = 0.9*pWidth/colLength, yLen = 0.9*pWidth/colLength, size= pWidth/colLength;

        var xOffset = 1, yOffset = 1;
        //24,12
        // Just create a nice black background
        var bgRect = paper.rect(0,0,pWidth, pHeight);
        bgRect.attr({"fill": "black"});
        bgRect.attr({"stroke-opacity": "0"});

        function arrCmp(arr, obj){
            var i = 0, len = arr.length;
            for(i=0; i < len;i++){
                if( arr[i].toString() == obj.toString()){
                    return 1;
                }
            }
            return -1;
        }

        var cnt = 0;
        var timer = 1;

        // thiknk about the clamps later

        // the cellular automaton rules that each object uses to compute
        // their states.
        function caRules (prev, cur, next){

            var rule = document.getElementById('carulebinary').value;
            rule = rule.split("");
            rule = rule.map(function(r){ return parseInt(r);});

            console.log("carule is" + rule);

            var castate = prev + "" +  cur + ""+ next;
            console.log(castate);
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
            obj.attr({"stroke-opacity": 0.2, "stroke-width": 1});

            obj.stateChanged = -1;
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
                    obj.stateChanged = 1;
                }

            });

            return obj;
        }

        //bittorio display on which display happens
        var bittorio = [];
        var row = 0, col = 0;

        // top most row is the initialization row
        // this has to be initialized and cannot changed afterwards
        for(row = 0; row < rowLength; row++){
            bittorio[row] = [];
            for(col=0; col< colLength; col++){
                bittorio[row][col] = new bitObject(col+xOffset,row+yOffset,size,row);
                bittorio[row][col].state = 0; //state change without color
                //bittorio[row][col].changeColor();
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

        function reset(){

            for(row = 1; row < rowLength; row++){
                for(col=0; col< colLength; col++){
                    bittorio[row][col].state = -1;
                    bittorio[row][col].changeColor();
                    bittorio[row][col].state = 0;

                }
            }


            row = 0;
            for(col=0; col< colLength; col++){
                bittorio[row][col].state = 0;
                bittorio[row][col].changeColor();
            }

            timer = 1;

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

            var arr = bittorio[timer-1];
            var ind = 0;

            while( ind < arr.length ){

                var el = bittorio[timer-1][ind];
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

                if( nextCell.state != -1 && nextCell.stateChanged == 1 ){
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

                ind++;
            }
            //            bittorio[timer-1].map( function (el,ind,arr){

            //return el;
                //console.log("ind is" + ind + "," + prev + ", " + next);
                //upddating the state of the new object.
//            });

            //increment timer
            console.log(timer);
            timer++;
        }

        //converts to binary of suitable,length
        function convert2Binary (num, len){

            var str = "";
            var rem = 0;

            while( num > 1 ){
                rem = num % 2;
                str += rem;
                num = parseInt(num/2);
            }
            if( num == 0){
                str+=0;
            }
            else str+=1;

            var i = str.length;
            while( i < len ){
                str+=0;
                i++;
            }

            str = str.split("").reverse().join("");
            return str;
        }

        function convert2Decimal( binArr ){

            var sum = 0;
            var i = binArr.length;
            while( i -- ){
                sum+= binArr[i]*Math.pow(2, binArr.length-i-1);
            }
            return sum;
        }

        document.getElementById('configFix').onclick = function (){

            //convert to binary
            var num = parseInt(document.getElementById('configNum').value);
            var str = convert2Binary (num, colLength);
            str = str.split(""); //has to be an array

            row = 0;
            for(col=0; col< colLength; col++){
                bittorio[row][col] = new bitObject(col+xOffset,row+yOffset,size,row);
                bittorio[row][col].state = parseInt(str[col]);
                bittorio[row][col].changeColor();
            }
        };

        document.getElementById('carule').onchange = function (){

            //convert to binary
            var num = parseInt(document.getElementById('carule').value);
            var str = convert2Binary (num, 8);
            document.getElementById('carulebinary').value = str;
        };

        function findInitConfigVal(){
            row = 0;
            var arr = [];
            for(col=0; col< colLength; col++){
                arr[col] = bittorio[row][col].state;
            }
            return convert2Decimal(arr);
        }

        //current timer - or the now row
        var run = null;
        document.getElementById('start').addEventListener("click", function(){
            console.log("here after reset");
            document.getElementById('configNum').value  = findInitConfigVal();
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

        document.getElementById('reset').addEventListener("click", function(){
            if(run != null){
                clearInterval(run); // stop the setInterval()
            }
            run = null;
            reset();
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
