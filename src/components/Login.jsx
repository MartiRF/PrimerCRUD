import React, { useState } from 'react'
import { useNavigate} from 'react-router-dom'
// Importaciones de FireBase
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword  } from "firebase/auth";
import { appfire } from '../configFire';


export default function Login() {
  const [email, setEmail ] = useState('')
  const [password, setPassword] = useState('')
  const [mgsError, setMgsError] = useState('')

  const historial = useNavigate();
  const auth = getAuth(appfire);

  const RegistrarUsuario = (e) => {
    e.preventDefault()

    createUserWithEmailAndPassword(auth, email, password)
      .then((useCredentials) => { 
        historial('/')
      })
      .catch( (error) => {
        const errorCode = error.code;
        const errorMensaje = error.message;
        console.log(`Error Codigo: ${errorCode}`)
        console.log(`Mensaje: ${errorMensaje}`)
        // auth/weak-password
        if (errorCode === 'auth/weak-password') {
          setMgsError('Contraseña demasiado corta minimo 6 caracteres')
        }
        if (errorCode === 'auth/invalid-email') {
          setMgsError('Campos vacios')
        }
        if (errorCode === 'auth/internal-error') {
          setMgsError('Contraseña vacia')
        }
        if(errorCode === 'auth/email-already-in-use'){
          setMgsError('Email ya registrado')
        }
      })

    // Singed In
    
    console.log(email,password)
  }

  const Login = () => {
    signInWithEmailAndPassword(auth,email, password)
    .then( (userCredential) => {
      console.log(userCredential)
      console.log('<Logeado>')
      historial('/')
    })
    .catch( (error) => { 
      console.log('Codigo de error:'+ error.code + ', Mensaje: ' + error.message) 
      if (error.code === 'auth/wrong-password'){
        setMgsError('Error en la contraseña')
      }
      if(error.code ==='auth/invalid-email'){
        setMgsError('Error campos vacios')
      }
      if (error.code === 'auth/internal-error'){
        setMgsError('Error en la contraseña')
      }
    })
  }
  return (
    <div className='row mt-5'>
      <div className='col'></div>
      <div className='col'>
        <form className='form-group' onSubmit={(e) => RegistrarUsuario(e)}>
          <input
            onChange={(e) => { setEmail(e.target.value) }}
            type="email" 
            placeholder='Intruduce el email'
            className='form-control'
          />
          <input 
            onChange={(e) => { setPassword(e.target.value) }}
            type="password" 
            placeholder='Clave'
            className='form-control mt-4'
          />
          <input 
            type="submit"
            className='btn btn-dark btn-block mt-4'
            value="Registrar"
            // onClick={RegistrarUsuario}
          />
        </form>
        <button
          className='btn btn-success btn-block'
          onClick={Login}
        >Iniciar Seccion</button>
        {mgsError ? <p> { mgsError} </p> : <p></p>}
      </div>
      <div className='col'></div>
    </div>
  )
}