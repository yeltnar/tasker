(() => {

    const id_arr = getIdArr();
    setLocal("id_arr", id_arr);

    const id_del_arr = getIdDelArr();
    setLocal("id_del_arr", id_del_arr);
    
    // flashLong(`id_del_arr ${id_del_arr} id_arr ${id_arr}`)
    
    exit();
})()

function getIdArr(){
    var obj = getActionJSON();
    var keys = Object.keys(obj).reduce((acc,cur,i,arr)=>{
        var cur_obj = obj[cur];
        if( cur_obj.delete!==true && cur_obj.delete!=="true" ){
            acc.push(cur);
        }
        return acc;
    },[]);
    if( keys.length===0 ){
        return ",";
    }
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
        return ",";
    }

    return keys.join(",")
}

function getActionJSON(){
   var json_str = action_json;
   return JSON.parse(json_str);
}
