import Axios from "axios"
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router'
import '../assets/style/Login.css';
import { useAuth } from '../hooks';
import logo from '../assets/schipt_grey_blue_logo.png';
import { Link } from 'react-router-dom';
import { Switch, ToggleDarkMode, Password, TextField, Button, Toast } from '../components';


export default function Login() {
  const { setAuth } = useAuth()
  const [ username, setUsername ] = useState('')
  const [ password, setPassword ] = useState('')
  const [errMsg, setErrMsg] = useState('');
  const [switchTest, setSwitchTest] = useState(false);
  
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (location.state?.username){
      setUsername(location.state.username)
      setPassword("")
    }        
  }, [location.state?.username])

  useEffect(() => {
    setErrMsg('')
  }, [username, password])

  const loginUser = async e => {
    e.preventDefault();    
    Axios.post("http://localhost:5000/login", {username, password}, 
    {
      headers: {"Content-Type": "application/json"},
      withCredentials: true       
    })
    .then(({data}) => {
      setAuth({ username, 
        accessToken: data.accessToken 
      }); 

      if (location?.state?.from){
        return navigate(location.state.from) 
      }        
      else
        return navigate("/Home")
              
    })
    .catch((e) => {
      console.error(e)
      setErrMsg(e?.response?.data?.message ?? e.message)
    })
  }

  return (<>
    <div className="flex h-screen bg-slate-600">
      <div className="float-right bg-slate-50 h-0 absolute">{ ToggleDarkMode() }</div>
      <div className="max-w-sm p-8 max-h-80 mx-auto my-40 bg-slate-100 rounded-lg drop-shadow-lg">
        <img className="h-10 mx-auto mb-3" src={logo} alt="logo" />        
        <form onSubmit={loginUser}>
          <TextField value={username} onChange={val => setUsername(val)}>Email</TextField>
          <Password value={password} onChange={val => setPassword(val)} required autoComplete="off">Password</Password>
          <Button type="submit">Login</Button>  
        </form>
        <p className={errMsg ? "errmsg" : "offscreen"} style={{color: "red",fontWeight:"bold"}} aria-live="assertive">{errMsg}</p>
        <div>
          <Link to="/Register" className="text-blue-900 text-xs float-left absolute bottom-3 left-7">Create account</Link>
          <Link to="/ResetPassword" state={{username}} className="text-blue-900 text-xs float-right absolute bottom-3 right-7">Forgot password</Link>
          <Switch text="Remember me?" checked={switchTest} onChange={() => {setSwitchTest(!switchTest)}} />
        </div>        
      </div>  
      <Toast autoHideDuration={4000} type="info" position="topcenter" open={switchTest}>Of course I remember you! 😃</Toast>    
    </div>
  </>)
}