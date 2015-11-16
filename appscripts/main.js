require(
    ["squarefiller"],
    function (sqfill) {

        var id = "mySVG",
            rowLength = 30,
            colLength = 30,
            objSize = 5;

        var grid = sqfill(id, rowLength,colLength,objSize);
        //console.log(grid.length);
    }
);
