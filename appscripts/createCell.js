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
            //calculates the state of an object using internal relation
            //between ca cells
            obj.updateState = caRules;
            obj.changedState = 0;
            obj.ind = x;
            obj.row = y;

            obj.timer = 0;

            obj.mouseDownState = {value: 0};
            obj.updateRow = { value: -1};

            //obj.tone = pentaTonicFactory(x);


            // obj.play = function(){

            //     if(this.state == 2){
            //         this.tone.setParam("play", 0);
            //     }
            //     else if(this.state == 1 && this.row == this.timer){
            //         console.log("going to play");
            //         this.tone.play();
            //     }
            //     else if(this.state == 1){
            //         this.tone.release();
            //     }
            //     else{
            //         this.tone.setParam("play", 0);
            //     }

            // }

            //object events, declared
            obj.changeColor = function(){

                if(this.state == 2){
                    this.attr({"fill": "grey"});
                }
                else if(this.state == 1){
                    this.attr({"fill": "black"});
                }
                else{
                    this.attr({"fill": "white"});
                }
                //obj.play();
            }

            obj.changeColor();

            obj.mousedown(function(){

                this.mouseDownState.value = 1;
                console.log("first mousedown");
                //past states can have black or white values only
                if(obj.changedState == 1 || this.row < this.timer){
                    this.state = (this.state + 1)%2; //obj = (obj.state + 1)%2;
                    this.changeColor();
                }
                //only future states have grey states
                else{
                    this.state = (this.state + 1)%3; //obj = (obj.state + 1)%2;
                    this.changeColor();

                }

                // if the cell is in the past, then trigger changes in all the future states
                if( this.row < this.timer){
                    console.log("this is true");
                    //making changes to the array location
                    this.updateRow.value = this.row+1;
                }


            });

            obj.updateTimer = function(nowTimer){
                this.timer = nowTimer;
                this.changeColor();
                //this.play();
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
