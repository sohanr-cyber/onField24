import React, { useEffect, useState } from 'react'
import styles from '../../styles/SearchResult/Filter.module.css'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import SkeletonDiv from '../Utility/SkeletonDiv'
import Colors from './Colors'
import Categories from './Categories'
import axios from 'axios'
import t from '@/utility/dict'

const Filter = ({ setOpen, tags }) => {
  const router = useRouter()
  const categories = useSelector(state => state.article.categories)
  const lang = router.locale

  const updateRoute = data => {
    const queryParams = { ...router.query, ...data }
    router.push({
      pathname: router.pathname,
      query: queryParams,
      shallow: false
    })
    setOpen(false)
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.left}>
        <div className={styles.flex}>
          <h3>{t('filter', lang)}</h3>
          <h3 onClick={() => setOpen(false)}>X</h3>
        </div>

        {/* Category Filter */}
        <div className={styles.heading}>{t('Category', lang)}</div>
        <div className={styles.filterOptions}>
          <Categories categories={categories} updateRoute={updateRoute} />
        </div>

        {/* Color Family */}
        <div className={styles.heading}>{t('Tags', lang)}</div>
        <div
          className={styles.filterOptions}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px'
          }}
        >
          {tags?.map((i, index) => (
            <span
              key={index}
              className={`${
                router.query.tags?.split(',').find(tag => tag == i._id)
                  ? styles.selectedTag
                  : ''
              } ${styles.tag}`}
              onClick={() =>
                updateRoute({
                  tags: router.query.tags
                    ? router.query.tags.split(',').find(tag => tag == i._id)
                      ? router.query.tags
                          .split(',')
                          .filter(tag => tag != i._id)
                          .join(',')
                      : [...router.query.tags.split(','), i._id].join(',')
                    : i._id // if router.query.tags is undefined, add the first tag
                })
              }
            >
              {i.name?.[lang]}
            </span>
          ))}
        </div>
      </div>
      <div className={styles.right} onClick={() => setOpen(false)}></div>
    </div>
  )
}

export default Filter
