import React, { useState } from 'react'
import styles from '../../styles/Admin/Navbar.module.css'
import MenuIcon from '@mui/icons-material/Menu'
import Logo from '../Utility/Logo'
import Image from 'next/image'
import SideBar from './SideBar'
import { useRouter } from 'next/router'
import LangPicker from '../Utility/LangPicker'
import { icons } from '@/utility/const'
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
          <Image src={icons.addIcon} width='25' height='25' alt='' />
        </div>
        <div className={styles.item} onClick={() => router.push(`/admin`)}>
          <Image src={icons.aIcon} width='25' height='25' alt='' />
        </div>
        {/* <LangPicker /> */}
      </div>
    </div>
  )
}

export default Navbar
