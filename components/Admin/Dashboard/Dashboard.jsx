import React from 'react'
import styles from '../../../styles/Admin/Dashboard.module.css'
import Orders from './Orders'
import Products from './Articles'
const Dashboard = () => {
  return (
    <div className={styles.wrapper}>
      {/* <Orders /> */}
      <Products />
    </div>
  )
}

export default Dashboard
