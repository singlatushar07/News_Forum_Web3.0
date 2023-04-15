import React, { useState } from 'react'
import { useEffect } from 'react';
const { ethers } = require("ethers");

const UserDetails = () => {
    const [user,setUser] = useState("");
    // const [state1, setState] = useState(JSON.parse(localStorage.getItem('state')) || {});
    const state = JSON.parse(localStorage.getItem("state"));

    async function fetchUser() {
        // Replace with the address of your Solidity contract
        const {contract} = state;
        console.log("State is->",state,"   and Contract is -> ", contract);
        const userId = localStorage.getItem("user_id");
        console.log("trying to query the user with userId", userId,"from blockchain");
        const userDetails = await contract.getUser(userId);
        //await userDetails.wait();
        console.log(userDetails);
  
        // Update state with user details
        setUser(userDetails);
      }

    useEffect( () => {
        if (window.ethereum) {
             fetchUser();
        } else {
            console.error('Ethereum provider not found');
        }       
    }, [localStorage.getItem("user_id")]);

    // useEffect(() => {
    //     // Store the state in localStorage whenever it changes
    //     localStorage.setItem('state', JSON.stringify(state));
    //   }, [state]);


    return (
        <div>
          <h2>User Details</h2>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
          <p>address: {user.userAddress}</p>
          {/* <p>rewardCount: {user.rewardCount._hex}</p> */}
        </div>
      );
}

export default UserDetails
