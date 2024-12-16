import { configureStore } from '@reduxjs/toolkit'
import {authReducer} from '../Slices/AuthenticateSlice'
import { alertReducer } from '../Slices/AlertSlice'
export const store = configureStore({
  reducer: {
    auth:authReducer,
    alert:alertReducer
  },
})
