import { showSnackBar } from '@/redux/notistackSlice'
import { setCategories } from '@/redux/articleSlice'
import { finishLoading, startLoading } from '@/redux/stateSlice'
import { buttonC, themeBg } from '@/utility/const'
import { BorderAllRounded } from '@mui/icons-material'
import axios from 'axios'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'

const AddCategory = ({ categories }) => {
  const [category, setCategory] = useState({})
  const dispatch = useDispatch()
  const userInfo = useSelector(state => state.user.userInfo)
  const headers = { Authorization: 'Bearer ' + userInfo?.token }

  const saveCategory = async () => {
    if (!category.name) {
      setError('Please fill all the necessaary field')
      dispatch(
        showSnackBar({
          message: 'Please fill all the necessaary field',
          option: {
            variant: 'error'
          }
        })
      )
      return
    }
    try {
      dispatch(startLoading())

      const { data } = await axios.post('/api/category', category, {
        headers
      })

      setCategory({
        name: '',
        image: ''
      })
      
      dispatch(setCategories([...categories, data]))
      dispatch(finishLoading())
      dispatch(
        showSnackBar({
          message: 'New Category Created ',
          option: {
            variant: 'success'
          }
        })
      )
    } catch (error) {
      dispatch(finishLoading())
      dispatch(
        showSnackBar({
          message: 'Error While Creating Category !',
          option: {
            variant: 'error'
          }
        })
      )
    }
  }

  return (
    <span style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
      <input
        type='text'
        placeholder='Enter Category Name'
        value={category.name}
        onChange={e => setCategory({ ...category, name: e.target.value })}
      />
      <span
        style={{
          background: `${themeBg}`,
          color: `${buttonC}`,
          padding: '7px 8px',
          borderRadius: '5px'
        }}
        onClick={() => saveCategory()}
      >
        +
      </span>{' '}
    </span>
  )
}

export default AddCategory
