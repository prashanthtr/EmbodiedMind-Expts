require(
    ["grid","utils","userGuide","loadConfig"],
    function (grid,utils,userGuide,loadConfig) {

        // --------------- Inits ------------------------------

        //bittorio display on which display happens
        var bittorio = [];
        var timer = 0;

        // These are parameters to pass to the grid
        var id = "centerDiv",
            rowLength = 14,
            colLength = 14,
            objSize = 5;

        // Create the Raphael paper that we will use for drawing and creating graphical objects

        var centerDiv = document.getElementById("centerDiv");
        var paper = new Raphael(centerDiv);
        var mouseDownState = {value: 0};

        paper.raphael.mouseup( function(){
            //console.log("reset because of this function");
            mouseDownState.value = 0;
        });

        //initialization for the live update
        var updateRow = { value: -1};

        // top most row is the initialization row
        // this has to be initialized and cannot changed afterwards
        bittorio = grid(paper, rowLength,colLength,objSize);


        // adds a new property
        utils.updateChange (bittorio, rowLength, colLength, updateRow, mouseDownState);

        var audioContext, oscillator;
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        audioContext = new AudioContext();

        //Initialization for anticipatory score interface
        var now = 6;

        userGuide();
        utils.init(bittorio,colLength,now);


        // --------------- Live update -----------------------------

        // //right now, this starts listening for mousestate changes and updates changes to all the cells
        // var listenMouse = setInterval(function(){
        //     utils.mouseBroadcast(bittorio, rowLength, colLength, mouseDownState.value);
        // }, 1000);

        //right now, this starts listening for mouse clicks on previous cells soon as program starts
        var listenVariable = null;

        var futureLoop = null;
        // recalculates all the future states from current index of change
        //called everytime a row in the past is changed
        //starts a loop that quickly refurbishes all the rows till the timer (which is the most future state that the system has calculated

        function recalcFuture(){

            //run a fresh loop till timer
            if( futureLoop == null){
                futureLoop = setInterval(function(){
                    console.log("row is" + updateRow.value);
                    changeFuture(updateRow.value);
                    updateRow.value++;
                    if(updateRow.value == timer){
                        clearInterval(futureLoop);
                    }
                }, 40);
            }
            //stop existing loop and run a fresh loop till timer if its a valid number less than the timer
            else if(updateRow.value < timer){
                console.log("clearing previous timer");
                clearInterval(futureLoop);
                futureLoop = setInterval(function(){
                    console.log("running");
                    updateRow.value++;
                    changeFuture(updateRow.value);
                    if(updateRow.value == timer){
                        clearInterval(futureLoop);
                    }
                }, 40);

            }
            else{
                clearInterval(futureLoop);
                updateRow.value = -1;
            }

        }

        //changes the current row number given as input, same function as caupdate but does not change the timer
        function changeFuture (row){

            console.log("calling this");
            bittorio[row].map( function (el,ind,arr){

                //initialized to the current value of the element
                var cur = el.state;

                var wrapping = document.getElementById('wrapCells').value;

                if( wrapping == "NO"){

                    var prevCell =  bittorio[row-1];
                    var prev =-1, next=-1;
                    //when the next cell is a grey
                    if( ind == 0 ||  ind == arr.length -1 ){
                        el.state = prevCell[ind].state;
                        el.changeColor();
                    }
                    else{
                        prev = prevCell[ind-1].state; //no turn around
                        next = prevCell[ind+1].state;
                        //only get the previous value if cur value is not a perturbation

                        cur = prevCell[ind].state;
                        el.state = el.updateState(prev,cur,next);
                        el.changeColor();
                    }
                }
                else{
                    //wrapping around
                    var prevCell =  bittorio[row-1];
                    //three values
                    var prev =-1, next=-1, cur = el.state;
                    if( ind - 1 < 0){
                        prev = prevCell[arr.length-1].state; //turn around
                    }
                    else {
                        prev = prevCell[ Math.abs(ind-1)%arr.length].state; //turn around
                    }
                    next = prevCell[ Math.abs(ind+1)%arr.length].state;
                    //only if cur value is not a pertrubation, use the last state of the system.
                    cur = prevCell[ind].state;
                    el.state = el.updateState(prev,cur,next);
                    el.changeColor();
                }
            });

        }

        // --------------- CA UPDATE ------------------------------

        //entering the function once, it updates the state of the
        //bittorio and stores in the new bittorio row.
        function caUpdate(){

            // it changes the ne
            //change happens at the timer
            bittorio[timer].map( function (el,ind,arr){

                //initialized to the current value of the element
                var cur = el.state;

                var wrapping = document.getElementById('wrapCells').value;

                //simple replace the cells value as the perturbation
                if( cur != 2){
                    el.state = cur;
                    el.changeColor();
                }
                else{

                    if( wrapping == "NO"){

                        var prevCell =  bittorio[timer-1];
                        var prev =-1, next=-1;
                        //when the next cell is a grey
                        if( ind == 0 ||  ind == arr.length -1 ){
                            el.state = prevCell[ind].state;
                            el.changeColor();
                        }
                        else{
                            prev = prevCell[ind-1].state; //no turn around
                            next = prevCell[ind+1].state;
                            //only get the previous value if cur value is not a perturbation
                            cur = prevCell[ind].state;
                            el.state = el.updateState(prev,cur,next);
                            el.changeColor();
                        }
                    }
                    else{
                        //wrapping around
                        var prevCell =  bittorio[timer-1];
                        //three values
                        var prev =-1, next=-1, cur = el.state;
                        if( ind - 1 < 0){
                            prev = prevCell[arr.length-1].state; //turn around
                        }
                        else {
                            prev = prevCell[ Math.abs(ind-1)%arr.length].state; //turn around
                        }
                        next = prevCell[ Math.abs(ind+1)%arr.length].state;
                        //only if cur value is not a pertrubation, use the last state of the system.
                        cur = prevCell[ind].state;
                        el.state = el.updateState(prev,cur,next);
                        el.changeColor();
                    }

                }
            });

            //increment timer
            console.log(timer);
            timer++;
            utils.updateTimers(bittorio, rowLength, colLength,timer);
        }

        // scrolls the CA every step
        function caScroll (){

            //utils.stopAllSounds(bittorio[now]);
            console.log("timer is" + timer);

            //moving the cells back from the now line
            var row = 0, col = 0;
            for(row=0; row < now; row++){
                for(col=0; col < colLength; col++){
                    bittorio[row][col].state = bittorio[row+1][col].state;
                    bittorio[row][col].changeColor();
                    //utils.updateTimers(bittorio, rowLength, colLength,timer);
                }
            }

            // updating the now line
            bittorio[now].map( function (el,ind,arr){

                //initialized to the current value of the element
                var cur = el.state;
                var wrapping = document.getElementById('wrapCells').value;
                var prevCell =  bittorio[now-1];
                var nextCell =  bittorio[now+1];

                //simple replace the cells value as the perturbation of the future cell
                if( nextCell[ind].state != 2){
                    el.state = nextCell[ind].state;
                    el.changeColor();
                }
                else{
                    //do the calculation
                    if( wrapping == "NO"){

                        var prev =-1, next=-1;
                        //when the next cell is a grey
                        if( ind == 0 ||  ind == arr.length -1 ){
                            el.state = prevCell[ind].state;
                            el.changeColor();
                        }
                        else{
                            prev = prevCell[ind-1].state; //no turn around
                            next = prevCell[ind+1].state;
                            //only get the previous value if cur value is not a perturbation
                            cur = prevCell[ind].state;
                            el.state = el.updateState(prev,cur,next);
                            el.changeColor();
                        }
                    }
                    else{
                        //wrapping around
                        //three values
                        var prev =-1, next=-1, cur = el.state;
                        if( ind - 1 < 0){
                            prev = prevCell[arr.length-1].state; //turn around
                        }
                        else {
                            prev = prevCell[ Math.abs(ind-1)%arr.length].state; //turn around
                        }
                        next = prevCell[ Math.abs(ind+1)%arr.length].state;
                        //only if cur value is not a pertrubation, use the last state of the system.
                        cur = prevCell[ind].state;
                        el.state = el.updateState(prev,cur,next);
                        el.changeColor();
                    }

                }
            });

            //update all the rows from the now+1 to the end
            for(row=now+1; row < rowLength-1; row++){
                for(col=0; col < colLength; col++){
                    bittorio[row][col].state = bittorio[row+1][col].state;
                    bittorio[row][col].changeColor();
                }
            }

            //make the new row unperturbed
            //update all the rows from the now+1 to the end
            for(col=0; col < colLength; col++){
                bittorio[rowLength-1][col].state = 2;
                bittorio[row][col].changeColor();
            }

            // bittorio[rowLength-1].map( function (el,ind,arr){

            //     //initialized to the current value of the element
            //     var cur = el.state;
            //     var wrapping = document.getElementById('wrapCells').value;
            //     var prevCell =  bittorio[rowLength-2];

            //     //compute the values of the last cell using previous values
            //     if( wrapping == "NO"){

            //         var prev =-1, next=-1;
            //         //when the next cell is a grey
            //         if( ind == 0 ||  ind == arr.length -1 ){
            //             el.state = prevCell[ind].state;
            //             el.changeColor();
            //         }
            //         else{
            //             prev = prevCell[ind-1].state; //no turn around
            //             next = prevCell[ind+1].state;
            //             //only get the previous value if cur value is not a perturbation
            //             cur = prevCell[ind].state;
            //             el.state = el.updateState(prev,cur,next);
            //             el.changeColor();
            //         }
            //     }
            //     else{
            //         //wrapping around
            //         //three values
            //         var prev =-1, next=-1, cur = el.state;
            //         if( ind - 1 < 0){
            //             prev = prevCell[arr.length-1].state; //turn around
            //         }
            //         else {
            //             prev = prevCell[ Math.abs(ind-1)%arr.length].state; //turn around
            //         }
            //         next = prevCell[ Math.abs(ind+1)%arr.length].state;
            //         //only if cur value is not a pertrubation, use the last state of the system.
            //         cur = prevCell[ind].state;
            //         el.state = el.updateState(prev,cur,next);
            //         el.changeColor();
            //     }
            // });

            utils.playAllSounds(bittorio[now]);
            timer++;
            utils.updateTimers(bittorio, rowLength, colLength,timer);
        }


        /// ------------ Events on buttons ---------------------------

        document.getElementById('preset').onchange = function(){

            var val = document.getElementById('preset').value;
            console.log(val);
            if(val == "None"){
                //
            }
            else{
                loadConfig(val);
            }

        }

        document.getElementById('randomConfig').onclick = function(){
            utils.randomInit(bittorio, colLength,now);
        }

        document.getElementById('clearFirst').onclick = function(){
            utils.clear(bittorio, colLength, now);
        }

        document.getElementById('wrapCells').onclick = function(){
            if( this.value == "YES" ){
                this.value = "NO";
            }
            else{
                this.value = "YES";
            }
        };

        document.getElementById('soundToggle').onclick = function(){
            if( this.value == "ON" ){
                this.value = "OFF";
                //mute all the cells
                utils.mute(bittorio, rowLength, colLength);
            }
            else{
                this.value = "ON";
                utils.unmute(bittorio, rowLength, colLength);
            }
        };


        document.getElementById('live').onclick = function(){
            if( this.value == "YES" ){
                this.value = "NO";
                //mute all the cells
                if(listenVariable != null){
                    clearInterval(listenVariable);
                }
            }
            else{
                this.value = "YES";

                //only listens when live is on
                listenVariable = setInterval(function(){
                    console.log("the true value is update" + updateRow.value);
                    if(updateRow.value != -1){
                        console.log("coming here");
                        recalcFuture();
                    }
                    else{
                        //nothing
                    }
                }, 20);

            }
        };


        // sets the configuration given a number
        document.getElementById('configFix').onclick = function (){

            //convert to binary
            var num = parseInt(document.getElementById('configNum').value);
            var str = utils.convert2Binary (num, colLength);
            str = str.split(""); //has to be an array

            utils.setConfig(str,bittorio,colLength)
        };

        document.getElementById('carulebinary').onchange = function(){
            //convert to decimal
            var num = document.getElementById('carulebinary').value;
            num = num.split("").map(function(n){ return parseInt(n);});
            var dec = utils.convert2Decimal (num);
            console.log("here");
            document.getElementById('carule').value = dec;
        };

        document.getElementById('carule').onchange = function (){

            console.log("changed");
            //convert to binary
            var num = parseInt(document.getElementById('carule').value);
            var str = utils.convert2Binary (num, 8);
            document.getElementById('carulebinary').value = str;
        };


        /// ------------ Timers -------------------------------

        //current timer - or the now row
        var run = null;

        document.getElementById('start').addEventListener("click", function(){
            console.log("here after reset");
            document.getElementById('configNum').value  = utils.findInitConfigVal();
            if(run == null){
                run = setInterval(simulate , parseFloat(document.getElementById("loopTime").value)); // start setInterval as "run";
            }
        },true);


        document.getElementById('stop').addEventListener("click", function(){
            if(run != null){
                clearInterval(run); // stop the setInterval()
                utils.stopAllSounds(bittorio[now]);
                run = null;
            }
            //also unconditionally stop playing everything
            utils.stopAllSounds(bittorio[now]);
        },true);

        document.getElementById('reset').addEventListener("click", function(){
            if(run != null){
                clearInterval(run); // stop the setInterval()
            }
            run = null;
            utils.reset(bittorio, rowLength, colLength, now);
            timer = 0;
        },true);

        function simulate() {
            //console.log(); // firebug or chrome log

            // if(timer > rowLength-1){
            //     clearInterval(run); // stop the setInterval()
            //     utils.stopAllSounds(bittorio[now]);
            // }
            // else{

            clearInterval(run); // stop the setInterval()
            // evolve the next state of the CA
            //caUpdate();
            caScroll();
            //run at the same or another speed
            run = setInterval(simulate, parseFloat(document.getElementById("loopTime").value)); // start the setInterval()

        }

        var yLen = (paper.height/rowLength);
        var xLen = (paper.width/colLength);

        paper.path("M0," +  now*yLen + "L" + (colLength*xLen-colLength) + "," + now*yLen).attr({
            stroke: "red"
        });

        paper.path("M0," + (now+1)*yLen + "L" + (colLength*xLen-colLength) + "," + (now+1)*yLen).attr({
            stroke: "red"
        });


});
