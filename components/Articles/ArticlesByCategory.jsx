import React, { useState } from 'react'
import styles from '@/styles/Articles/ArticlesByCategory.module.css'
import PBar from '../Utility/PBar'
import Article from '../Article/Article'
import Article2 from '../Article/Article2'
const ArticlesByCategory = ({ category, subCategory, articles, index }) => {
  //   const [articles, setArticles] = useState(data)
  return (
    <div className={styles.wrapper}>
      <b className={styles.categor_name}>{category}</b>
      <div>
        <PBar pixel={0} />
      </div>
      <div className={styles.articles}>
        <div className={styles.grid1}>
          <Article article={articles[0]} />
        </div>
        <div className={styles.grid2}>
          {articles.slice(1, articles.length).map((i, index) => (
            <Article2 article={i} flex={'row'} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default ArticlesByCategory
