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

const Create = ({ article: data, tags }) => {
  const [images, setImages] = useState([])
  const [article, setArticle] = useState(data)
  const [error, setError] = useState('')
  const [descriptionEn, setDescriptionEn] = useState(article.content?.en)
  const [descriptionBn, setDescriptionBn] = useState(article.content?.bn)
  const [lang, setLang] = useState(['en'])
  const dispatch = useDispatch()
  const router = useRouter()
  const handleImages = files => {
    setArticle(prev => ({ ...prev, images: files }))
  }
  const userInfo = useSelector(state => state.user.userInfo)
  const headers = { Authorization: 'Bearer ' + userInfo?.token }
  const [selected, setSelected] = useState(article.categories?.map(i => i._id))
  const { locale } = router
  const categories = useSelector(state => state.article.dualCategories)

  const saveArticle = async () => {
    setError('')
    if (!article.title || !article.content) {
      setError('Pleas fill all the necessaary field')
      return
    }
    try {
      dispatch(startLoading())
      const { data } = await axios.post(
        '/api/article',
        {
          ...article,
          content: {
            en: descriptionEn,
            bn: descriptionBn
          },
          categories: selected
        },
        { headers }
      )
      setArticle({
        title: '',
        content: {},
        publishedAt: new Date(
          new Date().getTime() - new Date().getTimezoneOffset() * 60000
        )
          .toISOString()
          .slice(0, 16),

        categories: [],
        tags: [],

        thumbnail: {},
        metaTitle: {},
        excerpt: {},
        status: 'draft'
      })

      // setSelected([])
      dispatch(finishLoading())
      dispatch(
        showSnackBar({
          message: 'New Article Created',
          option: {
            variant: 'success'
          }
        })
      )
    } catch (error) {
      dispatch(finishLoading())
      dispatch(
        showSnackBar({
          message: 'Error While Creating Article ! ',
          option: {
            variant: 'error'
          }
        })
      )
      setError('Error While Creating Article ! ')
    }
  }

  const updateArticle = async () => {
    if (
      !article.title ||
      !article.content

      // !article.stockQuantity
    ) {
      dispatch(
        showSnackBar({
          message: 'Please Fill All The Field !',
          option: {
            variant: 'info'
          }
        })
      )

      return
    }
    try {
      dispatch(startLoading())
      const { data } = await axios.put(
        `/api/article/id/${router.query.id}`,
        {
          ...article,
          categories: selected,
          content: {
            en: descriptionEn,
            bn: descriptionBn
          }
        },
        { headers }
      )
      setArticle(data)
      dispatch(finishLoading())
      dispatch(
        showSnackBar({
          message: 'Article Updated !',
          option: {
            variant: 'success'
          }
        })
      )
    } catch (error) {
      dispatch(finishLoading())
      dispatch(
        showSnackBar({
          message: 'Error Updating Article !',
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
          {router.query.id
            ? t('updateArticle', locale)
            : t('createArticle', locale)}
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
              <label>Title</label>
              <input
                type='text'
                placeholder='Enter Title'
                value={article.title?.en}
                onChange={e =>
                  setArticle(prev => ({
                    ...prev,
                    title: { en: e.target.value, bn: prev.title.bn }
                  }))
                }
              />
            </div>{' '}
            <div className={styles.field}>
              <label>Thumbnail</label>
              <Upload
                handle={files => {
                  setArticle(prev => ({
                    ...prev,
                    thumbnail: { en: files.url, bn: prev.thumbnail?.bn }
                  }))
                }}
              />
              <div className={styles.images}>
                {article.thumbnail?.en ? (
                  <div className={styles.image__container}>
                    <Image
                      src={article.thumbnail?.en}
                      alt=''
                      width={180}
                      height={180}
                    />
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
                    No Photo Uploaded
                  </div>
                )}
              </div>
            </div>
            <div className={styles.flex}>
              <div className={styles.field}>
                <label>Tag </label>
                <div className={styles.options}>
                  {' '}
                  {tags?.map(i => (
                    <span
                      className={styles.option}
                      onClick={() =>
                        setArticle({
                          ...article,
                          tags: article?.tags?.find(t => t == i._id)
                            ? article.tags.filter(t => t != i._id)
                            : [...article?.tags, i._id]
                        })
                      }
                      style={
                        article.tags?.find(t => t == i._id)
                          ? { background: 'black', color: 'white' }
                          : {}
                      }
                    >
                      {i.name['en']}
                    </span>
                  ))}
                </div>
              </div>
              <div className={styles.field}>
                <label>Category</label>
                <div className={styles.options}>
                  <SelectCategory
                    currentCategories={article.categories}
                    selected={selected}
                    setSelected={setSelected}
                  />
                </div>
              </div>
            </div>
            <div className={styles.field}>
              <label>Description</label>
              <TextEditor
                setDescriptionEn={setDescriptionEn}
                description={descriptionEn}
                lang='en'
              />
            </div>
            <div className={styles.field}>
              <label>Excerpt</label>
              <textarea
                value={article.excerpt?.en}
                placeholder='Write Excerpt ... '
                onChange={e =>
                  setArticle(prev => ({
                    ...prev,
                    excerpt: {
                      en: e.target.value,
                      bn: prev.excerpt?.bn
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
                value={article.title?.bn}
                onChange={e =>
                  setArticle(prev => ({
                    ...prev,
                    title: {
                      en: prev.title.en,
                      bn: e.target.value
                    }
                  }))
                }
              />
            </div>
            <div className={styles.field}>
              <label>{t('thumbnail', 'bn')}</label>
              <Upload
                handle={files => {
                  setArticle(prev => ({
                    ...prev,
                    thumbnail: { bn: files.url, en: prev.thumbnail?.en }
                  }))
                }}
              />
              <div className={styles.images}>
                {article.thumbnail?.bn ? (
                  <div className={styles.image__container}>
                    <Image
                      src={article.thumbnail?.bn}
                      alt=''
                      width='180'
                      height={180}
                    />
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
            <div className={styles.flex}>
              <div className={styles.field}>
                <label>{t('tag', 'bn')} </label>
                <div className={styles.options}>
                  {' '}
                  {tags?.map(i => (
                    <span
                      className={styles.option}
                      onClick={() =>
                        setArticle({
                          ...article,
                          tags: article?.tags?.find(t => t == i._id)
                            ? article.tags.filter(t => t != i._id)
                            : [...article?.tags, i._id]
                        })
                      }
                      style={
                        article.tags?.find(t => t == i._id)
                          ? { background: 'black', color: 'white' }
                          : {}
                      }
                    >
                      {i.name['bn']}
                    </span>
                  ))}
                </div>
              </div>
              <div className={styles.field}>
                <label>{t('category', 'bn')}</label>
                <div className={styles.options}>
                  <SelectCategory
                    currentCategories={article.categories}
                    selected={selected}
                    setSelected={setSelected}
                    lang={'bn'}
                  />
                </div>
              </div>
            </div>
            <div className={styles.field}>
              <label>{t('description', 'bn')}</label>

              <TextEditor
                setDescriptionBn={setDescriptionBn}
                description={descriptionBn}
                lang='bn'
              />
            </div>
            <div className={styles.field}>
              <label>{t('excerpt', 'bn')}</label>
              <textarea
                value={article.excerpt?.bn}
                placeholder={t('enterExcerpt', 'bn')}
                onChange={e =>
                  setArticle(prev => ({
                    ...prev,
                    excerpt: {
                      bn: e.target.value,
                      en: prev.excerpt?.en
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
            <span
              className={`${article.isFeatured ? styles.currentLang : ''}`}
              onClick={() => setArticle({ ...article, isFeatured: true })}
            >
              {t('Featured', locale)}
            </span>
            <span
              className={`${!article.isFeatured ? styles.currentLang : ''}`}
              onClick={() => setArticle({ ...article, isFeatured: false })}
            >
              {t('NOT', locale)}
            </span>
          </div>
        </div>
        <div className={styles.field}>
          <label>{t('publishedAt', locale)}</label>
          <input
            type='datetime-local'
            value={
              article.publishedAt
                ? new Date(
                    new Date(article.publishedAt).getTime() -
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
            onChange={e =>
              setArticle({ ...article, publishedAt: e.target.value })
            }
          />
        </div>

        <div className={styles.field}>
          <div className={styles.status}>
            <span
              className={`${
                article.status == 'published' ? styles.currentLang : ''
              }`}
              onClick={() => setArticle({ ...article, status: 'published' })}
            >
              {t('published', locale)}
            </span>
            <span
              className={`${
                article.status == 'draft' ? styles.currentLang : ''
              }`}
              onClick={() => setArticle({ ...article, status: 'draft' })}
            >
              {t('draft', locale)}
            </span>
          </div>
        </div>
        <button
          onClick={() => (router.query.id ? updateArticle() : saveArticle())}
        >
          {t('saveArticle', locale)}
        </button>
      </div>
    </div>
  )
}

export default Create

export async function getServerSideProps ({ query }) {
  const { id } = query

  const fetchArticle = async () => {
    const { data } = await axios.get(`${BASE_URL}/api/article/id/${id}`)
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
  const { tags } = await fetchTags()

  if (id) {
    const article = await fetchArticle()

    return {
      props: {
        article,
        // categories,
        tags
      }
    }
  }

  return {
    props: {
      article: {
        title: '',
        content: {},
        publishedAt: new Date(
          new Date().getTime() - new Date().getTimezoneOffset() * 60000
        )
          .toISOString()
          .slice(0, 16),

        categories: [],
        tags: [],

        thumbnail: {},
        metaTitle: {},
        excerpt: {},
        status: 'draft'
      },
      // categories,
      tags
    }
  }
}
