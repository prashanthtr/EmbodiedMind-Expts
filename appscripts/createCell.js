define(
  ["carules","utils","caupdate","sound-module"],
  function(caRules,utils,caupdate,basicOsc){
    
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

      cell.tone = basicOsc(x);
     
      //simply plays a note when the cell is on
      cell.play = function(){
        if(this.state == 2){
          this.tone.release();
        }
        else if(this.state == 1){
          if(this.row == Math.floor(utils.getVal('gridRowLength')/2)){
            this.tone.play();
          }
          else{
            this.tone.release();
          }
        }
        else{
          this.tone.release();
        }
      }
      
      //object events, declared
      cell.changeColor = function(){
        
        //var pertCol = utils.getVal("perturbationColor");
        //also includes user change perturbation color
        if (this.userChange == 1 && this.state == 0){
          this.setAttribute("fill", "yellow");
        }
        else if(this.userChange == 1 && this.state == 1){
          this.setAttribute("fill", "red");
        }
        else if(this.userChange == 0 && this.state == 2){
          this.setAttribute("fill", "grey");
        }
        else if(this.userChange == 0 && this.state == 1){
          this.setAttribute("fill", "black");
        }
        else{
          this.setAttribute("fill", "white");
        }
      }

      cell.changeColor();
      
      cell.updateFn = function (){

        //console.log("first")
        //console.log("this row is" + this.row + "this col is" +
        //this.ind);
        if( utils.getVal("enablePerturb") == 1){
          this.state = (this.state + 1)%2; //utils.getVal('perturbationColor');
          this.userChange = 1;
          this.changeColor();
          this.play();
        }
        else if(utils.getVal("enablePerturb") == 0){
          this.userChange = 0;
          this.state = (this.state + 1)%2; //merely toggle
          this.changeColor(); 
          this.play();
        }
        
      }
      
      cell.onmousedown = cell.updateFn;

      cell.onmouseover = function(){
        
        if( utils.getVal("enablePerturb") == 0){
          this.state = (this.state + 1)%2; //utils.getVal('perturbationColor');
          this.userChange = 0;
          this.changeColor(); 
        }
        else{
        }
        
      }
      
      return cell;
    }

    //this.updateState(leftCell.state, this.state, rightCell.state)
    // this.rowChange(); //update all rows
    
  });
