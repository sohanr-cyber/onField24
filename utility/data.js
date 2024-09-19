const newsPortalName = 'onField360'

const termsAndConditions = [
  {
    section: 1,
    title: {
      en: 'General Terms',
      bn: 'সাধারণ শর্তাবলী'
    },
    content: {
      en: `By using ${newsPortalName}, you agree to comply with all terms outlined here. Our content is for informational purposes, and we strive to ensure its accuracy.`,
      bn: `${newsPortalName} ব্যবহার করার মাধ্যমে, আপনি এখানে বর্ণিত সকল শর্তাবলী মেনে চলার সম্মতি প্রদান করছেন। আমাদের কন্টেন্ট শুধুমাত্র তথ্যের জন্য এবং এর সঠিকতা নিশ্চিত করার জন্য আমরা প্রচেষ্টা করি।`
    }
  },
  {
    section: 2,
    title: {
      en: 'Intellectual Property',
      bn: 'বৌদ্ধিক সম্পত্তি'
    },
    content: {
      en: `All materials, including text, images, and graphics, are the intellectual property of ${newsPortalName}. Unauthorized use or reproduction is strictly prohibited.`,
      bn: `${newsPortalName}-এর সকল উপকরণ, যার মধ্যে পাঠ্য, ছবি, এবং গ্রাফিক্স অন্তর্ভুক্ত, বৌদ্ধিক সম্পত্তি হিসেবে বিবেচিত হয়। অনুমতি ছাড়া ব্যবহার বা পুনরুৎপাদন কঠোরভাবে নিষিদ্ধ।`
    }
  },
  {
    section: 3,
    title: {
      en: 'User Accounts and Registration',
      bn: 'ব্যবহারকারীর অ্যাকাউন্ট এবং নিবন্ধন'
    },
    content: {
      en: `Users may register an account to comment on articles or subscribe to newsletters on ${newsPortalName}. Accurate and up-to-date information must be provided during registration.`,
      bn: `${newsPortalName}-এ নিবন্ধন করতে হবে মন্তব্য করার বা নিউজলেটার সাবস্ক্রাইব করার জন্য। নিবন্ধনের সময় সঠিক এবং হালনাগাদ তথ্য প্রদান করতে হবে।`
    }
  },
  {
    section: 4,
    title: {
      en: 'Comment Policy',
      bn: 'মন্তব্যের নীতিমালা'
    },
    content: {
      en: `We encourage constructive discussions on ${newsPortalName}. However, offensive language, personal attacks, or misinformation will not be tolerated, and we reserve the right to remove inappropriate comments.`,
      bn: `${newsPortalName}-এ আমরা গঠনমূলক আলোচনা উৎসাহিত করি। তবে, অশ্লীল ভাষা, ব্যক্তিগত আক্রমণ, বা ভুল তথ্য সহ্য করা হবে না এবং আমরা অনুপযুক্ত মন্তব্য মুছে ফেলার অধিকার রাখি।`
    }
  },
  {
    section: 5,
    title: {
      en: 'Privacy Policy',
      bn: 'গোপনীয়তা নীতিমালা'
    },
    content: {
      en: `Your personal data is collected and used in accordance with ${newsPortalName}'s Privacy Policy, which can be accessed at [Privacy Policy URL].`,
      bn: `আপনার ব্যক্তিগত তথ্য ${newsPortalName} এর গোপনীয়তা নীতিমালা অনুযায়ী সংগ্রহ করা এবং ব্যবহার করা হয়, যা [Privacy Policy URL] এ পাওয়া যাবে।`
    }
  },
  {
    section: 6,
    title: {
      en: 'Limitation of Liability',
      bn: 'দায়িত্বের সীমাবদ্ধতা'
    },
    content: {
      en: `${newsPortalName} shall not be held liable for any inaccuracies or delays in news content. Use of the website is at your own risk.`,
      bn: `${newsPortalName} সংবাদ সামগ্রীর কোনো ভুল বা বিলম্বের জন্য দায়ী নয়। ওয়েবসাইটটির ব্যবহার আপনার নিজের ঝুঁকিতে।`
    }
  },
  {
    section: 7,
    title: {
      en: 'Amendments to Terms',
      bn: 'শর্তাবলীর সংশোধন'
    },
    content: {
      en: `${newsPortalName} reserves the right to update these terms at any time. Changes will be posted on this page and are effective immediately.`,
      bn: `${newsPortalName} যে কোনো সময় এই শর্তাবলী পরিবর্তন করার অধিকার রাখে। পরিবর্তনগুলি এই পৃষ্ঠায় পোস্ট করা হবে এবং সাথে সাথে কার্যকর হবে।`
    }
  },
  {
    section: 8,
    title: {
      en: 'Governing Law',
      bn: 'প্রযোজ্য আইন'
    },
    content: {
      en: `These terms and conditions are governed by the laws of [Country/State], and any disputes will be resolved in the courts of that jurisdiction.`,
      bn: `এই শর্তাবলী [Country/State] এর আইন অনুযায়ী পরিচালিত হয় এবং কোনো বিতর্ক সেই বিচারক্ষেত্রের আদালতে নিষ্পত্তি করা হবে।`
    }
  },
  {
    section: 9,
    title: {
      en: 'Contact Us',
      bn: 'আমাদের সাথে যোগাযোগ করুন'
    },
    content: {
      en: `If you have any questions, please contact us at [Contact Email or Phone].`,
      bn: `যদি আপনার কোন প্রশ্ন থাকে, আমাদের সাথে [Contact Email বা ফোন নম্বর] এ যোগাযোগ করুন।`
    }
  }
]


