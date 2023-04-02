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
function App() {
  const [state, setState] = useState({
    provider: null,
    signer: null,
    contract: null,
  });
  const [account, setAccount] = useState("None");
  useEffect(()=>{
    const connectWallet = async ()=>{
      const contractAddress = "0xd6ae641648730c6429998c1ac58563b35adfc4a6"
      const contractABI = abi.abi;
      try{
        const {ethereum} = window;
        if(ethereum){
          console.log("hello");
          const account = await ethereum.request({
            method:"eth_requestAccounts",
          })
          const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        setAccount(account);
        setState({ provider, signer, contract });
      }else{
        alert("Please install metamask");
      } 
    }catch(error){
      console.log(error);
    }
  }
  connectWallet();
  console.log(state);
  },[])
  return (
    <div className="App">
      <BrowserRouter>
      {/* <NavBar profileStatus = "Anonymous"/> */}
      <Routes>
      <Route exact path = "/" element={<CredentialsPage/>}/>
      <Route path = "/login" element={<Login/>}/>
        <Route path = "/register" element={<SignUp state={state}/>}/>
        <Route path="/home" element={<Forum state = {state}/>}/>
      </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
