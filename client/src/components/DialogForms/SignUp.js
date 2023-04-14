
import React, { useState } from 'react'
import { Link ,useNavigate} from 'react-router-dom'
export default function SignUp({state}) {
    const nav = useNavigate();
    const handleSubmit = (e)=>{
        e.preventDefault()
      }
      const [password,setPassword] = useState("");
      const [email,setEmail] = useState("");
      const [username,setUsername] = useState("");
      const [address,setAddress] = useState("");
    //   const [confirm_password,setConfirmPassword] = useState("");
      const SignUpClicked = async ()=>{
        
    // localStorage.setItem("email",email);
    // localStorage.setItem("address",address);
    // const amount = { value: ethers.utils.parseEther("0.001") };
    try{
        const { contract } = state;
        console.log(contract);
        const transaction = await contract.addNewUser(username, email,address);
        await transaction.wait();
        console.log("1 done");
        // const transaction2 = await contract.verifyUser(email,password);
        // console.log("2 done");
        // aait transaction2.wait();

        console.log("Transaction is done");
        const response = await fetch("http://localhost:5000/auth/user/signup",
        {
          method:"POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username:username,
            email:email ,
            password:password,
          })
        });
        const data = await response.json();
        // window.localStorage.setItem("data",JSON.stringify(data))
        console.log(data);
        localStorage.setItem("username",username);
        // localStorage.setItem("data",JSON.stringify(user))
        localStorage.setItem("email",email)
        console.log(data);
        localStorage.setItem("User_id",data.new_user.id);
    console.log(username, email, contract);
    nav("/home")

    }catch(error){
        console.log(error);
    }
      }
    return (
        <div className="text-center m-5-auto">
            <h5>Create your account</h5>
            <form action="/home" method='POST' onSubmit={handleSubmit}>
                <p>
                    <label>Username</label><br/>
                    <input type="text" name="first_name" required onChange={e=>{
                        setUsername(e.target.value)
                    }}/>
                </p>
                <p>
                    <label>Email address</label><br/>
                    <input type="email" name="email" required onChange={e=>{
                        setEmail(e.target.value);
                    }} />
                </p>
                <p>
                    <label>Password</label><br/>
                    <input type="Password" name="Password" required onChange={e=>{
                        setPassword(e.target.value);
                    }} />
                </p>
                <p>
                    <label>Wallet</label><br/>
                    <input type="address" name="address" required onChange={e=>{
                        setAddress(e.target.value);
                    }} />
                </p>
                {/* <p>
                    <label>Confirm Password</label><br/>
                    <input type="password" name="password" required onChange={e=>{
                        setConfirmPassword(e.target.value);
                    }} />
                </p> */}

                <p>
                    <button id="sub_btn" type="submit" onClick={SignUpClicked}>Register</button>
                </p>
            </form>
            <footer>
                <p><Link to="/">Back </Link>.</p>
            </footer>
        </div>
    )

}