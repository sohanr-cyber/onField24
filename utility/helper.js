import BASE_URL from '@/config'
import { companyName, delivery_charge, seoData } from './const'
import mongoose from 'mongoose'
import crypto from 'crypto'
import t from './dict'

function generateTrackingNumber (length = 10) {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  let trackingNumber = ''

  for (let i = 0; i < length; i++) {
    trackingNumber += characters.charAt(
      Math.floor(Math.random() * charactersLength)
    )
  }

  return trackingNumber
}

function containsAdmin (url) {
  // Regular expression to check if the URL contains "/admin" anywhere in it
  var regex = /\/admin/i // The 'i' flag makes the regex case-insensitive

  // Test the URL against the regular expression
  return regex.test(url)
}

const getTime = timestamp => {
  const date = new Date(timestamp)

  const formattedDate = `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(
    date.getHours()
  ).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`

  return formattedDate
}

const calculateReadingTimeFromHTML = htmlString => {
  const wordsPerMinute = 200 // Average reading speed
  // Strip HTML tags and get plain text
  const plainText = htmlString.replace(/<\/?[^>]+(>|$)/g, '')
  // Split by spaces to get the word count
  const wordCount = plainText
    .split(/\s+/)
    .filter(word => word.length > 0).length
  // Calculate reading time
  const readingTime = Math.ceil(wordCount / wordsPerMinute)
  return readingTime
}

const generateArticleSeoData = article => {
  const { title, excerpt = title, slug, thumbnail, author } = article

  const articleSeoData = {
    title: title.substring(0, 60), // Ensure it's under 60 characters
    description: excerpt.substring(0, 160), // Ensure it's under 160 characters
    canonical: `${BASE_URL}/article/${slug}`,
    openGraph: {
      title: title,
      description: excerpt,
      url: `${BASE_URL}/article/${slug}`,
      images: [
        {
          url: thumbnail,
          width: 800,
          height: 600,
          alt: title
        }
      ],
      type: 'article',
      article: {
        published_time: new Date().toISOString(), // add publish time if available
        author: 'Author Name' // replace with actual author data
      }
    },
    twitter: {
      card: 'summary_large_image', // Ensures a large image is shown
      site: '@yourTwitterHandle', // Your Twitter account handle
      ...seoData.twitter // Include other twitter-specific metadata
    }
  }

  return articleSeoData
}
function chunkArray (array, chunkSize) {
  // Initialize an empty array to hold the chunks
  let result = []

  // Loop through the input array in steps of chunkSize
  for (let i = 0; i < array.length; i += chunkSize) {
    // Use the slice method to create a chunk and push it to the result array
    result.push(array.slice(i, i + chunkSize))
  }

  return result
}

function summarizeOrders (articles) {
  const summary = {
    total: 0,
    published: 0,
    draft: 0,
    views: 0,
    reads: 0
  }

  // Iterate through each order and sum up all the fields
  articles.forEach(article => {
    summary.total += article.total
    summary.published += article.published
    summary.draft += article.draft
    summary.views += article.views
    summary.reads += article.reads
  })

  return summary
}

function generateVerificationCode (length) {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let code = ''
  for (let i = 0; i < length; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return code
}

function verifyCode (enteredCode, generatedCode) {
  return enteredCode === generatedCode
}

function generateUniqueID (existingIDs) {
  let number
  do {
    // Generate a random 6-digit number
    number = Math.floor(100000 + Math.random() * 900000)
  } while (existingIDs.includes(number)) // Check if the number is already in use

  // Add the new ID to the existing list
  existingIDs.push(number)

  return number
}

const sortByMonth = data => {
  return data.sort((a, b) => new Date(a.month) - new Date(b.month))
}

function extractRGBA (rgbString, opacity = 1) {
  // Match the numbers inside the parentheses
  const result = rgbString.match(/\d+/g)

  if (result && result.length === 3) {
    // Parse the strings to integers
    const [r, g, b] = result.map(Number)
    // Return the values in rgba() format as a string
    return `rgba(${r}, ${g}, ${b}, ${opacity})`
  } else {
    // Return null if the format is incorrect
    return null
  }
}

function findCategoryById (categories, id) {
  if (!categories) {
    return
  }
  for (const category of categories) {
    if (category._id === id) {
      return category
    }
    if (category.children.length > 0) {
      const found = findCategoryById(category.children, id)
      if (found) {
        return found
      }
    }
  }
  return null // Return null if no category is found with the given ID
}

function convertToCamelCase (str) {
  return str
    .toLowerCase() // Convert the entire string to lowercase
    .split(' ') // Split the string into an array of words
    .join('_') // Join the words back together without spaces
    .replace(/[^\w]/g, '') // Remove any non-word characters (e.g., numbers, punctuation)
}

const dateDevider = days => {
  if (days >= 200) {
    return 30
  } else if (days >= 90) {
    return 7
  } else if (days >= 45) {
    return 3
  } else if (days >= 30) {
    return 2
  } else {
    return 1
  }
}

const readMinute = (duration, lang) => {
  if (!duration) {
    return
  } else if (duration > 1) {
    if (lang == 'en') return `${t(duration, lang)} Minutes Read`
    else if (lang == 'bn') return `${t(duration, lang)} মিনিট  `
  } else {
    if (lang == 'en') return `${t(duration, lang)} Minute Read`
    else if (lang == 'bn') return `${t(duration, lang)} মিনিট  `
  }
}

function convertToBanglaNumber (englishNumber, lang = 'en') {
  if (lang == 'en') {
    return englishNumber
  }
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯']

  // Convert the number to a string to work with each character
  return englishNumber
    .toString()
    .split('')
    .map(digit => (/\d/.test(digit) ? banglaDigits[digit] : digit)) // Check if the character is a digit
    .join('')
}

export {
  generateTrackingNumber,
  containsAdmin,
  getTime,
  generateArticleSeoData,
  generateUniqueID,
  generateVerificationCode,
  chunkArray,
  sortByMonth,
  extractRGBA,
  findCategoryById,
  convertToCamelCase,
  summarizeOrders,
  dateDevider,
  calculateReadingTimeFromHTML,
  readMinute,
  convertToBanglaNumber
}
