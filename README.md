

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
