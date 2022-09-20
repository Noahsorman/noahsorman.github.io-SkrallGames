import Axios from "axios"
import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router'
import '../assets/style/Login.css';
import logo from '../assets/schipt_grey_blue_logo.png';
import { Link } from 'react-router-dom';

export default function ResetPassword() {
  const { token } = useParams();

  const location = useLocation();
  //Variables for ResetPassword without /Token
  const [ username, setUsername ] = useState('')
  const [ message, setMessage ] = useState({});
  const [ buttonClicked, setButtonClicked ] = useState(false)
  //Variables with /Token
  const [ password, setPassword] = useState('')
  const [ repeatedPassword, setRepeatedPassword] = useState('')

  useEffect(() => {
    if (location.state?.username)
        setUsername(location.state.username)
  }, [location.state?.username])
  
  const navigate = useNavigate()

  useEffect(() => {
    setMessage({})
  }, [username, password, repeatedPassword])

  const sendResetMail = async e => {
    e.preventDefault();
    setMessage({})
    setButtonClicked(true)
    Axios.post("http://localhost:5000/resetPassword", {username}, 
    {
      headers: {"Content-Type": "application/json"},
      withCredentials: true,
      timeout: 5000    
    })
    .then(response => {
        console.log("Data:", response)
        let seconds = 5
        let intervalId = setInterval(() => {
            seconds--
            setMessage({text: `You'll be redirected to login page in ${seconds} seconds..`})
            if (seconds === 0){
                clearInterval(intervalId)
                return navigate("/Login", {state: {username}})
            }
        }, 1000)                      
    })
    .catch((e) => {
      console.error(e)
      setMessage({
        text: e?.response?.data?.message ?? e.message,
        color: "text-red-600"
      })
      setButtonClicked(false)
    })
  }

  const changePassword = async e => {
    e.preventDefault();
    setMessage({})
    setButtonClicked(true)

    if (password !== repeatedPassword){
        setMessage({
            text: "Passwords are not the same.",
            color: "text-red-600"
          })
        setButtonClicked(false)
        return
    }

    Axios.post("http://localhost:5000/changePassword", {
        resetToken: token,
        password
    }, 
    {
      headers: {"Content-Type": "application/json"},
      withCredentials: true,
      timeout: 5000    
    })
    .then(response => {
        console.log("Data:", response)
        let seconds = 5
        let intervalId = setInterval(() => {
            seconds--
            setMessage({text: `You'll be redirected to login page in ${seconds} seconds..`})
            if (seconds === 0){
                clearInterval(intervalId)
                return navigate("/Login")
            }
        }, 1000)                      
    })
    .catch((e) => {
      console.error(e)
      setMessage({
        text: e?.response?.data?.message ?? e.message,
        color: "text-red-600"
      })
      setButtonClicked(false)
    })
  }

  return (
    <>{!token ?
        <div className="flex h-screen bg-slate-600">
            <div className="p-8 max-h-80 w-64 mx-auto my-40 bg-slate-100 rounded-lg drop-shadow-lg">
                <img className="h-10 mb-3" src={logo} alt="logo" />        
                <form onSubmit={sendResetMail}>
                <input type="email" placeholder='Email...' value={username} className="text-base p-1 rounded-md border border-cyan-500" onChange={e => setUsername(e.target.value)} required autoFocus/>
                <button type="submit" disabled={buttonClicked} 
                    className={`bg-cyan-500 hover:bg-cyan-600 px-10 py-1 rounded-full text-white mt-5 ${buttonClicked && 'cursor-wait'}`}>Reset password</button>  
                </form>
                {message?.text ?
                    <p className={`text-ms mt-2 ${message?.color ?? 'text-neutral-500'}`} >{message?.text}</p>
                    :<></>
                }        
                <div>
                    <Link to="/Register" className="text-blue-900 text-xs float-left absolute bottom-3 left-7">Create account</Link>
                    <Link to="/Login" className="text-blue-900 text-xs float-right absolute bottom-3 right-7">Login</Link>
                </div>
            </div>
        </div>
        :
        <div className="flex h-screen bg-slate-600">
            <div className="p-8 max-h-80 w-64 mx-auto my-40 bg-slate-100 rounded-lg drop-shadow-lg">
                <img className="h-10 mb-3" src={logo} alt="logo" />        
                <form onSubmit={changePassword}>
                <input type="password" placeholder='New Password..' value={password} className="text-base p-1 rounded-md border border-cyan-500" onChange={e => setPassword(e.target.value)} required autoFocus/>
                <input type="password" placeholder='Repeat Password..' value={repeatedPassword} className="text-base p-1 rounded-md border border-cyan-500" onChange={e => setRepeatedPassword(e.target.value)} required/>
                <button type="submit" disabled={buttonClicked} 
                    className={`bg-cyan-500 hover:bg-cyan-600 px-10 py-1 rounded-full text-white mt-5 ${buttonClicked && 'cursor-wait'}`}>Reset password</button>  
                </form>
                {message?.text ?
                    <p className={`text-ms mt-2 ${message?.color ?? 'text-neutral-500'}`} >{message?.text}</p>
                    :<></>
                }        
            </div>
        </div>
    }</>
  )
}

