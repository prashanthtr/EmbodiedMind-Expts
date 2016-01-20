define(
  ["carules","utils","caupdate"],
  function(caRules,utils,caupdate){
    
    //.  x,y, - positions, side - of the square x,y, -
    //positions, side - of the square
    return function (parent, x,y, xLen, yLen){
      
      //create an svg rectangle
      var cell = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      // Set any attributes as desired
      cell.setAttribute("x", x*xLen);
      cell.setAttribute("y", y*yLen);
      cell.setAttribute("width",  xLen);
      cell.setAttribute("height",  yLen);
      
      //cell.style.fill = 'rgb(255,255,255)';
      cell.setAttribute("fill", "grey");
      cell.setAttribute("stroke-width", 0.5);
      cell.setAttribute("stroke", "black");

      // Add to a parent node; document.documentElement should be the root svg element.
      document.getElementById(parent).appendChild(cell);
      
      cell.state = 2;
      cell.colStr = "grey";
      //calculates the state of an object using internal relation
      //between ca cells
      cell.updateState = caRules;
      cell.userChange = 0;
      cell.ind = x;
      cell.row = y;

      // cell.leftCell = function (col,row,bittorio){
      //   if( x != 0 ){
      //     return bittorio[row][bittorio.length-1];
      //   }
      //   else{
      //     return bittorio[row][col-1];
      //   }
      // }

      // cell.rightCell = function (col,row,bittorio){
      //   if( x == bittorio.length-1 ){
      //     return bittorio[row][0];
      //   }
      //   else{
      //     return bittorio[row][col+1];
      //   }
      // }
      
      //object events, declared
      cell.changeColor = function(){

        var pertCol = utils.getVal("perturbationColor");
        //also includes user change perturbation color
        if (this.userChange == 1 && pertCol == 0){
          this.setAttribute("fill", "yellow");
        }
        else if(this.userChange == 1 && pertCol == 1){
          this.setAttribute("fill", "#dd0000");
        }
        else if(this.state == 2){
          this.setAttribute("fill", "grey");
        }
        else if(this.state == 1){
          this.setAttribute("fill", "black");
        }
        else{
          this.setAttribute("fill", "white");
        }
      }

      cell.changeColor();

      cell.onmousedown = function(){

        //console.log("this row is" + this.row + "this col is" + this.ind);
        this.userChange = 1;
        this.state = utils.getVal('perturbationColor');
        this.changeColor();

        for( row = this.row+1; row<utils.getVal("gridRowLength"); row++){
          caupdate.changeFuture(row);
        }
        
      };
      
      return cell;
    }

    //this.updateState(leftCell.state, this.state, rightCell.state)
    // this.rowChange(); //update all rows
    
  });
