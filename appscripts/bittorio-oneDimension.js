require(
  ["squareGrid","utils","userGuide","loadConfig","caupdate","structuralCoupling"],
  function (squareGrid,utils,userGuide,loadConfig, caupdate, structuralCoupling) {

    // --------------- Inits ------------------------------
    
    //bittorio display on which display happens
    var bittorio = [];
    var timer = 0;

    var id = "centerDiv",
        rowLength = 15,
        colLength = 15,
        objSize = 5,
        now = Math.floor(rowLength/2),
        initNum = 0,
        stepCount = 0;

    var centerDiv = document.getElementById("centerDiv");
    //var paper = new Raphael(centerDiv);
    
    //data structure for mouseState that is synchronnized across
    //cells
    var mouseDownState = {value: 0};

    //data structure for current row clicked, that is synchronnized
    //across cells
    var updateRow = { value: now};

    // paper.raphael.mouseup( function(){
    //     //console.log("reset because of this function");
    //     mouseDownState.value = 0;
    // });
    

    // --------------------- FUNCTIONS ----------------

    // Draws the now line on startup and when canvas is redrawn
    function drawNowLine (rowLength, colLength){

      var svg = document.getElementById('mysvg');
      var rect = svg.getBoundingClientRect();

      var yLen = (rect.height/rowLength) ;
      var xLen = (rect.width/colLength);

      var lineTop = document.createElementNS("http://www.w3.org/2000/svg", "path");
      var lineBottom = document.createElementNS("http://www.w3.org/2000/svg", "path");

      lineTop.setAttribute("d", "M0 " + now*yLen + " L"+ (colLength*xLen) + " " + now*yLen + " Z");
      lineTop.setAttribute("stroke", "red");

      lineBottom.setAttribute("d", "M0 " + (now+1)*yLen + " L"+ (colLength*xLen) + " " + (now+1)*yLen + " Z");
      lineBottom.setAttribute("stroke", "red");

      svg.appendChild(lineTop);
      svg.appendChild(lineBottom);
    }

    //initialization for the live update
    //var updateRow = { value: -1};

    // top most row is the initialization row
    // this has to be initialized and cannot changed afterwards
    bittorio = squareGrid("mysvg", rowLength,colLength);
    drawNowLine(rowLength, colLength);
    
    //function that updates the rows after on screen each action
    function rowChange (rc){
      console.log(caupdate);
      var row = rc;
      for( row = rc+1; row< rowLength; row++){
        caupdate.changeFuture(bittorio, row);
      }
      document.getElementById('configNum').value  = utils.findInitConfigVal(bittorio, colLength, now);
    }

    //arbitrary decision
    centerDiv.onclick = function (e){
      console.log("this is called second");
      var pert = parseInt(document.getElementById("perturbationColor").value); 
      console.log("value of perturbation is" + pert)
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

          bittorio[row][col] = structuralCoupling(
            bittorio[row][col],
            [bittorio[row+1][col]]);

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
      //utils.updateTimers(bittorio, rowLength, colLength,timer);
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
      var svg = document.getElementById('mysvg');
      while (svg.firstChild) {svg.removeChild(svg.firstChild);}

      //console.log("paper width after is" + paper.width);
      //bittorio = grid(id, paper, rowLength,colLength,objSize);
      bittorio = squareGrid("mysvg", rowLength,colLength);

      utils.updateChange (bittorio, rowLength, colLength, updateRow, mouseDownState);
      utils.reset(bittorio,rowLength, colLength,now)
      utils.init(bittorio,colLength,now);
      drawNowLine(rowLength, colLength);
    }

    document.getElementById('inputBit').onchange = function(){

      var ip = document.getElementById('inputBit').value
      if(ip == ""){

      }
      else{
        var changeBit = parseInt(ip);
        //utils.storeInitState(bittorio, colLength,now);
        utils.setNthBit(bittorio, now, colLength, changeBit);
        rowChange(now);
      }
    }


    document.getElementById('gridRow').onchange = function(){
      console.log("original now is" + "row" + rowLength + "now" + now);
      rowLength = parseInt(document.getElementById('gridRow').value);

      var svg = document.getElementById('mysvg');
      while (svg.firstChild) {svg.removeChild(svg.firstChild);}

      //console.log("paper heigth after is" + paper.height);
      now = Math.floor(rowLength / 2);
      console.log("original now is" + "row" + rowLength + "now" + now);
      bittorio = squareGrid("mysvg", rowLength,colLength);
      updateRow.value = now;
      utils.updateChange (bittorio, rowLength, colLength, updateRow, mouseDownState);
      utils.reset(bittorio,rowLength, colLength,now)
      utils.init(bittorio,colLength,now);
      drawNowLine(rowLength, colLength);
    }

    document.getElementById('randomConfig').onclick = function(){

      //utils.storeInitState(bittorio, colLength,now);
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

    document.getElementById('clearConfig').onclick = function(){
      utils.clearInitState(bittorio, colLength,now);
    }

    
    
    document.getElementById('restoreConfig').onclick = function(){
      utils.restoreInitState(bittorio, colLength,now);
      rowChange(now);
    }


    document.getElementById('storeConfig').onclick = function(){
      utils.storeInitState(bittorio, colLength,now);
    }


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

    document.getElementById('toggle').onclick = function(){
      var row = parseInt(document.getElementById('r').value);
      var col = parseInt(document.getElementById('c').value);
      utils.toggleState(bittorio, row, col);
      rowChange(now);
    };

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
      //utils.storeInitState(bittorio, colLength,now);

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
