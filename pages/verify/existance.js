import React, { useState } from 'react'
import styles from '../../styles/Login.module.css'
import Logo from '@/components/Utility/Logo'
import Link from 'next/link'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '@/redux/userSlice'
import { showSnackBar } from '@/redux/notistackSlice'
import { NextSeo } from 'next-seo'
import { loginSeoData } from '@/utility/const'
import { finishLoading, startLoading } from '@/redux/stateSlice'
import t from '@/utility/dict'

const Login = () => {
  const [email, setEmail] = useState('')
  const userInfo = useSelector(state => state.user.userInfo)
  const router = useRouter()
  const dispatch = useDispatch()
  const lang = router.locale

  const SendCode = async () => {
    if (!email) {
      return
    }

    dispatch(startLoading())
    try {
      const { data } = await axios.post('/api/user/verify/existance', {
        email
      })

      if (data.error) {
        dispatch(
          showSnackBar({
            message: data.error,
            option: {
              variant: 'error'
            }
          })
        )
      }

      if (data && !data.error) {
        console.log(data)
        dispatch(
          showSnackBar({
            message: 'A Code has been Sent To Your Mail'
          })
        )
        router.push('/verify/reset')
      }
      dispatch(finishLoading())
    } catch (error) {
      dispatch(finishLoading())
      console.log(error)
    }
  }

  return (
    <>
      <NextSeo {...loginSeoData} />
      <div className={styles.wrapper}>
        <div className={styles.form__container}>
          <div className={styles.logo}>
            <Logo />
          </div>
          <h2>{t('resetH', lang)}</h2>
          <form>
            <input
              type='email'
              placeholder={t('enterEmail', lang)}
              value={email}
              onChange={e => setEmail(e.target.value)}
            />

            <div className={styles.btn} onClick={() => SendCode()}>
              {t('submit', lang)}
            </div>
          </form>
          <p className={styles.route}>
            {t('noAccount', lang)}
            <Link href='/register'>
              &nbsp;
              {t('createAccount', lang)}
            </Link>
          </p>
        </div>
      </div>
    </>
  )
}

export default Login
