require(
    ["grid","utils","userGuide","loadConfig"],
    function (grid,utils,userGuide,loadConfig) {

        // --------------- Inits ------------------------------

        //bittorio display on which display happens
        var bittorio = [];
        var timer = 5;

        // These are parameters to pass to the grid
        //Initialization for anticipatory score interface


        var id = "centerDiv",
            rowLength = 15,
            colLength = 15,
            objSize = 5,
            now = 7,
            initNum = 0;

        // Create the Raphael paper that we will use for drawing and creating graphical objects

        var centerDiv = document.getElementById("centerDiv");
        var paper = new Raphael(centerDiv);
        var mouseDownState = {value: 0};

        paper.raphael.mouseup( function(){
            //console.log("reset because of this function");
            mouseDownState.value = 0;
        });


        function drawNow (paper, rowLength, colLength){
            var yLen = (paper.height/rowLength) * 0.985;
            var xLen = (paper.width/colLength) * 0.99;

            paper.path("M0," +  now*yLen + "L" + (colLength*xLen) + "," + now*yLen).attr({
                stroke: "red"
            });

            paper.path("M0," + (now+1)*yLen + "L" + (colLength*xLen) + "," + (now+1)*yLen).attr({
                stroke: "red"
            });
        }

        //initialization for the live update
        var updateRow = { value: -1};

        // top most row is the initialization row
        // this has to be initialized and cannot changed afterwards
        bittorio = grid(paper, rowLength,colLength,objSize);
        drawNow(paper, rowLength, colLength);

        // adds a new property
        utils.updateChange (bittorio, rowLength, colLength, updateRow, mouseDownState);

        var audioContext, oscillator;
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        audioContext = new AudioContext();


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
                    //console.log("row is" + updateRow.value);
                    changeFuture(updateRow.value);
                    updateRow.value++;
                    if(updateRow.value == timer){
                        clearInterval(futureLoop);
                    }
                }, 40);
            }
            //stop existing loop and run a fresh loop till timer if its a valid number less than the timer
            else if(updateRow.value < timer){
                //console.log("clearing previous timer");
                clearInterval(futureLoop);
                futureLoop = setInterval(function(){
                    //console.log("running");
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

        //updates the CA cells in a given row, using the values of the
        //previous row

        function changeFuture (row){

            console.log("Changing future of row" + row);
            bittorio[row].map( function (el,ind,arr){

                var wrapping = document.getElementById('wrapCells').value;
                var cur = el.state;
                if( el.userChange == 1 && row != now + 1){
                    // state change
                    el.state = cur;
                    el.changeColor();
                }
                else{
                    if( wrapping == "NO"){

                        var prevCell =  bittorio[row-1];
                        var prev =-1, next=-1;

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
                        //force the CA rule to compute
                        cur = prevCell[ind].state;
                        el.state = el.updateState(prev,cur,next);
                        el.changeColor();
                    }
                }

            });

        }

        // --------------- CA UPDATE ------------------------------

        // //entering the function once, it updates the state of the
        // //bittorio and stores in the new bittorio row.
        // function caUpdate(){

        //     // it changes the ne
        //     //change happens at the timer
        //     bittorio[timer].map( function (el,ind,arr){

        //         //initialized to the current value of the element
        //         var cur = el.state;

        //         var wrapping = document.getElementById('wrapCells').value;
        //         //simple replace the cells value as the perturbation
        //         if( cur != 2){
        //             el.state = cur;
        //             el.changeColor();
        //         }
        //         else{

        //             if( wrapping == "NO"){

        //                 var prevCell =  bittorio[timer-1];
        //                 var prev =-1, next=-1;
        //                 //when the next cell is a grey
        //                 if( ind == 0 ||  ind == arr.length -1 ){
        //                     el.state = prevCell[ind].state;
        //                     el.changeColor();
        //                 }
        //                 else{
        //                     prev = prevCell[ind-1].state; //no turn around
        //                     next = prevCell[ind+1].state;
        //                     //only get the previous value if cur value is not a perturbation
        //                     cur = prevCell[ind].state;
        //                     el.state = el.updateState(prev,cur,next);
        //                     el.changeColor();
        //                 }
        //             }
        //             else{
        //                 //wrapping around
        //                 var prevCell =  bittorio[timer-1];
        //                 //three values
        //                 var prev =-1, next=-1, cur = el.state;
        //                 if( ind - 1 < 0){
        //                     prev = prevCell[arr.length-1].state; //turn around
        //                 }
        //                 else {
        //                     prev = prevCell[ Math.abs(ind-1)%arr.length].state; //turn around
        //                 }
        //                 next = prevCell[ Math.abs(ind+1)%arr.length].state;
        //                 //only if cur value is not a pertrubation, use the last state of the system.
        //                 cur = prevCell[ind].state;
        //                 el.state = el.updateState(prev,cur,next);
        //                 el.changeColor();
        //             }

        //         }
        //     });

        //     //increment timer
        //     //console.log(timer);
        //     timer++;
        //     utils.updateTimers(bittorio, rowLength, colLength,timer);
        // }

        // scrolls the CA every step
        function caScroll (){

            //utils.stopAllSounds(bittorio[now]);
            console.log("timer is" + timer);

            //compute all rows from now + 1 to the end after the new current line is computed

            console.log("calculating the value of the future cells from the new current cell");
            var row = 0, col = 0;
            for(row=now+1; row < rowLength; row++){
                changeFuture(row);
            }

//            setTimeout ( function(){
                //moving the cells back from the now line
                console.log("moving cells back from now -1 back to beginning");
                var row = 0, col = 0;
                for(row=0; row < now; row++){
                    for(col=0; col < colLength; col++){
                        bittorio[row][col].state = bittorio[row+1][col].state;
                        bittorio[row][col].changeColor();
                        //this has to be state changed because, they influence the state of the current cell
                    }
                }

//            }, 0);

            console.log("moving cells back from end to now + 1");
//            setTimeout ( function(){
                //update only the perturbations from the now+1 to the end
                for(row=now+1; row < rowLength-1; row++){
                    for(col=0; col < colLength; col++){

                        if( bittorio[row+1][col].userChange == 1){
                            //copying
                            //change color by changing state
                            bittorio[row][col].state = bittorio[row+1][col].state;
                            bittorio[row][col].userChange = bittorio[row+1][col].userChange;
                            //transfered
                            bittorio[row+1][col].userChange = 0;

                            bittorio[row][col].changeColor();

                        }

                        //else leave the computed values

                        /*else{
                            //change color without state change
                            bittorio[row][col].colStr = bittorio[row+1][col].colStr;
                            bittorio[row][col].attr({"fill": bittorio[row][col].colStr});

                        }*/
                    }
                }

            //}, 1000);

//            setTimeout ( function(){
                console.log("calculating the value of the current cell");
                // updating the now line
                bittorio[now].map( function (el,ind,arr){

                    //initialized to the current value of the element
                    var cur = el.state;
                    var wrapping = document.getElementById('wrapCells').value;
                    var prevCell =  bittorio[now-1];
                    var nextCell =  bittorio[now+1];

                    //Replace the cells value as the perturbation of the
                    //future cell if user has changed the cell
                    if( nextCell[ind].userChange == 1){
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

//           }, 1500);

//            setTimeout ( function(){

                //discard the current now + 1 that was used to create
                //the current now
                bittorio[now + 1].map(function (el){
                    //el.state = 2;
                    el.userChange = 0;
                    //el.changeColor();
                });

                //keeps the future changes that the user has created
                //with some idea in mind

                //before calculating the value of the next row, make the
                //state of all the cells 2, except the user changed ones
                // for(row=now+2; row < rowLength; row++){
                //     bittorio[row].map(function (el){
                //         if( el.userChange == 1){
                //             //keep the state
                //             //el.userChange = 0;
                //         }
                //         else{
                //             //change to uncomputed
                //             //el.state = 2;
                //             //el.changeColor();
                //         }
                //     });
                //}

//            }, 1750);

            // //make the new row unperturbed
            // //update all the rows from the now+1 to the end
            // for(col=0; col < colLength; col++){
            //      bittorio[rowLength-1][col].state = 2;
            //     //     bittorio[row][col].changeColor();
            // }

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
            //console.log(val);
            if(val == "None"){
                //
            }
            else{
                loadConfig(val);
            }

        }

        document.getElementById('gridCol').onchange = function(){
            colLength = parseInt(document.getElementById('gridCol').value);
            paper.clear();
            bittorio = grid(paper, rowLength,colLength,objSize);
            utils.init(bittorio,colLength,now);
            drawNow(paper, rowLength, colLength);
        }

        document.getElementById('gridRow').onchange = function(){
            rowLength = parseInt(document.getElementById('gridRow').value);
            now = Math.floor(rowLength / 2);
            paper.clear();
            bittorio = grid(paper, rowLength,colLength,objSize);
            utils.init(bittorio,colLength,now);
            drawNow(paper, rowLength, colLength);
        }


        document.getElementById('randomConfig').onclick = function(){

            utils.randomInit(bittorio, colLength,now);
            initNum = document.getElementById('configNum').value;
            console.log("init numer stored as" + initNum);
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


        // document.getElementById('live').onclick = function(){
        //     if( this.value == "YES" ){
        //         this.value = "NO";
        //         //mute all the cells
        //         if(listenVariable != null){
        //             clearInterval(listenVariable);
        //         }
        //     }
        //     else{
        //         this.value = "YES";

        //         //only listens when live is on
        //         listenVariable = setInterval(function(){
        //             //console.log("the true value is update" + updateRow.value);
        //             if(updateRow.value != -1){
        //               //  console.log("coming here");
        //                 recalcFuture();
        //             }
        //             else{
        //                 //nothing
        //             }
        //         }, 20);

        //     }
        // };


        // sets the configuration given a number
        document.getElementById('configFix').onclick = function (){

            //convert to binary
            var num = parseInt(document.getElementById('configNum').value);
            var str = utils.convert2Binary (num, colLength);
            str = str.split(""); //has to be an array

            utils.setConfig(str,bittorio,colLength, now);
        };

        document.getElementById('carulebinary').onchange = function(){
            //convert to decimal
            var num = document.getElementById('carulebinary').value;
            num = num.split("").map(function(n){ return parseInt(n);});
            var dec = utils.convert2Decimal (num);
            //console.log("here");
            document.getElementById('carule').value = dec;
        };

        document.getElementById('carule').onchange = function (){

            //console.log("changed");
            //convert to binary
            var num = parseInt(document.getElementById('carule').value);
            var str = utils.convert2Binary (num, 8);
            document.getElementById('carulebinary').value = str;
        };

        document.getElementById('step').addEventListener("click", function(){
            caScroll();
        });

        document.getElementById('gain').onchange = function(){
            var newGain = parseFloat(document.getElementById('gain').value);
            utils.setGain(bittorio, rowLength, colLength, newGain);
        };



        /// ------------ Timers -------------------------------

        //current timer - or the now row
        var run = null;

        document.getElementById('start').addEventListener("click", function(){
            //console.log("here after reset");
            //document.getElementById('configNum').value  = utils.findInitConfigVal();
            //initNum = parseInt(document.getElementById('configNum').value);

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

            console.log("utilNum is" + initNum);
            var str = utils.convert2Binary (initNum, colLength);
            str = str.split(""); //has to be an array
            console.log("str is" + str);

            utils.setConfig(str,bittorio,colLength, now);
            document.getElementById('configNum').value = initNum;

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


});
