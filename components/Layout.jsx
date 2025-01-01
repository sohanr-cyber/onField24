import React, { useEffect, useState } from 'react'
import Footer from './Footer'
import BottomFooter from './BottomFooter'
import { useDispatch, useSelector } from 'react-redux'
import { containsAdmin } from '@/utility/helper'
import { Router, useRouter } from 'next/router'
import AdminNavbar from './Admin/Navbar'
import Loading from './Utility/Loading'
import { useSnackbar } from 'notistack'
import { setCategories, setDualCategories } from '@/redux/articleSlice'
import axios from 'axios'
import { setPixel } from '@/redux/pixelSlice'
import { PIXEL_ID } from '@/config'
import ChatButton from './Chat/ChatButton'
import styles from '@/styles/Layout.module.css'
import Navbar from './Navs/Navbar'

const Layout = ({ children }) => {
  const loading = useSelector(state => state.state.loading)
  const router = useRouter()
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const notistack = useSelector(state => state.notistack.notistack)
  const fetchAgain = useSelector(state => state.article.fetchAgain)
  const fetchDualAgain = useSelector(state => state.article.fetchDualAgain)

  const dispatch = useDispatch()

  const fetchCategory = async () => {
    try {
      const { data } = await axios.get(
        `/api/category/view?lang=${router.locale}`
      )
      dispatch(setCategories(data))
    } catch (error) {
      console.log(error)
    }
  }

  const retrieveCategories = async () => {
    try {
      const { data } = await axios.get('/api/category/retrieve')
      dispatch(setDualCategories(data))
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchCategory()
  }, [router.locale, fetchAgain])

  useEffect(() => {
    containsAdmin(router.asPath) && retrieveCategories()
  }, [fetchAgain, router.asPath])

  React.useEffect(() => {
    import('react-facebook-pixel')
      .then(x => x.default)
      .then(ReactPixel => {
        const options = {
          autoConfig: false, // set pixel's autoConfig. More info: https://developers.facebook.com/docs/facebook-pixel/advanced/
          debug: false // enable logs
        }
        console.log({ PIXEL_ID })
        ReactPixel.init(PIXEL_ID, {}, options)
        dispatch(setPixel(ReactPixel))
        ReactPixel.pageView()

        router.events.on('routeChangeComplete', () => {
          ReactPixel.pageView()
        })
      })
  }, [router.events])

  useEffect(() => {
    if (notistack) {
      enqueueSnackbar(notistack.message, notistack.option || 'default')
    }
  }, [notistack])
  return (
    <div>
      {loading && <Loading />}
      {!containsAdmin(router.asPath) ? (
        <>
          <Navbar />
        </>
      ) : (
        <AdminNavbar />
      )}
      <div className={styles.body__wrapper}>{children}</div>
      <Footer />
      <BottomFooter />
      {!containsAdmin(router.asPath) && <ChatButton />}
      {loading && <Loading />}
    </div>
  )
}

export default Layout
