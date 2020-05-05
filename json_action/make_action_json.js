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

            // need to add
            acc[cur_key] = {
                title: latest_json[cur_key].title,
                text: latest_json[cur_key].text,
            };
        }
        return acc;
    },{});

    // flash(JSON.stringify(action_obj,null,2))
    // flash()

    setLocal("action_json", JSON.stringify(action_obj,null,2))
 
    exit()
 
 })()
 
 function getActionJSON(){
    var json_str = latest_data===""||latest_data===undefined ? "{}" : latest_data;
    return JSON.parse(json_str);
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
 