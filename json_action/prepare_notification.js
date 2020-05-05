(()=>{

    var json = getActionJSON();
 
    // flashLong(`'${cur_id}'`)
 //flashLong(JSON.stringify(json))
 
    var cur_obj = json[cur_id];
 
 //flashLong(JSON.stringify(cur_obj))
 
    setLocal("title",cur_obj.title);
    // setLocal("title",cur_id);
    setLocal("text",cur_obj.text);
 
 exit()
 
 })()
 
 function getActionJSON(){
    var json_str = action_json;
    return JSON.parse(json_str);
 }