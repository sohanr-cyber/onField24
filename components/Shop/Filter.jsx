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

const Filter = ({ setOpen }) => {
  const router = useRouter()
  const categories = useSelector(state => state.article.categories)
  const [tags, setTags] = useState([])
  const lang = router.locale

  const fetchTags = async () => {
    try {
      const { data } = await axios.get(`/api/tag?limit=50`)
      setTags(data.tags)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchTags()
  }, [])

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
          <h3>FILTER</h3>
          <h3 onClick={() => setOpen(false)}>X</h3>
        </div>

        {/* Category Filter */}
        <div className={styles.heading}>Category</div>
        <div className={styles.filterOptions}>
          <Categories categories={categories} updateRoute={updateRoute} />
        </div>

        {/* Color Family */}
        <div className={styles.heading}>Tags</div>
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
              className={styles.tag}
              
              onClick={() =>
                updateRoute({
                  tags: i._id
                })
              }
            >
              {i.name[lang]}
            </span>
          ))}
        </div>
      </div>
      <div className={styles.right} onClick={() => setOpen(false)}></div>
    </div>
  )
}

export default Filter
