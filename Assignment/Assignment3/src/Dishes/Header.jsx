import React from 'react'

const Header = () => {
  return (
    <div style={{display:'flex', flexDirection:'row', justifyContent:'space-around', width:'auto', height:'100px', border:'2px solid black', backgroundColor:'whitesmoke'}}>
      <img src="https://imgs.search.brave.com/n4FWKm7y3HvvvCL-zcm1jFKi_tf4HZfD8y0LJxsZFpc/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMucGV4ZWxzLmNv/bS9waG90b3MvMjM5/NDQ0Ni9wZXhlbHMt/cGhvdG8tMjM5NDQ0/Ni5qcGVnP2NzPXRp/bnlzcmdiJmRwcj0x/Jnc9NTAw" alt="" height={'100px'} width={'100px'} border={'1px solid yellow'} />
      <h1 style={{color:'grey'}}><a href="#" style={{textDecoration:'none'}}>Home</a></h1>  
      <h1 style={{color:'grey'}}><a href="#" style={{textDecoration:'none'}}>About Us</a></h1>      
    </div>
  )
}

export default Header
