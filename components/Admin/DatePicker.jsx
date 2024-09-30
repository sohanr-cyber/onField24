import React, { useState } from 'react'
import styles from '@/styles/Admin/DatePicker.module.css'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import { showSnackBar } from '@/redux/notistackSlice'
import t from '@/utility/dict'

const DatePicker = ({ setOpen }) => {
  const router = useRouter()
  const lang = router.locale

  const dispatch = useDispatch()
  const [startDate, setStartDate] = useState(
    router.query.startDate
      ? new Date(router.query.startDate).toISOString().split('T')[0]
      : ''
  )
  const [endDate, setEndDate] = useState(
    router.query.endDate
      ? new Date(router.query.endDate).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0]
  )
  const updateRoute = data => {
    if (!data.startDate || !data.endDate) {
      dispatch(
        showSnackBar({
          message: 'Please Select Time Period !',
          option: {
            variant: 'info'
          }
        })
      )
      return
    }
    if (data.startDate == data.endDate) {
      dispatch(
        showSnackBar({
          message: "Both Date Can't Be Same !",
          option: {
            variant: 'info'
          }
        })
      )
      return
    }
    const queryParams = { ...router.query, ...data }
    router.push({
      pathname: router.pathname,
      query: queryParams,
      shallow: false
    })
    setOpen(false)
  }
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.field}>
          <span>{t('from', lang)} </span>
          <input
            type='date'
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            max={endDate}
          />
        </div>
        <div className={styles.field}>
          <span>{t('to', lang)} </span>
          <input
            type='date'
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            min={startDate}
          />
        </div>
        <div className={styles.field}>
          <button
            onClick={() =>
              updateRoute({ period: 'Custom', startDate, endDate })
            }
          >
            {t('apply', lang)}
          </button>
          <button onClick={() => setOpen(false)}>{t('cancel', lang)}</button>
        </div>
      </div>
    </div>
  )
}

export default DatePicker
