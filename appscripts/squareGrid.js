define(
    ["sound-module","carules"],
    function (pentaTonicFactory,caRules) {

        return function (id, rowLength, colLength){

            //getting the
            var canvas = document.getElementById(id);
            var rect = canvas.getBoundingClientRect();
            var pWidth = rect.width;
            var pHeight = rect.height;
            console.log("pWidth is " + pWidth + ", and pHeight is " + pHeight);

            //scaling factor for rows and columns.
            //var xLen = 0.99 * pWidth/colLength, yLen = 0.985* pHeight/rowLength;
            var xLen = pWidth/colLength, yLen = pHeight/rowLength;

            var size = yLen;

            // //2d grid
            var grid = [];

            //creates a cell in the 2D grid as an SVG rectangle.
            //x,y, - positions, side - of the square
            function createCell(x,y,l,b){

                var cell = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                // Set any attributes as desired
                cell.setAttribute("x", x*xLen);
                cell.setAttribute("y", y*yLen);
                cell.setAttribute("width",  l);
                cell.setAttribute("height",  b);

                //cell.style.fill = 'rgb(255,255,255)';
                cell.setAttribute("fill", "grey");
                cell.setAttribute("stroke-width", 0.5);
                cell.setAttribute("stroke", "black");

                // Add to a parent node; document.documentElement should be the root svg element.
                document.getElementById("mysvg").appendChild(cell);

                //User Defined parameters
                cell.type = "link";
                cell.state = 2;

                cell.updateState = caRules;
                cell.changedState = 0;
                cell.userChange = 0;
                cell.ind = x;
                cell.row = y;

                cell.mouseDownState = {value: 0};
                cell.updateRow = { value: -1};
                cell.tone = pentaTonicFactory(x);

                cell.release = function(){
                    cell.tone.release();
                }

                cell.play = function(){
                    // play should sense the sound toggle button to play
                    if(this.state == 2){
                        this.tone.release();
                    }
                    else if(this.state == 1){
                        //console.log("going to play");
                        //this.tone.setParam("Gain", 0.25);
                        this.tone.play();
                        //setTimeout(cell.release, 150);
                    }
                    else{
                        this.tone.release();
                    }
                }

                // cell.on("mousedown", function(){

                //     console.log("this row is" + this.row + "this col is" + this.ind);
                //     this.updateRow.value = this.row;
                //     this.userChange = 1;
                //     this.mouseDownState.value = 1;
                //     console.log("first mousedown");
                //     //past states can have black or white values only

                //     //if(obj.changedState == 1 || this.row < this.timer){
                //     this.state = (this.state + 1)%2; //obj = (obj.state + 1)%2;
                //     this.changeColor();
                // });

                //function to update color of the cell based on state
                cell.changeColor = function(){
                    if(this.state == 2){
                        this.setAttribute("fill", "grey");
                    }
                    else if(this.state == 1){
                        this.setAttribute("fill", "black");
                    }
                    else{
                        this.setAttribute("fill", "white");
                    }
                }

                //cell.changeColor();
                return cell;
            }


            //simply populate the grid with the objects
            var row = 0,col=0;
            for(row = 0; row < rowLength; row++){
                grid[row] = [];
                for(col=0; col< colLength; col++){
                    grid[row][col] = new createCell(col,row,xLen, yLen);
                }
            }
            return grid;
        }

    });
