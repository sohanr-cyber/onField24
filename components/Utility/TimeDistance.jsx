import React from 'react'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import styles from './../../styles/Utility/TimeDistance.module.css'
import { formatDistanceToNow } from 'date-fns'
import { timeAgo } from '@/utility/helper'
import { useRouter } from 'next/router'
const TimeDistance = ({ article }) => {
  const router = useRouter()
  const lang = router.locale

  return (
    <div className={styles.wrapper}>
      <AccessTimeIcon style = {{fontSize:"150%"}} />
      <div className={styles.time}>
        {' '}
        {timeAgo(
          formatDistanceToNow(
            new Date(article.publishedAt || article.createdAt)
          ) + ' Ago',
          lang
        )}
      </div>
    </div>
  )
}

export default TimeDistance
