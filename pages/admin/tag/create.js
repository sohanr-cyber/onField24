import React, { useEffect, useState } from 'react'
import styles from '../../../styles/Admin/ArticleCreate.module.css'
import Upload from '@/components/Utility/Upload'
import axios from 'axios'
import BASE_URL from '@/config'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import Image from 'next/image'
import { finishLoading, startLoading } from '@/redux/stateSlice'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import { showSnackBar } from '@/redux/notistackSlice'
import { buttonC, themeBg } from '@/utility/const'
import { setFetchAgain } from '@/redux/articleSlice'
import t from '@/utility/dict'
// Order Craetion Form
const Create = ({ tag: data }) => {
  const [tag, setTag] = useState(data)
  const [error, setError] = useState('')
  const dispatch = useDispatch()
  const router = useRouter()
  const [newTag, setNewTag] = useState(false)
  const categories = useSelector(state => state.article.categories)
  const [lang, setLang] = useState(['en'])
  const locale = router.locale

  useEffect(() => {
    setTag(data)
  }, [router.query])
  const userInfo = useSelector(state => state.user.userInfo)
  const headers = { Authorization: `Bearer ${userInfo?.token}` }

  const saveTag = async () => {
    if (!tag) {
      dispatch(
        showSnackBar({
          message: 'Please fill all the necessaary field',
          option: {
            variant: 'error'
          }
        })
      )
      return
    }
    try {
      dispatch(startLoading())
      const { data } = await axios.post(
        '/api/tag',
        {
          ...tag
        },
        {
          headers
        }
      )
      if (data.error) {
        dispatch(
          showSnackBar({
            message: data.error,
            option: {
              variant: 'error'
            }
          })
        )
        dispatch(finishLoading())
        return
      }
      dispatch(setFetchAgain())
      setTag({
        name: ''
      })
      dispatch(finishLoading())
      dispatch(
        showSnackBar({
          message: 'New Tag Created ',
          option: {
            variant: 'success'
          }
        })
      )
    } catch (error) {
      dispatch(finishLoading())
      dispatch(
        showSnackBar({
          message: 'Error While Creating Tag !',
          option: {
            variant: 'error'
          }
        })
      )
    }
  }

  console.log({ categories })
  const updateTag = async () => {
    if (!tag) {
      setError('Pleas fill all the necessaary field')
      dispatch(
        showSnackBar({
          message: 'Please fill all the necessaary field',
          option: {
            variant: 'error'
          }
        })
      )
      return
    }
    try {
      dispatch(startLoading())
      const { data } = await axios.put(
        `/api/tag/${router.query.id}`,
        {
          ...tag
        },
        { headers }
      )
      // setTag(data)
      dispatch(setFetchAgain())
      dispatch(finishLoading())
      dispatch(
        showSnackBar({
          message: 'Tag Updated',
          option: {
            variant: 'default'
          }
        })
      )
    } catch (error) {
      dispatch(finishLoading())
      dispatch(
        showSnackBar({
          message: 'Error While Updating Tag !',
          option: {
            variant: 'error'
          }
        })
      )
      setError('Error While Updating Tag !')
    }
  }
  return (
    <div className={styles.wrapper}>
      <div className={styles.flex}>
        <h2>
          {router.query.id ? t('updateTag', locale) : t('createTag', locale)}{' '}
        </h2>
        <div
          className={styles.status}
          onDoubleClick={() => setLang(['en', 'bn'])}
        >
          <span
            onClick={() => setLang(['en'])}
            className={`${lang.find(i => i == 'en') ? styles.currentLang : ''}`}
          >
            EN
          </span>
          <span
            onClick={() => setLang(['bn'])}
            className={`${lang.find(i => i == 'bn') ? styles.currentLang : ''}`}
          >
            বাংলা
          </span>
        </div>
      </div>
      <form className={styles.forms}>
        {lang.find(i => i == 'en') && (
          <div className={styles.left}>
            <div className={styles.field}>
              <label>{t('tagName', lang)}</label>
              <input
                type='text'
                placeholder={t('enterTagName', lang)}
                value={tag.name?.en}
                onChange={e =>
                  setTag({
                    ...tag,
                    name: { en: e.target.value, bn: tag.name?.bn }
                  })
                }
              />
            </div>
          </div>
        )}

        {lang.find(i => i == 'bn') && (
          <div className={styles.left}>
            <div className={styles.field}>
              <label>{t('tagName', 'bn')}</label>
              <input
                type='text'
                placeholder={t('enterTagName', 'bn')}
                value={tag.name.bn}
                onChange={e =>
                  setTag({
                    ...tag,
                    name: {
                      en: tag.name.en,
                      bn: e.target.value
                    }
                  })
                }
              />
            </div>
          </div>
        )}
      </form>
      {error && <p style={{ color: 'red', margin: '10px' }}>{error}</p>}
      <button onClick={() => (router.query.id ? updateTag() : saveTag())}>
        {t('saveTag', locale)}
      </button>
    </div>
  )
}

export default Create

export async function getServerSideProps ({ query }) {
  const { id } = query

  const fetchTag = async () => {
    const { data } = await axios.get(`${BASE_URL}/api/tag/${id}`)
    return data
  }

  const fetchCategories = async () => {
    const { data } = await axios.get(`${BASE_URL}/api/tag`)
    return data.categories
  }

  // const categories = await fetchCategories()

  if (id) {
    const tag = await fetchTag()
    return {
      props: {
        tag
        // categories
      }
    }
  }

  return {
    props: {
      tag: {
        name: {}
      }
      // categories: categories
    }
  }
}
