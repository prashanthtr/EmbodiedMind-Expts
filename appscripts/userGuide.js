define(
    [],
    function(){

        return function (){

            //introductory text
          document.getElementById('userGuide').innerHTML  = "<p>This is an app for exploring ideas to central to enactive cognition, such as operational closure and structural coupling, by applying them to a 1D cellular automaton (CA)";

          document.getElementById('userGuide').innerHTML  += "CA states:</p> <ol> <li>The center row is the initial configuration of the CA.</li> <li>Each subsequent row is the configuration of the CA in a subsequent time-step and each row in the previous row is the configuration of the CA at an earlier time  </li> <li> Current state has cells that are black or white, if unperturbed, and red or yellow if perturbed. Past state has white or black cells depending on the CA rules. Future states are grey, white, black, red or yellow. Grey cells are uncomputed, white or black cells are computed using CA rule projected into future, and red or yellow cells are 'perturbations' that are 'external' to the CA.</li> </ol>"

          document.getElementById('userGuide').innerHTML += "<p>User actions:</p> <ol> <li>Initial configuration: user can click the cells on or off </li> <li>Rules: the user can enter a particular rule (in binary or decimal) or select certain rules from the pull-down menu. Note: the rules in the pull-down menu are created by applying boolean functions on the state of adjacent cells in an k=2,r=1 CA. These result in specific kinds of interesting structural coupling (eg, “odd sequence recognizer”)</li> <li>Perturbations: user can create perturbations by clicking cells on or off</li> <li> Structural changes: user can change the number of states that CA has and the number of neighbours that it pays attention to </li> </ol>";
        }
      
    });
