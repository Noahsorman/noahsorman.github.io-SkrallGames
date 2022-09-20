//import Axios from "axios"
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router'
import '../assets/style/Login.css';
import logo from '../assets/schipt_grey_blue_logo.png';
import { ToggleDarkMode } from '../components/Utils';
import { Link } from 'react-router-dom';

export default function Register() {
  const [ companyName, setCompanyName ] = useState('')
  const [ companyRegNo, setCompanyRegNo ] = useState('')
  const [ companyVatNo, setCompanyVatNo ] = useState('')
  const [ invoiceEmail, setInvoiceEmail ] = useState('')
  const [ contactName, setContactName ] = useState('')
  const [ contactEmail, setContactEmail ] = useState('')
  const [ contactPhone, setContactPhone ] = useState('')
  const [errMsg, setErrMsg] = useState('');
  
  const navigate = useNavigate()

  const isLoggedIn = false//(SchiptToken.getToken() && true) ?? false

  useEffect(() => {
    setErrMsg('')
  }, [companyName, companyRegNo, companyVatNo, invoiceEmail, contactName, contactEmail])

  if (isLoggedIn) return <Navigate to="/Home" />

  const registerUser = async e => {
    e.preventDefault();    
    alert("Tja")
    navigate("/Home")
    // Axios.post("http://localhost:5000/login", {username, password}, 
    // {
    //   headers: {"Content-Type": "application/json"},
    //   withCredentials: true       
    // })
    // .then(({data}) => {
    //   setAuth({ username, 
    //     accessToken: data.accessToken 
    //   }); 

    //   if (location.state?.from)
    //     return navigate(location.state.from)        
    //   else
    //     return navigate("/Home")
              
    // })
    // .catch((e) => {
    //   console.error(e)
    //   setErrMsg(e?.response?.data?.message ?? e.message)
    // })
  }

  return (
    <div className="flex h-screen bg-slate-600">
      <div className="float-right bg-slate-50 h-0">{ ToggleDarkMode() }</div>
      <div className="mx-auto my-40 bg-slate-100 rounded-lg drop-shadow-lg">
        <img className="h-10 mx-auto mb-3" src={logo} alt="logo" />        
        <form onSubmit={registerUser} className="justify-center justify-items-center">
            <table className="border-separate"><tbody><tr>
                <td>
                    <h2>Företagsuppgifter</h2>
                    <input type="text" placeholder='Företagsnamn..' value={companyName} className="text-base p-1 rounded-md border border-cyan-500" onChange={e => setCompanyName(e.target.value)} required autoFocus autoComplete="off"/>
                    <input type="text" placeholder='RegNo..' value={companyRegNo} className="text-base p-1 rounded-md border border-cyan-500" onChange={e => setCompanyRegNo(e.target.value)} required autoComplete="off"/> 
                    <input type="text" placeholder='VatNo..' value={companyVatNo} className="text-base p-1 rounded-md border border-cyan-500" onChange={e => setCompanyVatNo(e.target.value)} required autoComplete="off"/>
                    <input type="email" placeholder='Email för faktura..' value={invoiceEmail} className="text-base p-1 rounded-md border border-cyan-500" onChange={e => setInvoiceEmail(e.target.value)} required autoComplete="off"/>
                </td>
                <td className="align-top">
                    <h2>Kontaktuppgifter</h2>
                    <input type="text" placeholder='Kontaktperson..' value={contactName} className="text-base p-1 rounded-md border border-cyan-500" onChange={e => setContactName(e.target.value)} required autoComplete="off"/>
                    <input type="email" placeholder='Kontaktmail..' value={contactEmail} className="text-base p-1 rounded-md border border-cyan-500" onChange={e => setContactEmail(e.target.value)} required autoComplete="off"/>
                    <input type="phone" placeholder='kontakttelefon..' value={contactPhone} className="text-base p-1 rounded-md border border-cyan-500" onChange={e => setContactPhone(e.target.value)} autoComplete="off"/>
                </td>
            </tr></tbody></table>
          <button type="submit" className="bg-cyan-500 hover:bg-cyan-600 px-10 py-1 rounded-full text-white mt-3 flex">Registrera</button>  
        </form>
        <p className={errMsg ? "errmsg" : "offscreen"} style={{color: "red",fontWeight:"bold"}} aria-live="assertive">{errMsg}</p>
        <div>
          <Link to="/Login" className="text-blue-900 text-xs float-left absolute bottom-3 left-7">Login page</Link>
          <Link to="/ResetPassword" className="text-blue-900 text-xs float-right absolute bottom-3 right-7">Forgot password</Link>
        </div>
      </div>
    </div>
  )
}