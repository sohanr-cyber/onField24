import { statusColors } from '@/utility/const'
import { summarizeOrders } from '@/utility/helper'
import React, { PureComponent } from 'react'
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts'

const Chart = ({ data }) => {
  return (
    <div>
      {' '}
      <PieChart width={140} height={140}>
        <Pie
          data={data}
          innerRadius={50}
          outerRadius={65}
          fill='#8884d8'
          paddingAngle={1}
          dataKey='value'
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
      </PieChart>
    </div>
  )
}

export default Chart
