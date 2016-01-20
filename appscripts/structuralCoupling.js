define(
    [],
    function () {

        //takes two arguments, the state of the cell and the state of
        //the change that should occur to the cell and updates the state of the cell
        return function (cell, replacingCells){
 
            function directSC(){
                //simplest form structural coupling based on only one cell
                cell.state = replacingCells[0].state;
                cell.userChange = replacingCells[0].userChange;

                //transfered the perturbation
                replacingCells[0].userChange = 0;
                return cell;
            }

            //more tuned with Varela's definition
            function perturbations(){
                //simplest form structural coupling based on only one cell
                cell.state = parseInt(document.getElementById('perturbationColor').value);
                cell.userChange = 1;

                //transfered the perturbation
                return cell;
            }


            //more complex forms of structural coupling
            function additiveSC(){
                //simplest form structural coupling based on only one cell
                var sum = 0;
                for(i=0;i<replacingCells.length;i++){
                    sum = sum + replacingCells[i].state;
                }
                cell.state = sum%3;
                //cell.userChange = 1; //replacingCells[0].userChange;
                replacingCells.map(function(c){c.userChange=0;});
                return cell;
            }

            return perturbation;
        }

    });
