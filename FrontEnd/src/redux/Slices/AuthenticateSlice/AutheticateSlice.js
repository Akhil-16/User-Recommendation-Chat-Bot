import { createSlice } from '@reduxjs/toolkit'

const AuthenticateState = {
  loginVerification: document.cookie.includes("isLoggedin"),
}

export const AuthenticateSlice =createSlice({
    name:"Authenticate",
    initialState:AuthenticateState,
    reducers:{
        setIsUserLoggedIn:(state,action)=>{
            state.loginVerification=action.payload
        }
    }
})

export const { setIsUserLoggedIn }=AuthenticateSlice.actions
export const authReducer =AuthenticateSlice.reducer