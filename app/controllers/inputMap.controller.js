const db = require("../models");
const InputMap = db.inputMap;

// Create and Save a new InputMap
exports.create = (req, res) => {
  // Validate request
  if (req.body.startNode === undefined) {
    res.status(400).send({
      message: `Start Node cannot be empty for Map!`,
    });
    return;
  } else if (req.body.endNode === undefined) {
    res.status(400).send({
      message: `End Node cannot be empty for Map!`,
    });
    return;
  } 

  // Create an InputMap
  const inputMap = {
    startNode: req.body.startNode,
    endNode: req.params.endNode,
    numOfBlocks: req.body.numOfBlocks,
  };
  // Save InputMap in the database
  InputMap.create(inputMap)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the InputMap.",
      });
    });
};

exports.findAllRoutes = (req, res) => {
  const startNode = req.body.startNode;
  const endNode = req.body.endNode;
  InputMap.findAll({
    where: { 
      startNode: startNode, 
      endNode: endNode, 
     },
    order: [["numOfBlocks", "ASC"]],
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving InputMaps for a trip.",
      });
    });
};


// Find a single InputMap with an id
exports.findOne = (req, res) => {
  const id = req.params.id;
  InputMap.findOne({
    where: { id: id },
  })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find InputMap with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error retrieving InputMap with id=" + id,
      });
    });
};
// Update a InputMap by the id in the request
exports.update = (req, res) => {
  // const startNode = req.body.startNode;
  // const endNode = req.body.endNode;
  // const numOfBlocks = req.body.numOfBlocks;

  const id = req.params.id;
  InputMap.update(req.body, {
    where: { id: id },
  })
    .then((number) => {
      if (number == 1) {
        res.send({
          message: "InputMap was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update InputMap with id=${id}. Maybe InputMap was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error updating InputMap with id=" + id,
      });
    });
};
// Delete a InputMap with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  InputMap.destroy({
    where: { id: id },
  })
    .then((number) => {
      if (number == 1) {
        res.send({
          message: "InputMap was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete InputMap with id=${id}. Maybe InputMap was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Could not delete InputMap with id=" + id,
      });
    });
};
// Delete all InputMaps from the database.
exports.deleteAll = (req, res) => {
  const tripId = req.params.tripId;
  const id = req.params.id;
  InputMap.destroy()
    .then((number) => {
      res.send({ message: `${number} InputMaps were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all inputmaps.",
      });
    });
};

async function doCreate(){
  await db.street.destroy({truncate: true});

  var streets_2way = [
    "2nd Ave",
    "6th Ave",
    "D Street"
  ];
  var direction = "S";
  var directionJ = "W"
  var twoWay = false;
  var twoWayJ = false;
  var street = null;
  var streetJ = null;
  //Create Streets
  for(var i = 1, j = 0; i <= 7; i++, j++){
      var name = String.fromCharCode(i+64) + " Street";
      if(streets_2way.includes(name)){
        twoWay = true;
      }else{
        twoWay = false;
      }
      street = {
        name: name,
        direction: direction,
        twoWay: twoWay,
      };
      
      await db.street.create(street)
          .then((data) => {
            
          })
          .catch((err) => {
            res.status(500).send({
              message:
                err.message || "Some error occurred while creating the InputMap.",
            });
          });
      if(direction == "N"){
        direction = "S";
      }else{
        direction = "N"
      }

      var nameJ = ordinal_suffix_of(i) + " Ave";
      if(streets_2way.includes(nameJ)){
        twoWayJ = true;
      }else{
        twoWayJ = false;
      }
      streetJ = {
        name: nameJ,
        direction: directionJ,
        twoWay: twoWayJ,
      };
      
      await db.street.create(streetJ)
          .then((data) => {
            
          })
          .catch((err) => {
            res.status(500).send({
              message:
                err.message || "Some error occurred while creating the InputMap.",
            });
          });
      
      if(directionJ == "E"){
        directionJ = "W";
      }else{
        directionJ = "E"
      }
  }

  db.inputMap.destroy({truncate: true});
  var streets = await db.street.findAll({raw : true});
  // console.log("Streets:",streets);
  // return;

  var topDownStreets = [];
  var sideStreets = [];
  for(var i=0; i<streets.length;i++){
    if(streets[i].direction == 'N' || streets[i].direction == 'S'){
      topDownStreets.push(streets[i]);
    }else{
      sideStreets.push(streets[i]);
    }
  }
  var intersections = [];
  for(var i=0; i<sideStreets.length; i++){
    for(var j=0; j<topDownStreets.length; j++){
      intersections.push({
        streetName: sideStreets[i].name + " and " + topDownStreets[j].name,
        sideStreet: sideStreets[i],
        topDownStreet: topDownStreets[j],
        sideDirection: sideStreets[i].direction,
        topDownDirection: topDownStreets[j].direction,
        sideTwoWay: sideStreets[i].twoWay,
        topDownTwoWay: topDownStreets[j].twoWay
      }
        );
    }
  }
  // console.log("Intersections: ", intersections);
  // console.log("Count of Intersections: ", intersections.length);
  var inputMap = createInputMap(intersections);


  for(var i=0;i<intersections.length;i++){
    for(var j=0;j<intersections.length;j++){
      if(intersections[i].streetName == intersections[j].streetName){
        continue;
      }
      var startNode = intersections[i].streetName;
      var endNode = intersections[j].streetName;
      var route = dijkstrasShortestPathAlgorith(inputMap, startNode, endNode);
      // console.log("Route:", startNode, endNode, route);
      // return;
      db.inputMap.create({
        startNode: startNode,
        endNode: endNode,
        route:JSON.stringify(route),
        numOfBlocks: (route.length - 1)
      });
    }
  }
}
doCreate();

function createInputMap(intersections){
  var inputMap = {};
  for(var i=0;i<intersections.length;i++){
    var intersection = intersections[i];
    //2nd Ave and B Street
    var letter = parseInt(intersection.streetName.charCodeAt(12));
    var number = parseInt(intersection.streetName.charAt(0));
    // if(letter != 66 || (number != 1 && number != 2) ){
      // continue;
    // }
    // console.log(intersection);
    var canIncrementNumber=false;
    var canDecrementNumber=false;
    var canIncrementLetter=false;
    var canDecrementLetter=false;
    if(number > 0 && number < 7){
      if(intersection.topDownDirection == "S"){
        canIncrementNumber = true;
      }else if(intersection.topDownTwoWay){
        canIncrementNumber = true;
      }
    }
    if(number > 1){
      if(intersection.topDownDirection == "N"){
        canDecrementNumber = true;
      }else if(intersection.topDownTwoWay){
        canDecrementNumber = true;
      }
    }
    //A=65, G=71
    if(letter >= 65 && letter < 71){
      if(intersection.sideDirection == "E"){
        canIncrementLetter = true;
      }else if(intersection.sideTwoWay){
        canIncrementLetter = true;
      }
    }
    if(letter > 65){
      if(intersection.sideDirection == "W"){
        canDecrementLetter = true;
      }else if(intersection.sideTwoWay){
        canDecrementLetter = true;
      }
    }
    if(canIncrementLetter){
      // console.log("Incrementing Letter");
      let streetName = intersections[i].streetName;
      if(inputMap[streetName] == undefined){
        inputMap[streetName] = {};
      }
      let topDownStreetNew = String.fromCharCode(letter+1) + " Street";
      let streetNew = intersection.sideStreet.name + " and " + topDownStreetNew; 
      inputMap[streetName][streetNew] = 1;
    }
    if(canDecrementLetter){
      // console.log("Decrementing Letter");
      let streetName = intersections[i].streetName;
      if(inputMap[streetName] == undefined){
        inputMap[streetName] = {};
      }
      let topDownStreetNew = String.fromCharCode(letter-1) + " Street";
      let streetNew = intersection.sideStreet.name + " and " + topDownStreetNew; 
      inputMap[streetName][streetNew] = 1;
    }
    if(canIncrementNumber){
      // console.log("Incrementing Number");
      let streetName = intersections[i].streetName;
      if(inputMap[streetName] == undefined){
        inputMap[streetName] = {};
      }
      let sideStreetNew = ordinal_suffix_of(number+1)+ " Ave";
      let streetNew = sideStreetNew + " and " + intersection.topDownStreet.name;
      inputMap[streetName][streetNew] = 1;
    }
    if(canDecrementNumber){
      // console.log("Decrementing Number");
      let streetName = intersections[i].streetName;
      if(inputMap[streetName] == undefined){
        inputMap[streetName] = {};
      }
      let sideStreetNew = ordinal_suffix_of(number-1)+ " Ave";
      let streetNew = sideStreetNew + " and " + intersection.topDownStreet.name;
      inputMap[streetName][streetNew] = 1;
    }
  }
  // console.log("InputMap", inputMap);
  // return;
  return inputMap;
}

function dijkstrasShortestPathAlgorith(inputMap, startNode, endNode){
  var last = {};
  var blocks = {};
  var nontraversed = new Set();
  for (var node in inputMap){
    if(node === startNode){
      blocks[node] = 0;
    }else{
      blocks[node] = Infinity;
    }
    nontraversed.add(node);
  }
  
  while(nontraversed.size){
    var nearestNode = null;
    for (var node of nontraversed){
      if(blocks[nearestNode] > blocks[node] || !nearestNode){
        nearestNode = node;
      }
    }
    if(blocks[nearestNode] == Infinity){
      break;
    }
    if(nearestNode === endNode){
      break;
    }
    for(var neighbor in inputMap[nearestNode]){
      var newBlocks = inputMap[nearestNode][neighbor] + blocks[nearestNode];
      if(blocks[neighbor] > newBlocks){
        blocks[neighbor] = newBlocks;
        last[neighbor] = nearestNode;
      }
    }
    nontraversed.delete(nearestNode);
  }
  var node = endNode;
  var route = [];
  while(node){
    route.push(node);
    node = last[node];
  }
  var correctRoute = route.reverse();
  return correctRoute;
}


function ordinal_suffix_of(i) {
  var j = i % 10,
      k = i % 100;
  if (j == 1 && k != 11) {
      return i + "st";
  }
  if (j == 2 && k != 12) {
      return i + "nd";
  }
  if (j == 3 && k != 13) {
      return i + "rd";
  }
  return i + "th";
}