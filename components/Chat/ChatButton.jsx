import React from 'react'
import styles from '../../styles/Chat/ChatButton.module.css'
import Image from 'next/image'
import { messenger, whatsapp } from '@/utility/const'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import { handleContact } from '@/redux/pixelSlice'

const ChatButton = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const handleClick = () => {
    dispatch(handleContact({}))
    router.push(whatsapp)
  }
  return (
    <div className={styles.wrapper}>
      <Image
        src='https://cdn-icons-png.flaticon.com/128/733/733585.png'
        width={35}
        height={35}
        alt='chat button'
        onClick={() => handleClick()}
      />
    </div>
  )
}

export default ChatButton
