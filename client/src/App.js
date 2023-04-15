import './App.css';
import NavBar from './components/NavBar';
import Forum from './components/Forum';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import Addforum from './components/Addforum';
import CredentialsPage from './components/DialogForms/CredentialsPage';
import Login from './components/DialogForms/Login';
import SignUp from './components/DialogForms/SignUp';
import abi from "./contract/NewsForum.json";
import { useState, useEffect } from "react";
import  {ethers}  from "ethers";
import { useNavigate } from "react-router-dom";
import Update from './components/DialogForms/Update';
import UpdateArticle from './components/UpdateArticle';
import Profile from './components/DialogForms/Profile';
function App() {
  const contractAddress = '0x5095d3313C76E8d29163e40a0223A5816a8037D8';
  const [state,setState] = useState({
    provider:null,
    signer:null,
    contract:null
  })
  const [account,setAccount] = useState("none");
  // const nav = useNavigate();
  useEffect(()=>{
    const {ethereum} = window;
    try{
      if(ethereum){
        const connectWallet = async ()=>{
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi.abi, signer);
        const account = await ethereum.request({
                  method:"eth_requestAccounts",
        })
        window.ethereum.on("chainChanged", () => {
          window.location.reload();
        });

        window.ethereum.on("accountsChanged", () => {
          // nav("/register")
          window.location.reload();
        });
        setAccount(account);
        setState({provider,signer,contract});
        console.log(state);
        console.log(state);
      }
      connectWallet();
      }else{
        alert("install wallet");
      }
    }catch(error){
      console.log(error);
    }
    console.log(account);
    console.log(state.signer);
    console.log(state.signer);
  }
  ,[])
  return (
    <div className="App">
      <BrowserRouter>
      {/* <NavBar profileStatus = "Anonymous"/> */}
      <Routes>
      <Route exact path = "/" element={<CredentialsPage/>}/>
      <Route path = "/login" element={<Login state={state}/>}/>
        <Route path = "/register" element={<SignUp state={state}/>}/>
        <Route path="/home" element={<Forum state = {state}/>}/>
        <Route exact path="/update" element = {<Update state = {state}/>}/>
        <Route exact path="/update/article" element = {<UpdateArticle state = {state}/>}/>
        <Route exact path="/user/profile" element = {<Profile state = {state}/>}/>
      </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
