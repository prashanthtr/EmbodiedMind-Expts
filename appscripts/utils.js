define(
    [],
    function(){

        // initializes the first row of bittorio
        function init ( bittorio, colLength){

            var row = 0, col=0;
            for(col=0; col< colLength; col++){
                bittorio[row][col].state = 0;
                bittorio[row][col].changedState = 1;
                bittorio[row][col].changeColor();
            }

        }

        // CA states to number
        function findInitConfigVal(bittorio,colLength){
            row = 0;
            var arr = [];
            for(col=0; col< colLength; col++){
                arr[col] = bittorio[row][col].state;
            }
            return convert2Decimal(arr);
        }


        function randomInit (bittorio, colLength){
            //reset();
            var row = 0, col=0;
            for(col=0; col< colLength; col++){
                bittorio[row][col].state = Math.floor( 0.4 + Math.random());
                bittorio[row][col].changeColor();
                bittorio[row][col].changedState = 1;
            }
            //also sets the value of the corresponding decimal number
            document.getElementById('configNum').value  = findInitConfigVal(bittorio, colLength);
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
            var i = binArr.length;
            while( i -- ){
                sum+= binArr[i]*Math.pow(2, binArr.length-i-1);
            }
            return sum;
        }

        //resets all the cells except the initial cell
        function reset (bittorio, rowLength, colLength){
            for(row = 1; row < rowLength; row++){
                for(col=0; col< colLength; col++){
                    bittorio[row][col].state = 2;
                    bittorio[row][col].changeColor();
                    bittorio[row][col].changedState = 0;
                }
            }
            //stopAllSounds(bittorio[0]);
        }

        function clear (bittorio, colLength){

            row = 0;
            for(col=0; col< colLength; col++){
                bittorio[row][col].state = 0;
                bittorio[row][col].changeColor();
                bittorio[row][col].changedState = 1;
            }
            document.getElementById('configNum').value  = findInitConfigVal(bittorio, colLength);
        }

        function setConfig (str, bittorio, colLength){
            row = 0;
            for(col=0; col< colLength; col++){
                bittorio[row][col].state = parseInt(str[col]);
                bittorio[row][col].changeColor();
            }
        }

        // function stopAllSounds (tone){
        //     console.log("tone lengt is " + tone.length);
        //     tone.map(function(el){
        //         el.tone.release();
        //     });
        // }


        //resets all the cells except the initial cell
        function updateTimers (bittorio, rowLength, colLength,timer){
            for(row = 0; row < rowLength; row++){
                for(col=0; col< colLength; col++){
                    bittorio[row][col].updateTimer(timer);
                }
            }
        }

        //updates changes on mouseclick
        function updateChange (bittorio, rowLength, colLength, upRow, mouseDown){
            for(row = 0; row < rowLength; row++){
                for(col=0; col< colLength; col++){
                    //assigning a pointer to the object
                    bittorio[row][col].updateRow = upRow;
                    bittorio.mouseDownState = mouseDown;
                }
            }
        }


        //updates changes on mouseclick
        function mouseBroadcast (bittorio, rowLength, colLength, mouse){
            for(row = 0; row < rowLength; row++){
                for(col=0; col< colLength; col++){
                    //assigning a pointer to the object
                    bittorio.mouseDownState.value = mouse;
                }
            }
        }


        var exports = {};
        exports.init = init;
        exports.randomInit = randomInit;
        exports.convert2Binary = convert2Binary
        exports.convert2Decimal = convert2Decimal;
        exports.reset = reset;
        exports.clear = clear;
        exports.setConfig = setConfig;
        exports.findInitConfigVal = findInitConfigVal;
        //exports.stopAllSounds = stopAllSounds;
        exports.updateTimers = updateTimers;
        exports.updateChange = updateChange;
        exports.mouseBroadcast = mouseBroadcast;
        return exports;

    });
