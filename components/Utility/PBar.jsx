import React from 'react'
import styles from '../../styles/Utility/ProgressBar.module.css'
import { buttonBg } from '@/utility/const'

const PBar = ({ height, percentage, pixel, color }) => {
  return (
    <div
      className={styles.progressBar}
      style={{ height: `${height || '3px'}` }}
    >
      <div
        className={styles.progress}
        style={{
          width: `${percentage ? `${percentage}%` : `${pixel}px`}`,
          background: `${color ? `${color}` : ``}`
        }}
      ></div>
    </div>
  )
}

export default PBar
