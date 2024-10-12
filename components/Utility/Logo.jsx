import React from 'react'
import styles from '../../styles/Utility/Logo.module.css'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { colors } from '@/utility/const'

const Logo = ({ color }) => {
  const router = useRouter()

  return (
    <div className={styles.wrapper} onClick={() => router.push('/')}>
      <div className={styles.right}>ON</div>
      <div className={styles.left}>
        <div>Field</div>
        <div>24</div>
      </div>
    </div>
  )
}

export default Logo
