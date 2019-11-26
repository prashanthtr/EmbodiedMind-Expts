
This is an attempt to recreate the results of Bittorio from, the book, The
Embodied Mind. One of the significant challenges in recreating these results is
the lack of information about the interpretation of the 8-bit rule sequence used
in simulations. In order to reimplement the results with more transparency, I
have found equivalent Wolfram rules that correspond to Bittorio rules. Using
these equivalent Wolfram rules, I will attempt to recreate the original Bittorio
rules through a combination of boolean functions and adjacent input pairs to
each cell - as as well find ways to extend its abilities.


The table presents unique Wolfram rules that are equivalent to the Bittorio
rules. These rules can be tested through simulation that is run by the
accompanying code (also hosted as github.io/prashanthtr/bittorio)

| Wolfram rule | Varela Rule |
| :----------  | :---------  |
| 00101000     | 00010001    |
| 00101100     | 10010001    |
| 10010110     | 10010110    |
| 10010010     | 00010110    |
| 10101111     | 01101111    |
| 01011110     | 01101110    |
| 11001001     | 01111000    |
| 01001001     | 01101000    |
| 00111110     | 11100110    |
| 10000100     | 10010001    |


More notes on perturbations to come.

<!-- operational closure and structural coupling in a 1D cellular automaton (CA). -->

<!-- From theory, the combination of closure and coupling brings forth a world of -->
<!-- signification in an environment of random perturbations [Varela, 1991]. -->

<!-- This theory of emergent signification was implemented as a cellular automata, -->
<!-- named Bittorio. -->

<!-- Closure was opertaionalized through pairs of boolean functions -->
<!-- (8 bit binary digits) that specify changes in the state as a function of -->
<!-- adjacent cells. The environmental perturbations were specified as binary -->
<!-- sequences that change the state of one or more cells in Bittorio. In response, -->
<!-- Bittorio self-organizes its state in response to the perturbing sequences. -->

<!-- Signification: Bittorio demonstrates two types of changes in state when it -->
<!-- self-organizes in response to perturbing sequences. While some perturbations -->
<!-- result in temporary change of state, other sequence of pertubations result in -->
<!-- permanent changes in spatio-temporal configuration of the cellular automaton. -->
<!-- The sequences that result in permanent changes in spatio-temporal configuration -->
<!-- of the cellular automataon are understood as its world of signification. -->

<!-- Reimplmenting the results: -->

<!-- One of the significant challenges in recreating these results of Bittorio is the -->
<!-- lack of information about the interpretation of the 8-bit rule sequence. -->

<!-- On the one hand, the rules 8-bit rules seem to be differently interpreted from -->
<!-- the CA rules used in other sources (e.g., Wolfram rules). This is clear as the -->
<!-- simulations of Bittorio do not pictorially correspond to simulations of the same -->
<!-- rule sequence interpreted in Wolfram rule. On the other hand, the available -->
<!-- material does not provide sufficient information to parse the rules in terms of -->
<!-- input pairs and boolean functions. -->


<!-- Qualitative method to find equivalence: -->

<!-- In order to reimplement the results, I have qualitatively compared the -->
<!-- simulation images in order to find a equivalence between CA rules ahd Bittorio -->
<!-- rules. The three steps in the process are: -->

<!-- 1) compare the simulation images from Bittorio (In Embodied Mind), and the -->
<!-- visual properties of Wolfram's Cellular automata rules (Wolfram, 1986) to find -->
<!-- an equivalent Wolfram rule. -->

<!-- 2) Verify the equivalence of the Wolfram rule through experimental simulation. -->

<!-- 3) Using the Wolfram rule, attempt to recreate the original rules through a -->
<!-- combination of boolean functions and adjacent input pairs to each cell. -->


<!-- Results: -->

<!-- By comparing and contrasting the simulation images, I have been able to find -->
<!-- unique Wolfram rules that are equivalent to the Bittorio rules used in the -->
<!-- simulation. These rules can be used in the simulation that is run by the code. -->

