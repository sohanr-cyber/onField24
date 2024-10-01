import db from '@/database/connection'
import Article from '@/database/model/Article'
import nc from 'next-connect'
import { convertToCamelCase, dateDevider, getTime } from '@/utility/helper'
import { isAdmin, isAuth } from '@/utility'
import Ad from '@/database/model/Ad'
import { SUPPORTED_LANGUAGE } from '@/config'

const handler = nc()

// POST /api/ads
handler.post(async (req, res) => {
  try {
    let {
      title,
      description,
      image,
      targetUrl,
      targetText,
      advertiser,
      startDate,
      endDate,
      targetAudience,
      adType,
      isActive,
      location
    } = req.body


    const ad = new Ad({
      title,
      description,
      image,
      targetUrl,
      advertiser,
      startDate,
      endDate,
      targetAudience,
      adType,
      targetText,
      isActive,
      location
    })

    await ad.save()
    res.status(201).json({ message: 'Ad created successfully', ad })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error creating ad', error })
  }
})

// PUT /api/ads/:id
handler.put(async (req, res) => {
  try {
    const {
      title,
      description,
      image,
      targetUrl,
      advertiser,
      startDate,
      endDate,
      targetAudience,
      location
    } = req.body

    const updatedAd = await Ad.findByIdAndUpdate(
      req.filter.id,
      {
        title,
        description,
        image,
        targetUrl,
        link,
        advertiser,
        startDate,
        endDate,
        targetAudience,
        location
      },
      { new: true }
    )

    if (!updatedAd) {
      return res.status(404).json({ message: 'Ad not found' })
    }

    res.status(200).json({ message: 'Ad updated successfully', updatedAd })
  } catch (error) {
    res.status(500).json({ message: 'Error updating ad', error })
  }
})

// GET /api/ads
handler.get(async (req, res) => {
  try {
    const {
      search,
      lang = 'en',
      page = 1,
      limit = 10,
      sortBy,
      sortOrder,
      isActive,
      location
    } = req.query
    if (!SUPPORTED_LANGUAGE.includes(lang)) {
      return res.status(400).json({
        message: 'Invalid language. Supported languages are en and bn.'
      })
    }

    let filter = {}
    if (isActive) {
      filter.isActive = isActive === 'true'
    }

    if (location) {
      filter.location = { $regex: location, $options: 'i' }
    }

    console.log(filter)

    const skip = (page - 1) * limit

    // Search in both English and Bengali fields of title and content
    if (search) {
      filter.$or = [
        { 'title.en': { $regex: search, $options: 'i' } }, // Search in English title
        { 'title.bn': { $regex: search, $options: 'i' } } // Search in Bengali title
      ]
    }
    await db.connect()
    let ads = await Ad.find(filter)
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(Number(limit))

    if (sortBy && sortOrder) {
      console.log({ sortBy, sortOrder })
      if (sortOrder === 'desc') {
        ads = sortArrayByKey(ads, sortBy, 'desc')
      } else {
        ads = sortArrayByKey(ads, sortBy, 'asc')
      }
    }

    const localizedAds = ads.map(i => ({
      _id: i._id,
      title: i.title[lang],
      description: i.description[lang],
      image: i.image[lang] || i.image['en'],
      targetUrl: i.targetUrl,
      targetText: i.targetText[lang],
      startDate: i.startDate,
      endDate: i.endDate,
      adType: i.adType,
      clicks: i.clicks,
      impressions: i.impressions,
      location: i.location
    }))
    const totalAds = await Ad.countDocuments(filter)

    res.status(200).json({
      message: 'Ads retrieved successfully',
      page: Number(page),
      totalPages: Math.ceil(totalAds / limit),
      totalAds,
      ads: localizedAds
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error retrieving ads', error })
  }
})

export default handler
