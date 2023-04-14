import React, { useState } from 'react'


const UpdateArticle = ({state}) => {
    const [title,setTitle] = useState("");
    const [content,setContent] = useState("");
    const handleChange=(e)=>{
        e.preventDefault();
    }
    const UpdateArticle = async ()=>{
        try{
        const {contract} = state;
        const article_id = localStorage.getItem("article_id");
        const transaction = await contract.updateArticle(article_id,title,content);
        transaction.wait();
        console.log("transaction done");
        }catch(error){
            console.log(error);
        }
    }

  return (
    <div>
      <form action="" method="post" onSubmit = {handleChange}>

        <input type="username" placeholder="Title" required onChange={e=>{
            setTitle(e.target.value);
        }}/>
        <input type="email" placeholder="Content"required onChange={
            e=>{
                setContent(e.target.value);
            }
        } />
        <button onClick={UpdateArticle} >Update</button>
      </form>
    </div>
  )
}

export default UpdateArticle
