import React from 'react'

const Student1 = (props) => {
  return (
    <div>
      <div style={{margin:"100px", border:'2px solid yellow,',width:'300px',height:'400px', backgroundColor:'grey', textAlign:'center'}}>
        <h1>{props.name}</h1>
        <img src={props.img} alt="" height={'150px'} width={'autopx'} border={'2px solid grey'} />
        <h3>{props.class}</h3>
        
        <h3>{props.address}</h3>
      </div>
    </div>
  )
}

export default Student1
