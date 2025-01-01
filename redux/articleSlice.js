import { createSlice } from '@reduxjs/toolkit'

export const productSlice = createSlice({
  name: 'article',
  initialState: {
    categories: null,
    dualCategories: null,
    fetchDualAgain: false,
    fetchAgain: false
  },
  reducers: {
    setCategories: (state, action) => {
      state.categories = action.payload
    },
    setFetchAgain: (state, action) => {
      console.log("state" ,state.fetchAgain)
      state.fetchAgain = !state.fetchAgain
    },
    setDualCategories: (state, action) => {
      state.dualCategories = action.payload
    }
  }
})

export const { setCategories, setFetchAgain, setDualCategories } =
  productSlice.actions

export default productSlice.reducer
