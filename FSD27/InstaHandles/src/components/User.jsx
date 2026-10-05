import React from 'react'

const User = (props) => {
  return (
    <div>
      <div style={{margin:"100px", border:'2px solid whitesmoke,',width:'300px',height:'400px', backgroundColor:'#E1AD01', textAlign:'center'}}>
        <h1>{props.name}</h1>
        <img src={props.img} alt="" height={'150px'} width={'autopx'} border={'1px solid blue' }  />
        <h3>{props.followers}</h3>
        <h3>{props.posts}</h3>
      </div>
    </div>
  )
}

export default User
