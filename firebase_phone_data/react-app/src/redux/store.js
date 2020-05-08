import {createStore} from 'redux'
import {getDataValue} from '../functions/query.js'
import {getQValue} from '../functions/query'

import uuid from "uuid/v4"

const initial_state_json = JSON.stringify({});

function reducer(state=JSON.parse(initial_state_json), action){
    const new_state = JSON.parse(JSON.stringify(state));
    
    if( "GET_PHONE_JSON_ACTION"===action.type ){
        new_state.phone = addQueryParamNotification(action.json);
        new_state.phone._notification_keys = {};
        for(let k in action.json.notifications){
            Object.keys(action.json.notifications[k]).forEach((cur,i,arr)=>{
                new_state.phone._notification_keys[cur] = cur;
            });
        }
    }else if( "UPDATE_NOTIFICATION_VALUE"===action.type ){
        const {label,content,notification_id} = action;
        new_state.phone.notifications[notification_id][label] = content;
    }else if( "SENT_UPDATE_NOTIFICATION"==action.type ){
        sendUpdateState(action.notification_id, new_state.phone.notifications[action.notification_id]);
    }else if( "DELETE_NOTIFICATION"===action.type ){
            sendDelete(action.notification_id, new_state.phone.notifications[action.notification_id]);
        delete new_state.phone.notifications[action.notification_id];
    }else if( "ADD_NOTIFICATION"===action.type ){
        const notification_id = uuid();
        new_state.phone.notifications[notification_id] = {};
        new_state.phone.notifications[notification_id].not_submitted = true;
        debugger
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
    
    const value = encodeURIComponent(JSON.stringify(notification_obj));

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

function addNotification(){ 
    return {
        type: "ADD_NOTIFICATION",
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
};