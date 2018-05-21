//flashLong("You have got the file");

try{
  data = JSON.parse(data);
  var action = data.action;
  
  if( action === "performTask" ){
    var taskName = data.taskName;

    flashLong("taskName "+taskName+" performTask "+performTask);
    performTask(taskName,5);

  }else{
    flash("didn't match: action "+action+" data "+JSON.stringify(data));
}
}catch(e){
  
}
  

