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
  Brush
} from 'recharts'
import { statusColors } from '@/utility/const'

const ChartArea = ({ title, summary }) => {
  return (
    <div className={styles.graph__wrapper} style={{ width: '100%' }}>
      <h3>{title}</h3>
      <ResponsiveContainer width='100%' aspect={7 / 3}>
        <AreaChart
          width={650}
          height={300}
          data={summary}
          margin={{ left: 0, bottom: -15 }}
        >
          <defs>
            <linearGradient id='colorTv' x1='0' y1='0' x2='0' y2='1'>
              <stop
                offset='5%'
                stopColor={statusColors['none']}
                stopOpacity={0.8}
              />
              <stop
                offset='95%'
                stopColor={statusColors['none']}
                stopOpacity={0}
              />
            </linearGradient>
            <linearGradient id='colorDv' x1='0' y1='0' x2='0' y2='1'>
              <stop
                offset='5%'
                stopColor={statusColors['delivered']}
                stopOpacity={0.8}
              />
              <stop
                offset='95%'
                stopColor={statusColors['delivered']}
                stopOpacity={0}
              />
            </linearGradient>
            <linearGradient id='colorFv' x1='0' y1='0' x2='0' y2='1'>
              <stop
                offset='5%'
                stopColor={statusColors['failed']}
                stopOpacity={0.8}
              />
              <stop
                offset='95%'
                stopColor={statusColors['failed']}
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <XAxis dataKey='date' tick={false} />
          <YAxis hide={true} />
          {/* <CartesianGrid strokeDasharray="3 3" /> */}
          <Tooltip />

          <Area
            type='monotone'
            dataKey='total'
            stroke={statusColors['none']}
            fillOpacity={1}
            fill='url(#colorTv)'
            strokeWidth={3}
          />

          <Area
            type='monotone'
            dataKey='published'
            stroke={statusColors['delivered']}
            fillOpacity={1}
            fill='url(#colorTv)'
            strokeWidth={3}
          />
          <Area
            type='monotone'
            dataKey='draft'
            stroke={statusColors['canceled']}
            fillOpacity={1}
            fill='url(#colorFv)'
            strokeWidth={3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export default ChartArea
