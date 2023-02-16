import React from 'react'

const Addforum = () => {
  return (
    <div>
        <form action="submit">
        <div className="input-group mb-3">
  <div className="input-group-prepend">
    <span className="input-group-text" id="basic-addon1">@</span>
  </div>
  <input type="text" className="form-control" placeholder="Username" aria-label="Username" aria-describedby="basic-addon1"/>
</div>
<div className="input-group">
  <div className="input-group-prepend">
    <span className="input-group-text">Category</span>
  </div>
  <textarea className="form-control" aria-label="With textarea"></textarea>
</div>
<div className="input-group">
  <div className="input-group-prepend">
    <span className="input-group-text">Title</span>
  </div>
  <textarea className="form-control" aria-label="With textarea"></textarea>
</div>
<div className="input-group">
  <div className="input-group-prepend">
    <span className="input-group-text">Description</span>
  </div>
  <textarea className="form-control" aria-label="With textarea"></textarea>
</div>
<button type="button" class="btn btn-primary mt-3">Submit</button>
        </form>
    </div>
  )
}

export default Addforum
