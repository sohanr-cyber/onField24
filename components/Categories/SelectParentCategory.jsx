import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import styles from '@/styles/Category/SelectCategory.module.css'
import CheckBox from '@mui/icons-material/CheckBox'
import CheckBoxOutlineBlank from '@mui/icons-material/CheckBoxOutlineBlank'
import { useRouter } from 'next/router'
import { Category } from '@mui/icons-material'
import SelectCategory from './SelectCategory'

const SelectParentCategory = ({ category, setCategory, lang = 'en' }) => {
  const categories = useSelector(state => state.article.dualCategories)

  const router = useRouter()

  return (
    <div className={styles.wrapper}>
      {categories?.map((i, index) => (
        <>
          {' '}
          <div className={styles.item}>
            {category.parent == i._id ? (
              <CheckBox
                onClick={() => setCategory({ ...category, parent: null })}
              />
            ) : (
              <CheckBoxOutlineBlank
                onClick={() => setCategory({ ...category, parent: i._id })}
              />
            )}

            <div className={styles.name}>{i.name[lang]}</div>
          </div>
          {i.children.length > 0 &&
            i.children?.map((i, index) => (
              <>
                <div className={styles.item} style={{ marginLeft: '20px' }}>
                  {category.parent == i._id ? (
                    <CheckBox
                      onClick={() => setCategory({ ...category, parent: null })}
                    />
                  ) : (
                    <CheckBoxOutlineBlank
                      onClick={() =>
                        setCategory({ ...category, parent: i._id })
                      }
                    />
                  )}

                  <div className={styles.name}>{i.name[lang]}</div>
                </div>
                {i.children.length > 0 &&
                  i.children?.map((i, index) => (
                    <div className={styles.item} style={{ marginLeft: '40px' }}>
                      {category.parent == i._id ? (
                        <CheckBox
                          onClick={() =>
                            setCategory({ ...category, parent: null })
                          }
                        />
                      ) : (
                        <CheckBoxOutlineBlank
                          onClick={() =>
                            setCategory({ ...category, parent: i._id })
                          }
                        />
                      )}

                      <div className={styles.name}>{i.name[lang]}</div>
                    </div>
                  ))}
              </>
            ))}
        </>
      ))}
    </div>
  )
}

export default SelectParentCategory
