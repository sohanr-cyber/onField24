import React from 'react'
import styles from '../../styles/Admin/Chart/Graph.module.css'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Brush,
  BarChart,
  Bar
} from 'recharts'
import { statusColors, themeC } from '@/utility/const'

const ChartBar = ({ title, number, percent, summary }) => {
  return (
    <div className={styles.graph__wrapper} style={{ width: '100%' }}>
      <h3 className={styles.title}>{title}</h3>
      <ResponsiveContainer width='100%' aspect={7 / 3}>
        <BarChart
          width={650}
          height={300}
          data={summary}
          margin={{
            bottom: 15
          }}
        >
          {/* <XAxis dataKey='date' padding={{ left: 0, right: 0 }} /> */}
          {/* <YAxis orientation={'right'} axisLine={false} tickLine={false} /> */}

          {/* <Tooltip /> */}
          <Bar dataKey='views' fill={statusColors['views']} stackId='a' />
          <Bar dataKey='reads' fill={statusColors['reads']} stackId='a' />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default ChartBar
