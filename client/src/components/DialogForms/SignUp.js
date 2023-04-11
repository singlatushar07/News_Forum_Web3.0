import React, { useState } from 'react'
import { Link ,useNavigate} from 'react-router-dom'
import { ethers } from 'ethers';
import abi from "../contract/NewsForum.json"
export default function SignUp() {
    const nav = useNavigate();
    const handleSubmit = (e)=>{
        e.preventDefault()
      }
      const [password,setPassword] = useState("");
      const [email,setEmail] = useState("");
      const [username,setUsername] = useState("");
      const [address,setAddress] = useState("");
      const [private_key,setPrivateKey] = useState("");
    //   const [confirm_password,setConfirmPassword] = useState("");
      const SignUpClicked = async ()=>{
        
    // localStorage.setItem("email",email);
    // localStorage.setItem("address",address);
    // const amount = { value: ethers.utils.parseEther("0.001") };
    try{
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
            private_key:private_key
          })
        });
        const data = await response.json();
        // window.localStorage.setItem("data",JSON.stringify(data))
        console.log(data);

        localStorage.setItem("username",username);
        // localStorage.setItem("data",JSON.stringify(user))
        localStorage.setItem("email",email);
        localStorage.setItem("privateKey",private_key);
        console.log(data);
        localStorage.setItem("User_id",data.new_user.id);
        // console.log(contract);
        const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545/");
        console.log("provider");
        console.log(provider);
        const wallet = new ethers.Wallet(private_key, provider);
        console.log(wallet);
        console.log("wallet");
        const contractAddress = '0x5095d3313C76E8d29163e40a0223A5816a8037D8';
        const contract = new ethers.Contract(contractAddress,abi.abi,wallet);
        console.log("contract");
        console.log(contract);
        // const NewsForum = await ethers.getContractFactory('NewsForumContract');
        // const newsForum = await NewsForum.attach(owner_address);
        // const contractWithSigner = await newsForum.connect(walletOwner)

        const transaction = await contract.addNewUser(username, email,address, password);
        await transaction.wait();
        console.log("1 done");
        const transaction2 = await contract.verifyUser(email,password);
        console.log("2 done");
        // aait transaction2.wait();

        console.log("Transaction is done");
        
    // console.log(username, email, contract);
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
                <p>
                    <label>PRIVATE KEY</label><br/>
                    <input type="key" name="key" required onChange={e=>{
                        setPrivateKey(e.target.value);
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