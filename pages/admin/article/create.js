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
import Colors from '@/components/Shop/Colors'
import ControlPointDuplicateOutlinedIcon from '@mui/icons-material/ControlPointDuplicateOutlined'
import SelectCategory from '@/components/Categories/SelectCategory'

const Create = ({ article: data, tags }) => {
  const [images, setImages] = useState([])
  const [article, setArticle] = useState(data)
  const [error, setError] = useState('')
  const [descriptionEn, setDescriptionEn] = useState(article.content?.en)
  const [descriptionBn, setDescriptionBn] = useState(article.content?.bn)

  const dispatch = useDispatch()
  const router = useRouter()
  const handleImages = files => {
    setArticle(prev => ({ ...prev, images: files }))
  }
  const userInfo = useSelector(state => state.user.userInfo)
  const headers = { Authorization: 'Bearer ' + userInfo?.token }
  const [selected, setSelected] = useState(article.categories?.map(i => i._id))

  const refreshPage = () => {
    // Get the current route's pathname and query parameters
    const { pathname, query } = router

    // Use router.push to navigate to the same URL
    router.push({
      pathname: pathname, // Same as current pathname
      query: query // Same as current query parameters
    })
  }
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
      // setArticle({
      //   name: '',
      //   sizes: '',
      //   description: '',
      //   price: 0,
      //   discount: '',
      //   categories: [],
      //   color: '',
      //   images: [],
      //   thumbnail: '',
      //   metaTitle: '',
      //   metaDescription: '',
      //   attributes: {},
      //   stockQuantity: 0,
      //   sold: 0
      // })

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

  const setColor = c => {
    setArticle({ ...article, color: article.color == c ? '' : c })
  }

  return (
    <div className={styles.wrapper}>
      <h2>Add Article</h2>
      <form className={styles.forms}>
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
          </div>
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
            <label>Meta Title(optional)</label>
            <input
              type='text'
              placeholder='Enter Article Meta Title'
              value={article.metaTitle?.en || article.title?.en}
              onChange={e =>
                setArticle(prev => ({
                  ...prev,
                  metaTitle: {
                    en: e.target.value,
                    bn: prev.metaTitle.bn
                  }
                }))
              }
            />
          </div>
          <div className={styles.field}>
            <label>Meta Description(optional)</label>
            <textarea
              value={article.metaDescription?.en}
              onChange={e =>
                setArticle(prev => ({
                  ...prev,
                  metaDescription: {
                    en: e.target.value,
                    bn: prev.metaDescription.bn
                  }
                }))
              }
            ></textarea>
          </div>
        </div>
        <div className={`${styles.left} ${styles.right}`}>
          {' '}
          <div className={styles.field}>
            <label>Article Name</label>
            <input
              type='text'
              placeholder='Enter Title'
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
            <label> Thumbnail</label>
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
                    {i.name['bn']}
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
                  lang={'bn'}
                />
              </div>
            </div>
          </div>
          <div className={styles.field}>
            <label>Description</label>

            <TextEditor
              setDescriptionBn={setDescriptionBn}
              description={descriptionBn}
              lang='bn'
            />
          </div>
          <div className={styles.field}>
            <label>Meta Title(optional)</label>
            <input
              type='text'
              placeholder='Enter Article Meta Title'
              value={article.metaTitle?.bn || article.title?.bn}
              onChange={e =>
                setArticle(prev => ({
                  ...prev,
                  metaTitle: {
                    en: prev.metaTitle.en,
                    bn: e.target.value
                  }
                }))
              }
            />
          </div>
          <div className={styles.field}>
            <label>Meta Description(optional)</label>
            <textarea
              value={article.metaDescription?.bn}
              onChange={e =>
                setArticle(prev => ({
                  ...prev,
                  metaDescription: {
                    bn: e.target.value,
                    en: prev.metaDescription.en
                  }
                }))
              }
            ></textarea>
          </div>
        </div>
      </form>
      {error && <p style={{ color: 'red', margin: '10px' }}>{error}</p>}
      <button
        onClick={() => (router.query.id ? updateArticle() : saveArticle())}
      >
        Save Prdouct
      </button>
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

        categories: [],
        tags: [],

        thumbnail: {},
        metaTitle: {},
        metaDescription: {}
      },
      // categories,
      tags
    }
  }
}
