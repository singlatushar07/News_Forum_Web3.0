import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import {Link} from 'react-router-dom'
const Forum = ({state}) => {
  const [Articles,setArticles] = useState([]);
  const {contract} = state;
  const [status,setStatus] = useState("");
  useEffect(() => {
    const ArticlesMessage = async () => {
        // const contract = {state};
        console.log("X");
        const x  = await contract.getAllArticles();
        console.log(x);
        setArticles(x);
        // console.log(Articles);
        console.log("x");
        Articles.map((Article)=>{
          if(Article.isValidated){
            setStatus("Verified");
          }else{
            setStatus("Not Verified")
          }
        })
     
    };
    contract && ArticlesMessage();
  }, [contract]);
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

    // const amount = { value: ethers.utils.parseEther("0.001") };
    const transaction = await contract.addArticle(title,content );
    await transaction.wait();
    console.log("Transaction is done");
    const User_id = localStorage.getItem("User_id")
    console.log(User_id);
    // const a = JSON.parse({
    //   title:title,
    //   content:content,
    //   authorId:User_id
    // })
    // console.log(a);
    const response = await fetch("http://localhost:5000/article/addArticle",
        {
          method:"POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            title:title,
            content:content,
            authorId:User_id
          })
        });
        const data = await response.json();
        // window.localStorage.setItem("data",JSON.stringify(data))
        console.log(data);
    }catch(error){
      console.log(error);
    }
    

  }
  const ValidateArticle = async (article_id)=>{
    try{
      const {contract} = state;
    const transaction = await contract.validateArticle(article_id);
    await transaction.wait();
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
  <li class="list-inline-item ">{Article.author}</li>
  <li class="list-inline-item ml-3">{new Date(Article.timestamp * 1000).toLocaleString()}</li>
  <li class="list-inline-item ml-3">{localStorage.getItem("username")}</li>
  <li class="list-inline-item ml-3">{localStorage.getItem("email")}</li>
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
    !Article.isValidated && <button type="button" class="btn btn-primary ml-2" onClick={ValidateArticle(Article.id)} >Verify</button>
  }
  {
    Article.isValidated && <button type="button" class="btn btn-primary ml-2">Upvote</button>
  }
  {
    Article.isValidated && <button type="button" class="btn btn-primary ml-2">Downvote</button>
  }
</div>

          </div>

          </>
        )
        })}
    </>
  )
}

export default Forum
