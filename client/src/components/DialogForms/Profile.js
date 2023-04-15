import React from 'react'
import { useEffect } from 'react';
import {useState} from 'react';
const Profile = ({state}) => {
    const [username,setUsername] = useState("");
    const [email,setEmail] = useState("");
    const [canBeValidator,setCanBeValidator] = useState("");
    const [articlesValidatedSinceLastAppoint,setArticlesValidatedSinceLastAppoint] = useState();
    const [rewardCount,setrewardCount] = useState("");
    const [articleValidatedCount,setarticleValidatedCount] = useState("");
    const [isActiveValidator,setisActiveValidator] = useState();
    useEffect(()=>{
        const getUserDetails = async ()=>{
            setUsername(localStorage.getItem("username"));
            setEmail(localStorage.getItem("email"));
            const user_id = localStorage.getItem("user_id");
            const id = parseInt(user_id,10);
            console.log(id);
            try{
                const {contract} = state;
            const user = await contract.getUser(id);
            setCanBeValidator(user[5].toString());
            setArticlesValidatedSinceLastAppoint(parseInt(user[6],16).toString());
            setrewardCount(parseInt(user[7],16).toString());
            setarticleValidatedCount(parseInt(user[8],16).toString());
            setisActiveValidator(user[10].toString());
            // console.log(user[]);
            // await user.wait();
            console.log(user);
            }catch(error){
                console.log(error);
            }
            
        }
        getUserDetails()
    }
    ,[])
  return (
    <div>
      <ul class="list-group">
  <li class="list-group-item">Name : {username}</li>
  <li class="list-group-item">Email :{email}</li>
  <li class="list-group-item">Can Be Validator : {canBeValidator}</li>
  <li class="list-group-item">Articles Validated Since Last Appoint : {articlesValidatedSinceLastAppoint}</li>
  <li class="list-group-item">Reward Count : {rewardCount}</li>
  <li class="list-group-item">Article Validated Count : {articleValidatedCount}</li>
  <li class="list-group-item">Is Active Validator : {isActiveValidator}</li>
</ul>
    </div>
  )
}

export default Profile