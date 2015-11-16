// To use the sound on a web page with its current parameters (and without the slider box):
require.config({
    paths: {"jsaSound": "http://animatedsoundworks.com:8001"}
});

define(
    ["jsaSound/jsaModels/pentTone"],
    function (pentaTonicFactory) {

        return function (notenum){
            // using the model loaded from jsasound

            var pentatonic = pentaTonicFactory();
            pentatonic.setParam("play", 0);    //or// pentatonic.setParamNorm("play", 0.000);
            pentatonic.setParam("Note Number", notenum);    //or// pentatonic.setParamNorm("Note Number", 0.469);
            pentatonic.setParam("Modulation Index", 75);    //or// pentatonic.setParamNorm("Modulation Index", 0.750);
            pentatonic.setParam("Gain", 1);    //or// pentatonic.setParamNorm("Gain", 0.250);
            pentatonic.setParam("Attack Time", 0.1);    //or// pentatonic.setParamNorm("Attack Time", 0.220);
            pentatonic.setParam("Release Time", 0.5);    //or// pentatonic.setParamNorm("Release Time", 0.333);

            return pentatonic;
        }

    });
