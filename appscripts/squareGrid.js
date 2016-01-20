define(
  ["createCell"],
  function (createCell) {

    return function (id, rowLength, colLength){

      //getting the
      var canvas = document.getElementById(id);
      var rect = canvas.getBoundingClientRect();
      var pWidth = rect.width;
      var pHeight = rect.height;
      console.log("pWidth is " + pWidth + ", and pHeight is " + pHeight);

      //scaling factor for rows and columns.
      var xLen = pWidth/colLength, yLen = pHeight/rowLength;

      // //2d grid
      var grid = [];
      
      //simply populate the grid with the objects
      var row = 0,col=0;
      for(row = 0; row < rowLength; row++){
        grid[row] = [];
        for(col=0; col< colLength; col++){
          grid[row][col] = new createCell("bittorio", col,row,xLen, yLen, grid);
        }
      }
      return grid;
    }

  });
