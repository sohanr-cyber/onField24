import React, { useState } from 'react'
import styles from '../../styles/SearchResult/Filter.module.css'
import { CheckBox, CheckBoxOutlineBlank } from '@mui/icons-material'
import { useRouter } from 'next/router'
import SkeletonDiv from '../Utility/SkeletonDiv'
import { findCategoryById } from '@/utility/helper'

const Categories = ({ categories, updateRoute }) => {
  const [list, setList] = useState([])
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState({})
  console.log({ selectedCategory })

  return (
    <div>
      {categories
        ? categories.map((item, index) => (
            <>
              {' '}
              <div className={styles.flex}>
                {router.query.categories
                  ?.split(',')
                  .find(each => each == item._id) ? (
                  <div
                    className={styles.option}
                    onClick={() =>
                      updateRoute({
                        categories: null
                      })
                    }
                  >
                    <CheckBox />
                    <span>{item.name}</span>
                  </div>
                ) : (
                  <div
                    className={styles.option}
                    onClick={() => {
                      updateRoute({
                        categories: item._id
                      })
                    }}
                  >
                    <CheckBoxOutlineBlank />
                    <span>{item.name}</span>
                  </div>
                )}

                {item.children.length > 0 && (
                  <div
                    className={styles.category_right}
                    onClick={() =>
                      list.indexOf(item) === -1
                        ? setList([...list, item])
                        : setList(list.filter(e => e._id != item._id))
                    }
                  >
                    {list.indexOf(item) === -1 ? '+' : '-'}
                  </div>
                )}
              </div>
              {list.find(i => i == item) &&
                item.children.map((i, index) => (
                  <div
                    className={styles.flex}
                    style={{
                      marginLeft: '20px',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    {router.query.categories
                      ?.split(',')
                      .find(each => each == i._id) ? (
                      <div
                        className={styles.option}
                        onClick={() => {
                          updateRoute({
                            categories: item._id
                          })
                        }}
                      >
                        <CheckBox />
                        <span>{i.name}</span>
                      </div>
                    ) : (
                      <div
                        className={styles.option}
                        onClick={() =>
                          updateRoute({
                            categories: i._id
                          })
                        }
                      >
                        <CheckBoxOutlineBlank />
                        <span>{i.name}</span>
                      </div>
                    )}
              
                  </div>
                ))}
            </>
          ))
        : [1, 2, 3, 4].map((item, index) => (
            <div className={styles.option} key={index}>
              <SkeletonDiv />
            </div>
          ))}
      {findCategoryById(categories, router.query.categories) && (
        <div
          className={styles.selected}
          onClick={() =>
            updateRoute({
              categories: null
            })
          }
        >
          {findCategoryById(categories, router.query.categories).name}
          <span>X</span>
        </div>
      )}
    </div>
  )
}

export default Categories
