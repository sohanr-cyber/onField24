import React, { use, useEffect, useState } from 'react'
import styles from '../../../styles/Admin/Orders.module.css'
import Pages from '@/components/Utility/Pagination'
import SearchIcon from '@mui/icons-material/Search'
import { useRouter } from 'next/router'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { finishLoading, startLoading } from '@/redux/stateSlice'
import { showSnackBar } from '@/redux/notistackSlice'
import { statusColors } from '@/utility/const'
import { extractRGBA, getTime, readMinute } from '@/utility/helper'
import t from '@/utility/dict'

const Ads = ({
  title,
  dashboard,
  ads,
  totalPages,
  count,
  currentPage,
  style
}) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredAds, setFilteredAds] = useState({
    ads,
    totalPages,
    count,
    page: currentPage
  })
  const lang = router.locale
  const userInfo = useSelector(state => state.user.userInfo)
  const headers = { Authorization: 'Bearer ' + userInfo?.token }
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    setFilteredAds({ ads, totalPages, count, page: currentPage })
  }, [ads])

  const updateRoute = data => {
    const queryParams = { ...router.query, ...data }
    router.push({
      pathname: router.pathname,
      query: queryParams,
      shallow: false
    })
  }

  useEffect(() => {
    setSearchQuery(router.query.search)
  }, [router.query.search])

  const remove = async id => {
    try {
      dispatch(startLoading())
      const { data } = await axios.delete(`/api/ad/${id}`, {
        headers
      })
      setFilteredAds({
        ...filteredAds,
        ads: filteredAds.ads.filter(i => i._id != id)
      })
      dispatch(finishLoading())
      dispatch(showSnackBar({ message: 'Product Removed !' }))
    } catch (error) {
      dispatch(finishLoading())
      dispatch(
        showSnackBar({
          message: 'Error While Deleting Product !',
          option: {
            variant: 'error'
          }
        })
      )
    }
  }

  return (
    <>
      {!dashboard && <h2>{title}</h2>}

      <div
        className={styles.wrapper}
        id='ads'
        style={style ? { ...style } : {}}
      >
        {dashboard && <h2>{title}</h2>}
        {!dashboard && (
          <div className={styles.flex}>
            <div className={styles.left}>
              <input
                type='text'
                placeholder={`${t('search', lang)}...`}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <span
                onClick={() => updateRoute({ search: searchQuery, page: 1 })}
              >
                <SearchIcon />
              </span>
            </div>
            <div className={styles.right}>
              <button onClick={() => router.push('/admin/ad/create')}>
                <span className={styles.plus__btn}>
                  {t('addArticle', lang)}
                </span>
                <span className={styles.plus__icon}>+</span>
              </button>
            </div>
          </div>
        )}
        <div className={styles.table__wrapper}>
          <table>
            <thead>
              <tr>
                <th>{t('title', lang)} </th>
                <th>{t('advertiser', lang)}</th>
                <th>{t('startDate', lang)}</th>
                <th>{t('EndDate', lang)}</th>
                <th>{t('addType', lang)}</th>
                <th>{t('location')}</th>
                <th>{t('click', lang)}</th>
                {/* <th>{t('impression', lang)}</th> */}
                <th>{t('action', lang)}</th>
                {/* Add more table headers as needed */}
              </tr>
            </thead>
            <tbody>
              {isClient &&
                filteredAds?.ads?.map((ad, index) => (
                  <tr
                    key={index}
                    style={{
                      borderLeft: `3px solid ${
                        statusColors[
                          `${
                            ad.status == 'draft'
                              ? 'draft'
                              : ad.isFeatured
                              ? 'featured'
                              : 'none'
                          }`.toLowerCase()
                        ]
                      }`,
                      background: `${extractRGBA(
                        statusColors[
                          `${
                            ad.status == 'draft'
                              ? 'draft'
                              : ad.isFeatured
                              ? 'featured'
                              : 'none'
                          }`.toLowerCase()
                        ],
                        0.1
                      )}`
                    }}
                  >
                    <td onDoubleClick={() => router.push(`/ad/${ad.slug}`)}>
                      {ad.title}
                    </td>

                    <td>{ad.advertiser}</td>
                    <td>{getTime(ad.startDate)}</td>
                    <td>{getTime(ad.endDate)}</td>
                    <td>{ad.adType}</td>
                    <td>{t(ad.location, lang)}</td>
                    <td>{ad.clicks}</td>
                    {/* <td>{ad.impressions}</td> */}
                    <td className={styles.action}>
                      {isClient && userInfo.role == 'admin' && (
                        <span onDoubleClick={() => remove(ad._id)}>
                          {t('delete', lang)}
                        </span>
                      )}
                      <span
                        onClick={() =>
                          router.push(`/admin/ad/create?id=${ad._id}`)
                        }
                      >
                        {t('view', lang)}
                      </span>
                    </td>
                    {/* Add more table cells as needed */}
                  </tr>
                ))}
            </tbody>
          </table>{' '}
        </div>
        {!dashboard && (
          <div className={styles.pagination}>
            <Pages
              totalPages={filteredAds.totalPages}
              currentPage={filteredAds.page}
            />
          </div>
        )}
      </div>
    </>
  )
}

export default Ads
