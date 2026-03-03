import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: [{ password: 'hello', name: 'test'}],
}

const passwordsSlice = createSlice({
    name: 'passwords',
    initialState,
    reducers:{
        addPassword: (state, action) => {
            state.value.push(action.payload)

        }
    }
})

export const { addPassword} = passwordsSlice.actions
export default passwordsSlice.reducer