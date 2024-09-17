import React, { useMemo, useState } from 'react'
// import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import dynamic from 'next/dynamic'

const TextEditor = ({
  description,
  setDescriptionEn,
  setDescriptionBn,
  lang
}) => {
  const ReactQuill = useMemo(
    () => dynamic(() => import('react-quill'), { ssr: false }),
    []
  )

  const modules = {
    toolbar: [
      [{ header: '1' }, { header: '2' }, { font: [] }],
      [{ size: [] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [
        { list: 'ordered' },
        { list: 'bullet' },
        { indent: '-1' },
        { indent: '+1' }
      ],
      ['link', 'image', 'video'],
      ['clean']
    ]
  }

  const formats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
    'video'
  ]

  return (
    <ReactQuill
      theme='snow'
      value={description}
      onChange={lang == 'en' ? setDescriptionEn : setDescriptionBn}
      modules={modules}
      formats={formats}
      style={{
        width: '100%',
        background: 'aliceblue',
        borderRadius: '5px',
        overflow: 'hidden',
        border: 'none'
        // minHeight:"200px"
      }}
    />
  )
}

export default TextEditor
