(()=>{

    // flash("new")

    var latest_json = getActionJSON().notifications || {};
    var current_json = getCurrentJSON().notifications || {};

    var all_keys = Object.keys({...latest_json,...current_json});

    // flash("1"+JSON.stringify(latest_json))
    // flash("2"+JSON.stringify(current_json))
    // flash("3"+JSON.stringify(all_keys))
    
    const action_obj = all_keys.reduce((acc,cur_key,i,arr)=>{

        // check if it hasn't changed
        const current_notification_obj_keys = Object.keys({ ...latest_json[cur_key], ...current_json[cur_key] });
        let need_to_update = false;
        
        current_notification_obj_keys.forEach((cur,small_i,arr)=>{

            if( latest_json[cur_key]===undefined){
                need_to_update=true;
            }else if( current_json[cur_key]===undefined ){
                need_to_update=true;
            }else if( latest_json[cur_key][cur]!==current_json[cur_key][cur] ){
                need_to_update=true;
            }
        });

        if(need_to_update) {

            if (latest_json[cur_key] === undefined) {
                // need to delete
                acc[cur_key] = {
                    title: current_json[cur_key].title,
                    text: current_json[cur_key].text,
                    delete: true,
                };
            } else if (latest_json[cur_key] !== undefined) {

                if (latest_json[cur_key].show === false) {
                    acc[cur_key] = {
                        // title: latest_json[cur_key].title,
                        // text: latest_json[cur_key].text,
                        title: "DELETE IT",
                        text: "DELETE IT",
                        delete: true
                    };
                } else if (latest_json[cur_key].title !== undefined) {
                    // need to add
                    const text = latest_json[cur_key].text || "";
                    acc[cur_key] = {
                        title: latest_json[cur_key].title,
                        text: text,
                    };
                } else {
                    acc[cur_key] = {
                        title: latest_json[cur_key].title,
                        text: latest_json[cur_key].text,
                        delete: true
                    };
                }

            }

        }
        return acc;
    },{});

    setLocal("action_json", JSON.stringify(action_obj,null,2))
 
    exit()
 
 })()
 
 function getActionJSON(){
    var json_str = latest_data===""||latest_data===undefined ? "{}" : latest_data;
    let to_return;
    json_str = fixJsonString(json_str);
    try{
        to_return = JSON.parse(json_str);
    }catch(e){
        flashLong(`JSON Parse issue in getActionJSON`);
        setClip(json_str);
        throw e;
    }
    return to_return;
 }
 
 function getCurrentJSON(){
     let real_current_data;
     try{
        real_current_data = current_data;
    }catch(e){
        real_current_data = "";
     }
    var json_str = real_current_data===""||real_current_data===undefined ? "{}" : real_current_data;
    json_str = fixJsonString(json_str);
    let to_return;
    try{
        to_return = JSON.parse(json_str)
    }catch(e){
        flashLong(`JSON Parse issue in getCurrentJSON`);
        setClip(json_str);
        throw e;
    }
    return to_return;
 }

 function fixJsonString(json_str){
    const break_str = "<br/>";
    return json_str.split(/\n/).join(break_str).split(new RegExp(break_str+"$")).join("");
 }
 