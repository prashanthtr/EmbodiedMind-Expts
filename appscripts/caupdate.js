define(
  ["utils"],
  function(utils){

    //bittorio is a 2d matrix
    
    function changeFuture (bittorio, row){

      console.log("Changing future of row" + row);
      
      bittorio[row].map( function (el,ind,arr){
        
        var cur = el.state;
        if( el.userChange == 1){ //if it is a user changed cell, do
          //not change it, only another click takes out user change
          // dont do anything
          //el.state = cur;
          //el.changeColor();
        }
        else{
          //wrapping around
          var prevCell =  bittorio[row-1];

          //three values
          var prev =-1, next=-1, cur = el.state;
          if( ind == 0){
            prev = prevCell[arr.length-1].state; //previous first cell
          }
          else {
            prev = prevCell[ind-1].state; //previous before
          }

          if( ind == arr.length-1){
            next = prevCell[0].state; //previous first
          }
          else {
            next = prevCell[ind+1].state; //wrongly turned around
          }
          
          //force the CA rule to compute
          cur = prevCell[ind].state;
          el.state = el.updateState([prev,cur,next]);
          el.changeColor();
        }

      });

    }
    var exports = {};
    exports.changeFuture = changeFuture;
    return exports;
    
    
  });
