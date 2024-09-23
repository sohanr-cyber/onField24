import React, { useState } from 'react'
import styles from '../styles/Login.module.css'
import Logo from '@/components/Utility/Logo'
import Link from 'next/link'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import { login } from '@/redux/userSlice'
import { showSnackBar } from '@/redux/notistackSlice'
import { NextSeo } from 'next-seo'
import { loginSeoData } from '@/utility/const'
import { finishLoading, startLoading } from '@/redux/stateSlice'
import t from '@/utility/dict'

const Login = () => {
  const [user, setUser] = useState({})
  const router = useRouter()
  const dispatch = useDispatch()
  const lang = router.locale

  const signup = async () => {
    if (!user.password || !user.email) {
      dispatch(
        showSnackBar({
          message: 'Fill All The Field',
          option: {
            variant: 'error'
          }
        })
      )
      return
    }

    try {
      dispatch(startLoading())

      const { data } = await axios.post('/api/user/login', {
        ...user
      })
      if (!data.error) {
        dispatch(login(data))
        dispatch(
          showSnackBar({
            message: 'Succesfully Logged In '
          })
        )
        console.log({ data })
        if (data.role == 'admin') {
          router.push('/admin')
        } else {
          router.push(`/user/${data.id}?current=settings`)
        }
      }

      if (data.error) {
        dispatch(login(data))
        dispatch(
          showSnackBar({
            message: data.error,
            option: {
              variant: 'error'
            }
          })
        )
      }

      dispatch(finishLoading())
    } catch (error) {
      dispatch(finishLoading())

      dispatch(
        showSnackBar({
          messaage: 'Something Went Wrong !',
          option: {
            variant: 'error'
          }
        })
      )

      console.log(error)
    }
  }

  return (
    <>
      <NextSeo {...loginSeoData} />
      <div className={styles.wrapper}>
        <div className={styles.form__container}>
          {' '}
          <div className={styles.logo}>
            <Logo />
          </div>
          <h2>{t('loginH', lang)}</h2>
          <p>{t('loginP', lang)}</p>
          <form>
            <input
              type='email'
              placeholder={t('enterEmail', lang)}
              value={user.email}
              onChange={e => setUser({ ...user, email: e.target.value })}
            />
            <input
              type='password'
              placeholder={t('enterPassword', lang)}
              onChange={e => setUser({ ...user, password: e.target.value })}
            />
            <div className={styles.btn} onClick={() => signup()}>
              {t('signIn', lang)}
            </div>
          </form>
          <p className={styles.route}>
            {t('noAccount', lang)}

            <Link href='/register'>&nbsp; {t('createAccount', lang)}</Link>
          </p>
          <p className={styles.route}>
            {t('forgetPassword', lang)}

            <Link href='/verify/existance'>
              &nbsp;
              {t('resetPassword', lang)}{' '}
            </Link>
          </p>
        </div>
      </div>
    </>
  )
}

export default Login
