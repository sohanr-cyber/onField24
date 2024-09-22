import React, { useEffect, useState } from 'react'
import styles from '@/styles/Admin/Chart/PieWithTag.module.css'
import { summarizeOrders } from '@/utility/helper'
import { statusColors } from '@/utility/const'
import Pie from './Pie'
const PieWithTag = ({ data }) => {
  const [client, setClient] = useState(false)

  useEffect(() => {
    setClient(true)
  }, [])

  return (
    <div className={styles.container}>
      {/* <b>Order Statistics</b> */}
      {client && (
        <div className={styles.wrapper}>
          <Pie data={data} />
          <div className={styles.identities}>
            {data.map((i, index) => (
              <div
                className={styles.identity}
                style={{
                  color: `${statusColors[i.name.toLocaleLowerCase()]}`
                }}
              >
                <div
                  className={styles.square}
                  style={{
                    backgroundColor: `${i.color}`
                  }}
                ></div>
                <div>{i.name}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default PieWithTag
