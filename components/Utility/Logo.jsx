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
      <div className={styles.left}>
        <div>Dhaka</div>
        <div>
          <Image
            src={'https://cdn-icons-png.flaticon.com/128/17552/17552804.png'}
            width={35}
            height={10}
            alt=''
          />
          Pulse
        </div>
      </div>
      <div className={styles.right}>24</div>
    </div>
  )
}

export default Logo
