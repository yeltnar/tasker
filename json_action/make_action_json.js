(()=>{

    // flash("new")

    var latest_json = getActionJSON().notifications || {};
    var current_json = getCurrentJSON().notifications || {};

    var all_keys = Object.keys({...latest_json,...current_json});

    // flash("1"+JSON.stringify(latest_json))
    // flash("2"+JSON.stringify(current_json))
    // flash("3"+JSON.stringify(all_keys))
    
    const action_obj = all_keys.reduce((acc,cur_key,i,arr)=>{
        if( latest_json[cur_key] === undefined ){
            // need to delete
            acc[cur_key] = {
                title: current_json[cur_key].title,
                text: current_json[cur_key].text,
                delete: true,
            };
        }else if( latest_json[cur_key] !== undefined ){

            // TODO check if the title for the key has changed
            if( current_json[cur_key]!==undefined && latest_json[cur_key].title !== current_json[cur_key].title ){
                const rand_id = (Math.random()+"").split("0.").join("");

                acc[rand_id] = {
                    title: current_json[cur_key].title,
                    text: current_json[cur_key].text,
                    delete: true,
                };
            }

            if( latest_json[cur_key].title!==undefined ){
                // need to add
                const text = latest_json[cur_key].text || "";
                acc[cur_key] = {
                    title: latest_json[cur_key].title,
                    text: text,
                };
            }else{
                acc[cur_key] = {
                    title: latest_json[cur_key].title,
                    text: latest_json[cur_key].text,
                    delete: true
                };
            }

        }
        return acc;
    },{});

    // flash(JSON.stringify(action_obj,null,2))
    // flash()

    setLocal("action_json", JSON.stringify(action_obj,null,2))
 
    exit()
 
 })()
 
 function getActionJSON(){
    let json_str = latest_data===""||latest_data===undefined ? "{}" : latest_data;
    json_str = json_str.split("\n").join(" ")
    let to_return;
    try{
        to_return = JSON.parse(json_str);
    }catch(e){
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
    return JSON.parse(json_str);
 }
 