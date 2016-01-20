define(
  ["utils"],
  function(utils){

    //updates the CA cells in a given row, using the values of the
    //previous row
    function changeFuture (row){

      var bittorio = document.getElementById("bittorio").children;
      var rowLength = utils.getVal("gridRowLength");
      var colLength = utils.getVal("gridColLength");

      // function that decides which rows to compute
      function (ind, rowLength, colLength){
        var compute = -1;
        if( parseInt(ind/rowLength) <= row){
          compute = 0;
        }
        else{
          compute = 1;
        }
        return compute;
      }
      
      console.log("Changing future of row" + row);
      bittorio[row].map( function (el,ind,arr){

        if( ind < row + ){

        }
        
        var cur = el.state;
        if( el.userChange == 1){
          // perturbation change
          console.log("unchanged perturbations")
          el.state = utils.getVal("perturbationColor");
          //this goes through structural coupling function.
          el.changeColor();
        }
        else{
          console.log("ca changes")
          //wrap around CA
          if( ind == 0){
            prev = bittorio[row-1][utils.getVal("gridColLength")-1].state;
          }
          else{
            prev = bittorio[row-1][ind-1].state;
          }
          
          if( ind == utils.getVal("gridColLength")-1){
            next = bittorio[row-1][0].state;
          }
          else{
            next = bittorio[row-1][ind+1].state;
          }
          
          el.state = el.updateState([prev,cur,next]);
          el.changeColor();
          
        }
      });

    }
    
    var exports = {};
    exports.changeFuture = changeFuture;
    return exports;

  });
