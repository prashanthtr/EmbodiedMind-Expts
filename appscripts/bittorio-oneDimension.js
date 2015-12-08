require(
    ["grid","utils","userGuide","loadConfig","caupdate"],
    function (grid,utils,userGuide,loadConfig, caupdate) {

        // --------------- Inits ------------------------------

        //bittorio display on which display happens
        var bittorio = [];
        var timer = 5;

        // These are parameters to pass to the grid
        //Initialization for anticipatory score interface


        var id = "centerDiv",
            rowLength = 18,
            colLength = 30,
            objSize = 5,
            now = Math.floor(rowLength/2),
            initNum = 0,
            stepCount = 0;


        // Create the Raphael paper that we will use for drawing and creating graphical objects

        var centerDiv = document.getElementById("centerDiv");
        var paper = new Raphael(centerDiv);
        var mouseDownState = {value: 0};
        var updateRow = { value: now};

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
        //var updateRow = { value: -1};

        // top most row is the initialization row
        // this has to be initialized and cannot changed afterwards
        bittorio = grid(paper, rowLength,colLength,objSize);
        drawNow(paper, rowLength, colLength);


        function rowChange (rc){
            console.log(caupdate);
            var row = rc;
            for( row = rc+1; row< rowLength; row++){
                caupdate.changeFuture(bittorio, row);
            }
            document.getElementById('configNum').value  = utils.findInitConfigVal(bittorio, colLength, now);
        }

        centerDiv.onclick = function (e){
            console.log("reset because of this function");
            //console.log("x + y" + e.x + " " + e.y);
            rowChange(updateRow.value);
        };

        // adds a new property
        utils.updateChange (bittorio, rowLength, colLength, updateRow, mouseDownState);

        var audioContext, oscillator;
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        audioContext = new AudioContext();

        userGuide();
        utils.init(bittorio,colLength,now);

        // scrolls the CA every time step
        function caScroll (){

            console.log("timer is" + timer);
            console.log("Scrolling cells up from end to start");
            var row =0, col =0;
            //update only the perturbations from the now+1 to the end
            for(row=0; row < rowLength-1; row++){
                for(col=0; col < colLength; col++){

                    //copying
                    //change color by changing state
                    bittorio[row][col].state = bittorio[row+1][col].state;
                    bittorio[row][col].userChange = bittorio[row+1][col].userChange;
                    //transfered
                    bittorio[row+1][col].userChange = 0;

                    bittorio[row][col].changeColor();
                }
            }

            console.log("calculating the value of the future");

            //compute the new future after pushing up
            for(col=0; col < colLength; col++){
                bittorio[rowLength -1][col].state = 2;
                bittorio[rowLength -1][col].userChange = 0;
            }
            caupdate.changeFuture(bittorio, rowLength - 1);

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
                rowChange(now);
            }

        }

        document.getElementById('gridCol').onchange = function(){
            colLength = parseInt(document.getElementById('gridCol').value);
            //console.log("paper width before is" + paper.width);
            paper.clear();
            //console.log("paper width after is" + paper.width);
            bittorio = grid(paper, rowLength,colLength,objSize);
            utils.init(bittorio,colLength,now);
            drawNow(paper, rowLength, colLength);
        }

        document.getElementById('gridRow').onchange = function(){
            console.log("original now is" + "row" + rowLength + "now" + now);
            rowLength = parseInt(document.getElementById('gridRow').value);
            //console.log("paper height before is" + paper.height);
            paper.clear();
            //console.log("paper heigth after is" + paper.height);
            now = Math.floor(rowLength / 2);
            console.log("original now is" + "row" + rowLength + "now" + now);
            bittorio = grid(paper, rowLength,colLength,objSize);
            updateRow.value = now;
            utils.updateChange (bittorio, rowLength, colLength, updateRow, mouseDownState);
            utils.reset(bittorio,rowLength, colLength,now)
            utils.init(bittorio,colLength,now);
            drawNow(paper, rowLength, colLength);
        }


        document.getElementById('randomConfig').onclick = function(){

            utils.randomInit(bittorio, colLength,now);
            rowChange(now);
            initNum = document.getElementById('configNum').value;
            console.log("init numer stored as" + initNum);
        }

        document.getElementById('clearFirst').onclick = function(){
            utils.clear(bittorio, colLength, now);
            rowChange(now);
        }

        document.getElementById('wrapCells').onclick = function(){
            if( this.value == "YES" ){
                this.value = "NO";
            }
            else{
                this.value = "YES";
            }
            rowChange(now);

        };

        document.getElementById('wrapSetting').onchange = function(){
            rowChange(now);
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

        // sets the configuration given a number
        document.getElementById('configFix').onclick = function (){

            //convert to binary
            var num = parseInt(document.getElementById('configNum').value);
            var str = utils.convert2Binary (num, colLength);
            str = str.split(""); //has to be an array

            utils.setConfig(str,bittorio,colLength, now);
            rowChange(now);

        };

        document.getElementById('carulebinary').onchange = function(){
            //convert to decimal
            var num = document.getElementById('carulebinary').value;
            num = num.split("").map(function(n){ return parseInt(n);});
            var dec = utils.convert2Decimal (num);
            //console.log("here");
            document.getElementById('carule').value = dec;
            rowChange(now);

        };

        document.getElementById('carule').onchange = function (){

            //console.log("changed");
            //convert to binary
            var num = parseInt(document.getElementById('carule').value);
            var str = utils.convert2Binary (num, 8);
            document.getElementById('carulebinary').value = str;
            rowChange(now);

        };

        document.getElementById('step').addEventListener("click", function(){
            rowChange(now);
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
            document.getElementById('configNum').value  = utils.findInitConfigVal(bittorio, colLength, now);
            //initNum = parseInt(document.getElementById('configNum').value);
            rowChange(now);
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
            stepCount = 0;
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
            caScroll();
            //run at the same or another speed
            run = setInterval(simulate, parseFloat(document.getElementById("loopTime").value)); // start the setInterval()

        }


});
