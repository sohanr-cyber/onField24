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
import AddCategory from '@/components/Admin/AddCategory'
import { setFetchAgain } from '@/redux/articleSlice'
import SelectParentCategory from '@/components/Categories/SelectParentCategory'
import t from '@/utility/dict'
// Order Craetion Form
const Create = ({ category: data }) => {
  const [category, setCategory] = useState(data)
  const [error, setError] = useState('')
  const dispatch = useDispatch()
  const router = useRouter()
  const [newCategory, setNewCategory] = useState(false)
  const categories = useSelector(state => state.article.categories)
  const [lang, setLang] = useState(['en'])

  useEffect(() => {
    setCategory(data)
  }, [router.query])
  const userInfo = useSelector(state => state.user.userInfo)
  const headers = { Authorization: `Bearer ${userInfo?.token}` }

  const saveCategory = async () => {
    if (!category.name) {
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
        '/api/category',
        {
          ...category
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
      setCategory({
        name: '',
        image: ''
      })
      dispatch(finishLoading())
      dispatch(
        showSnackBar({
          message: 'New Category Created ',
          option: {
            variant: 'success'
          }
        })
      )
    } catch (error) {
      dispatch(finishLoading())
      dispatch(
        showSnackBar({
          message: 'Error While Creating Category !',
          option: {
            variant: 'error'
          }
        })
      )
    }
  }

  console.log({ categories })
  const updateCategory = async () => {
    if (!category.name) {
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
        `/api/category/${router.query.id}`,
        {
          ...category
        },
        { headers }
      )
      // setCategory(data)
      dispatch(setFetchAgain())
      dispatch(finishLoading())
      dispatch(
        showSnackBar({
          message: 'Category Updated',
          option: {
            variant: 'default'
          }
        })
      )
    } catch (error) {
      dispatch(finishLoading())
      dispatch(
        showSnackBar({
          message: 'Error While Updating Category !',
          option: {
            variant: 'error'
          }
        })
      )
      setError('Error While Updating Category !')
    }
  }

  const locale = router.locale

  return (
    <div className={styles.wrapper}>
      <div className={styles.flex}>
        <h2>
          {router.query.id
            ? t('updateCategory', locale)
            : t('createCategory', locale)}{' '}
        </h2>
      </div>
      <form className={styles.forms}>
        {lang.find(i => i == 'en') && (
          <div className={styles.left}>
            <div className={styles.field}>
              <label>Category Name</label>
              <input
                type='text'
                placeholder='Enter Category Name'
                value={category.name.en}
                onChange={e =>
                  setCategory({
                    ...category,
                    name: { en: e.target.value, bn: category.name.bn }
                  })
                }
              />
            </div>

            <div className={styles.field}>
              <label>Chose Parent Category</label>
              <div className={styles.options}>
                <SelectParentCategory
                  category={category}
                  setCategory={setCategory}
                />
              </div>
            </div>
            {newCategory && (
              <div className={styles.field}>
                <AddCategory categories={categories} />
              </div>
            )}

            <div
              className={styles.field}
              style={{
                flexDirection: 'row',
                alignItems: 'center'
              }}
            >
              <span
                onClick={() =>
                  setCategory({ ...category, isFeatured: !category.isFeatured })
                }
              >
                {category.isFeatured ? (
                  <CheckBoxIcon />
                ) : (
                  <CheckBoxOutlineBlankIcon />
                )}
              </span>
              <span> This Category will be shown in home page</span>{' '}
            </div>
            <div
              className={styles.field}
              style={{
                flexDirection: 'row',
                alignItems: 'flex-start'
              }}
            ></div>
          </div>
        )}

        {lang.find(i => i == 'bn') && (
          <div className={styles.left}>
            <div className={styles.field}>
              <label>{t('categoryName', 'bn')}</label>
              <input
                type='text'
                placeholder={t('enterCategoryName', 'bn')}
                value={category.name.bn}
                onChange={e =>
                  setCategory({
                    ...category,
                    name: {
                      en: category.name.en,
                      bn: e.target.value
                    }
                  })
                }
              />
            </div>

            <div className={styles.field}>
              <label>{t('chosePCategory', 'bn')}</label>
              <div className={styles.options}>
                <SelectParentCategory
                  category={category}
                  setCategory={setCategory}
                  lang={'bn'}
                />
              </div>
            </div>
            {newCategory && (
              <div className={styles.field}>
                <AddCategory categories={categories} />
              </div>
            )}

            <div
              className={styles.field}
              style={{
                flexDirection: 'row',
                alignItems: 'center'
              }}
            >
              <span
                onClick={() =>
                  setCategory({ ...category, isFeatured: !category.isFeatured })
                }
              >
                {category.isFeatured ? (
                  <CheckBoxIcon />
                ) : (
                  <CheckBoxOutlineBlankIcon />
                )}
              </span>
              <span>{t('showInHomPage', 'bn')}</span>{' '}
            </div>
            <div
              className={styles.field}
              style={{
                flexDirection: 'row',
                alignItems: 'flex-start'
              }}
            ></div>
          </div>
        )}
      </form>
      {error && <p style={{ color: 'red', margin: '10px' }}>{error}</p>}
      <button
        onClick={() => (router.query.id ? updateCategory() : saveCategory())}
      >
        {t('saveCategory', locale)}
      </button>
    </div>
  )
}

export default Create

export async function getServerSideProps ({ query }) {
  const { id } = query

  const fetchCategory = async () => {
    const { data } = await axios.get(`${BASE_URL}/api/category/${id}`)
    return data
  }

  const fetchCategories = async () => {
    const { data } = await axios.get(`${BASE_URL}/api/category`)
    return data.categories
  }

  // const categories = await fetchCategories()

  if (id) {
    const category = await fetchCategory()
    return {
      props: {
        category
        // categories
      }
    }
  }

  return {
    props: {
      category: {
        name: '',
        image: '',
        children: []
      }
      // categories: categories
    }
  }
}