<!-- | Wolfram rule | Varela Rule | -->
<!-- | :----------  | :---------  | -->
<!-- | 00101000     | 00010001    | -->
<!-- | 00101100     | 10010001    | -->
<!-- | 10010110     | 10010110    | -->
<!-- | 10010010     | 00010110    | -->
<!-- | 10101111     | 01101111    | -->
<!-- | 01011110     | 01101110    | -->
<!-- | 11001001     | 01111000    | -->
<!-- | 01001001     | 01101000    | -->
<!-- | 00111110     | 11100110    | -->
<!-- | 10000100     | 10010001    | -->






<!-- There are several different -->

<!-- correspond to Wolfram rules is , which is CA rules of -->

<!-- The -->

<!-- The CA rules were corresponded as boolean functions of the inputs to each -->
<!-- cellular unit. -->


<!-- In this environment, Bittorio encounters  perturbations of that change the state -->
<!-- of one or more cells/units in the cellular automata. -->


<!-- Bittorio was used the phenomenon of through a combination of -->






<!-- 1. The first (top) row is the initial configuration of the CA. -->
<!-- 2. Each subsequent row is the state of the CA in a subsequent time-step -->
<!-- 3. Future states can be grey, black, or white. Cells that are black or -->
<!--    white are treated as 'perturbations' that are 'external' to the CA. -->

<!-- CA rules: -->

<!-- 1. Usually, the state of a cell is computed based on its state and the -->
<!--    state of its immediate neighbors during the previous time-step -->
<!-- 2. If, however, a cell encounters a "perturbation", that cell is -->
<!--    replaced by the state of the perturbing cell. -->

<!-- User actions: -->

<!-- 1. Initial configuration: user can click the cells on or off or drag -->
<!--    (click and move) the mouse over them. -->
<!-- 2. Rules: user can enter a particular rule (in binary or decimal) or -->
<!--    select certain rules from the pull-down menu. Note: the rules in the -->
<!--    pull-down menu result in specific kinds of interesting structural -->
<!--    coupling (eg, "odd sequence recognizer") -->
<!-- 3. Perturbations: user can create perturbations by clicking cells on or -->
<!--    off (or) dragging (click and move) over them. -->



<!-- Extending bittorio to threshold neurons: -->

<!-- The central hypothesis of varela is that cognition (world of significance) -->
<!-- emerges out of closure and coupling between the boundary of the cell and the its -->
<!-- environment. -->

<!-- However, implementing this physical model with more realistic biological systems -->
<!-- is important as it will connect the ideas between the two domains better - -->
<!-- highlighting the embodied dimension of computation. -->

<!-- There are three components of bittorio : -->
<!-- 1) closure - operational closure of CA cell -->
<!-- 2) coupling - perturbations that change state of cell -->
<!-- 3) world of significance - odd sequences that are recognized as significant from a -->
<!-- background of -->

<!-- Here, I extend bittorio to a physical model - namely, that of threshold neurons. -->
<!-- The three components of bittorio are: -->

<!-- 1) coupling through voltage gated ion channels - ing difference in membrane -->
<!-- potential between the inside and the outside of the cell boundary -->

<!-- 2) closure - self-organized dynamics of CA -->

<!-- -  closure and coupling bring forth the action potential cycle - i.e., the -->
<!--   capture and release of sodium and potassium ion in and out of the cell -->

<!-- 3) world of significance - classes of functions computed by the biological Cell -->
<!-- through charge and discharge -->

<!-- 4) history of structural coupling with environment - influences the cell's dynamics -->

<!-- 5) history of structural coupling with another boundary - combinations of cells -->
<!-- compute classes of functions -->

<!-- 6) environment - rules for ion movement in a charge gradient (with randomness) -->

<!-- For example, there are conditions under which the cell is not able to enter into -->
<!-- the cycle of activation due to a lack of voltage difference across membrane. In -->
<!-- these cases, the cell and the environment do not enter a mode of viable -->
<!-- structural coupling. This may be sequences that are not recognized by the cells. -->


<!-- - how do we identify the class of functions computed by cell -->
<!-- - take output of function, convert it into binary representation (sodium, -->
<!--   chloride, potassium) -->
<!-- - feed it into the environment (adjacent to the boundary cells ) -->
<!-- - outputs that are computed by the function - trigger action potential -->
<!-- - output that are not computed by the function - do not trigger action potential -->
