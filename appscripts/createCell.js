define(
    ["sound-module","carules"],
    function(pentaTonicFactory,caRules){

        //.  x,y, - positions, side - of the square x,y, -
        //positions, side - of the square
        return function (paperObj, x,y,s){

            var obj = paperObj;
            obj.attr({"stroke-opacity": 0.2, "stroke-width": 1});

            obj.type = "link";
            obj.state = 2;
            obj.colStr = "grey";
            //calculates the state of an object using internal relation
            //between ca cells
            obj.updateState = caRules;
            obj.changedState = 0;
            obj.userChange = 0;
            obj.ind = x;
            obj.row = y;

            obj.timer = 0;

            obj.mouseDownState = {value: 0};

            obj.updateRow = { value: -1};

            obj.tone = pentaTonicFactory(x);

            obj.release = function(){

                obj.tone.release();
            }

            obj.play = function(){
                // play should sense the sound toggle button to play
                if(this.state == 2){
                    this.tone.release();
                }
                else if(this.state == 1){
                    //console.log("going to play");
                    //this.tone.setParam("Gain", 0.25);
                    this.tone.play();
                    //setTimeout(obj.release, 150);
                }
                else{
                    this.tone.release();
                    //
                }
            }

            //object events, declared
            obj.changeColor = function(){

                // if (this.userChange == 1 && this.state == 0){
                //     this.attr({"fill": "#ffcccc"});
                // }
                // else if(this.userChange == 1 && this.state == 1){
                //     this.attr({"fill": "#b30000"});
                // }
                if(this.state == 2){
                    this.colStr = "grey";
                    this.attr({"fill": "grey"});
                }
                else if(this.state == 1){
                    this.colStr = "black";
                    this.attr({"fill": "black"});
                }
                else{
                    this.colStr = "white";
                    this.attr({"fill": "white"});
                }
            }

            obj.changeColor();

            obj.mousedown(function(){

                console.log("this row is" + this.row + "this col is" + this.ind);
                this.updateRow.value = this.row;
                this.userChange = 1;
                this.mouseDownState.value = 1;
                console.log("first mousedown");
                //past states can have black or white values only

                //if(obj.changedState == 1 || this.row < this.timer){
                    this.state = (this.state + 1)%2; //obj = (obj.state + 1)%2;
                this.changeColor();

                //}
                //only future states have grey states
                //no grey states

                /*else{
                    this.state = (this.state + 1)%3; //obj = (obj.state + 1)%2;
                    this.changeColor();

                }*/

                // if the cell is in the past, then trigger changes in all the future states

                /*if( this.row < this.timer){
                    //console.log("this is true");
                    //making changes to the array location
                    this.updateRow.value = this.row+1;
                 }*/


            });

            //updates the timer and does different actions on the timer
            obj.updateTimer = function(nowTimer){
                this.timer = nowTimer;
                this.changeColor();
            }

            //consider adding these events later
            // obj.mouseup(function(){
            //     this.mouseDownState.value = 0;
            // });


            // //toggle state
            // obj.hover(function(){

            //     if( this.mouseDownState.value == 1){
            //         if(obj.changedState == 1 || this.row < this.timer){
            //             this.state = (this.state + 1)%2; //obj = (obj.state + 1)%2;
            //             this.changeColor();
            //         }
            //         else{
            //             console.log("added click" + this.state);
            //             this.state = (this.state + 1)%3; //obj = (obj.state + 1)%2;
            //             this.changeColor();
            //         }

            //         // if the cell is in the past, then trigger changes in all the future states
            //         if( this.row < this.timer){
            //             console.log("this is true");
            //             //making changes to the array location
            //             this.updateRow.value = this.row+1;
            //         }

            //     }

            // });

            return obj;
        }

    });
