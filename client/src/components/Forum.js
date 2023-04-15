import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import {Link} from 'react-router-dom'
const Forum = ({state}) => {
  const [Articles,setArticles] = useState([]);
  const {contract} = state;
  const [status,setStatus] = useState("");
  const [upvotes,setUpvotes] = useState(new Map());
  const [downvotes,setDownvotes] = useState(new Map());

  useEffect(() => {
    const ArticlesMessage = async () => {
        // const contract = {state};
        console.log("X");
        const x  = await contract.getAllArticles();
        console.log(x);
        setArticles(x);
        // console.log(Articles);
        console.log("x");
        Articles.map(async (Article)=>{
          if(Article.isValidated){
            setStatus("Verified");
          }else{
            setStatus("Not Verified")
          }
          // const transaction = await contract.getNumberOfUpvotes(Article.id);
          // const x = parseInt(transaction._hex,16);
          // upvotes.set(Article.id,x);
          // console.log(upvotes);
          // const transaction2 = await contract.getNumberOfDownvotes(Article.id);
          // const y = parseInt(transaction2._hex,16);
          // downvotes.set(Article.id,y);
          // console.log(downvotes);
        })
     
        
      };
    //   const getUpvotes = async ()=>{
    //     const result = await contract.getNumberOfUpvotes(article_id);
    // // setUpvotes(result);
    // const x = parseInt(result._hex,16);
    // setUpvotes(x);
    //   }
    //   const getDownvotes = async ()=>{
    //     const result = await contract.getNumberOfDownvotes(article_id);
    // // setUpvotes(result);
    // const x = parseInt(result._hex,16);
    // setDownvotes(x);
    //   }
    contract && ArticlesMessage();
    // getUpvotes();
    // getDownvotes();
  }, [contract]);
  useEffect(() => {
    const fetchVotes = async () => {
      for (const article of Articles) {
        const upvoteResult = await contract.getNumberOfUpvotes(article.id);
        const upvoteCount = parseInt(upvoteResult._hex, 16);
        setUpvotes((prevUpvotes) => new Map(prevUpvotes.set(article.id, upvoteCount)));

        const downvoteResult = await contract.getNumberOfDownvotes(article.id);
        const downvoteCount = parseInt(downvoteResult._hex, 16);
        setDownvotes((prevDownvotes) => new Map(prevDownvotes.set(article.id, downvoteCount)));
      }
    };
    contract && Articles.length && fetchVotes();
  }, [contract, Articles]);
  // const ArticlesMessage = async (event) => {
  //      event.preventDefault();
  //       const x = await contract.getAllArticles();
  //       setArticles(x); 
  //     };
  const handleSubmit = (e)=>{
    e.preventDefault();
  }
  const [title,setTitle] = useState("");
  const [content,setContent] = useState(""); 
  const addArticle = async ()=>{
    try{
      const { contract } = state;
    console.log(title, content, contract);
    const username = localStorage.getItem("username");
    // const amount = { value: ethers.utils.parseEther("0.001") };
    const transaction = await contract.addArticle(title,content,username);
    await transaction.wait();
    console.log("Transaction is done");
    const User_id = localStorage.getItem("user_id")
    const userId = parseInt(User_id,10);
    console.log(User_id);
    // const a = JSON.parse({
    //   title:title,
    //   content:content,
    //   authorId:User_id
    // })
    // console.log(a);
    const response = await fetch("http://localhost:5002/article/addArticle",
        {
          method:"POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            title:title,
            content:content,
            authorId:userId
          })
        });
        const data = await response.json();
        // window.localStorage.setItem("data",JSON.stringify(data))
        console.log(data);
        // window.reload();
    }catch(error){
      console.log(error);
    }
    

  }
  const addAnonymous = async ()=>{
    try{
      const { contract } = state;
    console.log(title, content, contract);
    // const amount = { value: ethers.utils.parseEther("0.001") };
    const transaction = await contract.addAnonymously(title,content);
    await transaction.wait();
    console.log("Transaction is done");
    const User_id = localStorage.getItem("User_id")
    const userId = parseInt(User_id,10);
    console.log(userId);
    // const a = JSON.parse({
    //   title:title,
    //   content:content,
    //   authorId:User_id
    // })
    // console.log(a);
    const response = await fetch("http://localhost:5002/article/addArticle",
        {
          method:"POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            title:title,
            content:content,
            authorId:userId
          })
        });
        const data = await response.json();
        // window.localStorage.setItem("data",JSON.stringify(data))
        console.log(data);
        // window.reload();
    }catch(error){
      console.log(error);
    }
    
  }
  const ValidateArticle = async (article_id)=>{
    try{
    const {contract} = state;
    const transaction = await contract.validateArticle(article_id);
    await transaction.wait();
    const users = await contract.getAllUsers();
    console.log("All the user info is-->",users);
    }catch(error){
      console.log(error);
    }
    
  }
  const UpvoteArticle = async (article_id)=>{
    try{
      const {contract} = state;
      const transaction = await contract.upvoteArticle(article_id);
      await transaction.wait();
      console.log("upvote transaction done");
      // const result = await contract.getNumberOfUpvotes(article_id);
      // // setUpvotes(result);
      // const x = parseInt(result._hex,16);
      // upvotes.set(article_id,x);
      // console.log();
    }catch(error){
      console.log(error);
    }
  }
  const DownvoteArticle = async (article_id)=>{
    try{
      const {contract} = state;
      const transaction = await contract.downvoteArticle(article_id);
      await transaction.wait();
      // const result = await contract.getNumberOfDownvotes(article_id);
      // const x = parseInt(result._hex,16);
      // downvotes.set(article_id,x);
    }catch(error){
      console.log(error);
    }
  }

  return (
    <>
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
  <a className="navbar-brand" href="#">NewsForum Web3.0</a>
  <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
    <span className="navbar-toggler-icon"></span>
  </button>
  <div className="collapse navbar-collapse" id="navbarText">
    <ul className="navbar-nav mr-auto">
      <li className="nav-item active">
        <a className="nav-link" href="#">Home <span className="sr-only">(current)</span></a>
      </li>
      <li className="nav-item">
        <a className="nav-link" href="#">{localStorage.getItem("username")}</a>
      </li>
      <li className="nav-item">
        <a className="nav-link" href="#">{localStorage.getItem("email")}</a>
      </li>
      <li className="nav-item">
        <Link className = "nav-link" to="/update">Update User</Link>
      </li>
      <li className="nav-item">
        <Link className = "nav-link" to="/user/profile">User Profile</Link>
      </li>
    </ul>
    {/* <span className="navbar-text">
    {localStorage.getItem("address")}
    </span> */}
  </div>
</nav>
    <form action="" className='form-group' onSubmit={handleSubmit}>
      <h1>Add an Article</h1>
      <div>
      <input type="title" placeholder='title' className='form-control mt-3' onChange={e=>{
        setTitle(e.target.value)
      }} />
      <textarea name="content" id="" cols="30" rows="10" placeholder='content' className='form-control' onChange={e=>{
        setContent(e.target.value)
      }}></textarea>
      <button className=' btn btn-primary mt-3' onClick={addArticle}>Add</button>
      <button className=' btn btn-primary ml-2 mt-3' onClick={addAnonymous}>Add Anonymously</button>
      </div>
    </form>
    {/* <button onClick={ArticlesMessage}> Get </button> */}
    {
      Articles.map((Article)=>{
          // if(Article.isValidated ){
          //   setStatus("Verified");
          // }else{
          //   setStatus("Not Verified")
          // }
        return (
          <>
          <div class="border">
          <ul class="list-inline ">
            {
  Article.authorName=="" && <li class="list-inline-item "></li>
            }
            {
  !Article.authorName=="" && <li class="list-inline-item">{Article.author}</li>
            }
  <li class="list-inline-item ml-3">{new Date(Article.timestamp * 1000).toLocaleString()}</li>
  <li class="list-inline-item ml-3">{Article.authorName}</li>
  {/* <li class="list-inline-item ml-3" >{status}</li> */}
  <div>
    {
      !Article.isValidated && <li class="list-inline-item ml-3" style={{color:'red'}}>"Not Verified"</li>
    }
    {
      Article.isValidated && <li class="list-inline-item ml-3" >"Verified"</li>
    }
  </div>
  
</ul>
<blockquote class="blockquote">
  <p class="mb-0">{Article.content}</p>
  <footer class="blockquote-footer"> <cite title="Source Title">{Article.title}</cite></footer>
</blockquote>
<div>
  {
    !Article.isValidated && <button type="button" class="btn btn-primary ml-2" onClick={()=>ValidateArticle(Article.id)} >Verify</button>
  }
  {
    Article.isValidated && <p><button type="button" class="btn btn-primary mt-2" onSubmit={handleSubmit} onClick={()=>UpvoteArticle(Article.id)}>Upvote</button> {upvotes.get(Article.id)}</p>  
    
  }
  {
    Article.isValidated && <p><button type="button" class="btn btn-primary mt-2" onSubmit={handleSubmit} onClick={()=>DownvoteArticle(Article.id)}>Downvote</button> {downvotes.get(Article.id)}</p>
                                                   
  }
   <Link className = "nav-link" to="/update/article" onClick={()=>{
    localStorage.setItem("article_id",Article.id);
   }}>Update Article</Link>
</div>

          </div>

          </>
        )
        })}
    </>
  )
}

export default Forum