import React from 'react'
import styles from '../../styles/Utility/Logo.module.css'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { colors } from '@/utility/const'

const Logo = ({ color }) => {
  const router = useRouter()

  return (
    <div className={styles.wrapper} onClick={() => router.push('/')}>
      <div className={styles.right}>D</div>
      <div className={styles.left}>
        <div>haka</div>
        <div>
          {/* <Image
            src={'https://cdn-icons-png.flaticon.com/128/17552/17552804.png'}
            width={35}
            height={10}
            alt=''
          /> */}
          Magazine
        </div>
      </div>
    </div>
  )
}

export default Logo
