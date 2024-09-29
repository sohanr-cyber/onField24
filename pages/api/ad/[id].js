import db from '@/database/connection'
import Article from '@/database/model/Article'
import nc from 'next-connect'
import { convertToCamelCase, dateDevider, getTime } from '@/utility/helper'
import { isAdmin, isAuth } from '@/utility'
import Ad from '@/database/model/Ad'
import { SUPPORTED_LANGUAGE } from '@/config'

const handler = nc()

// PUT /api/ads/:id
handler.put(async (req, res) => {
  try {
    const {
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
    await db.connect()
    const updatedAd = await Ad.findByIdAndUpdate(
      req.query.id,
      {
        title,
        description,
        image,
        targetUrl,
        targetText,
        adType,
        advertiser,
        startDate,
        endDate,
        targetAudience,
        isActive,
        location
      },
      { new: true }
    )

    if (!updatedAd) {
      return res.status(404).json({ message: 'Ad not found' })
    }

    res.status(200).json({ message: 'Ad updated successfully', updatedAd })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error updating ad', error })
  }
})

// POST /api/ads/:id/click
handler.patch(async (req, res) => {
  try {
    await db.connect()
    const ad = await Ad.findById(req.query.id)

    if (!ad) {
      return res.status(404).json({ message: 'Ad not found' })
    }

    ad.clickCount += 1
    await ad.save()

    res
      .status(200)
      .json({ message: 'Ad click tracked', clickCount: ad.clickCount })
  } catch (error) {
    res.status(500).json({ message: 'Error tracking ad click', error })
  }
})

// GET /api/ads/:id
handler.get(async (req, res) => {
  try {
    const ad = await Ad.findById(req.query.id)

    if (!ad) {
      return res.status(404).json({ message: 'Ad not found' })
    }

    res.status(200).json(ad)
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving ad', error })
  }
})

// DELETE /api/ads/:id
handler.delete(async (req, res) => {
  try {
    await db.connect()
    const ad = await Ad.findByIdAndDelete(req.query.id)

    if (!ad) {
      return res.status(404).json({ message: 'Ad not found' })
    }

    res.status(200).json({ message: 'Ad deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Error deleting ad', error })
  }
})

export default handler
