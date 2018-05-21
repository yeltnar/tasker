//flashLong("You have got the file");

flashLong(data);

var action = data.action;

if( action === "performTask" ){
  var taskName = data.taskName;
  performTask(taskName,5);
}
