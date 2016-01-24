define(
    [],
    function(){

      return function(){
        //introductory text
        document.getElementById('userGuide').innerHTML = "<p> The following text provides instructions to play along with the Cellular automata. </p>";

        document.getElementById('userGuide').innerHTML += "<h2> Key mapping </h2> Use the following key mapping to the toggle the the immediate future of the now cell, on or off <ol> <li>h- C</li> <li>j- C#</li> <li>k- D</li> <li>l- D#</li> <li>\;- E</li> <li>'' - F</li> <li>Enter - F#</li> <li>a - G</li> <li>s - G#</li> <li>d - A</li> <li>f - A#</li> <li>g - B</li> </ol>";
        
        document.getElementById('userGuide').innerHTML += "<h2> Perturbations </h2> Red perturbations correspond to note-on action. The note is played when it reaches the now line. Yellow perturbations correspond to note-off state"; 

        document.getElementById('userGuide').innerHTML += "<h2> Instructions </h2> <ol> <li> Press start to run the CA </li> <li> Play a melody using the keyboard mappings specified above </li> <li> The cellular automata immediately responds to the changes in the user input through changes in the visual patterns on the screen </li> </ol> "
        
      }
      
});
