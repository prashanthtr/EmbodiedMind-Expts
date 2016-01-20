define(
    [],
    function(){

      //the cellular automaton rules that each object uses to compute
      //their states.

      return function ( prevStates ) {

        function oneDimensionalCA (){

          var prev = prevStates[0], cur = prevStates[1], next = prevStates[2];

          var rule = document.getElementById('carulebinary').value;
          rule = rule.split("");
          rule = rule.map(function(r){ return parseInt(r);});

          //console.log("carule is" + rule);

          var castate = prev + "" +  cur + ""+ next;
          //console.log(castate);
          //ca rule
          var ret = -1;
          switch(castate){
          case "111": ret = rule[0]; break;
          case "110": ret = rule[1];  break;
          case "101": ret = rule[2];  break;
          case "100": ret = rule[3];  break;
          case "011": ret = rule[4]; break;
          case "010": ret = rule[5];  break;
          case "001": ret = rule[6];  break;
          case "000": ret = rule[7];  break;
          default: ret = -1; break;
          };
          //console.log("ret is" + ret);
          return ret;
        }
        
        function booleanFns (){

          var prev = prevStates[0], cur = prevStates[1], next = prevStates[2];

          var rule = document.getElementById('carulebinary').value;
          rule = rule.split("");
          rule = rule.map(function(r){ return parseInt(r);});

          var ret = -1;
          var adjInput = prev + "" + next;
          
          if(cur == 1){
            switch(adjInput){
            case "00": ret = rule[0]; break;
            case "01": ret = rule[1];  break;
            case "10": ret = rule[2];  break;
            case "11": ret = rule[3];  break;
            default: ret = -1; break;
            }    
          }
          else if(cur == 0){
            switch(adjInput){
            case "00": ret = rule[4]; break;
            case "01": ret = rule[5];  break;
            case "10": ret = rule[6];  break;
            case "11": ret = rule[7];  break;
            default: ret = -1; break;
            }
          }
          
          return ret;
        }

        //previous states ordered in cyclic order from 0,1,2,4,5,6,7,8,9
        function gameOfLife (){

          var sum = prevStates.reduce(function(a,b){return a+b;});
          var cur = prevStates[8];
          console.log("sum is" + sum);
          var ret = 2; //grey state

          if( cur == 1 && sum < 2){
            ret = 0; //dead
          }
          else if( cur == 1 && (sum == 2 || sum == 3)){
            ret = 1; //alive
          }
          else if( cur == 1 && sum > 3){
            ret = 0; //dead
          }
          else if( cur == 0 && sum > 3){
            ret = 0; //dead
          }
          console.log("ret is" + ret);
          return ret;
        }

        return booleanFns;
      }

    });
