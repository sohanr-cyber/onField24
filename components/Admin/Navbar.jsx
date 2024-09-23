import React, { useState } from 'react'
import styles from '../../styles/Admin/Navbar.module.css'
import MenuIcon from '@mui/icons-material/Menu'
import Logo from '../Utility/Logo'
import Image from 'next/image'
import SideBar from './SideBar'
import { useRouter } from 'next/router'
import LangPicker from '../Utility/LangPicker'
const Navbar = () => {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  return (
    <div className={styles.wrapper}>
      {open && <SideBar setOpen={setOpen} />}
      <div className={styles.left}>
        <div className={styles.menu} onClick={() => setOpen(true)}>
          <MenuIcon />
        </div>
      </div>
      <div className={styles.logo}>
        <Logo />
      </div>
      <div className={styles.right}>
        <div
          className={styles.item}
          onClick={() => router.push(`/admin/article/create`)}
        >
          <Image
            src='https://cdn-icons-png.flaticon.com/128/15414/15414285.png'
            width='25'
            height='25'
            alt=''
          />
        </div>
        <div className={styles.item} onClick={() => router.push(`/admin`)}>
          <Image
            src='https://cdn-icons-png.flaticon.com/128/3665/3665909.png'
            width='25'
            height='25'
            alt=''
          />
        </div>
        <LangPicker />
      </div>
    </div>
  )
}

export default Navbar
