define(
    ["createCell"],
    function (createCell) {

        return function (paper, rowLength, colLength, objSize){

            // put the width and heigth of the canvas into variables for our own convenience
            var pWidth = paper.canvas.offsetWidth;
            var pHeight = paper.canvas.offsetHeight;
            console.log("pWidth is " + pWidth + ", and pHeight is " + pHeight);

            //var colLength = 40, rowLength = 40; //len-1 time units are displayed
            //colLength = 14; // 3 octaves from 110 to 440
            //rowLength = Math.ceil((pHeight * colLength)/pWidth);

            //xLen and yLen have to be equal to size
            var xLen = pWidth/colLength-1, yLen = pHeight/rowLength-1;
            var size = xLen;

            console.log("size is" + size + "ratio is");
            console.log("length is is " + xLen + ", " + yLen);
            var xOffset = 0, yOffset = 0;

            //colLength = colLength-1;
            paper.setSize(pWidth, rowLength*yLen);


            // //2d grid
            var matrix2d = [];

            //creates a cell in the 2D grid as a rapheal object

            //simply populate the matrix2d with the objects
            var row = 0,col=0;
            for(row = 0; row < rowLength; row++){
                matrix2d[row] = [];
                for(col=0; col< colLength; col++){
                    matrix2d[row][col] = new createCell(paper.rect(col*xLen,row*yLen,size,size),col,row,size);
                }
            }
            return matrix2d;
        }

    });
