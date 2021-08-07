import React, {useState} from 'react'
import { Link } from 'react-router-dom';
import Base from '../core/Base';

const Signin = () => {
  const signinForm = () => {
    return (
      <div className="row">
        <div className="col-md-6 offset-sm-3 test-left">
          <form>
            <div className="form-group">
              <label className="text-light">Email</label>
              <input className="form-control" type="email" />
            </div>
            <br/>
            <div className="form-group">
              <label className="text-light">Password</label>
              <input className="form-control" type="password" />
            </div>
            <br/>
            <button className="btn btn-success btn-block"> Submit</button>
          </form>
        </div>
      </div>
    );
  };

  return (
    <Base title="Sign In " description="Sign In to Explore Tshirt Store">
      {signinForm()}
    </Base>
  );
};


export default Signin;
