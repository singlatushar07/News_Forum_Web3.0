import React from 'react'
import { Link } from 'react-router-dom'


export default function CredentialsPage() {
    return (
        <>
        <h1> Welcome to News Forum Web3.0</h1>
            <h1 className="main-title text-center">login or register</h1>
            <div className="buttons text-center">
                <Link to="/login">
                    <button className="primary-button">log in</button>
                </Link>
                <Link to="/register">
                    <button className="primary-button" id="reg_btn"><span>register </span></button>
                </Link>
            </div>
            </>
    )
}