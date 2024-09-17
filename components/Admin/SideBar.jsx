import React, { useState } from 'react'
import styles from '../../styles/Admin/SideBar.module.css'
import Image from 'next/image'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import DashboardIcon from '@mui/icons-material/Dashboard'
import AccountBoxIcon from '@mui/icons-material/AccountBox'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn'
import MapIcon from '@mui/icons-material/Map'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import LogoutIcon from '@mui/icons-material/Logout'
import DeleteIcon from '@mui/icons-material/Delete'
import { useRouter } from 'next/router'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import Logo from '../Utility/Logo'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import CategoryIcon from '@mui/icons-material/Category'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle'
import CommentIcon from '@mui/icons-material/Comment'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import CameraIcon from '@mui/icons-material/Camera'
import Logout from '../Utility/Logout'

const SideBar = ({ setOpen }) => {
  const router = useRouter()
  const [visible, setVisible] = useState('')
  const logout = () => {
    // Cookies.remove('userInfo')
    router.reload()
    router.push('/login')
  }

  return (
    <div className={styles.wrapper}>
      {' '}
      <div className={styles.left}>
        <div className={styles.top}>
          <div className={styles.logo}>
            <Logo color={'aliceblue'} />
          </div>
          <div className={styles.exit} onClick={() => setOpen(setOpen(false))}>
            <ExitToAppIcon />
          </div>
        </div>
        <div className={styles.navigators}>
          {' '}
          <div className={styles.item} onClick={() => router.push('/admin')}>
            <div className={styles.flex}>
              {' '}
              <div className={styles.icon}>
                <DashboardIcon />
              </div>
              <div className={styles.title}>Dashboard</div>
            </div>
          </div>
          <div
            className={styles.item}
            onClick={() =>
              setVisible(prev => (prev == 'article' ? '' : 'article'))
            }
          >
            <div className={styles.flex}>
              {' '}
              <div className={styles.icon}>
                <CameraIcon />
              </div>
              <div className={styles.title}>Article</div>{' '}
            </div>
            <div className={styles.icon}>
              {visible == 'article' ? (
                <KeyboardArrowUpIcon />
              ) : (
                <KeyboardArrowDownIcon />
              )}{' '}
            </div>
          </div>{' '}
          {visible == 'article' && (
            <div className={styles.inner__items}>
              <div
                className={styles.item}
                onClick={() => router.push('/admin/article')}
              >
                <div className={styles.flex}>
                  {' '}
                  <div className={styles.icon}>
                    <FormatListBulletedIcon />
                  </div>
                  <div className={styles.title}>Article List</div>
                </div>
              </div>{' '}
              <div
                className={styles.item}
                onClick={() => router.push('/admin/article/create')}
              >
                <div className={styles.flex}>
                  {' '}
                  <div className={styles.icon}>
                    <AddCircleIcon />
                  </div>
                  <div className={styles.title}>Add Article</div>
                </div>
              </div>
            </div>
          )}
          <div
            className={styles.item}
            onClick={() =>
              setVisible(prev => (prev == 'category' ? '' : 'category'))
            }
          >
            <div className={styles.flex}>
              {' '}
              <div className={styles.icon}>
                <CategoryIcon />
              </div>
              <div className={styles.title}>Category</div>{' '}
            </div>
            <div className={styles.icon}>
              {visible == 'category' ? (
                <KeyboardArrowUpIcon />
              ) : (
                <KeyboardArrowDownIcon />
              )}{' '}
            </div>
          </div>{' '}
          {visible == 'category' && (
            <div className={styles.inner__items}>
              <div
                className={styles.item}
                onClick={() => router.push('/admin/category')}
              >
                <div className={styles.flex}>
                  {' '}
                  <div className={styles.icon}>
                    <FormatListBulletedIcon />
                  </div>
                  <div className={styles.title}>Category List</div>
                </div>
              </div>{' '}
              <div
                className={styles.item}
                onClick={() => router.push('/admin/category/create')}
              >
                <div className={styles.flex}>
                  {' '}
                  <div className={styles.icon}>
                    <AddCircleIcon />
                  </div>
                  <div className={styles.title}>Add Category</div>
                </div>
              </div>
            </div>
          )}
          <div
            className={styles.item}
            onClick={() => setVisible(prev => (prev == 'user' ? '' : 'user'))}
          >
            <div className={styles.flex}>
              {' '}
              <div className={styles.icon}>
                <AssignmentTurnedInIcon />
              </div>
              <div className={styles.title}>Users</div>
            </div>
            <div className={styles.icon}>
              {visible == 'user' ? (
                <KeyboardArrowUpIcon />
              ) : (
                <KeyboardArrowDownIcon />
              )}{' '}
            </div>
          </div>
          {visible == 'user' && (
            <div className={styles.inner__items}>
              <div
                className={styles.item}
                onClick={() => router.push('/admin/user')}
              >
                <div className={styles.flex}>
                  {' '}
                  <div className={styles.icon}>
                    <FormatListBulletedIcon />
                  </div>
                  <div className={styles.title}>User List</div>
                </div>
              </div>
              <div className={styles.item} style={{ display: 'none' }}>
                <div className={styles.flex}>
                  {' '}
                  <div className={styles.icon}>
                    <AddCircleIcon />
                  </div>
                  <div className={styles.title}>Add Order</div>
                </div>
              </div>
            </div>
          )}
          <div
            className={styles.item}
            onClick={() => router.push('/admin/address')}
          >
            <div className={styles.flex}>
              {' '}
              <div className={styles.icon}>
                <MapIcon />
              </div>
              <div className={styles.title}>Address</div>
            </div>
          </div>
          <div className={styles.item}>
            <Logout />
          </div>
        </div>
      </div>
      <div className={styles.right} onClick={() => setOpen(false)}></div>
    </div>
  )
}

export default SideBar
