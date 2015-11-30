define(
    [],
    function(){

        // the cellular automaton rules that each object uses to compute
        // their states.
        return function (prev, cur, next){

            var rule = document.getElementById('carulebinary').value;
            rule = rule.split("");
            rule = rule.map(function(r){ return parseInt(r);});

            //console.log("carule is" + rule);

            var castate = prev + "" +  cur + ""+ next;
            //console.log(castate);
            //ca rule
            var ret = -1;
            switch(castate){
            case "111": ret = rule[0]; break;
            case "110": ret = rule[1];  break;
            case "101": ret = rule[2];  break;
            case "100": ret = rule[3];  break;
            case "011": ret = rule[4]; break;
            case "010": ret = rule[5];  break;
            case "001": ret = rule[6];  break;
            case "000": ret = rule[7];  break;
            default: ret = -1; break;
            };
            //console.log("ret is" + ret);
            return ret;
        }

    });
