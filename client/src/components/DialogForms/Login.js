import React,{ useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from "react-router-dom";
export default function Login({state}) {
    const nav = useNavigate();
    const handleSubmit = (e)=>{
        e.preventDefault()
    }
    const [password,setPassword] = useState("");
    const [email,setEmail] = useState("");
    const LoginClicked = async ()=>{
        try{

            // console.log("2 done");
            const response = await fetch("http://localhost:5002/auth/user/login",
    {
      method:"POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email:email,
        password:password
      })
    });
    const data = await response.json();
    if(data){
        console.log(data);
        // localStorage.setItem("name",name)
        localStorage.setItem("email",email)
        // dispatch({type:"USER",payload:true})
        localStorage.setItem("username",data.result.username);
        localStorage.setItem("user_id",data.result.userId);
        nav("/home")
    }else{
        alert("You have entered wrong credentials")
    }
    
        }catch(error){
            console.log(error);
        }
    //    nav("/home")
      }
    return (
        <div className="text-center m-5-auto">
            <h2>Sign in</h2>
            <form action="/home" method='POST' onSubmit={handleSubmit}>
                <p>
                    <label>Email </label><br/>
                    <input type="text" name="first_name" required onChange={e=>{
                        setEmail(e.target.value);
                    }} />
                </p>
                <p>
                    <label>Password</label>
                
                    <br/>
                    <input type="password" name="password" required onChange={e=>{
                        setPassword(e.target.value);
                    }}/>
                </p>
                
                <p>
                    <button id="sub_btn" type="submit" onClick={LoginClicked}>Login</button>
                </p>
            </form>
            <footer>
                <p> <Link to="/register">Create an account</Link>.</p>
                <p><Link to="/">Back </Link>.</p>
            </footer>
        </div>
    )
}