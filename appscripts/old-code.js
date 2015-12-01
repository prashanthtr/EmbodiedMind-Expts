        // --------------- Live update -----------------------------

        // //right now, this starts listening for mousestate changes and updates changes to all the cells
        // var listenMouse = setInterval(function(){
        //     utils.mouseBroadcast(bittorio, rowLength, colLength, mouseDownState.value);
        // }, 1000);

        //right now, this starts listening for mouse clicks on previous cells soon as program starts
        var listenVariable = null;

        var futureLoop = null;
        // recalculates all the future states from current index of change
        //called everytime a row in the past is changed
        //starts a loop that quickly refurbishes all the rows till the timer (which is the most future state that the system has calculated

        function recalcFuture(){

            //run a fresh loop till timer
            if( futureLoop == null){
                futureLoop = setInterval(function(){
                    //console.log("row is" + updateRow.value);
                    caupdate.changeFuture(updateRow.value);
                    updateRow.value++;
                    if(updateRow.value == timer){
                        clearInterval(futureLoop);
                    }
                }, 40);
            }
            //stop existing loop and run a fresh loop till timer if its a valid number less than the timer
            else if(updateRow.value < timer){
                //console.log("clearing previous timer");
                clearInterval(futureLoop);
                futureLoop = setInterval(function(){
                    //console.log("running");
                    updateRow.value++;
                    caupdate.changeFuture(updateRow.value);
                    if(updateRow.value == timer){
                        clearInterval(futureLoop);
                    }
                }, 40);

            }
            else{
                clearInterval(futureLoop);
                updateRow.value = -1;
            }

        }


        // --------------- CA UPDATE ------------------------------

        // //entering the function once, it updates the state of the
        // //bittorio and stores in the new bittorio row.
        // function caUpdate(){

        //     // it changes the ne
        //     //change happens at the timer
        //     bittorio[timer].map( function (el,ind,arr){

        //         //initialized to the current value of the element
        //         var cur = el.state;

        //         var wrapping = document.getElementById('wrapCells').value;
        //         //simple replace the cells value as the perturbation
        //         if( cur != 2){
        //             el.state = cur;
        //             el.changeColor();
        //         }
        //         else{

        //             if( wrapping == "NO"){

        //                 var prevCell =  bittorio[timer-1];
        //                 var prev =-1, next=-1;
        //                 //when the next cell is a grey
        //                 if( ind == 0 ||  ind == arr.length -1 ){
        //                     el.state = prevCell[ind].state;
        //                     el.changeColor();
        //                 }
        //                 else{
        //                     prev = prevCell[ind-1].state; //no turn around
        //                     next = prevCell[ind+1].state;
        //                     //only get the previous value if cur value is not a perturbation
        //                     cur = prevCell[ind].state;
        //                     el.state = el.updateState(prev,cur,next);
        //                     el.changeColor();
        //                 }
        //             }
        //             else{
        //                 //wrapping around
        //                 var prevCell =  bittorio[timer-1];
        //                 //three values
        //                 var prev =-1, next=-1, cur = el.state;
        //                 if( ind - 1 < 0){
        //                     prev = prevCell[arr.length-1].state; //turn around
        //                 }
        //                 else {
        //                     prev = prevCell[ Math.abs(ind-1)%arr.length].state; //turn around
        //                 }
        //                 next = prevCell[ Math.abs(ind+1)%arr.length].state;
        //                 //only if cur value is not a pertrubation, use the last state of the system.
        //                 cur = prevCell[ind].state;
        //                 el.state = el.updateState(prev,cur,next);
        //                 el.changeColor();
        //             }

        //         }
        //     });

        //     //increment timer
        //     //console.log(timer);
        //     timer++;
        //     utils.updateTimers(bittorio, rowLength, colLength,timer);
        // }


        // changes the future of all the cells from the position of the click
        function scrollOp1(changeRow){

            console.log("calculating the value of the future cells from the new current cell");
            var row = 0, col = 0;
            for(row=changeRow; row < rowLength; row++){
                caupdate.changeFuture(row);
            }

        }

        function scrollOp2(){
            var row = 0, col = 0;
            console.log("moving cells back from now -1 back to beginning");
            var row = 0, col = 0;
            for(row=0; row < now; row++){
                for(col=0; col < colLength; col++){
                    bittorio[row][col].state = bittorio[row+1][col].state;
                    bittorio[row][col].changeColor();
                    //this has to be state changed because, they influence the state of the current cell
                }
            }
        }

        function scrollOp3(){
            var row = 0, col = 0;
            console.log("moving cells back from end to now + 1");
            //            setTimeout ( function(){
            //update only the perturbations from the now+1 to the end
            for(row=now; row < rowLength-1; row++){
                for(col=0; col < colLength; col++){

                    //if( bittorio[row+1][col].userChange == 1){
                    //copying
                    //change color by changing state
                    bittorio[row][col].state = bittorio[row+1][col].state;
                    bittorio[row][col].userChange = bittorio[row+1][col].userChange;
                    //transfered
                    //bittorio[row+1][col].userChange = 0;

                    bittorio[row][col].changeColor();

                    //}

                }
            }

            //compute the new future after pushing up
            for(col=0; col < colLength; col++){
                bittorio[rowLength -1][col].state = 2;
                bittorio[rowLength -1][col].userChange = 0;
            }
            caupdate.changeFuture(rowLength - 1);

        }

        function scrollOp4(){
            var row = 0, col = 0;

            console.log("calculating the value of the current cell");
            // updating the now line
            bittorio[now].map( function (el,ind,arr){

                //initialized to the current value of the element
                var cur = el.state;
                var wrapping = document.getElementById('wrapCells').value;
                var prevCell =  bittorio[now-1];
                var nextCell =  bittorio[now+1];

                //Replace the cells value as the perturbation of the
                //future cell if user has changed the cell
                if( nextCell[ind].userChange == 1){
                    el.state = nextCell[ind].state;
                    el.changeColor();
                }
                else{
                    //do the calculation
                    if( wrapping == "NO"){

                        var prev =-1, next=-1;
                        //when the next cell is a grey
                        if( ind == 0 ||  ind == arr.length -1 ){
                            el.state = prevCell[ind].state;
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
                        //three values
                        var prev =-1, next=-1, cur = el.state;
                        if( ind - 1 < 0){
                            prev = prevCell[arr.length-1].state; //turn around
                        }
                        else {
                            prev = prevCell[ Math.abs(ind-1)%arr.length].state; //turn around
                        }
                        next = prevCell[ Math.abs(ind+1)%arr.length].state;
                        //only if cur value is not a pertrubation, use the last state of the system.
                        cur = prevCell[ind].state;
                        el.state = el.updateState(prev,cur,next);
                        el.changeColor();
                    }

                }
            });

            //           }, 1500);

            //            setTimeout ( function(){

            //discard the current now + 1 that was used to create
            //the current now
            // bittorio[now + 1].map(function (el){
            //     //el.state = 2;
            //     el.userChange = 0;
            //     //el.changeColor();
            // });

            utils.playAllSounds(bittorio[now]);
            timer++;
            utils.updateTimers(bittorio, rowLength, colLength,timer);

        }


function oldCASCROLL(){


            console.log("timer is" + timer);

            // //compute all rows from now + 1 to the end after the new current line is computed

            // console.log("calculating the value of the future cells from the new current cell");
            // var row = 0, col = 0;
            // for(row=now+1; row < rowLength; row++){
            //     caupdate.changeFuture(row);
            // }

            // console.log("moving cells back from now -1 back to beginning");
            // var row = 0, col = 0;
            // for(row=0; row < now; row++){
            //     for(col=0; col < colLength; col++){
            //         bittorio[row][col].state = bittorio[row+1][col].state;
            //         bittorio[row][col].changeColor();
            //         //this has to be state changed because, they influence the state of the current cell
            //     }
            // }

            console.log("Scrolling cells up from end to start");
//            setTimeout ( function(){
                //update only the perturbations from the now+1 to the end
                for(row=0; row < rowLength-1; row++){
                    for(col=0; col < colLength; col++){

                            //copying
                            //change color by changing state
                            bittorio[row][col].state = bittorio[row+1][col].state;
                            bittorio[row][col].userChange = bittorio[row+1][col].userChange;
                            //transfered
                            bittorio[row+1][col].userChange = 0;

                            bittorio[row][col].changeColor();

                        //else leave the computed values

                        /*else{
                            //change color without state change
                            bittorio[row][col].colStr = bittorio[row+1][col].colStr;
                            bittorio[row][col].attr({"fill": bittorio[row][col].colStr});

                        }*/
                    }
                }

            console.log("calculating the value of the future");
            // // updating the now line
            //     bittorio[now].map( function (el,ind,arr){

            //         //initialized to the current value of the element
            //         var cur = el.state;
            //         var wrapping = document.getElementById('wrapCells').value;
            //         var prevCell =  bittorio[now-1];
            //         var nextCell =  bittorio[now+1];

            //         //Replace the cells value as the perturbation of the
            //         //future cell if user has changed the cell
            //         if( nextCell[ind].userChange == 1){
            //             el.state = nextCell[ind].state;
            //             el.changeColor();
            //         }
            //         else{
            //             //do the calculation
            //             if( wrapping == "NO"){

            //                 var prev =-1, next=-1;
            //                 //when the next cell is a grey
            //                 if( ind == 0 ||  ind == arr.length -1 ){
            //                     el.state = prevCell[ind].state;
            //                     el.changeColor();
            //                 }
            //                 else{
            //                     prev = prevCell[ind-1].state; //no turn around
            //                     next = prevCell[ind+1].state;
            //                     //only get the previous value if cur value is not a perturbation
            //                     cur = prevCell[ind].state;
            //                     el.state = el.updateState(prev,cur,next);
            //                     el.changeColor();
            //                 }
            //             }
            //             else{
            //                 //wrapping around
            //                 //three values
            //                 var prev =-1, next=-1, cur = el.state;
            //                 if( ind - 1 < 0){
            //                     prev = prevCell[arr.length-1].state; //turn around
            //                 }
            //                 else {
            //                     prev = prevCell[ Math.abs(ind-1)%arr.length].state; //turn around
            //                 }
            //                 next = prevCell[ Math.abs(ind+1)%arr.length].state;
            //                 //only if cur value is not a pertrubation, use the last state of the system.
            //                 cur = prevCell[ind].state;
            //                 el.state = el.updateState(prev,cur,next);
            //                 el.changeColor();
            //             }

            //         }
            //     });

            // //discard the current now + 1 that was used to create
            //     //the current now
            //     bittorio[now + 1].map(function (el){
            //         //el.state = 2;
            //         el.userChange = 0;
            //         //el.changeColor();
            //     });

            //keeps the future changes that the user has created
            //with some idea in mind

                //before calculating the value of the next row, make the
                //state of all the cells 2, except the user changed ones
                // for(row=now+2; row < rowLength; row++){
                //     bittorio[row].map(function (el){
                //         if( el.userChange == 1){
                //             //keep the state
                //             //el.userChange = 0;
                //         }
                //         else{
                //             //change to uncomputed
                //             //el.state = 2;
                //             //el.changeColor();
                //         }
                //     });
                //}

//            }, 1750);

            // //make the new row unperturbed
            // //update all the rows from the now+1 to the end
            // for(col=0; col < colLength; col++){
            //      bittorio[rowLength-1][col].state = 2;
            //     //     bittorio[row][col].changeColor();
            // }

            // bittorio[rowLength-1].map( function (el,ind,arr){

            //     //initialized to the current value of the element
            //     var cur = el.state;
            //     var wrapping = document.getElementById('wrapCells').value;
            //     var prevCell =  bittorio[rowLength-2];

            //     //compute the values of the last cell using previous values
            //     if( wrapping == "NO"){

            //         var prev =-1, next=-1;
            //         //when the next cell is a grey
            //         if( ind == 0 ||  ind == arr.length -1 ){
            //             el.state = prevCell[ind].state;
            //             el.changeColor();
            //         }
            //         else{
            //             prev = prevCell[ind-1].state; //no turn around
            //             next = prevCell[ind+1].state;
            //             //only get the previous value if cur value is not a perturbation
            //             cur = prevCell[ind].state;
            //             el.state = el.updateState(prev,cur,next);
            //             el.changeColor();
            //         }
            //     }
            //     else{
            //         //wrapping around
            //         //three values
            //         var prev =-1, next=-1, cur = el.state;
            //         if( ind - 1 < 0){
            //             prev = prevCell[arr.length-1].state; //turn around
            //         }
            //         else {
            //             prev = prevCell[ Math.abs(ind-1)%arr.length].state; //turn around
            //         }
            //         next = prevCell[ Math.abs(ind+1)%arr.length].state;
            //         //only if cur value is not a pertrubation, use the last state of the system.
            //         cur = prevCell[ind].state;
            //         el.state = el.updateState(prev,cur,next);
            //         el.changeColor();
            //     }
            // });

            //compute the new future after pushing up
            for(var col=0; col < colLength; col++){
                bittorio[rowLength -1][col].state = 2;
                bittorio[rowLength -1][col].userChange = 0;
            }
            caupdate.changeFuture(bittorio, rowLength - 1);

            utils.playAllSounds(bittorio[now]);
            timer++;
            utils.updateTimers(bittorio, rowLength, colLength,timer);


}

       document.getElementById('step1').addEventListener("click", function(){

            if( stepCount == 0){
                stepCount= (stepCount+1)%3;
                scrollOp1();
            }
            else if( stepCount == 1){
                stepCount= (stepCount+1)%3;
                scrollOp2();
            }
            else if( stepCount == 2){
                stepCount= (stepCount+1)%3;
                scrollOp3();
            }
            // else if( stepCount == 3){
            //     stepCount= (stepCount+1)%4;
            //     scrollOp4();
            // }
        });
        // document.getElementById('live').onclick = function(){
        //     if( this.value == "YES" ){
        //         this.value = "NO";
        //         //mute all the cells
        //         if(listenVariable != null){
        //             clearInterval(listenVariable);
        //         }
        //     }
        //     else{
        //         this.value = "YES";

        //         //only listens when live is on
        //         listenVariable = setInterval(function(){
        //             //console.log("the true value is update" + updateRow.value);
        //             if(updateRow.value != -1){
        //               //  console.log("coming here");
        //                 recalcFuture();
        //             }
        //             else{
        //                 //nothing
        //             }
        //         }, 20);

        //     }
        // };
