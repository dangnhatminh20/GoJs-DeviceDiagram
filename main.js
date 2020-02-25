//Example use GoJS Basic
//function init() {
//    var $ = go.GraphObject.make;
//    myDiagram = $(go.Diagram, "myDiagramDiv");
//    var nodeDataArray = [
//        { key: "Alpha", color: "lime" },
//        { key: "Beta", color: "cyan" },
//        { key: "Zeta", isGroup: true },
//        { key: "Delta", color: "blue", group: "Zeta" },
//        { key: "Gamma", color: "pink", group: "Zeta" }
//    ];
//    var linkDataArray = [
//        { to: "Beta", from: "Alpha", color: "red" },
//        { from: "Alpha", to: "Zeta"}
//    ];
//    myDiagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);

//    myDiagram.nodeTemplate = $(go.Node, "Auto",
//        $(go.Shape, "RoundedRectangle", { fill: "white" },
//            new go.Binding("fill", "color")
//        ),
//        $(go.TextBlock, "text", {margin: 10},
//            new go.Binding("text", "key")
//        )
//    );

//    myDiagram.linkTemplate =
//        $(go.Link,
//            $(go.Shape, {strokeWidth: 3},
//                new go.Binding("stroke", "color")
//            ),
//            $(go.Shape, { toArrow: "Standard", stroke: null },
//                new go.Binding("fill", "color")
//            )
//        )
//}

function init() {
    var $ = go.GraphObject.make;

    myDiagram =
        $(go.Diagram, "myDiagramDiv",  // must name or refer to the DIV HTML element
            {
                // supply a simple narrow grid that manually reshaped link routes will follow
                grid: $(go.Panel, "Grid",
                    { gridCellSize: new go.Size(16, 16) },
                    $(go.Shape, "LineH", { stroke: "lightgray", strokeWidth: 0.5 }),
                    $(go.Shape, "LineV", { stroke: "lightgray", strokeWidth: 0.5 })
                ),
                // automatically show the state of the diagram's model on the page in a PRE element
                "ModelChanged": function (e) {
                    if (e.isTransactionFinished) {
                        document.getElementById("mySavedModel").textContent = myDiagram.model.toJson();
                    }
                },                

                "undoManager.isEnabled": true
            });

    // define the Node template for regular nodes
    myDiagram.nodeTemplateMap.add("",  // the default category
        $(go.Node, go.Panel.Auto,
            // The Node.location comes from the "loc" property of the node data,
            // converted by the Point.parse method.
            // If the Node.location is changed, it updates the "loc" property of the node data,
            // converting back using the Point.stringify method.
            new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
            // the main object is a Panel that surrounds a TextBlock with a rectangular Shape
            $(go.Shape,
                { figure: "Circle", width: 45, height: 45, fill: "white", strokeWidth: 1 },
                new go.Binding("stroke", "color"),
                { portId: "", fromLinkable: true, toLinkable: true, cursor: "pointer" }),
            $(go.TextBlock,
                {
                    maxSize: new go.Size(150, NaN), textAlign: "center",
                    margin: 0, editable: true, name: "TEXT",
                    font: "12pt Helvetica, Arial, sans-serif"
                },
                new go.Binding("text", "text").makeTwoWay())));
  
    myDiagram.linkTemplate =
        $(go.Link,
            $(go.Shape, { strokeWidth: 1 }),
            $(go.Shape, { toArrow: "Standard", stroke: null }));

    // this DiagramEvent is raised when the user has drag-and-dropped something
    // from another Diagram (a Palette in this case) into this Diagram
    myDiagram.addDiagramListener("ExternalObjectsDropped", function (e) {
        // stop any ongoing text editing
        if (myDiagram.currentTool instanceof go.TextEditingTool) {
            myDiagram.currentTool.acceptText(go.TextEditingTool.LostFocus);
        }
        // expand any "macros"
        myDiagram.commandHandler.ungroupSelection();
        // start editing the first node that was dropped after ungrouping
        var tb = myDiagram.selection.first().findObject('TEXT');
        if (tb) myDiagram.commandHandler.editTextBlock(tb);
    });
    // initialize the Palette that is on the left side of the page
    myPalette =
        $(go.Palette, "myPaletteDiv",  // must name or refer to the DIV HTML element
            {
                nodeTemplateMap: myDiagram.nodeTemplateMap,
                //layout: $(go.GridLayout, { alignment: go.GridLayout.Location })
            });

    myPalette.model = new go.GraphLinksModel([
        // a regular node
        { key: "AP", text: "AP", color: "#ADC8FF"},
        { key: "RE", text: "RE", color: "#3366FF" },
        { key: "DZ", text: "DZ", color: "#102693" },
        { key: "PZ", text: "PZ", color: "#F2FDD1" },
        { key: "CGZ", text: "CGZ", color: "#8CE01F" },
        { key: "CTZ", text: "CTZ", color: "#3D8109" },
        { key: "DMZ", text: "DMZ", color: "#D8F9FF" },
        { key: "GSZ", text: "GSZ", color: "#3DB4FF" },
        { key: "SSZ", text: "SSZ", color: "#134B93" },
        { key: "SCZ", text: "SCZ", color: "#FFF9CE" },
        { key: "IRZ", text: "IRZ", color: "#FFD20A" },
        { key: "CZ", text: "CZ", color: "#937103" },
        { key: "CIZ", text: "CIZ", color: "#FFE8D4" },
    ]);
}

// Show the diagram's model in JSON format that the user may edit
function save() {
    saveDiagramProperties();  // do this first, before writing to JSON
    document.getElementById("mySavedModel").value = myDiagram.model.toJson();
    myDiagram.isModified = false;
    console.log(document.getElementById("mySavedModel").value)
}

function saveDiagramProperties() {
    myDiagram.model.modelData.position = go.Point.stringify(myDiagram.position);
}

//Format data JSON
var dataTest = {
    "class": "GraphLinksModel",
    "modelData": { "position": "-820.5 -432" },
    "nodeDataArray": [
        { "key": "AP", "text": "AP", "color": "#ADC8FF", "loc": "-423 -256" },
        { "key": "RE", "text": "RE", "color": "#3366FF", "loc": "-246 -405" },
        { "key": "DZ", "text": "DZ", "color": "#102693", "loc": "-253 -132" },
        { "key": "PZ", "text": "PZ", "color": "#F2FDD1", "loc": "-80 -263" },
        { "key": "CGZ", "text": "CGZ", "color": "#8CE01F", "loc": "56.5 -427" },
        { "key": "CTZ", "text": "CTZ", "color": "#3D8109", "loc": "96 -269" }
    ],
    "linkDataArray": [
        { "from": "AP", "to": "RE" },
        { "from": "AP", "to": "DZ" },
        { "from": "AP", "to": "PZ" },
        { "from": "PZ", "to": "CGZ" },
        { "from": "PZ", "to": "CTZ" },
        { "from": "DZ", "to": "RE" }
    ]
}

function load() {
    //myDiagram.model = go.Model.fromJson(document.getElementById("mySavedModel").value);
    myDiagram.model = go.Model.fromJson(dataTest);
    loadDiagramProperties();
    //console.log(document.getElementById("mySavedModel").value);
}

// Called by "InitialLayoutCompleted" DiagramEvent listener, NOT directly by load()!
function loadDiagramProperties(e) {
    // set Diagram.initialPosition, not Diagram.position, to handle initialization side-effects
    var pos = myDiagram.model.modelData.position;
    if (pos) myDiagram.initialPosition = go.Point.parse(pos);
}