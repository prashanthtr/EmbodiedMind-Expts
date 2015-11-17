// To use the sound on a web page with its current parameters (and without the slider box):

define(
    ["utils"],
    function (utils) {

        return function (str){

            // loading the appropriate CA rules
            if( str == "oddSequence"){
                document.getElementById('carule').value = 132;
                var str2 = utils.convert2Binary (132, 8);
                document.getElementById('carulebinary').value = str2;

            }
            else if( str == "localChanges"){
                document.getElementById('carule').value = 133;
                var str2 = utils.convert2Binary (133, 8);
                document.getElementById('carulebinary').value = str2;

            }
        }

    });
