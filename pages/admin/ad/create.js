import React, { useState } from 'react'
import styles from '../../../styles/Admin/ArticleCreate.module.css'
import Image from 'next/image'
import Upload from '@/components/Utility/Upload'
import UploadMany from '@/components/Utility/UploadMany'
import axios from 'axios'
import BASE_URL from '@/config'
import { useDispatch, useSelector } from 'react-redux'
import { finishLoading, startLoading } from '@/redux/stateSlice'
import { useRouter } from 'next/router'
import TextEditor from '@/components/Utility/TextEditor'
import { showSnackBar } from '@/redux/notistackSlice'
import SelectCategory from '@/components/Categories/SelectCategory'
import LangPicker from '@/components/Utility/LangPicker'
import t from '@/utility/dict'
import { add } from 'date-fns'

const Create = ({ ad: data }) => {
  const [ad, setAd] = useState(data)
  const [error, setError] = useState('')
  const [lang, setLang] = useState(['en'])
  const dispatch = useDispatch()
  const router = useRouter()
  const handleImages = files => {
    setAd(prev => ({ ...prev, images: files }))
  }
  const userInfo = useSelector(state => state.user.userInfo)
  const headers = { Authorization: 'Bearer ' + userInfo?.token }
  const [selected, setSelected] = useState(ad.categories?.map(i => i._id))
  const { locale } = router
  const categories = useSelector(state => state.article.dualCategories)

  const validate = ad => {
    if (
      !ad.title ||
      !ad.image ||
      !ad.targetUrl ||
      !ad.targetText ||
      !ad.startDate ||
      !ad.endDate ||
      !ad.adType
    ) {
      dispatch(
        showSnackBar({
          message: 'Fill All The Required Field ',
          option: {
            variant: 'error'
          }
        })
      )
      return false
    }
    if (ad.startDate >= ad.endDate) {
      dispatch(
        showSnackBar({
          message: 'End Date Must Be Greater That Start Date',
          option: {
            variant: 'error'
          }
        })
      )
      return false
    } else {
      return true
    }
  }

  const saveAd = async () => {
    if (!validate(ad)) {
      return
    }
    try {
      dispatch(startLoading())
      const { data } = await axios.post(
        '/api/ad',
        {
          ...ad,
          image: ad.image
        },
        { headers }
      )
      setAd({
        title: {},
        targetText: {},
        targetUrl: '',
        addType: '',
        startDate: new Date(
          new Date().getTime() - new Date().getTimezoneOffset() * 60000
        )
          .toISOString()
          .slice(0, 16),
        endDate: new Date(
          new Date().getTime() - new Date().getTimezoneOffset() * 320000
        )
          .toISOString()
          .slice(0, 16),

        image: {},
        description: {},
        isActive: true
      })

      // setSelected([])
      dispatch(finishLoading())
      dispatch(
        showSnackBar({
          message: 'New Ad Created',
          option: {
            variant: 'success'
          }
        })
      )
    } catch (error) {
      dispatch(finishLoading())
      dispatch(
        showSnackBar({
          message: 'Error While Creating Ad ! ',
          option: {
            variant: 'error'
          }
        })
      )
      setError('Error While Creating Ad ! ')
    }
  }

  const updateAd = async () => {
    if (!validate(ad)) {
      return
    }
    try {
      dispatch(startLoading())
      const { data } = await axios.put(
        `/api/ad/${router.query.id}`,
        {
          ...ad,
          image: ad.image
        },
        { headers }
      )

      dispatch(finishLoading())
      if (data.updatedAd) {
        setAd(data.updatedAd)
        dispatch(
          showSnackBar({
            message: data.message,
            option: {
              variant: 'success'
            }
          })
        )
      }
    } catch (error) {
      dispatch(finishLoading())
      dispatch(
        showSnackBar({
          message: 'Error Updating Ad !',
          option: {
            variant: 'error'
          }
        })
      )
      setError('Something Went Wrong !')
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.flex}>
        <h2>
          {router.query.id ? t('updateAd', locale) : t('createAd', locale)}
        </h2>
      </div>

      <form className={styles.forms}>
        {lang.find(i => i == 'en') && (
          <div className={styles.left}>
            <div className={styles.field}>
              <label>Title</label>
              <input
                type='text'
                placeholder='Enter Title'
                value={ad.title?.en}
                onChange={e =>
                  setAd(prev => ({
                    ...prev,
                    title: { en: e.target.value, bn: prev.title.bn }
                  }))
                }
              />
            </div>{' '}
            <div className={styles.flex}>
              <div className={styles.field}>
                <label>Taget Url</label>
                <input
                  type='text'
                  placeholder='Enter Taget Url'
                  value={ad.targetUrl}
                  onChange={e =>
                    setAd(prev => ({
                      ...prev,
                      targetUrl: e.target.value
                    }))
                  }
                />
              </div>{' '}
              <div className={styles.field}>
                <label>Taget Text</label>
                <input
                  type='text'
                  placeholder='Enter Taget Tex'
                  value={ad.targetText?.en}
                  onChange={e =>
                    setAd(prev => ({
                      ...prev,
                      targetText: {
                        en: e.target.value,
                        bn: prev.targetText?.bn
                      }
                    }))
                  }
                />
              </div>
            </div>
            <div className={styles.field}>
              <label>Thumbnail</label>
              <Upload
                handle={files => {
                  setAd(prev => ({
                    ...prev,
                    image: { en: files.url, bn: prev.image?.bn }
                  }))
                }}
              />
              <div className={styles.images}>
                {ad.image?.en ? (
                  <div className={styles.image__container}>
                    <Image src={ad.image?.en} alt='' width={180} height={180} />
                  </div>
                ) : (
                  <div
                    className={styles.image__container}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center'
                    }}
                  >
                    {t('noPhotoUploaded', 'en')}
                  </div>
                )}
              </div>
            </div>
            <div className={styles.field}>
              <label>{t('description', 'en')}</label>
              <textarea
                value={ad.description?.en}
                placeholder={t('writeDescription', 'en')}
                onChange={e =>
                  setAd(prev => ({
                    ...prev,
                    description: {
                      en: e.target.value,
                      bn: prev.description?.bn
                    }
                  }))
                }
              ></textarea>
            </div>
          </div>
        )}

        {lang.find(i => i == 'bn') && (
          <div className={`${styles.left} ${styles.right}`}>
            {' '}
            <div className={styles.field}>
              <label>{t('title', 'bn')}</label>
              <input
                type='text'
                placeholder={t('enterTitle', 'bn')}
                value={ad.title?.bn}
                onChange={e =>
                  setAd(prev => ({
                    ...prev,
                    title: {
                      en: prev.title.en,
                      bn: e.target.value
                    }
                  }))
                }
              />
            </div>
            <div className={styles.flex}>
              <div className={styles.field}>
                <label>{t('targetUrl', 'bn')}</label>
                <input
                  type='text'
                  placeholder={t('enterTargetUrl', 'bn')}
                  value={ad.targetUrl}
                  onChange={e =>
                    setAd(prev => ({
                      ...prev,
                      targetUrl: e.target.value
                    }))
                  }
                />
              </div>{' '}
              <div className={styles.field}>
                <label>{t('targetText', 'bn')}</label>
                <input
                  type='text'
                  placeholder={t('enterTargetText', 'bn')}
                  value={ad.targetText?.bn}
                  onChange={e =>
                    setAd(prev => ({
                      ...prev,
                      targetText: {
                        bn: e.target.value,
                        en: prev.targetText?.en
                      }
                    }))
                  }
                />
              </div>
            </div>
            <div className={styles.field}>
              <label>{t('thumbnail', 'bn')}</label>
              <Upload
                handle={files => {
                  setAd(prev => ({
                    ...prev,
                    image: { bn: files.url, en: prev.image?.en }
                  }))
                }}
              />
              <div className={styles.images}>
                {ad.image?.bn ? (
                  <div className={styles.image__container}>
                    <Image src={ad.image?.bn} alt='' width='180' height={180} />
                  </div>
                ) : (
                  <div
                    className={styles.image__container}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center'
                    }}
                  >
                    {t('noPhotoUploaded', 'bn')}
                  </div>
                )}
              </div>
            </div>
            <div className={styles.field}>
              <label>{t('description', 'bn')}</label>
              <textarea
                value={ad.description?.bn}
                placeholder={t('writeDescription', 'bn')}
                onChange={e =>
                  setAd(prev => ({
                    ...prev,
                    description: {
                      bn: e.target.value,
                      en: prev.description?.en
                    }
                  }))
                }
              ></textarea>
            </div>
          </div>
        )}
      </form>
      <div className={styles.top__flex}>
        <div className={styles.field}>
          <div className={styles.status}>
            {['banner', 'video', 'sidebar', 'popup'].map((i, index) => (
              <span
                className={`${ad.adType == i ? styles.currentLang : ''}`}
                onClick={() => setAd({ ...ad, adType: i })}
              >
                {t(i, locale)}
              </span>
            ))}
          </div>
        </div>
        <div className={styles.field}>
          <div className={styles.status}>
            <span
              className={`${ad.location == 'home' ? styles.currentLang : ''}`}
              onClick={() => setAd({ ...ad, location: 'home' })}
            >
              {t('home', locale)}
            </span>
            <span
              className={`${ad.location == 'news' ? styles.currentLang : ''}`}
              onClick={() => setAd({ ...ad, location: 'news' })}
            >
              {t('news', locale)}
            </span>
          </div>
        </div>
        <div className={styles.field}>
          <label>{t('from', locale)}</label>
          <input
            type='datetime-local'
            value={
              ad.startDate
                ? new Date(
                    new Date(ad.startDate).getTime() -
                      new Date().getTimezoneOffset() * 60000
                  )
                    .toISOString()
                    .slice(0, 16)
                : new Date(
                    new Date().getTime() -
                      new Date().getTimezoneOffset() * 60000
                  )
                    .toISOString()
                    .slice(0, 16)
            }
            onChange={e => setAd({ ...ad, startDate: e.target.value })}
          />
        </div>
        <div className={styles.field}>
          <label>{t('to', locale)}</label>
          <input
            type='datetime-local'
            value={
              ad.endDate
                ? new Date(
                    new Date(ad.endDate).getTime() -
                      new Date().getTimezoneOffset() * 60000
                  )
                    .toISOString()
                    .slice(0, 16)
                : new Date(
                    new Date().getTime() -
                      new Date().getTimezoneOffset() * 320000
                  )
                    .toISOString()
                    .slice(0, 16)
            }
            onChange={e => setAd({ ...ad, endDate: e.target.value })}
          />
        </div>

        <div className={styles.field}>
          <div className={styles.status}>
            <span
              className={`${ad.isActive ? styles.currentLang : ''}`}
              onClick={() => setAd({ ...ad, isActive: true })}
            >
              {t('active', locale)}
            </span>
            <span
              className={`${!ad.isActive ? styles.currentLang : ''}`}
              onClick={() => setAd({ ...ad, isActive: false })}
            >
              {t('inActive', locale)}
            </span>
          </div>
        </div>
        <button onClick={() => (router.query.id ? updateAd() : saveAd())}>
          {t('saveAd', locale)}
        </button>
      </div>
    </div>
  )
}

export default Create

export async function getServerSideProps ({ query }) {
  const { id } = query

  const fetchAd = async () => {
    const { data } = await axios.get(`${BASE_URL}/api/ad/${id}`)
    return data
  }

  // const fetchCategory = async () => {
  //   const { data } = await axios.get(`${BASE_URL}/api/category`)
  //   return data
  // }

  const fetchTags = async () => {
    const { data } = await axios.get(`${BASE_URL}/api/tag`)
    return data
  }

  // const { categories } = await fetchCategory()

  if (id) {
    const ad = await fetchAd()

    return {
      props: {
        ad
        // categories,
      }
    }
  }

  return {
    props: {
      ad: {
        title: '',
        targetText: {},
        targetUrl: '',
        image: {},
        description: {},
        isActive: true,
        location: 'home'
      }
      // categories,
    }
  }
}
