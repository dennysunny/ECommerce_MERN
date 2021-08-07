import React from 'react'
import "../styles.css"
import { API } from '../backend';
import Base from './Base';
//https://serverless-stack.com/chapters/environments-in-create-react-app.html


export default function Home() {

    console.log("API IS", process.env.REACT_APP_BACKEND);
    return (
        <Base title="Home Page" description="Welcome To T-Shirt Store">
           <div className="row">
               <div className="col-4">
                   <button className="btn btn-success">Test</button>
               </div>
               <div className="col-4">
                   <button className="btn btn-danger">Test</button>
               </div>
               <div className="col-4">
                   <button className="btn btn-primary">Test</button>
               </div>
           </div>
        </Base>
    )
}


