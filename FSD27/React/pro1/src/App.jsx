// import React from 'react'
// import Student1 from './Components/Student1'
// const App = () => {
//   return (
//     <div>
//       <h1 style={{textAlign:"center"}}>My Children records</h1>
//       <div style={{display:'flex', alignItems:'center'}}>
//         <Student1 name="Tushar" class="Padhta nhi" address="Junglee" img="https://instagram.fdel15-1.fna.fbcdn.net/v/t51.82787-19/573047445_17945861391060753_974938230239517375_n.jpg?_nc_cat=107&_nc_map=urlgen_bucketless&ccb=7-5&_nc_sid=bf7eb4&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLnd3dy4xMDgwLkMzIn0%3D&_nc_ohc=Gf8B58VWnfoQ7kNvwEEjbvq&_nc_oc=AdpYzECKwB-ap8sN3DX82tCJFH8C5JwPf3QRj6CGU5QuySXaz2_OD5w96mIGtHhduLY&_nc_zt=24&_nc_ht=instagram.fdel15-1.fna&_nc_gid=s4PDGk9C-NOjAAtcLL7Geg&_nc_ss=7baaf&oh=00_AQMBrWIDOU5y3My-vLnEZlrLms3vVBQP_gw_eDPV-1cQPw&oe=6AC8FB8C"/>
//         <Student1 name="Pheonix" class="Jyda pdhta hai" address="Mars" img="https://imgs.search.brave.com/WAvf0VWI4tcfJhI3dF544jdlpjsnkR1iFwLvOl2Geo0/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJzLmNvbS9p/bWFnZXMvaGQvcGhv/ZW5peC1taW5pbWFs/aXNtLWJsYWNrLWxt/a2FkbmVhZm92eWNl/NG4uanBn"/>
//         <Student1 name="Bharadwaj" class="aata hi nhi" address="Smashkarts" img="https://imgs.search.brave.com/5-_LHSmrXQGl31E1cAk18mpicUjpLK0kjuJPG_Qg_IM/rs:fit:0:180:1:0/g:ce/aHR0cHM6Ly9tZWRp/YS50ZW5vci5jb20v/dUJQSDFETlQ4Mm9B/QUFBTS9mYWtlci10/MS5naWY.jpeg"/>
//       </div>
//     </div>
//   )
// }

// export default App


import {BrowserRouter,Link, Routes, Route} from 'react-router-dom'
function Home(){
  return <h1>This is my home page</h1>
}
function About(){
  return <h1>This is abput page</h1>
}
function Phone(){
  return <h1>Thisis phone page</h1>
}
const App = () => {
  return (
    <BrowserRouter>
    
      <nav style={{display:"flex", justifyContent:"center",gap:"80px", border:"1px solid blue",padding:"27px", backgroundColor:"cyan"}}>
        <Link style={{textDecoration:"none",}} to="/">HOME</Link>
        <Link style={{textDecoration:"none"}}  to="/about">ABOUT US</Link>
        <Link style={{textDecoration:"none"}}  to="/phone">PHONE</Link>
      </nav>
      
      <Routes >
        <Route path="/" element={<Home/>}/>
        <Route path="/about" element={<About/>}/>
        <Route path="/phone" element={<Phone/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App

