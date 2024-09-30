import React from 'react'
import styles from '../../styles/Utility/Logo.module.css'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { colors } from '@/utility/const'

const Logo = ({ color }) => {
  const router = useRouter()
  const name = 'OnField360'

  return (
    <div className={styles.wrapper} onClick={() => router.push('/')}>
      <span>Dhaka</span> <span>Pulse</span>
      <span>24</span>
    </div>
  )
}

export default Logo