const companyName = 'OnField360'
const contactEmail = "OnField360@gmail.com"
const contactPhone = "+882501-923-233"
const privacyPolicy = [
  {
    section: 1,
    title: {
      en: 'Introduction',
      bn: 'ভূমিকা'
    },
    content: {
      en: `We at ${companyName} are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information when you use our website.`,
      bn: `আমরা, ${companyName}, আপনার গোপনীয়তা রক্ষায় প্রতিশ্রুতিবদ্ধ। এই গোপনীয়তা নীতি আমাদের ওয়েবসাইট ব্যবহারের সময় আপনার ব্যক্তিগত তথ্য কীভাবে সংগ্রহ, ব্যবহার এবং সুরক্ষিত করা হয় তা ব্যাখ্যা করে।`
    }
  },
  {
    section: 2,
    title: {
      en: 'Information We Collect',
      bn: 'আমরা যে তথ্য সংগ্রহ করি'
    },
    content: {
      en: `We may collect personal information such as your name, email address, shipping address, payment details, and other relevant information needed for processing orders or providing services. We also collect non-personal information such as browser type, IP address, and cookies to improve user experience.`,
      bn: `আমরা আপনার নাম, ইমেইল ঠিকানা, শিপিং ঠিকানা, পেমেন্টের বিবরণ এবং অন্যান্য প্রাসঙ্গিক তথ্য সংগ্রহ করতে পারি যা অর্ডার প্রক্রিয়াকরণের জন্য প্রয়োজন। এছাড়াও, আমরা ব্রাউজারের ধরন, আইপি ঠিকানা এবং কুকিজের মতো অ-ব্যক্তিগত তথ্য সংগ্রহ করি যা ব্যবহারকারীর অভিজ্ঞতা উন্নত করতে সহায়ক।`
    }
  },
  {
    section: 3,
    title: {
      en: 'How We Use Your Information',
      bn: 'আমরা আপনার তথ্য কীভাবে ব্যবহার করি'
    },
    content: {
      en: `We use the information we collect to process transactions, provide customer support, improve our services, and send promotional communications.`,
      bn: `আমরা যে তথ্য সংগ্রহ করি তা লেনদেন প্রক্রিয়াকরণ, গ্রাহক সহায়তা প্রদান, আমাদের সেবা উন্নত করা এবং প্রচারমূলক যোগাযোগ পাঠানোর জন্য ব্যবহার করা হয়।`
    }
  },
  {
    section: 4,
    title: {
      en: 'Sharing Your Information',
      bn: 'আপনার তথ্য শেয়ার করা'
    },
    content: {
      en: `We do not share your personal information with third parties, except for essential services like payment processing, order fulfillment, and as required by law.`,
      bn: `${companyName} আপনার ব্যক্তিগত তথ্য তৃতীয় পক্ষের সাথে শেয়ার করে না, শুধুমাত্র অর্থপ্রদানের প্রক্রিয়াকরণ, অর্ডার পূরণ এবং আইন অনুযায়ী প্রয়োজনীয় সেবাগুলি ব্যতীত।`
    }
  },
  {
    section: 5,
    title: {
      en: 'Cookies',
      bn: 'কুকিজ'
    },
    content: {
      en: `Our website uses cookies to collect data about browsing behavior to improve site performance.`,
      bn: `আমাদের ওয়েবসাইট কুকিজ ব্যবহার করে ব্রাউজিং আচরণের তথ্য সংগ্রহ করতে যা সাইটের কর্মক্ষমতা উন্নত করতে সাহায্য করে।`
    }
  },
  {
    section: 6,
    title: {
      en: 'Data Security',
      bn: 'তথ্য সুরক্ষা'
    },
    content: {
      en: `We implement security measures to protect your personal information from unauthorized access, loss, misuse, or alteration.`,
      bn: `${companyName} আপনার ব্যক্তিগত তথ্য অননুমোদিত অ্যাক্সেস, ক্ষতি, অপব্যবহার বা পরিবর্তন থেকে রক্ষা করার জন্য নিরাপত্তা ব্যবস্থা বাস্তবায়ন করে।`
    }
  },
  {
    section: 7,
    title: {
      en: 'Your Rights',
      bn: 'আপনার অধিকার'
    },
    content: {
      en: `You have the right to access, modify, or delete your personal information. If you would like to review or update your information, please contact us at ${contactEmail}.`,
      bn: `আপনার ব্যক্তিগত তথ্য অ্যাক্সেস, পরিবর্তন বা মুছে ফেলার অধিকার রয়েছে। আপনি যদি আপনার তথ্য পর্যালোচনা বা আপডেট করতে চান, অনুগ্রহ করে ${contactEmail}-এ আমাদের সাথে যোগাযোগ করুন।`
    }
  },
  {
    section: 8,
    title: {
      en: 'Children’s Privacy',
      bn: 'শিশুদের গোপনীয়তা'
    },
    content: {
      en: `Our website is not intended for children under the age of 13, and we do not knowingly collect personal information from children.`,
      bn: `${companyName} ওয়েবসাইটটি ১৩ বছরের কম বয়সী শিশুদের জন্য নয় এবং আমরা সচেতনভাবে তাদের কাছ থেকে ব্যক্তিগত তথ্য সংগ্রহ করি না।`
    }
  },
  {
    section: 9,
    title: {
      en: 'Changes to the Privacy Policy',
      bn: 'গোপনীয়তা নীতির পরিবর্তন'
    },
    content: {
      en: `We reserve the right to modify this Privacy Policy at any time. Any changes will be posted on this page and will take effect immediately.`,
      bn: `${companyName} যে কোনও সময়ে এই গোপনীয়তা নীতি পরিবর্তন করার অধিকার সংরক্ষণ করে। কোনও পরিবর্তন হলে, তা এই পৃষ্ঠায় পোস্ট করা হবে এবং অবিলম্বে কার্যকর হবে।`
    }
  },
  {
    section: 10,
    title: {
      en: 'Contact Us',
      bn: 'যোগাযোগ করুন'
    },
    content: {
      en: `If you have any questions about this Privacy Policy, please contact us at ${contactEmail} or ${contactPhone}.`,
      bn: `এই গোপনীয়তা নীতি সম্পর্কে আপনার কোনও প্রশ্ন থাকলে, অনুগ্রহ করে ${contactEmail} অথবা ${contactPhone}-এ আমাদের সাথে যোগাযোগ করুন।`
    }
  }
];

export { termsAndConditions, privacyPolicy }
