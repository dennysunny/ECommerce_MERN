import React, {useState} from 'react'
import { Link } from 'react-router-dom';
import Base from '../core/Base';

const Signup = () => {

    const signupForm = () => {

        return(
            <div className="row">
                <div className = "col-md-6 offset-sm-3 test-left">
                    <form>
                        <div className="form-group">
                            <label className = "text-light">Name</label>
                            <input className = "form-control" type="text"/>
                        </div>
                        <br/>
                        <div className="form-group">
                            <label className = "text-light">Email</label>
                            <input className = "form-control" type="email"/>
                        </div>
                        <br/>
                        <div className="form-group">
                            <label className = "text-light">Password</label>
                            <input className = "form-control" type="password"/>
                        </div>
                        <br/>
                        <button className="btn btn-success btn-block"> Submit</button>
                    </form>
                </div>
            </div>
        )
    }

    return (
        <Base title= "Sign Up " description="Sign Up to Explore Tshirt Store">
          {signupForm()}
        </Base>
    )
}


export default Signup;
