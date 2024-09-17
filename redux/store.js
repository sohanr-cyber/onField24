import { configureStore } from '@reduxjs/toolkit'
import user from './userSlice'
import state from './stateSlice'
import cart from './cartSlice'
import address from './addressSlice'
import article from './articleSlice'
import notistack from './notistackSlice'
import pixel from './pixelSlice'
export const store = configureStore({
  reducer: {
    user,
    state,
    cart,
    address,
    article,
    notistack,
    pixel
  }
})
