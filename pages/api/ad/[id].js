import db from '@/database/connection'
import Article from '@/database/model/Article'
import nc from 'next-connect'
import {
  convertToCamelCase,
  dateDevider,
  deleteFileFromUrl,
  getTime
} from '@/utility/helper'
import { isAdmin, isAuth } from '@/utility'
import Ad from '@/database/model/Ad'
import { SUPPORTED_LANGUAGE } from '@/config'
import { storage } from '@/database/firebase'
import { ref, deleteObject } from 'firebase/storage'

const handler = nc()
// Helper function to extract file path from URL
function getFilePathFromUrl (mediaUrl) {
  const baseUrl = `https://firebasestorage.googleapis.com/v0/b/lms-926e5.appspot.com/o/`

  // Extract file path from URL by splitting it
  const decodedUrl = decodeURIComponent(
    mediaUrl.split(baseUrl)[1].split('?')[0]
  )
  console.log({ decodedUrl })

  return decodedUrl
}
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

    ad.clicks += 1
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

    // Find and delete the ad in one step
    const ad = await Ad.findByIdAndDelete(req.query.id)

    // If ad is not found, return a 404 response
    if (!ad) {
      return res.status(404).json({ message: 'Ad not found' })
    }

    // Prepare file deletion promises
    const fileDeletionPromises = []

    if (ad.image.en) {
      fileDeletionPromises.push(deleteFileFromUrl(ad.image.en))
    }
    if (ad.image.bn) {
      fileDeletionPromises.push(deleteFileFromUrl(ad.image.bn))
    }

    // Attempt to delete the associated files
    await Promise.all(fileDeletionPromises)

    // Respond with success message
    res
      .status(200)
      .json({ message: 'Ad and associated files deleted successfully' })
  } catch (error) {
    console.error('Error deleting ad:', error)

    // More detailed error response
    res.status(500).json({
      message: 'Error deleting ad',
      error: error.message || 'An unknown error occurred'
    })
  } finally {
    // Ensure database connection is closed after operation
    await db.disconnect()
  }
})

export default handler
