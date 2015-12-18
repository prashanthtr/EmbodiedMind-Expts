// To use the sound on a web page with its current parameters (and without the slider box):
// require.config({
//     paths: {"jsaSound": "http://animatedsoundworks.com:8001"}
// });

// To use the sound on a web page with its current parameters (and without the slider box):
require.config({
    paths: {"jsaSound": "http://animatedsoundworks.com:8001"}
});


define(
    ["jsaSound/jsaModels/jsaOsc"],
    function (basicOscFactory){

        return function (notenum){
            var basicOsc = basicOscFactory();

            basicOsc.setParam("play", 0);    //or// basicOsc.setParamNorm("play", 0.000);

            basicOsc.setParam("Frequency", 220*Math.pow(2, notenum/12));    //or// basicOsc.setParamNorm("Frequency", 0.199);
            basicOsc.setParam("Type", 1);    //or// basicOsc.setParamNorm("Type", 0.250);
            basicOsc.setParam("Gain", 0);    //or// basicOsc.setParamNorm("Gain", 0.200);
            basicOsc.setParam("Attack Time", 0.05);    //or// basicOsc.setParamNorm("Attack Time", 0.010);
            basicOsc.setParam("Release Time", 0.05);    //or// basicOsc.setParamNorm("Release Time", 0.130);
            return basicOsc;
        }

    });

// define(
//     ["jsaSound/jsaModels/pentTone"],
//     function (pentaTonicFactory) {

//         return function (notenum){
//             // using the model loaded from jsasound

//             var pentatonic = pentaTonicFactory();
//             pentatonic.setParam("play", 0);    //or// pentatonic.setParamNorm("play", 0.000);
//             pentatonic.setParam("Note Number", notenum);    //or// pentatonic.setParamNorm("Note Number", 0.469);
//             pentatonic.setParam("Modulation Index", 75);    //or// pentatonic.setParamNorm("Modulation Index", 0.750);
//             pentatonic.setParam("Gain", 0);    //or// pentatonic.setParamNorm("Gain", 0.250);
//             pentatonic.setParam("Attack Time", 0.005);    //or// pentatonic.setParamNorm("Attack Time", 0.220);
//             pentatonic.setParam("Release Time", 0.005);    //or// pentatonic.setParamNorm("Release Time", 0.333);
//             //pentatonic.setParam("Decay", 0.01);    //or// pentatonic.setParamNorm("Attack Time", 0.220);


//             return pentatonic;
//         }

//     });
