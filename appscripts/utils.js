define(
    [],
    function(){

        var initState = [];

        // initializes the first row of bittorio
        function init ( bittorio, colLength,now){

            var row = now, col=0;
            for(col=0; col< colLength; col++){
                bittorio[row][col].state = 0;
                bittorio[row][col].userChange = 0;
                bittorio[row][col].changeColor();
                bittorio[row][col].changedState = 0;
            }
        }

        //stores the initial state in array representation
        // easier to store the init states for 80 columns
        // and replicate Varela's results
        function storeInitState (bittorio, colLength,now){
            for(var col=0; col< colLength; col++){
                initState.push(bittorio[now][col].state);
            }
            document.getElementById('initConfig').value = initState.join("");
        }

        //restores the stored initial state to bittorio now
        function restoreInitState (bittorio, colLength,now){

            var oldState = document.getElementById('initConfig').value.split("");
            for(var col=0; col< colLength; col++){
                bittorio[now][col].state = oldState[col];
                bittorio[now][col].userChange = 0;
                bittorio[now][col].changeColor();
            }
        }

        //clears the stored initial state in array representation
        function clearInitState (){
            initState = [];
        }

        // CA states to number
        function findInitConfigVal(bittorio,colLength,now){
            row = now;
            var arr = [];
            for(col=0; col< colLength; col++){
                arr[col] = bittorio[row][col].state;
            }
            return convert2Decimal(arr);
        }

        //nth bit as specified by standard binary
        function setNthBit (bittorio, now, colLength, n){
            //reset();
            var row = now, col=0;
            for(col= 0; col < colLength; col++){
                console.log("col is" + col);
                if( col == colLength-1-n){
                    bittorio[row][col].state = 1;
                    bittorio[row][col].changeColor();
                }
                else{
                    bittorio[row][col].state = 0;
                    bittorio[row][col].changeColor();
                    bittorio[row][col].changedState = 0;
                }
            }
            //also sets the value of the corresponding decimal number
            document.getElementById('configNum').value  = findInitConfigVal(bittorio, colLength, now);
        }


        function randomInit (bittorio, colLength, now){
            //reset();
            var row = now, col=0;
            for(col=0; col< colLength; col++){
                bittorio[row][col].state = Math.floor( 0.4 + Math.random());
                bittorio[row][col].changeColor();
                bittorio[row][col].changedState = 1;
            }
            //also sets the value of the corresponding decimal number
            document.getElementById('configNum').value  = findInitConfigVal(bittorio, colLength, now);
            }


        // //converts to binary of suitable,length
        function convert2Binary (num, len){

            var str = "";
            var rem = 0;

            while( num > 1 ){
                rem = num % 2;
                str += rem;
                num = parseInt(num/2);
            }
            if( num == 0){
                str+=0;
            }
            else str+=1;

            var i = str.length;
            while( i < len ){
                str+=0;
                i++;
            }

            str = str.split("").reverse().join("");
            return str;
        }

        function convert2Decimal ( binArr ){

            var sum = 0;
            //sum.toFixed(21);
            var i = binArr.length;
            while( i -- ){
                sum+= binArr[i]*Math.pow(2, binArr.length-i-1);
                //sum.toFixed(21);
            }
            console.log(sum + "");
            return sum;
        }

        //resets all the cells except the initial cell
        function reset (bittorio, rowLength, colLength, now){
            for(row = 0; row < rowLength; row++){
                for(col=0; col< colLength; col++){
                    bittorio[row][col].state = 2;
                    bittorio[row][col].userChange = 0;
                    bittorio[row][col].changeColor();
                    bittorio[row][col].changedState = 0;

                }
            }
            stopAllSounds(bittorio[now]);
        }

        //toggles only a given state of row and column
        function toggleState (bittorio, row, col){

            if( bittorio[row][col].state == 2){
                console.log("grey to white");
                bittorio[row][col].state = 0;
                bittorio[row][col].changeColor();
            }
            else if(bittorio[row][col].state == 0){
                console.log("white to black");
                bittorio[row][col].state = 1;
                bittorio[row][col].changeColor();
            }
            else{
                console.log("black to white");
                bittorio[row][col].state = 0;
                bittorio[row][col].changeColor();
            }
            bittorio[row][col].userChange = 1;
            bittorio[row][col].changedState = 1;
        }

        function clear (bittorio, colLength, now){

            row = now;
            for(col=0; col< colLength; col++){
                bittorio[row][col].state = 0;
                bittorio[row][col].changeColor();
                bittorio[row][col].changedState = 1;
            }
            document.getElementById('configNum').value  = findInitConfigVal(bittorio, colLength, now);
        }

        function setConfig (str, bittorio, colLength,now){
            var row = now;
            for(col=0; col< colLength; col++){
                bittorio[row][col].state = parseInt(str[col]);
                bittorio[row][col].changeColor();
            }
        }

        function stopAllSounds (tone){
            //console.log("tone lengt is " + tone.length);
            tone.map(function(el){
                el.tone.release();
            });
        }

        function playAllSounds(arr){
            //console.log("tone lengt is " + arr.length);
            arr.map(function(el){
                el.play();
            });
        }


        // function updateTimers (bittorio, rowLength, colLength,timer){
        //     for(row = 0; row < rowLength; row++){
        //         for(col=0; col< colLength; col++){
        //             bittorio[row][col].updateTimer(timer);
        //         }
        //     }
        // }

        //updates changes on mouseclick
        function updateChange (bittorio, rowLength, colLength, upRow, mouseDown){
            for(row = 0; row < rowLength; row++){
                for(col=0; col< colLength; col++){
                    //assigning a pointer to the object
                    bittorio[row][col].updateRow = upRow;
                    //bittorio.mouseDownState = mouseDown;
                }
            }
        }


        //updates changes on mouseclick
        function mouseBroadcast (bittorio, rowLength, colLength, mouse){
            for(row = 0; row < rowLength; row++){
                for(col=0; col< colLength; col++){
                    //assigning a pointer to the object
                    bittorio[row][col].mouseDownState.value = mouse;
                }
            }
        }

        //mutes all cells
        function mute (bittorio, rowLength, colLength){
            for(row = 0; row < rowLength; row++){
                for(col=0; col< colLength; col++){
                    //assigning a pointer to the object
                    bittorio[row][col].tone.setParam("Gain", 0);
                }
            }
        }

        //unmutes all cells
        function unmute (bittorio, rowLength, colLength){
            for(row = 0; row < rowLength; row++){
                for(col=0; col< colLength; col++){
                    bittorio[row][col].tone.setParam("Gain", parseFloat(document.getElementById('gain').value));
                }
            }
        }


        //unmutes all cells
        function setGain (bittorio, rowLength, colLength, gain){
            var row = 0, col = 0;
            for(row = 0; row < rowLength; row++){
                for(col=0; col< colLength; col++){
                    bittorio[row][col].tone.setParam("Gain", gain);
                }
            }
        }


        var exports = {};
        exports.init = init;
        exports.randomInit = randomInit;
        exports.convert2Binary = convert2Binary;
        exports.convert2Decimal = convert2Decimal;
        exports.reset = reset;
        exports.clear = clear;
        exports.setConfig = setConfig;
        exports.findInitConfigVal = findInitConfigVal;
        exports.stopAllSounds = stopAllSounds;
        //exports.updateTimers = updateTimers;
        exports.updateChange = updateChange;
        exports.mouseBroadcast = mouseBroadcast;
        exports.mute = mute;
        exports.setNthBit = setNthBit;
        exports.unmute = unmute;
        exports.setGain = setGain;
        exports.playAllSounds = playAllSounds;
        exports.storeInitState = storeInitState;
        exports.restoreInitState = restoreInitState
        exports.clearInitState = clearInitState;
        exports.toggleState = toggleState;
        return exports;

    });
