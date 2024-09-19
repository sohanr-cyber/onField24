import React, { useState } from 'react'
import styles from '../styles/Login.module.css'
import Logo from '@/components/Utility/Logo'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import { login } from '@/redux/userSlice'
import axios from 'axios'
import { showSnackBar } from '@/redux/notistackSlice'
import { NextSeo } from 'next-seo'
import { registerSeoData } from '@/utility/const'
import { finishLoading, startLoading } from '@/redux/stateSlice'
import t from '@/utility/dict'

const Register = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const [user, setUser] = useState({})
  const lang = router.locale
  const createAccount = async () => {
    if (
      !user.email ||
      !user.password ||
      !user.firstName ||
      !user.lastName ||
      !user.phone
    ) {
      dispatch(
        showSnackBar({
          message: 'FIll All The Field',
          option: {
            variant: 'error'
          }
        })
      )
      return
    }
    try {
      dispatch(startLoading())

      const { data } = await axios.post('/api/user', {
        ...user
      })

      if (!data.error) {
        dispatch(login(data))
        router.push('/verify')
        dispatch(
          showSnackBar({
            message: 'Account Created',
            option: {
              variant: 'success'
            }
          })
        )
      }

      dispatch(finishLoading())
    } catch (error) {
      console.log(error)
      dispatch(finishLoading())
      dispatch(
        showSnackBar({
          message: 'Error While Creating Account !',
          option: {
            variant: 'error'
          }
        })
      )
    }
  }
  return (
    <>
      {' '}
      <NextSeo {...registerSeoData} />
      <div className={styles.wrapper}>
        <div className={styles.form__container}>
          {' '}
          <div className={styles.logo}>
            <Logo />
          </div>
          <h2>{t('registerH', lang)}</h2>
          <form>
            <input
              type='text'
              placeholder={t('enterFName', lang)}
              value={user?.firstName}
              onChange={e => setUser({ ...user, firstName: e.target.value })}
            />
            <input
              type='text'
              placeholder={t('enterLName', lang)}
              value={user.lastName}
              onChange={e => setUser({ ...user, lastName: e.target.value })}
            />

            <input
              type='text'
              placeholder={t('enterPhone', lang)}
              value={user.phone}
              onChange={e => setUser({ ...user, phone: e.target.value })}
            />

            <input
              type='email'
              placeholder={t('enterEmail', lang)}
              value={user.email}
              onChange={e => setUser({ ...user, email: e.target.value })}
            />
            <input
              type='password'
              placeholder={t('enterPassword', lang)}
              value={user.password}
              onChange={e => setUser({ ...user, password: e.target.value })}
            />
            <div className={styles.btn} onClick={() => createAccount()}>
              {t('createAccount', lang)}
            </div>
          </form>
          <p className={styles.route}>
            {t('haveAccount', lang)}
            <Link href='/login'>&nbsp; {t('signInHere', lang)}</Link>
          </p>
        </div>
      </div>
    </>
  )
}

export default Register
