import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: [{ id: 1, password: 'hello', name: 'test' }],
}

const passwordsSlice = createSlice({
  name: 'passwords',
  initialState,
  reducers: {
    addPassword: (state, action) => {
      state.value.push(action.payload)
    },
    deletePassword: (state, action) => {
      state.value = state.value.filter((item) => item.id !== action.payload)
    },
    updatePassword: (state, action) => {
      const { id, name, password } = action.payload
      const existing = state.value.find((item) => item.id === id)

      if (existing) {
        existing.name = name
        existing.password = password
      }
    },
  },
})

export const { addPassword, deletePassword, updatePassword } = passwordsSlice.actions
export default passwordsSlice.reducer
