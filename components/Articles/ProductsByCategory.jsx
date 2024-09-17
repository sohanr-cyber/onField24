import React, { useEffect, useState } from 'react'
import styles from '@/styles/Products/ProductsByCategory.module.css'
import Product from '../Product'
import ProgressBar from '../Utility/PBar'

const ProductsByCategory = ({
  category,
  subCategory,
  products: data,
  rowDirection,
  structure
}) => {
  const [products, setProducts] = useState(data)
  const style = `styles.${structure}`

  useEffect(() => {
    setProducts(data)
  }, [data])

  return (
    <div className={styles.wrapper}>
      <div className={styles.top}>
        <div className={styles.left}>
          <h3 className={styles.item} onClick={() => setProducts(data)}>
            {category}
          </h3>
        </div>
        <div className={styles.right}>
          {subCategory?.map(item => (
            <>
              <div
                className={styles.item}
                onClick={() =>
                  setProducts(
                    data.filter(p => p.categories.find(c => c == item._id))
                  )
                }
              >
                {item.name}
              </div>
            </>
          ))}
        </div>
      </div>
      <ProgressBar pixel={category.length * 11.2} />
      <div className={`${styles.products} ${style}`}>
        {[...products].map((item, index) => (
          <Product
            key={index}
            item={item}
            redirect={true}
            structure={structure}
            rowDirection={rowDirection}
          />
        ))}
      </div>
    </div>
  )
}

export default ProductsByCategory
