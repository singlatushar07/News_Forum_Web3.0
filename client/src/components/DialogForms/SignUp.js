import React, { useState } from 'react'
import { Link ,useNavigate} from 'react-router-dom'
export default function SignUp({state}) {
    const nav = useNavigate();
    const handleSubmit = (e)=>{
        e.preventDefault()
      }
      const [address,setAddress] = useState("");
      const [email,setEmail] = useState("");
      const [username,setUsername] = useState("");
    //   const [confirm_password,setConfirmPassword] = useState("");
      const SignUpClicked = async ()=>{
        // const response = await fetch("http://localhost:5000/auth/user/signup",
        // {
        //   method:"POST",
        //   headers: {
        //     'Content-Type': 'application/json'
        //   },
        //   body: JSON.stringify({
        //     username:username,
        //     email:email ,
        //     password:password,
        //     confirm_password:confirm_password
        //   })
        // });
        // const data = await response.json();
        // // window.localStorage.setItem("data",JSON.stringify(data))
        // console.log(data);
        // // localStorage.setItem("data",JSON.stringify(user))
        // localStorage.setItem("email",email)
        // nav("/home")
    const { contract } = state;
    console.log(username, email, contract);
    localStorage.setItem("username",username);
    localStorage.setItem("email",email);
    localStorage.setItem("address",address);
    // const amount = { value: ethers.utils.parseEther("0.001") };
    try{
        const transaction = await contract.addNewUser(username, email, address);
        await transaction.wait();
        console.log("Transaction is done");

    }catch(error){
        console.log(error);
    }
    nav("/home")
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
                    <label>Wallet Address</label><br/>
                    <input type="Address" name="Address" required onChange={e=>{
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