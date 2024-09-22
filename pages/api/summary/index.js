import db from '@/database/connection'
import Article from '@/database/model/Article'
import nc from 'next-connect'
import { convertToCamelCase, dateDevider, getTime } from '@/utility/helper'
import { isAdmin, isAuth } from '@/utility'

const handler = nc()

function getSummary (data, date) {
  let total = 0
  let published = 0
  let draft = 0
  let views = 0
  let reads = 0

  data.forEach(i => {
    total += 1
    views += i.views
    reads += i.reads
    if (i.status === 'published') {
      published += 1
    }
    if (i.status === 'draft') {
      draft += 1
    }
  })

  return {
    date,
    total,
    published,
    draft,
    views,
    reads
  }
}

handler.get(async (req, res) => {
  let { period, startDate, endDate } = req.query
  period = period && convertToCamelCase(period)
  let dateFilter = {}

  const now = new Date()

  // Handle different period cases
  if (period === 'last_3_days') {
    dateFilter = {
      publishedAt: { $gte: new Date(now.setDate(now.getDate() - 3)) }
    }
  } else if (period === 'last_7_days') {
    dateFilter = {
      publishedAt: { $gte: new Date(now.setDate(now.getDate() - 7)) }
    }
  } else if (period === 'last_month') {
    const startOfMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    dateFilter = { publishedAt: { $gte: startOfMonth, $lt: endOfMonth } }
  } else if (period == 'custom' && startDate && endDate) {
    dateFilter = {
      publishedAt: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }
  }

  try {
    await db.connect()

    let articles = await Article.find(dateFilter, {
      content: 0,
      excerpt: 0
    }).sort({ publishedAt: 1 })

    if (articles.length == 0) {
      return res.status(200).json([])
    }

    // console.log(articles)
    let startDate = new Date(articles[0].publishedAt)

    startDate.setUTCHours(0, 0, 0, 0)

    let endDate = new Date(articles[articles.length - 1].publishedAt)
    endDate.setUTCHours(0, 0, 0, 0)

    // Calculate the difference in time (milliseconds)
    let timeDiff = endDate - startDate

    // Convert the time difference to days
    let daysDiff = timeDiff / (1000 * 60 * 60 * 24)
    let diff = dateDevider(daysDiff)

    console.log(`Number of days between startDate and endDate: ${daysDiff}`)

    let dateList = []
    let currentDay = new Date(startDate)

    while (currentDay <= endDate) {
      dateList.push(new Date(currentDay)) // Push a copy of currentDay
      currentDay.setUTCDate(currentDay.getUTCDate() + diff) // Move to next day
    }
    let newArticles = []

    console.log({ dateList })

    dateList.forEach((date, index) => {
      if (index + 1 < dateList.length) {
        const startOfDay = dateList[index]
        const endOfDay = new Date(dateList[index + 1]) // Create a new Date object for the next day

        newArticles.push(
          getSummary(
            articles.filter(
              e => e.publishedAt >= startOfDay && e.publishedAt < endOfDay
            ),
            getTime(startOfDay).split(' ')[0]
          )
        )
      }
    })

    // Handle the last date separately
    const lastDate = dateList[dateList.length - 1]
    newArticles.push(
      getSummary(
        articles.filter(e => e.publishedAt >= lastDate),
        getTime(lastDate).split(' ')[0]
      )
    )

    return res.status(200).json(newArticles)
  } catch (error) {
    console.log(error)
    res.status(400).send({ message: 'internal error' })
  }
})

export default handler
