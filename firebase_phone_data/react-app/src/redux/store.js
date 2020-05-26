import {createStore} from 'redux'
import {getDataValue} from '../functions/query.js'
import {getQValue} from '../functions/query'

import uuid from "uuid/v4"

const initial_state_json = JSON.stringify({
    _saved:{},
    filter:{
        text:""
    },
});

function reducer(state=JSON.parse(initial_state_json), action){
    const new_state = JSON.parse(JSON.stringify(state));
    
    if( "GET_PHONE_JSON_ACTION"===action.type ){
        action.json = action.json===undefined||action.json===null ? {} : action.json; // if DB empty, fill it in
        action.json.notifications = action.json.notifications===undefined ? {} : action.json.notifications; // if DB empty, fill it in
        
        // if don't have show value, make it true
        for(let k in action.json.notifications){
            action.json.notifications[k].show = action.json.notifications[k].show===undefined?true:action.json.notifications[k].show;
        }

        new_state.phone = addQueryParamNotification(action.json);
        new_state.phone._notification_keys = {};
        // force title and text and have them be in this order
        new_state.phone._notification_keys.title = "title";
        new_state.phone._notification_keys.text = "text";
        new_state.phone._notification_keys.tag = "tag";
        // make sure all keys are on all objects
        for(let k in action.json.notifications){
            Object.keys(action.json.notifications[k]).forEach((cur,i,arr)=>{
                new_state.phone._notification_keys[cur] = cur;
            });
        }
    }else if( "UPDATE_NOTIFICATION_VALUE"===action.type ){
        const {label,content,notification_id} = action;

        new_state._saved.phone = new_state._saved.phone===undefined?{}:new_state._saved.phone;
        new_state._saved.phone.notifications = new_state._saved.phone.notifications===undefined?{}:new_state._saved.phone.notifications;

        if( new_state._saved.phone.notifications[notification_id]===undefined ){
            new_state._saved.phone.notifications[notification_id] = {...new_state.phone.notifications[notification_id]};
        }

        new_state.phone.notifications[notification_id][label] = content;

    }else if( "SENT_UPDATE_NOTIFICATION"==action.type ){
        const {notification_id} = action;
        new_state._saved.phone = new_state._saved.phone===undefined?{}:new_state._saved.phone;
        new_state._saved.phone.notifications = new_state._saved.phone.notifications===undefined?{}:new_state._saved.phone.notifications;
        new_state._saved.phone.notifications[notification_id] = undefined;
        sendUpdateState(notification_id, new_state.phone.notifications[notification_id]);
    }else if( "DELETE_NOTIFICATION"===action.type ){
            sendDelete(action.notification_id, new_state.phone.notifications[action.notification_id]);
        delete new_state.phone.notifications[action.notification_id];
    }else if( "ADD_NOTIFICATION"===action.type ){
        // debugger
        const notification_id = uuid();
        const {data} = action;
        const notification_obj={}

        for( let k in data ){
            notification_obj[k] = data[k];
        }

        notification_obj.show = notification_obj.show===undefined ? true : notification_obj.show;
        notification_obj.not_submitted = notification_obj.not_submitted===undefined ? true : notification_obj.not_submitted;

        new_state.phone.notifications[notification_id] = notification_obj;
    }else if( "SET_FILTER_CHANGE_EVENT"===action.type ){
        new_state.filter.text = action.text_value;

        try{
            if( new_state.filter.text.split("/").length >= 3  ){
                
                const remove_first_slash = /\/(.*)/.exec(new_state.filter.text)[1];
                const remove_second_slash = /(.*)\/([^/]*)/.exec(remove_first_slash);

                const text = remove_second_slash[1];
                const flags = remove_second_slash[2];

                new_state.filter.regex = new RegExp( text, flags );
            }else{
                throw new Error("Not a regex");
            }
        }catch(e){
            new_state.filter.regex = undefined;
        }
    }

    return new_state;
};

async function getPhoneJsonAction(){
    const json = await getPhoneJson();
    return {
        type: "GET_PHONE_JSON_ACTION",
        json
    }
}

async function sendUpdateState(notification_id, notification_obj) {

    const person_id = getDataValue("person_id");
    const token = getDataValue("token");

    delete notification_obj.not_submitted;
    
    const json_value = JSON.stringify(notification_obj);
    const value = encodeURIComponent(json_value);

    var requestOptions = {
        method: 'POST',
        redirect: 'follow'
    };

    const fetch_res = await fetch(`https://node.andbrant.com/database?person_id=${person_id}&token=${token}&data_location=phone.notifications.${notification_id}&value=${value}`, requestOptions)
        .then(response => response.json())
        .catch(error => alert('error', error));
}

async function sendDelete(notification_id, notification_obj){

    if(notification_obj.not_submitted===true){
        return
    }

    const person_id = getDataValue("person_id");
    const token = getDataValue("token");
    
    const value = null;

    var requestOptions = {
        method: 'POST',
        redirect: 'follow'
    };

    const fetch_res = await fetch(`https://node.andbrant.com/database?person_id=${person_id}&token=${token}&data_location=phone.notifications.${notification_id}&value=${value}`, requestOptions)
        .then(response => response.json())
        // .then(result => console.log(result))
        .catch(error => console.log('error', error));

}

function updateNotificationValue( {label,content,notification_id} ){
    return{
        type: "UPDATE_NOTIFICATION_VALUE",
        label,
        content,
        notification_id,
    }
}

function submitNotificationUpdate(notification_id){
    return {
        type: "SENT_UPDATE_NOTIFICATION",
        notification_id
    }
}

function deleteNotification(notification_id){
    return {
        type: "DELETE_NOTIFICATION",
        notification_id
    }
}

function addNotification(data){ 
    return {
        type: "ADD_NOTIFICATION",
        data,
    }
}

function setFilterChangeEvent(text_value){ 
    return {
        type: "SET_FILTER_CHANGE_EVENT",
        text_value,
    }
}

const getPhoneJson = (()=>{
    let pending_promise;;
    return ()=>{

        if( pending_promise===undefined ){

            pending_promise = new Promise(async(resolve, reject)=>{
                const person_id = getDataValue("person_id");
                const token = getDataValue("token");
    
                const res_obj = await fetch(`https://node.andbrant.com/database?person_id=${person_id}&token=${token}&data_location=phone`).then(resp=>resp.json());
    
                resolve(res_obj)
            });
        }

        return pending_promise;

        
    };
})();

function addQueryParamNotification(phone_obj) {
    let title = getQValue("title");
    let text = getQValue("text");
    let url = getQValue("url");

    title = title!==undefined ? decodeURIComponent(title) : title;
    text = text!==undefined ? decodeURIComponent(text) : text;
    url = url!==undefined ? decodeURIComponent(url) : url;

    title = title===undefined ? title : title.split("+").join(" ");
    // text = text===undefined ? text : text.split("+").join(" ");

    if( title!==undefined || text!==undefined || url!==undefined ){
        const id=uuid();

        phone_obj.notifications[id] = {
            not_submitted:true
        };

        if( title!==undefined ){
            phone_obj.notifications[id].title = title;
        }
        if( text!==undefined ){
            phone_obj.notifications[id].text = text;
        }
        if( url!==undefined ){
            phone_obj.notifications[id].url = url;
        }

        phone_obj.notifications[id].show = true;
    }

    return phone_obj;
}

const store = createStore(reducer, JSON.parse(initial_state_json), )

export {
    store,
    getPhoneJsonAction,
    updateNotificationValue,
    submitNotificationUpdate,
    deleteNotification,
    addNotification,
    setFilterChangeEvent,
};
