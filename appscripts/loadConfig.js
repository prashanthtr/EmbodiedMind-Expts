// To use the sound on a web page with its current parameters (and without the slider box):

define(
  ["utils"],
  function (utils) {

    return function (str, gridRow, gridCol){

      var rowLength = utils.getVal(gridRow),
          colLength = utils.getVal(gridCol);
        
        //always check if rows and columns are same as for experimental situations
        // change number of rows and columns
        console.log("changing row value");
        if( rowLength == 61){
          //no change
        }
        else{
          document.getElementById('gridRow').value = 61;
          document.getElementById('gridRow').onchange();
        }

        if( parseInt(document.getElementById('gridCol').value) == 80){
          //no change
        }
        else{
          document.getElementById('gridCol').value = 80;
          document.getElementById('gridCol').onchange();
        }


        // loading the appropriate CA rules
        if( str == "oddSequence"){

          //load ca rule
          document.getElementById('carule').value = 132;
          var str2 = utils.convert2Binary (132, 8);
          document.getElementById('carulebinary').value = str2;
          document.getElementById('wrapCells').value = "YES";

          //set init configuration
          document.getElementById('initConfig').value = "00000000011100011001001001011100011001100100001100011110011110111011111000011111";               document.getElementById('restoreConfig').onclick();

          //set perturbation as well
          //document.getElementById('toggle').onclick();

        }
        else if( str == "doublePerturb"){
          document.getElementById('carule').value = 133;
          var str2 = utils.convert2Binary (133, 8);
          document.getElementById('carulebinary').value = str2;
          document.getElementById('wrapCells').value = "YES";

          //yet to find init configuration
          //document.getElementById('initConfig').value = "00000000011100011001001001011100011001100100001100011110011110111011111000011111";               document.getElementById('restoreConfig').onclick();

        }
        else if(str == "Rule204"){
          document.getElementById('carule').value = 204;
          var str2 = utils.convert2Binary (204, 8);
          document.getElementById('carulebinary').value = str2;
          document.getElementById('wrapCells').value = "YES";

          //yet to find init configuration
          //use older configuration
          document.getElementById('restoreConfig').onclick();
        }
        else if(str == "Rule160"){
          document.getElementById('carule').value = 160;
          var str2 = utils.convert2Binary (160, 8);
          document.getElementById('carulebinary').value = str2;
          document.getElementById('wrapCells').value = "YES";

          //yet to find init configuration
          document.getElementById('initConfig').value = "10001010110110110000110010011011000110101011111111111001000010001010111010001100";               document.getElementById('restoreConfig').onclick();
        }
        else if(str == "Rule150"){
          document.getElementById('carule').value = 150;
          var str2 = utils.convert2Binary (150, 8);
          document.getElementById('carulebinary').value = str2;
          document.getElementById('wrapCells').value = "YES";

          //yet to find init configuration
          document.getElementById('initConfig').value = "10001010110110110000110010011011000110101011111111111001000010001010111010001100";               document.getElementById('restoreConfig').onclick();
        }
        else if( str == "Rule73"){
          document.getElementById('carule').value = 73;
          var str2 = utils.convert2Binary (73, 8);
          document.getElementById('carulebinary').value = str2;
          document.getElementById('wrapCells').value = "YES";

          document.getElementById('initConfig').value = "00000000011100011001001001011100011001100100001100011110011110111011111000011111"
          document.getElementById('restoreConfig').onclick();
        }
        else if( str == "Rule146"){

          document.getElementById('carule').value = 146;
          var str2 = utils.convert2Binary (146, 8);
          document.getElementById('carulebinary').value = str2;
          document.getElementById('wrapCells').value = "YES";

          document.getElementById('initConfig').value = "00000000011100011001001001011100011001100100001100011110011110111011111000011111"
          document.getElementById('restoreConfig').onclick();
        }
        else if( str == "Rule164"){

          document.getElementById('carule').value = 164;
          var str2 = utils.convert2Binary (164, 8);
          document.getElementById('carulebinary').value = str2;
          document.getElementById('wrapCells').value = "YES";

          document.getElementById('initConfig').value = "00000000011100011001001001011100011001100100001100011110011110111011111000011111"
          document.getElementById('restoreConfig').onclick();
        }
        else if( str == "Rule123"){

          document.getElementById('carule').value = 123;
          var str2 = utils.convert2Binary (123, 8);
          document.getElementById('carulebinary').value = str2;
          document.getElementById('wrapCells').value = "YES";

          document.getElementById('initConfig').value = "00000000011100011001001001011100011001100100001100011110011110111011111000011111"
          document.getElementById('restoreConfig').onclick();
        }
      }
    });
