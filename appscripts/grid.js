define(
    ["createCell"],
    function (createCell) {

        return function (paper, rowLength, colLength, objSize){

            // put the width and heigth of the canvas into variables for our own convenience
            //console.log(paper);

            var pWidth = paper.width;
            var pHeight = paper.height;
            console.log("pWidth is " + pWidth + ", and pHeight is " + pHeight);

            //var colLength = 40, rowLength = 40; //len-1 time units are displayed
            //colLength = 14; // 3 octaves from 110 to 440
            //rowLength = Math.ceil((pHeight * colLength)/pWidth);

            var xLen = 0.99 * pWidth/colLength, yLen = 0.985* pHeight/rowLength;

            var size = yLen; //(pWidth * pHeight)/ ( xLen* colLength * yLen * rowLength );

            console.log("size is" + size + "ratio is");
            console.log("length is is " + xLen + ", " + yLen);
            var xOffset = 0, yOffset = 0;

            //colLength = colLength-1;
            paper.setSize(pWidth, pHeight);


            // //2d grid
            var matrix2d = [];

            //creates a cell in the 2D grid as a rapheal object

            //simply populate the matrix2d with the objects
            var row = 0,col=0;
            for(row = 0; row < rowLength; row++){
                matrix2d[row] = [];
                for(col=0; col< colLength; col++){
                    matrix2d[row][col] = new createCell(paper.rect(col*xLen,row*yLen,xLen,yLen),col,row,size);
                }
            }
            return matrix2d;
        }

    });
