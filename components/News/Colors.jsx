import { colors, themeBg, themeC, themeTransparent } from '@/utility/const'
import { handleClientScriptLoad } from 'next/script'
import React, { useEffect, useState } from 'react'



const Colors = ({ selectedColors, handleClick }) => {
  const [loaded, setLoaded] = useState(false)
  const [productColors, setProductColors] = useState(
    colors.slice(0, colors.length / 2)
  )

  useEffect(() => {
    loaded
      ? setProductColors(colors)
      : setProductColors(colors.slice(0, colors.length / 2))
  }, [loaded])

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
      {productColors.map((c, index) => (
        <div
          style={{
            display: 'flex',
            gap: '5px',
            border: '1px solid lightgrey',
            borderRadius: '5px',
            padding: '3px',
            cursor: 'pointer',
            background: `${
              selectedColors?.split(',').find(i => i == c.name)
                ? `${themeTransparent}`
                : ''
            }`,
            border: `${
              selectedColors?.split(',').find(i => i == c.name)
                ? `1.5px solid ${themeC}`
                : '1px solid lightgrey'
            }`
          }}
          key={index}
          onClick={() => handleClick(c.name)}
        >
          <div
            style={{
              background: `${c.code}`,
              minWidth: '18px',
              minHeight: '10px',
              borderRadius: '5px'
            }}
          ></div>
          <span>{c.name}</span>
        </div>
      ))}
      <div
        style={{
          display: 'flex',
          gap: '5px',
          border: '1px solid lightgrey',
          borderRadius: '5px',
          padding: '3px 7px',
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: '100%',
          background: `${themeBg}`,
          color: 'white'
        }}
        onClick={() => setLoaded(prev => !prev)}
      >
        {loaded ? '-' : '+'}
      </div>
    </div>
  )
}

export default Colors
