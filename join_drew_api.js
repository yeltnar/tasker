//flashLong("You have got the file");

var action = data.action;

if( action === "performTask" ){
  var taskName = data.taskName;
  
  flashLong("taskName "+taskName+" performTask "+performTask);
  performTask(taskName,5);
}else{
  flash("didn't match: action "+action);
}
