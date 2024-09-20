const dict = {
  latest: {
    en: 'Latest News',
    bn: 'সর্বশেষ'
  },
  readMore: {
    en: 'Read More',
    bn: 'আরো পড়ুন'
  },
  mustRead: {
    en: 'Must Read',
    bn: 'গুরুত্বপুর্ন'
  },
  home: {
    en: 'Home',
    bn: 'হোম'
  },
  news: {
    en: 'News',
    bn: 'খবর'
  },
  seeAll: {
    en: 'See All',
    bn: 'আরো দেখুন'
  },
  privacyPolicy: {
    en: 'Privacy & Policy',
    bn: 'গোপনীয়তা নীতি'
  },
  termsAndCondition: {
    en: 'Terms And Condition',
    bn: 'শর্তাবালী ও নীতিমালা'
  },
  login: {
    en: 'Login',
    bn: 'লগইন'
  },
  register: {
    en: 'Register',
    bn: 'রেজিস্টার'
  },
  contact: {
    en: 'Contact',
    bn: 'যোগাযোগ'
  },
  link: {
    en: 'Links',
    bn: 'লিংক'
  },
  mail: {
    en: 'Mail',
    bn: 'মেইল'
  },
  phone: {
    en: 'Phone',
    bn: 'ফোন'
  },
  address: {
    en: 'Address',
    bn: ' ঠিকানা'
  },

  loginH: {
    en: 'Sign In To Your Account',
    bn: 'আপনার অ্যাকাউন্টে লগইন করুন'
  },
  registerH: {
    en: 'Create An Account',
    bn: 'আপনার অ্যাকাউন্ট খুলুন'
  },
  loginP: {
    en: 'Enter Your Email and Password to Sign In',
    bn: 'লগইন করার জন্য আপনার ইমেইল এবং পাসওয়ার্ড দিন'
  },
  enterEmail: {
    en: 'Enter Email',
    bn: 'ইমেইল লিখুন'
  },
  enterPassword: {
    en: 'Enter Password',
    bn: 'পাসওয়ার্ড লিখুন'
  },
  noAccount: {
    en: "Don't have an Account?",
    bn: 'অ্যাকাউন্ট নাই?'
  },
  forgetPassword: {
    en: 'Forget Password? ',
    bn: 'পাসওয়ার্ড ভুলে গেছেন? '
  },
  resetPassword: {
    en: 'Reset Password',
    bn: 'নতুন পাসওয়ার্ড সেট করুন'
  },
  signIn: {
    en: 'Sign In',
    bn: 'লগইন'
  },
  createAccount: {
    en: 'Create Account',
    bn: 'অ্যাকাউন্ট খুলুন'
  },
  haveAccount: {
    en: 'Already Have An Account?',
    bn: 'ইতিমধ্যে অ্যাকাউন্ট রয়েছে?'
  },
  signInHere: {
    en: 'Sign In Here!',
    bn: 'এখানে লগইন করুন'
  },
  enterPhone: {
    en: 'Enter Phone Number',
    bn: 'ফোন নাম্বার দিন'
  },
  enterFName: {
    en: 'Enter First Name',
    bn: 'নামের প্রথম অংশ লিখুন'
  },
  enterLName: {
    en: 'Enter Last Name',
    bn: 'নামের শেষ অংশ কিখুন'
  },
  addressDetails: {
    en: 'House 41(meena bazar, lift 4), Gareeb-e-Newaz Avenue Road, Rangpur',
    bn: 'বাড়ি 41 (মীনা বাজার, লিফট 4), গরিব-ই-নেওয়াজ এভিনিউ রোড, রংপুর'
  },
  'Best Match': {
    en: 'Relavant',
    bn: 'প্রাসঙ্গিক'
  },
  'Newest To Oldest': {
    en: 'Newest to Oldest',
    bn: 'নতুন থেকে পুরাতন'
  },
  'Oldest To Newest': {
    en: 'Oldest to Newest',
    bn: 'পুরানো থেকে নতুন'
  },
  resetH: {
    en: 'Reset Your Password',
    bn: 'পুনরায় পাসওয়ার্ড সেট করুন'
  },
  submit: {
    en: 'Submit',
    bn: 'সাবমিট'
  },
  enterVCode: {
    en: 'Enter Varification Code',
    bn: 'ভেরিফিকেশন কোড লিখুন'
  },
  enterNewPassword: {
    en: 'Enter New Password',
    bn: 'নতুন পাসওয়ার্ড লিখুন'
  },
  resetNewH: {
    en: 'Set New Password',
    bn: 'নতুন পাসওয়ার্ড সেট করুন'
  }
}

const t = (key, lang) => {
  return dict[key] ? dict[key][lang] : key
}

export default t
