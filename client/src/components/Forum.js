import React from 'react'

const Forum = () => {
  return (
    <div>
      <div className="card mt-3 ">
  <h5 className="card-header bg-primary">Sports</h5>
  <div className="card-body">
    <h5 className="card-title">Fifa World Cup 2022</h5>
    <p className="card-text">FIFA Council highlights record breaking revenue in football</p>
    <a href="#" className="btn btn-primary">Head to Forum</a>
  </div>
</div>
<div className="card mt-5">
  <h5 className="card-header bg-primary">Business</h5>
  <div className="card-body">
    <h5 className="card-title">Investments</h5>
    <p className="card-text">India a bright spot for investments despite current volatility</p>
    <a href="#" className="btn btn-primary">Head to Forum</a>
  </div>
</div>
<div className="card mt-5">
  <h5 className="card-header bg-primary">Politics</h5>
  <div className="card-body">
    <h5 className="card-title">Elections</h5>
    <p className="card-text">BJP has no competition in 2024, people whole-heartedly with PM Modi</p>
    <a href="#" className="btn btn-primary">Head to Forum</a>
  </div>
</div>
    </div>
  )
}

export default Forum
