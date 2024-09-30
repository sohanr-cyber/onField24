import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    // User credentials
    email: {
      type: String,
      required: true,
      unique: true // Ensures unique email addresses
    },
    password: {
      type: String,
      required: true,
    },
    // User details
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    salt: {
      type: String
    },
    facebook: {
      type: String
    },
    photo: {
      type: String,
      default: 'https://cdn-icons-png.flaticon.com/128/4322/4322991.png'
    },
    whatsapp: { type: String },
    address: { type: String },
    role: {
      type: String,
      enum: [
        'admin',
        'editor',
        'journalist',
        'contributor',
        'moderator',
        'subscriber',
        'user'
      ],
      default: 'user'
    },
    // Additional information (optional)
    phone: { type: String },
    isVerified: { type: Boolean, default: false },
    verificationCode: { type: String },
    expirationTime: { type: Date }
  },

  { timestamps: true }
)

const User = mongoose.models.User || mongoose.model('User', userSchema)
export default User
