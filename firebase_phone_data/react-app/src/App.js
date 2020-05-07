import React, { useState } from 'react';
import logo from './logo.svg';
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


  return <App/>;
}

const default_phon_json = JSON.stringify({browser_has_loaded_state:false});

function App() {

  // const val = JSON.stringify(phone_json,null,2);

  return (
    <Notifications></Notifications>
  );

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
      await dispatch( await getPhoneJsonAction() );
    })
    return null;
  }

  const notification_element_holders_arr = notification_keys.map((cur,i,arr)=>{
    return ( <NotificationElementHolder notification_id={cur} key={i}/> );
  });

  return <div className="notifications">
    {notification_element_holders_arr}
    <AddNotificationButton/>
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
    ele_arr.push( <NotificationElement key={k} label={k} content={single_notification_obj[k]||""} notification_id={notification_id} /> );
  }

  return (
    <div className="notification_element_holder">
      <div className="top_notification_container">
        <div>{single_notification_obj.title}  [{notification_id}]</div>
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

  function submit(){
    dispatch(submitNotificationUpdate(notification_id));
    setSubmitText("Submitted!");
    setTimeout(()=>{setSubmitText("Submit");},2000);
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
  const {label,content,notification_id} = props;

  return(
    <div className="notification_element">
      <div>{label}</div>
      <textarea value={content} onChange={onChange}></textarea>
    </div>
  )

  function onChange(event){
    console.log()
    dispatch(updateNotificationValue( {label,content:event.target.value,notification_id} ));
  }
}

function AddNotificationButton(){
  const dispatch = useDispatch();
  return (<div className="add_notification_button"><button onClick={addButtonClick}>Add Notification</button></div>)
  function addButtonClick(){
    dispatch(addNotification());
  }
}

export default AppWrapper;
