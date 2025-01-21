import React, { useState } from 'react'
import { RegisterAPI } from '../API/RegisterAPI'

function Register() {

    const[email, setEmail] = useState("");
    const[password, setPassword] = useState("");

  return (
    <>
      <form onSubmit={(e) => RegisterAPI(e, email, password)}>
        <input type="email" value={email} onChange={({target}) => setEmail(target.value)}/>
        <input type="password" value={password} onChange={({target}) => setPassword(target.value)}/>
        <button type='submit' >
          créer un compte
        </button>
      </form>
    </>
  )
}

export default Register