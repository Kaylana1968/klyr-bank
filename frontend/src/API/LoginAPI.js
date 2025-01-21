import React from 'react'

export function LoginAPI(email, password) {
    fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body : JSON.stringify({email, password})
    })
        .then(res => res.json())
        .then(res => console.log(res));
}
