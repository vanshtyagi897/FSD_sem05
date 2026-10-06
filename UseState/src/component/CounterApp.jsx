import React from 'react'
import { useState } from 'react';
const CounterApp = () => {
  const [count, setCount]=useState(0);
  function inc(){
    setCount(count+1)
    
  }
  function dec(){
    if(count>0)
    setCount(count-1)
    
  }
  return (
    <div style={{border:"2px solid black", height:"300px", width:"300px", backgroundColor:"yellow"}}>
      <h1>Counter App</h1>
      <button onClick={inc}>Add +</button>
      <br />
      <span>{count}</span>
      <p>{count==0 && "can not be negative"}</p>
      <br />
      <button onClick={dec}>sub -</button>
    </div>
  )
}

export default CounterApp
