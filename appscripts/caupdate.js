define(
    [],
    function(){

        //updates the CA cells in a given row, using the values of the
        //previous row
        function changeFuture (bittorio, row){

            console.log("Changing future of row" + row);
            bittorio[row].map( function (el,ind,arr){

                var wrapping = document.getElementById('wrapCells').value;
                var cur = el.state;
                if( el.userChange == 1){
                    // state change
                    el.state = cur;
                    el.changeColor();
                }
                else{
                    if( wrapping == "NO"){

                        var prevCell =  bittorio[row-1];
                        var prev =-1, next=-1;

                        if( ind == 0){
                            cur = prevCell[ind].state;
                            next = prevCell[ind+1].state;
                            prev = 0; //or 1, not sure
                            //updating with prev state is 0
                            el.state = el.updateState(prev,cur,next);
                            el.changeColor();
                        }
                        else if(ind == arr.length -1 ){
                            cur = prevCell[ind].state;
                            prev = prevCell[ind-1].state;
                            next = 0; //or 1, its hard to say

                            //updating with next state is 0
                            el.state = el.updateState(prev,cur,next);
                            el.changeColor();
                        }
                        else{
                            prev = prevCell[ind-1].state; //no turn around
                            next = prevCell[ind+1].state;
                            //only get the previous value if cur value is not a perturbation

                            cur = prevCell[ind].state;
                            el.state = el.updateState(prev,cur,next);
                            el.changeColor();
                        }
                    }
                    else{
                        //wrapping around
                        var prevCell =  bittorio[row-1];
                        //three values
                        var prev =-1, next=-1, cur = el.state;
                        if( ind - 1 < 0){
                            prev = prevCell[arr.length-1].state; //turn around
                        }
                        else {
                            prev = prevCell[ Math.abs(ind-1)%arr.length].state; //turn around
                        }
                        next = prevCell[ Math.abs(ind+1)%arr.length].state;
                        //force the CA rule to compute
                        cur = prevCell[ind].state;
                        el.state = el.updateState(prev,cur,next);
                        el.changeColor();
                    }
                }

            });

        }

        var exports = {};
        exports.changeFuture = changeFuture;
        return exports;

    });