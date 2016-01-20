require(
  ["squareGrid","utils","userGuide","loadConfig","caupdate","structuralCoupling"],
  function (squareGrid,utils,userGuide,loadConfig, caupdate, structuralCoupling) {

    // --------------- Inits ------------------------------
    
    //bittorio display on which display happens
    var bittorio = [];
    var timer = 0;

    var rowLength = parseInt(document.getElementById('gridRowLength').value),
        colLength = parseInt(document.getElementById('gridColLength').value),
        objSize = 5,
        now = Math.floor(rowLength/2),
        initNum = 0,
        stepCount = 0;
    
    // --------------------- FUNCTIONS ----------------

    // Draws the now line on startup and when canvas is redrawn
    function drawNowLine (rowLength, colLength){

      var svg = document.getElementById('bittorio');
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
    
    // top most row is the initialization row
    // this has to be initialized and cannot changed afterwards
    bittorio = squareGrid("bittorio", rowLength,colLength);
    drawNowLine(rowLength, colLength);
    
    //function that updates the rows after on screen each action
    function rowChange (rc){
      for(var row = rc+1; row < bittorio.length; row++) {
        caupdate.changeFuture(bittorio,row);
      }

    }
    
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
      
      //utils.playAllSounds(bittorio[now]);
      timer++;
    }
    
    /// ------------ Events on buttons ---------------------------

    document.getElementById('bittorio').onclick = function(){
      //console.log("Second")
      rowChange(now);
    }
    
    document.getElementById('preset').onchange = function(){

      var val = document.getElementById('preset').value;
      //console.log(val);
      if(val == "None"){
        //
      }
      else{
        loadConfig(val,"gridRowLength","gridColLength");
        rowChange(now);
      }

    }

    document.getElementById('gridColLength').onchange = function(){
      colLength = utils.getVal('gridColLength'); 
      var svg = document.getElementById('bittorio');
      while (svg.firstChild) {svg.removeChild(svg.firstChild);}

      //console.log("paper width after is" + paper.width);
      //bittorio = grid(id, paper, rowLength,colLength,objSize);
      bittorio = squareGrid("bittorio", rowLength,colLength);

      //utils.updateChange (bittorio, rowLength, colLength);
      utils.reset(bittorio,rowLength, colLength,now)
      utils.init(bittorio,colLength,now);
      drawNowLine(rowLength, colLength);
    }
        

    document.getElementById('gridRowLength').onchange = function(){
      console.log("original now is" + "row" + rowLength + "now" + now);
      rowLength = utils.getVal('gridRowLength'); 
      var svg = document.getElementById('bittorio');
      while (svg.firstChild) {svg.removeChild(svg.firstChild);}

      //console.log("paper heigth after is" + paper.height);
      now = Math.floor(rowLength / 2);
      console.log("original now is" + "row" + rowLength + "now" + now);
      bittorio = squareGrid("bittorio", rowLength,colLength);
      //utils.updateChange (bittorio, rowLength, colLength);
      utils.reset(bittorio,rowLength, colLength,now)
      utils.init(bittorio,colLength,now);
      drawNowLine(rowLength, colLength);
    }

    document.getElementById('randomConfig').onclick = function(){
      utils.randomInit(bittorio, colLength,now);
      rowChange(now);
    }
    
    document.getElementById('clear').onclick = function(){
      utils.clear(bittorio, colLength, now);
      rowChange(now);
    }

   
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
      var num = parseInt(document.getElementById('carule').value);
      var str = utils.convert2Binary (num, 8);
      document.getElementById('carulebinary').value = str;
      rowChange(now);
    };

    document.getElementById('step').addEventListener("click", function(){
      rowChange(now);
      caScroll();

    });

    
    /// ------------ Timers -------------------------------

    //current timer - or the now row
    var run = null;

    document.getElementById('start').addEventListener("click", function(){
      //console.log("here after reset");

      rowChange(now);
      if(run == null){
        run = setInterval(simulate , parseFloat(document.getElementById("loopTime").value)); // start setInterval as "run";
      }
    },true);
    

    document.getElementById('stop').addEventListener("click", function(){
      if(run != null){
        clearInterval(run); // stop the setInterval()
        //utils.stopAllSounds(bittorio[now]);
        run = null;
      }
      //also unconditionally stop playing everything
      //utils.stopAllSounds(bittorio[now]);
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
