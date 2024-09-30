import Image from 'next/image'
import React from 'react'
import styles from '../../styles/Admin/Card.module.css'
import PeopleIcon from '@mui/icons-material/People'
import { convertToBanglaNumber, extractRGBA } from '@/utility/helper'
import { statusColors, themeTransparent } from '@/utility/const'
import ProgressBar from '../Utility/PBar'
import { useRouter } from 'next/router'

const colors = [
  'rgb(255, 0, 0, 0.1)',
  'rgb(0, 129, 0, 0.1)',
  'rgb(255, 255, 0, 0.1)',
  'rgb(131, 0, 131, 0.1)'
]

const Card = ({ item, index, title, status, total, denominator, icon }) => {
  const percentage = ((total / denominator) * 100).toFixed(0)
  const router = useRouter()
  const lang = router.locale
  return (
    <div
      className={styles.card__wrapper}
      style={{
        background: `${
          status != 'None'
            ? extractRGBA(statusColors[status.toLowerCase()], 0.1)
            : themeTransparent
        }`,
        borderLeft: `2px solid ${statusColors[status.toLowerCase()]}`
      }}
    >
      {' '}
      <div className={styles.flex}>
        <Image src={icon} width='20' height='20' alt='icon' />{' '}
        <div className={styles.title}>{title}</div>
      </div>
      {status != 'None' && (
        <ProgressBar
          height={'3px'}
          percentage={percentage}
          color={statusColors[status.toLowerCase()]}
        />
      )}
      <div className={styles.bottom_flex}>
        <div className={styles.total}>
          {convertToBanglaNumber(total, lang)}{' '}
          {status != 'None' && (total / denominator) * 100 > 0 && (
            <span>({convertToBanglaNumber(percentage, lang)})%</span>
          )}
        </div>
        {/* <div className={styles.amount}>{totalAmount.toLocaleString()} BDT</div> */}
      </div>
    </div>
  )
}

export default Card
