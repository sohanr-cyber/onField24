import React from 'react'
import styles from '../../styles/Utility/Logo.module.css'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { colors } from '@/utility/const'

const Logo = ({ color }) => {
  const router = useRouter()

  return (
    <div className={styles.wrapper} onClick={() => router.push('/')}>
      <Image src="/images/curly-flag.png" width={38} height={40} alt="" />
      <div className={styles.sun}>      <Image src="/images/sun.png" width={40} height={40} alt="" /></div>

      <div className={styles.top}><span>BANGLADESH</span>
      </div>      <div className={styles.mid}>
        <div> TRAITS</div>
        <div>TIMES</div></div>
      <div className={styles.flex}>
        <span>-</span>
        <span>NEWS CENTER</span>
        <span>-</span>
      </div>
    </div>

  )
}

export default Logo
