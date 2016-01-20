define(
    [],
    function(){

        var initState = [];

        // initializes the first row of bittorio
        function init ( bittorio, colLength,now){

            var row = now, col=0;
            for(col=0; col< colLength; col++){
                bittorio[row][col].state = 0;
                bittorio[row][col].userChange = 0;
                bittorio[row][col].changeColor();
                bittorio[row][col].changedState = 0;
            }
        }

      //clears the stored initial state in array representation
      function clearInitState (){
            initState = [];
      }
      
      function randomInit (bittorio, colLength, now){
        //reset();
        var row = now, col=0;
        for(col=0; col< colLength; col++){
          bittorio[row][col].state = Math.floor( 0.4 + Math.random());
          bittorio[row][col].changeColor();
          bittorio[row][col].changedState = 1;
        }
      }


      // //converts to binary of suitable,length
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

      function convert2Decimal ( binArr ){

        var sum = 0;
        //sum.toFixed(21);
        var i = binArr.length;
        while( i -- ){
          sum+= binArr[i]*Math.pow(2, binArr.length-i-1);
          //sum.toFixed(21);
        }
        console.log(sum + "");
        return sum;
      }

      //resets all the cells except the initial cell
      function reset (bittorio, rowLength, colLength, now){
        for(row = 0; row < rowLength; row++){
          for(col=0; col< colLength; col++){
            bittorio[row][col].state = 2;
            bittorio[row][col].userChange = 0;
            bittorio[row][col].changeColor();
            bittorio[row][col].changedState = 0;

          }
        }
        //stopAllSounds(bittorio[now]);
      }

      //toggles only a given state of row and column
      function toggleState (bittorio, row, col){

        if( bittorio[row][col].state == 2){
          console.log("grey to white");
          bittorio[row][col].state = 0;
          bittorio[row][col].changeColor();
        }
        else if(bittorio[row][col].state == 0){
          console.log("white to black");
          bittorio[row][col].state = 1;
          bittorio[row][col].changeColor();
        }
        else{
          console.log("black to white");
          bittorio[row][col].state = 0;
          bittorio[row][col].changeColor();
        }
        bittorio[row][col].userChange = 1;
        bittorio[row][col].changedState = 1;
      }

      function clear (bittorio, colLength, now){

        row = now;
        for(col=0; col< colLength; col++){
          bittorio[row][col].state = 0;
          bittorio[row][col].changeColor();
          bittorio[row][col].changedState = 1;
        }
      }

      function setConfig (str, bittorio, colLength,now){
        var row = now;
        for(col=0; col< colLength; col++){
          bittorio[row][col].state = parseInt(str[col]);
          bittorio[row][col].changeColor();
        }
      }


      // function updateTimers (bittorio, rowLength, colLength,timer){
      //     for(row = 0; row < rowLength; row++){
      //         for(col=0; col< colLength; col++){
      //             bittorio[row][col].updateTimer(timer);
      //         }
      //     }
      // }

      function getVal(docElement){
        return parseFloat(document.getElementById(docElement).value)
      }


      var exports = {};
      exports.init = init;
      exports.getVal = getVal;
      exports.randomInit = randomInit;
      exports.convert2Binary = convert2Binary;
      exports.convert2Decimal = convert2Decimal;
      exports.reset = reset;
      exports.clear = clear;
      exports.setConfig = setConfig;
      //exports.findInitConfigVal = findInitConfigVal;
      //exports.stopAllSounds = stopAllSounds;
      //exports.updateTimers = updateTimers;
      //exports.updateChange = updateChange;
      //exports.setNthBit = setNthBit;
      return exports;

    });
