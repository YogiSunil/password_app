import { configureStore } from '@reduxjs/toolkit'
import passwordsReducer from '../features/passwords/passwordsSlice'

export const store = configureStore({
    reducer: {
        passwords: passwordsReducer,
    },
})