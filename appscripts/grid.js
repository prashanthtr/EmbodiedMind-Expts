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


            //arbitrary
            function note (noteNum){
                switch(noteNum){

                case 0: return "C"; break;
                case 1: return "C#"; break;
                case 2: return "D"; break;
                case 3: return "D#"; break;
                case 4: return "E"; break;
                case 5: return "F"; break;
                case 6: return "F#"; break;
                case 7: return "G"; break;
                case 8: return "G#"; break;
                case 9: return "A"; break;
                case 10: return "A#"; break;
                case 11: return "B"; break;
                case 12: return "B#"; break;
                case 13: return "C^"; break;
                case 14: return "C#^"; break;
                default: return "C"

                }
            }

            //creates a cell in the 2D grid as a rapheal object

            //simply populate the matrix2d with the objects
            var row = 0,col=0;
            for(row = 0; row < rowLength; row++){
                matrix2d[row] = [];
                for(col=0; col< colLength; col++){
                    matrix2d[row][col] = new createCell(paper.rect(col*xLen,row*yLen,xLen,yLen),col,row,size);
                    if( row == Math.floor(rowLength/2) ){
                        paper.text(col*xLen+xLen/2,row*yLen+yLen/2, note(col)).attr({"fill": "red"});
                    }
                }
            }
            return matrix2d;
        }

    });
