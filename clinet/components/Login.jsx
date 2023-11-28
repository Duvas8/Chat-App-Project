import React, {  } from 'react'
import { useEffect, useState, useRef , useContext} from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import  AuthContext  from "../context/AuthProvider";


// import useSocket from '../hooks/useSocket'

// import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios';
const LOGIN_URL = 'http://localhost:3000/auth/login'

const  Login = () => {
   const { setAuth } = useContext(AuthContext)

   const location = useLocation()
   const navigate = useNavigate()
   const from = location.state?.from?.pathname || "/Dashbord";

   const userRef = useRef();
   const errRef = useRef();

   const [user, setUser] = useState('');
   const [pwd, setPwd] = useState('');
   const [errMsg, setErrMsg] = useState('');
   
   
   
   useEffect(() => {
    userRef.current.focus();
   }, [])

   
   useEffect(() => {
    setErrMsg('');
   }, [user, pwd])

   const handleSubmit = async (e) => {
        e.preventDefault();
        if(!user || !pwd){
            setErrMsg('Please fill in all fields.');
            return
        }
        const obj = {
            username:user,
            password:pwd
          }
        try {
            const resp = await axios.post(
                LOGIN_URL,
                obj,
                {
                    headers: {
                        'Content-Type': 'application/json', 
                        //'Authorization': `Bearer ${accessToken}`
                    },
                    withCredentials: true 
                });
            console.log(resp?.data);
            // console.log(resp?.data?.accessToken);
            // console.log(JSON.stringify(resp?.data))
            // console.log(resp?.data?.roles);
            const accessToken = resp.data.accessToken
            const roles = resp.data.roles
            const id = resp.data.id
            setAuth({user, pwd, accessToken, roles, id})
            setUser('')
            setPwd('')
            navigate(from, {relative: true})
        } catch (err) {  
            if(!err?.resp){
                setErrMsg("No Server Respons")
                console.log(errMsg)
                console.log(err)
            } else if (err.resp?.status === 409){
                setErrMsg("Name Already Taken ")
                console.log(errMsg)
            }else{
                setErrMsg("Regisrition Faild")
            }
            errRef.current.focus();
        } 
   }

  


  
  
  return (
   
       <section>
           <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
           <h1>Login</h1>
           <form onSubmit={handleSubmit}>
               <label htmlFor="username">
                   Username:
               </label>
               <input
                   type="text"
                   id="username"
                   ref={userRef}
                   autoComplete="off"
                   onChange={(e) => setUser(e.target.value)}
                   value={user}
                   required
               />
               <label htmlFor="password">
                   Password:
               </label>
               <input
                   type="password"
                   id="password"
                   onChange={(e) => setPwd(e.target.value)}
                   value={pwd}
                   required
               />
        
             
               <button disabled={!user || !pwd  ? true : false}>Sign In</button>
           </form>
           <p>
               Not registered?<br />
               <span className="line">
               <Link to='/'>Sign Up</Link> <br />
                <Outlet />
               </span>
           </p>
       </section>
   
  )
}

export default Login