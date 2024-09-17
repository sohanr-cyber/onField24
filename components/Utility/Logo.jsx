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
      <span>On</span> <span>Field</span>
      <span>360</span>
    </div>
  )
}

export default Logo
