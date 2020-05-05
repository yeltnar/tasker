(() => {
    setLocal("id_arr", getIdArr());
    setLocal("id_del_arr", getIdDelArr());
    exit();
})()

function getIdArr(){
    var obj = getActionJSON();
    // flashLong(JSON.stringify(obj))
    var keys = Object.keys(obj).reduce((acc,cur,i,arr)=>{
        var cur_obj = obj[cur];
        if( cur_obj.delete!==true && cur_obj.delete!=="true" ){
            // flashLong("adding "+cur_obj.title);
            acc.push(cur);
        }
        return acc;
    },[]);
    return keys.join(",")
}

function getIdDelArr(){
    var obj = getActionJSON();
    var keys = Object.keys(obj).reduce((acc,cur,i,arr)=>{
        var cur_obj = obj[cur];
        if( cur_obj.delete===true || cur_obj.delete==="true" ){
            acc.push(cur);
        }
        return acc;
    },[]);

    if( keys.length===0 ){
        // flashLong("empty delete");
        return ",";
    }

    // flashLong("---"+(keys.join(",")));

    // return ["",""].join(",")
    return keys.join(",")
}

function getActionJSON(){
   var json_str = action_json;
   return JSON.parse(json_str);
}
