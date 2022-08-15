import React, { useEffect, useState } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc  } from 'firebase/firestore'
import { appfire, db } from '../configFire'


export default function Inicio() {
  const [ usuario , setUsuario ] = useState(null)
  const [ nombre, setNombre ] = useState('')
  const [ edad, setEdad ] = useState('')
  const [error, setError] = useState(null)
  const [listaUsuarios, setListaUsuarios] = useState([])
  const [edicio, setEdicion] = useState(false)
  const [updateID, setUpdateID] = useState([])

  const AgregarALista = async (e) => {
    e.preventDefault()
    if(!nombre.trim() ){
      setError('Nombre vacio')
      console.log('Nombre vacio')
    }
    if(!edad.trim() ){
      setError('Edad vacio')
      console.log('Edad vacio')
    }
    if(!edad.trim() && !nombre.trim()){
      setError('Campos vacios')
    }
    try{
      const docRef = await addDoc(collection(db,'user'),{
        name:nombre,
        age:edad
      });
      console.log(docRef.id)
      LeerUsuario();
    }
    catch(e){
      console.log('Error inesperado: '+ e.code + ', Mensaje: ' + e.message)
    }
    setNombre('')
    setEdad('')
  }

  const LeerUsuario = async () => {
    const querySnapshot = await getDocs(collection(db, "user"));
    console.log(querySnapshot.docs)
    const nuevoArray = querySnapshot.docs.map( item => ({
      id:item.id, ...item.data()
    }))
    console.log(nuevoArray)
    setListaUsuarios(nuevoArray)
  }
 const Borrar = async (id) => {
  try{
    await deleteDoc(doc(db, "user", id));
    console.log('Borrado')
    LeerUsuario()
  }
  catch(e){
    console.log(e)
  }
 }
 const pulsarActualizar = (item) => {
  setNombre(item.name)
  setEdad(item.age)
  setEdicion(true)
  setUpdateID(item.id)
 }
const BotonActulizar = async (e) => {
  e.preventDefault()
  const update = doc(db,"user",updateID)
  try{
    await updateDoc(update, {
      name:nombre,
      age:edad
    })
  }
  catch(e){
    console.log(e)
  }
  console.log('Subiendo')
  setNombre('')
  setEdad('')
  setEdicion(false)
  LeerUsuario()
}

  useEffect( () => {
    const auth = getAuth(appfire)
    onAuthStateChanged(auth, (user) => {
      setUsuario(user)
      if (user != null) {
        console.log('Dentro')
      }else{console.log('Fuera')}
    })

    LeerUsuario()

  },[])

  return (
    <div className='conatiner'>
      <div className='row'>
        <div className='col'>
          {usuario ? <div>
            <h2>Formulario de Usuario</h2>
            <form className='form-group' onSubmit={(e)=>{AgregarALista(e)}}>
              <input 
                value={nombre}
                type="text"
                placeholder='Nombre'
                className='form-control'
                onChange={ (e) => setNombre(e.target.value) } 
              />
              <input 
                value={edad}
                type="number"
                placeholder='Edad'
                className='form-control mt-3'
                onChange={ (e) => setEdad(e.target.value)} 
              />
              {edicio 
                ?
                  <button
                    className='btn btn-dark btn-block mt-4'
                    onClick={(e) => {BotonActulizar(e)}}
                    >
                      Actualizar
                  </button>
                :
                  <input
                    type='submit'
                    className='btn btn-dark btn-block mt-4'
                    value='Registrar'
                  />
                  }
            </form>
            {error ? <p>{error}</p>: <span> </span>}
            </div> 
          :
           <span></span>}
            
        </div>
        <div className='mt-3'>
          <h2> Lista de usuarios </h2>
          <div>
            {
              listaUsuarios.length !== 0 
              ? 
                listaUsuarios.map( (item) => 
                  <div key={item.id}>
                    <h4>Nombre: {item.name}, Edad: {item.age}</h4>
                    {usuario 
                    ?
                    <div>
                      <button onClick={() => {Borrar(item.id)}}>Eliminar</button>
                      <button onClick={ () => {pulsarActualizar(item)}}>Editar</button>
                    </div>
                  :
                  <span></span> }
                  </div>)
              : 
                <span></span>
            }
          </div>
        </div>
      </div>
    </div>
  )
}
