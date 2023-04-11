import React from 'react'
import {useState} from 'react'
const Update = ({state}) => {
    const [username,setUsername] = useState("");
    const [email,setEmail] = useState("")
    const UpdateUser = async ()=>{
        const {contract} = state;
        const transaction = await contract.updateUser(username,email);
        await transaction.wait();
        console.log("transaction is done");
    }
    const handleChange=(e)=>{
        e.preventDefault();
    }
  return (
    <div>
      <form action="" method="post" onSubmit = {handleChange}>
        <input type="username" required onChange={e=>{
            setUsername(e.target.value);
        }}/>
        <input type="email" required onChange={
            e=>{
                setEmail(e.target.value)
            }
        } />
        <button onClick = {UpdateUser}>Update</button>
      </form>
    </div>
  )
}

export default Update