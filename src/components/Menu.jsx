import React, { useEffect, useState } from 'react'
import {Link, useNavigate } from 'react-router-dom'
import { appfire } from '../configFire'
import { getAuth,onAuthStateChanged, signOut } from 'firebase/auth'

export default function Menu() {
    const [usuario, setUsuario] = useState(null)
    const historial = useNavigate()
    useEffect( () => {
        const auth = getAuth(appfire);
        onAuthStateChanged(auth, (user) => {
            setUsuario(user.email)
        })
    },[])
    const CerrarSesion = () =>{
        const auth = getAuth(appfire);
        signOut(auth)
            .then( () => {
                setUsuario(null)
                historial('/Login')
            })
            .catch( (error) => {
                console.log(error.code)
            })
    }
  return (
    <div>
        <nav className='navbar navbar-expand-lg navbar-dark bg-dark'>
            <ul className='navbar-nav mr-auto'>
                <li className='nav-item'>
                    <Link to='/' className='nav-link'>Inicio</Link>
                </li>
                
                <li>
                    {usuario ? <span></span> : <Link to='/Admin' className='nav-link'>Admin</Link> }
                    {/* <Link to='/Admin' className='nav-link'>Admin</Link> */}
                </li>
                
                <li>
                    {usuario ? <span></span> : <Link to='/Login' className='nav-link'>Login</Link>}
                    {/* <Link to='/Login' className='nav-link'>Login</Link> */}
                </li>
                
            </ul>
            { usuario ? <button onClick={CerrarSesion} className='btn btn-danger '>Cerrar Sesion</button> : <span></span>}
        </nav>
    </div>
  )
}
