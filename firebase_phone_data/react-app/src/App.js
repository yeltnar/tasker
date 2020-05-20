import React, { useState } from 'react';
import './App.css';
import { useSelector, useDispatch } from 'react-redux';
import {getPhoneJsonAction,updateNotificationValue,submitNotificationUpdate,deleteNotification,addNotification} from "./redux/store"
import {getDataValue} from './functions/query'

function AppWrapper(){

  const person_id = getDataValue("person_id");
  const token = getDataValue("token");

  if( person_id===undefined || token===undefined ){
    const str = `person_id=${person_id} token=${token}`;
    alert(str)
    return <div>{str}</div>;
  }

  window.addEventListener("load",()=>{
    too_many_loops();

    function too_many_loops(){
      const add_notification_button = document.querySelector(".add_notification_button")
      if( add_notification_button===null || add_notification_button===undefined ){
        setTimeout(too_many_loops,100);
      }else{
        add_notification_button.scrollIntoView();
      }
    }
  })

  return <App/>;
}

const default_phon_json = JSON.stringify({browser_has_loaded_state:false});

function App() {

  // const val = JSON.stringify(phone_json,null,2);

  return (
    <div id="app">
      <TopBar></TopBar>
      <Notifications></Notifications>
    </div>
  );
}

function TopBar(){
  return (<div id="TopBar">
    <div>Filter Tag</div>
    <input type="text"></input>
  </div>);
}

function Notifications(){

  const dispatch = useDispatch();

  const notification_keys = useSelector((state)=>{
    if( state===undefined || state.phone===undefined || state.phone.notifications===undefined ){
      return undefined;
    }else{   
      const notification_keys = Object.keys(state.phone.notifications);
      return notification_keys;
    }
  });

  if( notification_keys===undefined ){
    setImmediate(async()=>{
      dispatch( await getPhoneJsonAction() );
    })
    return null;
  }

  const notification_element_holders_arr = notification_keys.map((cur,i,arr)=>{
    return ( <NotificationElementHolder notification_id={cur} key={i}/> );
  });

  return <div className="notifications">
    <div className="notifications_scroll_wrapper">
      {notification_element_holders_arr}
      <AddNotificationButton/>
    </div>
  </div>

}

function NotificationElementHolder(props){

  const dispatch = useDispatch();
  const [submit_text, setSubmitText] = useState("Submit");

  const {notification_id} = props;

  const single_notification_obj = useSelector((state)=>{
    if( notification_id===undefined || state===undefined || state.phone===undefined || state.phone.notifications===undefined || state.phone.notifications[notification_id]===undefined ){
      return undefined;
    }else{   
      return state.phone.notifications[notification_id];
    }
  });

  const different_from_saved = useSelector((state)=>{
    if( notification_id===undefined || 
        state===undefined || 
        state._saved===undefined || 
        state._saved.phone===undefined || 
        state._saved.phone.notifications===undefined || 
        state._saved.phone.notifications[notification_id]===undefined ||
        state===undefined || 
        state.phone===undefined || 
        state.phone.notifications===undefined || 
        state.phone.notifications[notification_id]===undefined 
    ){
      return false;
    }else{
      // state._saved.phone.notifications[notification_id]
      let to_return = false;
      for( let k in state.phone.notifications[notification_id] ){
        if( state.phone.notifications[notification_id][k] !== state._saved.phone.notifications[notification_id][k] ){
          to_return = true;
        }
      }
      return to_return;
    }
  });

  const _notification_keys = useSelector( state=>{
    if( notification_id===undefined || state===undefined || state.phone===undefined || state.phone._notification_keys===undefined ){
      return undefined;
    }else{   
      return state.phone._notification_keys;
    }
  } );

  if( notification_id===undefined ){
    console.error(`notification_id is ${notification_id}`);
    return null;
  }

  const ele_arr = [];
  for( let k in _notification_keys ){
    ele_arr.push( <NotificationElement different_from_saved={different_from_saved} key={k} label={k} content={single_notification_obj[k]||""} notification_id={notification_id} /> );
  }

  const not_submitted_class = single_notification_obj.not_submitted===true||different_from_saved===true ? "not_submitted" : "";

  return (
    <div className={`notification_element_holder ${not_submitted_class}`}>
      <div className="top_notification_container">
        <div>{single_notification_obj.title}  [{getShortId(notification_id)}]</div>
        <div><button onClick={deleteClick}>X</button></div>
      </div>
      <div>
        <div className="edit_holder">
          {ele_arr}
        </div>
      </div>
      <div>
        <button onClick={submit} className="submit_button">{submit_text}</button>
      </div>
    </div>
  );

  async function submit(){
    dispatch(submitNotificationUpdate(notification_id));
    setSubmitText("Submitted!");
    await (new Promise((resolve,reject)=>{setTimeout(()=>{resolve()},2000);}));
    setSubmitText("Submit");
  }

  function deleteClick(){
    const confirm_response = window.confirm(`Are you sure you want to delete '${single_notification_obj.title}' [${notification_id}]?`);
    if( confirm_response===true ){
      dispatch(deleteNotification(notification_id));
    }
  }
}

function NotificationElement(props){
  const dispatch = useDispatch();
  const {label,content,notification_id, different_from_saved} = props;

  if( label==="not_submitted" ){
    return null;
  }

  if(label==="show"){
    return(
      <div className="notification_element">
        <div>{label}</div>
        <input type="checkbox" checked={content} onChange={onChange}></input>
      </div>
    )
  }else{
    return(
      <div className="notification_element">
        <div>{label}</div>
        <textarea value={content} onChange={onChange}></textarea>
      </div>
    )
  }

  function onChange(event){
    let redux_event;
    if(label==="show"){
      redux_event = updateNotificationValue( {label, content:event.target.checked, notification_id} );
    }else{
      redux_event = updateNotificationValue( {label, content:event.target.value, notification_id} );
    }
    dispatch(redux_event);
  }
}

function AddNotificationButton(){
  const dispatch = useDispatch();
  return (<div className="add_notification_button">
    <button onClick={addButtonClick}>Add Notification</button>
    </div>)
  function addButtonClick(){
    dispatch(addNotification());
  }
}

function getShortId(long_id){

  let short_id=""
  const MAX_LENGTH=8;
  
  if( long_id.length>MAX_LENGTH ){

    short_id = long_id.split("").reduce((acc,cur,i,arr)=>{
      if(i<MAX_LENGTH){
        acc = acc+cur;
      }
      return acc
    },"");

  }else{
    short_id=long_id;
  }

  return short_id
}

export default AppWrapper;
