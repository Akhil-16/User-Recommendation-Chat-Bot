import { createSlice } from '@reduxjs/toolkit'

const AlertSliceState = {
  message: '',
  openSnackbar:false,

}

export const AlertSlice =createSlice({
    name:"Alert",
    initialState:AlertSliceState,
    reducers:{
        setSnackbarMessage:(state,action)=>{
            state.message=action.payload
        },
        setSnackBarState:(state,action)=>{
            state.openSnackbar=action.payload
        }
    }
})

export const { setSnackbarMessage,setSnackBarState }=AlertSlice.actions
export const alertReducer =AlertSlice.reducer