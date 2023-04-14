import React from 'react'
import {useState} from 'react'
const Update = ({state}) => {
    const [username,setUsername] = useState("");
    const [email,setEmail] = useState("");

    const UpdateUser = async ()=>{
      try{
        const user_id = localStorage.getItem("user_id");
        const id = parseInt(user_id,10);
        // console.log("2 done");
        const response = await fetch("http://localhost:5000/auth/user/update",
{
  method:"POST",
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    id:id,
    username:username,
    email:email
  })
});
const data = await response.json();
if(data){
    console.log(data);
    // localStorage.setItem("name",name)
    localStorage.setItem("email",email)
    // dispatch({type:"USER",payload:true})
    localStorage.setItem("username",username);
    alert("Profile Changed")
}else{
    alert("user doesnt exist")
}

    }catch(error){
        console.log(error);
    }
    }
    const handleChange=(e)=>{
        e.preventDefault();
    }
  return (
    <div>
      <form action="" method="post" onSubmit = {handleChange}>
        <input type="username" placeholder="username" required onChange={e=>{
            setUsername(e.target.value);
        }}/>
        <input type="email" placeholder="email"required onChange={
            e=>{
                setEmail(e.target.value);
            }
        } />
        <button onClick = {UpdateUser}>Update</button>
      </form>
    </div>
  )
}

export default Update
