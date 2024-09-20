import { createSlice } from '@reduxjs/toolkit'
import Cookies from 'js-cookie'

export const pixelSlice = createSlice({
  name: 'newsState',
  initialState: {
    pixel: null
  },

  reducers: {
    setPixel: (state, action) => {
      state.pixel = action.payload
    },
    handleViewArticle: (state, action) => {
      const article = action.payload
      const pixel = state.pixel
      pixel.track('ViewContent', {
        content_name: article.title,
        content_ids: [article._id],
        content_type: 'article',
        // author: article.author,
        content_category: 'article'
      })
    },

    handleSearch: (state, action) => {
      const searchTerm = action.payload
      const pixel = state.pixel
      pixel.track('Search', {
        search_string: searchTerm,
        content_category: 'article'
      })
    },

    handleSubscription: (state, action) => {
      const subscription = action.payload
      const pixel = state.pixel
      pixel.track('Subscribe', {
        subscription_type: subscription.type,
        value: subscription.price,
        currency: 'BDT'
      })
    },

    // custom event
    handleShare: (state, action) => {
      const { article, platform } = action.payload
      const pixel = state.pixel
      pixel.track('Share', {
        content_name: article.title,
        content_ids: [article._id],
        content_type: 'article',
        platform: platform
      })
    },

    handleContact: (state, action) => {
      const contactDetails = action.payload
      const pixel = state.pixel
      pixel.track('Contact', {
        contact_method: contactDetails.method,
        message: contactDetails.message
      })
    }
  }
})

// Action creators are generated for each case reducer function

export const {
  setPixel,
  handleViewArticle,
  handleSearch,
  handleSubscription,
  handleShare,
  handleContact
} = pixelSlice.actions

export default pixelSlice.reducer
