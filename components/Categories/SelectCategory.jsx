import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import styles from '@/styles/Category/SelectCategory.module.css'
import CheckBox from '@mui/icons-material/CheckBox'
import CheckBoxOutlineBlank from '@mui/icons-material/CheckBoxOutlineBlank'
import { useRouter } from 'next/router'

const SelectCategory = ({ selected, setSelected, lang = 'en' }) => {
  const categories = useSelector(state => state.article.dualCategories)

  const router = useRouter()

  return (
    <div className={styles.wrapper}>
      {categories?.map((i, index) => (
        <>
          {' '}
          <div className={styles.item}>
            {selected.find(id => id == i._id) ? (
              <CheckBox
                onClick={() => setSelected(selected.filter(id => id != i._id))}
              />
            ) : (
              <CheckBoxOutlineBlank
                onClick={() => setSelected([...selected, i._id])}
              />
            )}

            <div className={styles.name}>{i.name[lang]}</div>
          </div>
          {i.children.length > 0 &&
            i.children?.map((i, index) => (
              <>
                <div className={styles.item} style={{ marginLeft: '20px' }}>
                  {selected.find(id => id == i._id) ? (
                    <CheckBox
                      onClick={() =>
                        setSelected(selected.filter(id => id != i._id))
                      }
                    />
                  ) : (
                    <CheckBoxOutlineBlank
                      onClick={() => setSelected([...selected, i._id])}
                    />
                  )}

                  <div className={styles.name}>{i.name[lang]}</div>
                </div>
                {i.children.length > 0 &&
                  i.children?.map((i, index) => (
                    <div className={styles.item} style={{ marginLeft: '40px' }}>
                      {selected.find(id => id == i._id) ? (
                        <CheckBox
                          onClick={() =>
                            setSelected(selected.filter(id => id != i._id))
                          }
                        />
                      ) : (
                        <CheckBoxOutlineBlank
                          onClick={() => setSelected([...selected, i._id])}
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

export default SelectCategory
