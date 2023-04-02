import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';

const Forum = ({state}) => {
  const [Articles,setArticles] = useState([]);
  const contract = {state};

  useEffect(() => {
    const ArticlesMessage = async () => {
      const Articles = await contract.getMyArticles();
      setArticles(Articles); 
    };
    contract && ArticlesMessage();
  }, [contract]);
  const handleSubmit = (e)=>{
    e.preventDefault();
  }
  const [title,setTitle] = useState("");
  const [content,setContent] = useState(""); 
  const addArticle = async ()=>{
    const { contract } = state;
    console.log(title, content, contract);

    // const amount = { value: ethers.utils.parseEther("0.001") };
    const transaction = await contract.addArticle(title,content );
    await transaction.wait();
    console.log("Transaction is done");
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

    </ul>
    <span className="navbar-text">
    {localStorage.getItem("address")}
    </span>
  </div>
</nav>
    <form action="" className='form-group' onSubmit={handleSubmit}>
      <div>
      <input type="title" placeholder='title' className='form-control mt-3' onChange={e=>{
        setTitle(e.target.value)
      }} />
      <textarea name="content" id="" cols="30" rows="10" placeholder='content' className='form-control' onChange={e=>{
        setContent(e.target.value)
      }}></textarea>
      <button className='mt-3' onClick={addArticle}>Add</button>
      </div>
    </form>
    <p>Articles</p>
    {
      Articles.map((Article)=>{
        return (
          <>

          <p>
            {Article.title}
          </p>
          <p>
            {Article.content}
          </p>
          </>
        )
        })}
    </>
  )
}

export default Forum
