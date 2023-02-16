import React from 'react'
import { useState } from 'react'
import {Link} from 'react-router-dom'
const NavBar = (props) => {
    const [profileState,setProfileState] = useState(props.profileStatus);
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <Link className="navbar-brand" to="/">News Forum Web3.0</Link>
  {/* <a className="navbar-brand" href="#">News Forum Web3.0</a> */}
  <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
    <span className="navbar-toggler-icon"></span>
  </button>
  <div className="collapse navbar-collapse" id="navbarNavDropdown">
    <ul className="navbar-nav">
      <li className="nav-item active">
        <Link className="nav-link" to="/profile">Profile_Name <span className="sr-only">(current)</span></Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/add">Add_News</Link>
      </li>
      <li className="nav-item">
        <a className="nav-link" href="#">Update_News</a>
      </li>
      <li className="nav-item dropdown">
        <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          More Options
        </a>
        <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
          <a className="dropdown-item" href="#">Update_Profile</a>
          <a className="dropdown-item" href="#">View_My_News</a>
        </div>
      </li>
    </ul>
    <div className="htmlForm-group row">

</div>
  </div>
<div className="custom-control custom-switch">
  <input type="checkbox" className="custom-control-input" id="customSwitches"/>
  <label className="custom-control-label" htmlFor="customSwitches" onClick={()=>{
    if(profileState == "Anonymous"){
        setProfileState("Public");
    }else{
        setProfileState("Anonymous");
    }
  }}>{profileState}</label>
</div>
</nav>
    </div>
  )
}

export default NavBar
