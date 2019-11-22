

This is an app for exploring operational closure and structural coupling
in a 1D cellular automaton (CA) CA states:

1. The first (top) row is the initial configuration of the CA.
2. Each subsequent row is the state of the CA in a subsequent time-step
3. Future states can be grey, black, or white. Cells that are black or
   white are treated as 'perturbations' that are 'external' to the CA.

CA rules:

1. Usually, the state of a cell is computed based on its state and the
   state of its immediate neighbors during the previous time-step
2. If, however, a cell encounters a "perturbation", that cell is
   replaced by the state of the perturbing cell.

User actions:

1. Initial configuration: user can click the cells on or off or drag
   (click and move) the mouse over them.
2. Rules: user can enter a particular rule (in binary or decimal) or
   select certain rules from the pull-down menu. Note: the rules in the
   pull-down menu result in specific kinds of interesting structural
   coupling (eg, "odd sequence recognizer")
3. Perturbations: user can create perturbations by clicking cells on or
   off (or) dragging (click and move) over them.



Extending bittorio to threshold neurons:

The central hypothesis of varela is that cognition (world of significance)
emerges out of closure and coupling between the boundary of the cell and the its
environment.

However, implementing this physical model with more realistic biological systems
is important as it will connect the ideas between the two domains better -
highlighting the embodied dimension of computation.

There are three components of bittorio :
1) closure - operational closure of CA cell
2) coupling - perturbations that change state of cell
3) world of significance - odd sequences that are recognized as significant from a
background of

Here, I extend bittorio to a physical model - namely, that of threshold neurons.
The three components of bittorio are:

1) coupling through voltage gated ion channels - ing difference in membrane
potential between the inside and the outside of the cell boundary

2) closure - self-organized dynamics of CA

-  closure and coupling bring forth the action potential cycle - i.e., the
  capture and release of sodium and potassium ion in and out of the cell

3) world of significance - classes of functions computed by the biological Cell
through charge and discharge

4) history of structural coupling with environment - influences the cell's dynamics

5) history of structural coupling with another boundary - combinations of cells
compute classes of functions

6) environment - rules for ion movement in a charge gradient (with randomness)

For example, there are conditions under which the cell is not able to enter into
the cycle of activation due to a lack of voltage difference across membrane. In
these cases, the cell and the environment do not enter a mode of viable
structural coupling. This may be sequences that are not recognized by the cells.


- how do we identify the class of functions computed by cell
- take output of function, convert it into binary representation (sodium,
  chloride, potassium)
- feed it into the environment (adjacent to the boundary cells )
- outputs that are computed by the function - trigger action potential
- output that are not computed by the function - do not trigger action potential
