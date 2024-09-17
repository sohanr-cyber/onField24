import BASE_URL from '@/config'
import { companyName, delivery_charge, seoData } from './const'
import mongoose from 'mongoose'
import crypto from 'crypto'

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

const calculateSubtotal = cartItems => {
  let subtotal = 0
  cartItems?.forEach(item => {
    subtotal +=
      (item.product?.price -
        item.product?.price * (item.product?.discount / 100)) *
      item.quantity
  })
  return subtotal
}

const getPrice = (price, discount = 0) => {
  price = price - price * (discount / 100)
  return Math.floor(price).toFixed(2)
}

const getDeliveryCharge = position => {
  return delivery_charge[position] ? delivery_charge[position] : 100
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

const generateProductSeoData = productData => {
  const {
    name,
    metaDescription: description,
    slug,
    thumbnail: imageUrl
  } = productData

  const productSeoData = {
    title: `${companyName} - ${name}`,
    description: description,
    canonical: `${BASE_URL}/products/${slug}`,
    openGraph: {
      title: `Quince Cloth - ${name}`,
      description: description,
      url: `${BASE_URL}/products/${slug}`,
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 600,
          alt: name
        }
      ],
      type: 'product'
    },
    twitter: seoData.twitter
  }

  return productSeoData
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

function summarizeOrders (orders) {
  const summary = {
    total: 0,
    totalAmount: 0,
    pending: 0,
    pendingAmount: 0,
    failed: 0,
    failedAmount: 0,
    canceled: 0,
    canceledAmount: 0,
    delivering: 0,
    deliveringAmount: 0,
    delivered: 0,
    deliveredAmount: 0,
    confirmed: 0,
    confirmedAmount: 0,
    failedAndCanceled: 0,
    failedAndCanceledAmount: 0
  }

  // Iterate through each order and sum up all the fields
  orders.forEach(order => {
    summary.total += order.total
    summary.totalAmount += order.totalAmount
    summary.pending += order.pending
    summary.pendingAmount += order.pendingAmount
    summary.failed += order.failed
    summary.failedAmount += order.failedAmount
    summary.canceled += order.canceled
    summary.canceledAmount += order.canceledAmount
    summary.delivering += order.delivering
    summary.deliveringAmount += order.deliveringAmount
    summary.delivered += order.delivered
    summary.deliveredAmount += order.deliveredAmount
    summary.confirmed += order.confirmed
    summary.confirmedAmount += order.confirmedAmount
    summary.failedAndCanceled += order.failedAndCanceled
    summary.failedAndCanceledAmount += order.failedAndCanceledAmount
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

function orderToGraph (inputData) {
  const result = []

  for (const [date, values] of Object.entries(inputData)) {
    const total = values.total || 0
    const pending = (values.pending || 0) + (values.Pending || 0)
    const processing = values.Processing || 0
    const canceled = values.Canceled || 0
    const failed = values.Failed || 0
    const delivered = values.Delivered || 0
    const packing = values.Packing || 0

    result.push({
      date: date,
      total: total,
      pending: pending,
      processing: processing,
      canceled: canceled,
      failed: failed,
      delivered: delivered,
      packing: packing,
      red: failed + canceled
    })
  }
  return result
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

const getTotalProfit = arr => {
  let total = 0
  arr.forEach(i => {
    total += i.revenue
  })
  return total.toFixed(0)
}

function findCategoryById (categories, id) {
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

function generateTransactionId (orderId) {
  const timestamp = Date.now().toString() // Current timestamp
  const randomString = crypto.randomBytes(4).toString('hex') // Random string of 8 characters
  const orderIdString = orderId.toString() // Convert order ID to string

  // Combine the order ID, timestamp, and random string to create a unique transaction ID
  const transactionId = `${orderIdString}-${timestamp}-${randomString}`

  return transactionId
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

const readMinute = duration => {
  if (!duration) {
    return
  } else if (duration > 1) {
    return `${duration} Minutes Read`
  } else {
    return `${duration} Minute Read`
  }
}
export {
  generateTrackingNumber,
  containsAdmin,
  calculateSubtotal,
  getPrice,
  getDeliveryCharge,
  getTime,
  generateProductSeoData,
  generateUniqueID,
  generateVerificationCode,
  chunkArray,
  orderToGraph,
  getTotalProfit,
  sortByMonth,
  extractRGBA,
  findCategoryById,
  generateTransactionId,
  convertToCamelCase,
  summarizeOrders,
  dateDevider,
  calculateReadingTimeFromHTML,
  readMinute
}
