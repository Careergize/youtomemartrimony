export interface Education {
  degree: string;
  college: string;
  field: string;
}

export interface Occupation {
  title: string;
  companySector: 'Technology' | 'Healthcare' | 'Finance' | 'Creative & Design' | 'Engineering' | 'Civil Services' | 'Business & Entrepreneurship';
  employer: string;
  annualIncome: string; // e.g. "₹25 - 35 Lakhs" or "$140,000"
  incomeBracket: '10-20L' | '20-35L' | '35-50L' | '50L+';
}

export interface FamilyDetails {
  type: 'Nuclear' | 'Joint';
  fatherOccupation: string;
  motherOccupation: string;
  siblings: string;
  nativePlace: string;
  values: 'Liberal & Cultured' | 'Moderate & Traditional' | 'Progressive' | 'Orthodox';
  affluenceLevel: 'Upper Middle Class' | 'High Net Worth' | 'Affluent / Business';
}

export interface HoroscopeDetails {
  nakshatra: string;
  rasi: string;
  manglik: 'Non-Manglik' | 'Manglik' | 'Anshik / Partial' | 'Doesn\'t Matter';
  birthTime: string;
  birthPlace: string;
  horoscopeMatchScore?: number;
}

export interface VerificationDetails {
  isVerified: boolean;
  idVerified: boolean;
  mobileVerified: boolean;
  workVerified: boolean;
  badgeText: string;
}

export interface PartnerPreferences {
  ageRange: [number, number];
  heightRange: [number, number]; // in inches (e.g. 60 = 5'0", 72 = 6'0")
  maritalStatus: ('Never Married' | 'Divorced' | 'Awaiting Divorce')[];
  religion: string[];
  motherTongue: string[];
  education: string[];
  occupationSectors: string[];
  preferredLocations: string[];
  diet: string[];
  manglikPreference: string;
}

export interface MatrimonialProfile {
  mobile?: string;
  id: string;
  name: string;
  gender: 'Bride' | 'Groom';
  age: number;
  height: string; // e.g. "5' 7\" (170 cm)"
  heightInches: number; // for filtering
  maritalStatus: 'Never Married' | 'Divorced' | 'Awaiting Divorce';
  religion: 'Hindu' | 'Muslim' | 'Christian' | 'Sikh' | 'Jain';
  community: string;
  subCaste?: string;
  motherTongue: 'Malayalam' | 'Tamil' | 'Hindi' | 'Telugu' | 'Kannada' | 'Bengali' | 'Marathi' | 'English';
  city: string;
  state: string;
  country: string;
  diet: 'Vegetarian' | 'Non-Vegetarian' | 'Eggetarian' | 'Vegan';
  smoke: 'No' | 'Occasionally' | 'Never';
  drink: 'No' | 'Socially' | 'Never';
  bio: string;
  hobbies: string[];
  values: string[];
  languagesSpoken: string[];
  education: Education;
  occupation: Occupation;
  family: FamilyDetails;
  horoscope: HoroscopeDetails;
  verification: VerificationDetails;
  partnerPreferences: PartnerPreferences;
  compatibilityScore: number;
  tags: string[];
  photos: string[];
  isShortlisted?: boolean;
  interestStatus?: 'none' | 'sent' | 'received' | 'accepted' | 'declined';
  lastActive: string;
  isOnline: boolean;
}

export const CURRENT_USER: MatrimonialProfile = {
  id: 'usr_me',
  name: 'Devika Krishnan',
  gender: 'Bride',
  age: 27,
  height: "5' 5\" (165 cm)",
  heightInches: 65,
  maritalStatus: 'Never Married',
  religion: 'Hindu',
  community: 'Nair',
  subCaste: 'Menon',
  motherTongue: 'Malayalam',
  city: 'Bengaluru',
  state: 'Karnataka',
  country: 'India',
  diet: 'Vegetarian',
  smoke: 'Never',
  drink: 'Socially',
  bio: 'Product Designer at a leading fintech. Passionate about art history, filter coffee, weekend pottery, and long conversations about design systems and indie movies. Looking for an empathetic partner with progressive family values.',
  hobbies: ['Ceramics & Pottery', 'Filter Coffee Brewing', 'Classical Carnatic Flute', 'Trekking in Western Ghats'],
  values: ['Intellectual Curiosity', 'Kindness & Empathy', 'Work-Life Equilibrium', 'Respect for Heritage'],
  languagesSpoken: ['Malayalam', 'English', 'Hindi', 'Tamil'],
  education: {
    degree: 'Master of Design (M.Des)',
    college: 'National Institute of Design (NID)',
    field: 'Interaction & Strategic Design'
  },
  occupation: {
    title: 'Lead Product Designer',
    companySector: 'Creative & Design',
    employer: 'Fintech Unicorn, Indiranagar',
    annualIncome: '₹28 - 32 Lakhs',
    incomeBracket: '20-35L'
  },
  family: {
    type: 'Nuclear',
    fatherOccupation: 'Retired Chief Engineer, CPWD',
    motherOccupation: 'Professor of Literature (Retd)',
    siblings: '1 Elder Brother (AI Scientist in Zurich)',
    nativePlace: 'Thrissur / Kochi, Kerala',
    values: 'Liberal & Cultured',
    affluenceLevel: 'Upper Middle Class'
  },
  horoscope: {
    nakshatra: 'Rohini',
    rasi: 'Vrishabha (Taurus)',
    manglik: 'Non-Manglik',
    birthTime: '07:22 AM',
    birthPlace: 'Kochi, Kerala',
    horoscopeMatchScore: 32
  },
  verification: {
    isVerified: true,
    idVerified: true,
    mobileVerified: true,
    workVerified: true,
    badgeText: 'Elite Verified'
  },
  partnerPreferences: {
    ageRange: [27, 33],
    heightRange: [67, 74],
    maritalStatus: ['Never Married'],
    religion: ['Hindu'],
    motherTongue: ['Malayalam', 'Tamil', 'English'],
    education: ['B.Tech', 'M.Tech', 'MBA', 'MS', 'M.Des'],
    occupationSectors: ['Technology', 'Engineering', 'Creative & Design', 'Healthcare', 'Finance'],
    preferredLocations: ['Bengaluru', 'Kochi', 'Chennai', 'Mumbai', 'Singapore'],
    diet: ['Vegetarian', 'Eggetarian'],
    manglikPreference: 'Doesn\'t Matter'
  },
  compatibilityScore: 100,
  tags: ['M.Des (NID)', 'Product Design Lead', 'Carnatic Flute', 'Bengaluru'],
  photos: [
    '/profiles/user_ananya.jpg'
  ],
  interestStatus: 'none',
  lastActive: 'Online now',
  isOnline: true
};

export const MOCK_PROFILES: MatrimonialProfile[] = [
  {
    id: 'prof-01',
    name: 'Dr. Siddharth Menon',
    gender: 'Groom',
    age: 29,
    height: "5' 11\" (180 cm)",
    heightInches: 71,
    maritalStatus: 'Never Married',
    religion: 'Hindu',
    community: 'Nair',
    subCaste: 'Kurup',
    motherTongue: 'Malayalam',
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    diet: 'Vegetarian',
    smoke: 'Never',
    drink: 'Socially',
    bio: 'Senior Interventional Cardiologist with a passion for humanitarian medicine and weekend acoustic guitar. Raised in a loving, intellectual family. Believer in mutual respect, equal partnership, and exploring cozy mountain cafes.',
    hobbies: ['Acoustic Guitar', 'Badminton', 'Trekking', 'Specialty Coffee'],
    values: ['Compassion', 'Work-Life Harmony', 'Intellectual Conversations', 'Family Grounding'],
    languagesSpoken: ['Malayalam', 'English', 'Hindi', 'Kannada'],
    education: {
      degree: 'MD, DM Cardiology',
      college: 'AIIMS New Delhi / NIMHANS',
      field: 'Cardiovascular Science'
    },
    occupation: {
      title: 'Consultant Cardiologist',
      companySector: 'Healthcare',
      employer: 'Manipal Hospitals, Whitefield',
      annualIncome: '₹42 - 50 Lakhs',
      incomeBracket: '35-50L'
    },
    family: {
      type: 'Nuclear',
      fatherOccupation: 'Senior Advocate, High Court of Kerala',
      motherOccupation: 'Principal, Higher Secondary School (Retd)',
      siblings: '1 Younger Sister (Architect, Singapore)',
      nativePlace: 'Kozhikode, Kerala',
      values: 'Liberal & Cultured',
      affluenceLevel: 'Upper Middle Class'
    },
    horoscope: {
      nakshatra: 'Makha (Magha)',
      rasi: 'Simha (Leo)',
      manglik: 'Non-Manglik',
      birthTime: '06:45 AM',
      birthPlace: 'Kozhikode, Kerala',
      horoscopeMatchScore: 33
    },
    verification: {
      isVerified: true,
      idVerified: true,
      mobileVerified: true,
      workVerified: true,
      badgeText: 'Govt ID & Medical Council Verified'
    },
    partnerPreferences: {
      ageRange: [25, 30],
      heightRange: [63, 69],
      maritalStatus: ['Never Married'],
      religion: ['Hindu'],
      motherTongue: ['Malayalam', 'Tamil', 'English'],
      education: ['MBBS', 'MD', 'B.Tech', 'MBA', 'M.Des'],
      occupationSectors: ['Healthcare', 'Technology', 'Creative & Design', 'Civil Services'],
      preferredLocations: ['Bengaluru', 'Kochi', 'Chennai'],
      diet: ['Vegetarian', 'Eggetarian'],
      manglikPreference: 'Non-Manglik or Doesn\'t Matter'
    },
    compatibilityScore: 96,
    tags: ['Doctor (DM)', 'AIIMS Alum', 'Non-Smoker', 'Vegetarian', 'Bengaluru'],
    photos: [
      '/profiles/prof_01_siddharth.jpg'
    ],
    isShortlisted: true,
    interestStatus: 'none',
    lastActive: 'Online now',
    isOnline: true
  },
  {
    id: 'prof-02',
    name: 'Ananya Deshmukh',
    gender: 'Bride',
    age: 27,
    height: "5' 6\" (168 cm)",
    heightInches: 66,
    maritalStatus: 'Never Married',
    religion: 'Hindu',
    community: 'Maratha',
    motherTongue: 'Marathi',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    diet: 'Vegetarian',
    smoke: 'Never',
    drink: 'Never',
    bio: 'Senior Experience Design Lead at a global design consultancy. A student of Kathak, architecture enthusiast, and book collector. Seeking a cheerful, ambitious soulmate who enjoys thoughtful museum visits and spontaneous road trips.',
    hobbies: ['Classical Kathak', 'Architectural Sketching', 'Baking', 'Philosophy'],
    values: ['Empathy', 'Creative Ambition', 'Respect for Elders', 'Elegance'],
    languagesSpoken: ['Marathi', 'Hindi', 'English', 'French'],
    education: {
      degree: 'Master of Fine Arts & Interaction',
      college: 'IDC School of Design, IIT Bombay',
      field: 'Industrial Design & Human Factors'
    },
    occupation: {
      title: 'Staff UX Architect',
      companySector: 'Creative & Design',
      employer: 'Global Innovation Studio, Bandra',
      annualIncome: '₹34 - 38 Lakhs',
      incomeBracket: '20-35L'
    },
    family: {
      type: 'Nuclear',
      fatherOccupation: 'Executive Director, Public Sector Enterprise',
      motherOccupation: 'Botanist & College Lecturer',
      siblings: 'None (Only child)',
      nativePlace: 'Pune, Maharashtra',
      values: 'Progressive',
      affluenceLevel: 'Upper Middle Class'
    },
    horoscope: {
      nakshatra: 'Rohini',
      rasi: 'Vrishabha (Taurus)',
      manglik: 'Non-Manglik',
      birthTime: '11:15 AM',
      birthPlace: 'Pune, Maharashtra',
      horoscopeMatchScore: 31
    },
    verification: {
      isVerified: true,
      idVerified: true,
      mobileVerified: true,
      workVerified: true,
      badgeText: 'Elite Verified'
    },
    partnerPreferences: {
      ageRange: [27, 33],
      heightRange: [68, 74],
      maritalStatus: ['Never Married'],
      religion: ['Hindu', 'Jain'],
      motherTongue: ['Marathi', 'Hindi', 'English', 'Gujarati'],
      education: ['B.Tech', 'MBA', 'MS', 'M.Des'],
      occupationSectors: ['Technology', 'Creative & Design', 'Finance', 'Engineering'],
      preferredLocations: ['Mumbai', 'Pune', 'Bengaluru', 'London'],
      diet: ['Vegetarian'],
      manglikPreference: 'Doesn\'t Matter'
    },
    compatibilityScore: 94,
    tags: ['IIT Bombay Alum', 'UX Architect', 'Classical Dancer', 'Vegetarian'],
    photos: [
      '/profiles/prof_02_ananya.jpg'
    ],
    isShortlisted: false,
    interestStatus: 'none',
    lastActive: 'Active 15m ago',
    isOnline: true
  },
  {
    id: 'prof-03',
    name: 'Arjun Venkatesh',
    gender: 'Groom',
    age: 30,
    height: "6' 0\" (183 cm)",
    heightInches: 72,
    maritalStatus: 'Never Married',
    religion: 'Hindu',
    community: 'Brahmin - Iyer',
    motherTongue: 'Tamil',
    city: 'Chennai',
    state: 'Tamil Nadu',
    country: 'India',
    diet: 'Vegetarian',
    smoke: 'Never',
    drink: 'Never',
    bio: 'Principal Quant Analyst and Alumnus of BITS Pilani & Carnegie Mellon. Passionate about algorithmic trading, carnatic violin, and long-distance marathons. Looking for an intelligent, grounded companion who values family togetherness and laughing at silly puns.',
    hobbies: ['Carnatic Violin', 'Marathon Running', 'Chess', 'Financial History'],
    values: ['Discipline', 'Continuous Learning', 'Cultural Deepness', 'Humility'],
    languagesSpoken: ['Tamil', 'English', 'Hindi'],
    education: {
      degree: 'M.S. Computational Finance',
      college: 'Carnegie Mellon University & BITS Pilani',
      field: 'Mathematical Sciences & Finance'
    },
    occupation: {
      title: 'Principal Quantitative Strategist',
      companySector: 'Finance',
      employer: 'Global Hedge Fund, OMR Chennai',
      annualIncome: '₹65 - 80 Lakhs',
      incomeBracket: '50L+'
    },
    family: {
      type: 'Nuclear',
      fatherOccupation: 'General Manager, Reserve Bank of India (Retd)',
      motherOccupation: 'Carnatic Vocalist & Teacher',
      siblings: '1 Elder Sister (Married, Senior Director in Bay Area)',
      nativePlace: 'Thanjavur, Tamil Nadu',
      values: 'Moderate & Traditional',
      affluenceLevel: 'Upper Middle Class'
    },
    horoscope: {
      nakshatra: 'Uthirattathi (Uttara Bhadrapada)',
      rasi: 'Meena (Pisces)',
      manglik: 'Non-Manglik',
      birthTime: '08:40 AM',
      birthPlace: 'Chennai, Tamil Nadu',
      horoscopeMatchScore: 34
    },
    verification: {
      isVerified: true,
      idVerified: true,
      mobileVerified: true,
      workVerified: true,
      badgeText: 'Govt ID & Degree Verified'
    },
    partnerPreferences: {
      ageRange: [25, 30],
      heightRange: [62, 68],
      maritalStatus: ['Never Married'],
      religion: ['Hindu'],
      motherTongue: ['Tamil', 'Malayalam', 'Telugu', 'English'],
      education: ['B.Tech', 'MBA', 'MS', 'M.Tech', 'CA'],
      occupationSectors: ['Finance', 'Technology', 'Healthcare', 'Engineering'],
      preferredLocations: ['Chennai', 'Bengaluru', 'Singapore'],
      diet: ['Vegetarian'],
      manglikPreference: 'Non-Manglik'
    },
    compatibilityScore: 92,
    tags: ['BITS & CMU Alum', 'Quant Strategist', 'Marathoner', 'Strict Vegetarian'],
    photos: [
      '/profiles/prof_03_arjun.jpg'
    ],
    isShortlisted: true,
    interestStatus: 'sent',
    lastActive: 'Active 1h ago',
    isOnline: false
  },
  {
    id: 'prof-04',
    name: 'Zoya Fatima Alvi',
    gender: 'Bride',
    age: 26,
    height: "5' 5\" (165 cm)",
    heightInches: 65,
    maritalStatus: 'Never Married',
    religion: 'Muslim',
    community: 'Sunni',
    subCaste: 'Syed',
    motherTongue: 'Hindi',
    city: 'Hyderabad',
    state: 'Telangana',
    country: 'India',
    diet: 'Non-Vegetarian',
    smoke: 'Never',
    drink: 'Never',
    bio: 'Civil Services Officer (IRS Assistant Commissioner). Bibliophile, lover of Urdu poetry, culinary explorer, and heritage conservation enthusiast. Believes in integrity, family warmth, and building a partnership rooted in mutual aspirations.',
    hobbies: ['Urdu Ghazals', 'Persian Architecture', 'Tennis', 'Culinary Arts'],
    values: ['Integrity', 'Public Service', 'Compassion', 'Family Cohesion'],
    languagesSpoken: ['Urdu', 'Hindi', 'English', 'Telugu'],
    education: {
      degree: 'Master of Public Policy & B.A. Economics (Hons)',
      college: 'St. Stephen\'s College, Delhi University',
      field: 'Public Policy & Fiscal Economics'
    },
    occupation: {
      title: 'Assistant Commissioner (IRS)',
      companySector: 'Civil Services',
      employer: 'Ministry of Finance, Govt. of India',
      annualIncome: '₹22 - 26 Lakhs',
      incomeBracket: '20-35L'
    },
    family: {
      type: 'Nuclear',
      fatherOccupation: 'Surgeon & Medical Director, Hyderabad',
      motherOccupation: 'Educator & Philanthropist',
      siblings: '1 Younger Brother (Final year AI student at BITS)',
      nativePlace: 'Hyderabad / Lucknow',
      values: 'Liberal & Cultured',
      affluenceLevel: 'Affluent / Business'
    },
    horoscope: {
      nakshatra: 'N/A',
      rasi: 'N/A',
      manglik: 'Doesn\'t Matter',
      birthTime: '03:10 PM',
      birthPlace: 'Hyderabad, Telangana',
      horoscopeMatchScore: 30
    },
    verification: {
      isVerified: true,
      idVerified: true,
      mobileVerified: true,
      workVerified: true,
      badgeText: 'Govt Officer Verified'
    },
    partnerPreferences: {
      ageRange: [27, 33],
      heightRange: [68, 73],
      maritalStatus: ['Never Married'],
      religion: ['Muslim'],
      motherTongue: ['Hindi', 'Urdu', 'English', 'Telugu'],
      education: ['IAS / IPS / IRS', 'MD / MS', 'MBA (IIM/ISB)', 'B.Tech (IIT/NIT)'],
      occupationSectors: ['Civil Services', 'Healthcare', 'Technology', 'Finance'],
      preferredLocations: ['Hyderabad', 'Delhi NCR', 'Bengaluru'],
      diet: ['Non-Vegetarian', 'Eggetarian'],
      manglikPreference: 'Doesn\'t Matter'
    },
    compatibilityScore: 91,
    tags: ['Civil Services (IRS)', 'St. Stephens Alum', 'Urdu Literature', 'Tennis Player'],
    photos: [
      '/profiles/prof_04_zoya.jpg'
    ],
    isShortlisted: false,
    interestStatus: 'none',
    lastActive: 'Active today',
    isOnline: false
  },
  {
    id: 'prof-05',
    name: 'Karanvir Singh Gill',
    gender: 'Groom',
    age: 31,
    height: "6' 2\" (188 cm)",
    heightInches: 74,
    maritalStatus: 'Never Married',
    religion: 'Sikh',
    community: 'Jat Sikh',
    motherTongue: 'Hindi',
    city: 'Chandigarh',
    state: 'Punjab',
    country: 'India',
    diet: 'Non-Vegetarian',
    smoke: 'Never',
    drink: 'Socially',
    bio: 'Founder & CEO of an AgriTech startup backed by Tier-1 VCs. Outdoor adventurer, passionate pilot license holder, and lover of golden retrievers. Seeking a confident, joyful partner with high emotional intelligence and big dreams.',
    hobbies: ['Aviation & Flying', 'Horse Riding', 'Off-roading', 'Angel Investing'],
    values: ['Enterprising Spirit', 'Chardi Kala (Resilience)', 'Loyalty', 'Generosity'],
    languagesSpoken: ['Punjabi', 'Hindi', 'English'],
    education: {
      degree: 'B.Tech & MBA',
      college: 'IIT Roorkee & ISB Hyderabad',
      field: 'Mechanical Engg & Tech Entrepreneurship'
    },
    occupation: {
      title: 'Co-Founder & CEO',
      companySector: 'Business & Entrepreneurship',
      employer: 'AgroNova Technologies (Series-A Funded)',
      annualIncome: '₹75 - 90 Lakhs',
      incomeBracket: '50L+'
    },
    family: {
      type: 'Joint',
      fatherOccupation: 'Landowner & Industrialist (Agro Equipment)',
      motherOccupation: 'Home Maker & Organic Orchardist',
      siblings: '2 Elder Sisters (Both married and settled)',
      nativePlace: 'Ludhiana / Chandigarh',
      values: 'Progressive',
      affluenceLevel: 'Affluent / Business'
    },
    horoscope: {
      nakshatra: 'N/A',
      rasi: 'N/A',
      manglik: 'Doesn\'t Matter',
      birthTime: '10:30 AM',
      birthPlace: 'Chandigarh',
      horoscopeMatchScore: 28
    },
    verification: {
      isVerified: true,
      idVerified: true,
      mobileVerified: true,
      workVerified: true,
      badgeText: 'Elite Verified Founder'
    },
    partnerPreferences: {
      ageRange: [25, 30],
      heightRange: [65, 71],
      maritalStatus: ['Never Married'],
      religion: ['Sikh', 'Hindu'],
      motherTongue: ['Punjabi', 'Hindi', 'English'],
      education: ['MBA', 'B.Tech', 'Masters', 'MBBS'],
      occupationSectors: ['Technology', 'Creative & Design', 'Business & Entrepreneurship', 'Healthcare'],
      preferredLocations: ['Chandigarh', 'Delhi NCR', 'Bengaluru', 'Global'],
      diet: ['Non-Vegetarian', 'Vegetarian'],
      manglikPreference: 'Doesn\'t Matter'
    },
    compatibilityScore: 89,
    tags: ['IIT & ISB Alum', 'Tech Founder', 'Pilot License', 'Chandigarh'],
    photos: [
      '/profiles/prof_05_karanvir.jpg'
    ],
    isShortlisted: false,
    interestStatus: 'none',
    lastActive: 'Online now',
    isOnline: true
  },
  {
    id: 'prof-06',
    name: 'Tanvi Rajesh Shah',
    gender: 'Bride',
    age: 28,
    height: "5' 4\" (163 cm)",
    heightInches: 64,
    maritalStatus: 'Never Married',
    religion: 'Jain',
    community: 'Shwetambar',
    motherTongue: 'English',
    city: 'Ahmedabad',
    state: 'Gujarat',
    country: 'India',
    diet: 'Vegetarian',
    smoke: 'Never',
    drink: 'Never',
    bio: 'Chartered Accountant (Rank Holder) & VP of Private Equity. Enjoys contemporary Indian painting, scuba diving, and mindful living. Looking for a partner who values deep intellectual connection, emotional security, and a grounded lifestyle.',
    hobbies: ['Scuba Diving', 'Contemporary Art', 'Sanskrit Literature', 'Yoga'],
    values: ['Ahimsa & Mindfulness', 'Ambition with Ethics', 'Transparency', 'Warmth'],
    languagesSpoken: ['Gujarati', 'Hindi', 'English'],
    education: {
      degree: 'Chartered Accountant (FCA) & B.Com',
      college: 'ICAI (AIR 14) & Narsee Monjee College',
      field: 'Corporate Finance & Valuation'
    },
    occupation: {
      title: 'Vice President, Growth Capital',
      companySector: 'Finance',
      employer: 'Global Private Equity Fund',
      annualIncome: '₹48 - 55 Lakhs',
      incomeBracket: '35-50L'
    },
    family: {
      type: 'Nuclear',
      fatherOccupation: 'Senior Partner, Renowned Audit Firm',
      motherOccupation: 'Interior Stylist',
      siblings: '1 Younger Brother (MS in Robotics, TU Munich)',
      nativePlace: 'Ahmedabad, Gujarat',
      values: 'Liberal & Cultured',
      affluenceLevel: 'High Net Worth'
    },
    horoscope: {
      nakshatra: 'Hasta',
      rasi: 'Kanya (Virgo)',
      manglik: 'Non-Manglik',
      birthTime: '01:25 PM',
      birthPlace: 'Ahmedabad, Gujarat',
      horoscopeMatchScore: 32
    },
    verification: {
      isVerified: true,
      idVerified: true,
      mobileVerified: true,
      workVerified: true,
      badgeText: 'Govt ID & ICAI Verified'
    },
    partnerPreferences: {
      ageRange: [28, 34],
      heightRange: [67, 73],
      maritalStatus: ['Never Married'],
      religion: ['Jain', 'Hindu'],
      motherTongue: ['Gujarati', 'Hindi', 'English'],
      education: ['CA', 'MBA (IIM/Top Tier)', 'MS', 'B.Tech'],
      occupationSectors: ['Finance', 'Technology', 'Business & Entrepreneurship', 'Consulting'],
      preferredLocations: ['Mumbai', 'Ahmedabad', 'Bengaluru', 'London'],
      diet: ['Vegetarian'],
      manglikPreference: 'Doesn\'t Matter'
    },
    compatibilityScore: 93,
    tags: ['CA Ranker (AIR 14)', 'VP Private Equity', 'Scuba Diver', 'Vegetarian'],
    photos: [
      '/profiles/prof_06_tanvi.jpg'
    ],
    isShortlisted: true,
    interestStatus: 'received',
    lastActive: 'Active 2h ago',
    isOnline: false
  },
  {
    id: 'prof-07',
    name: 'Nikhil Koshy Thomas',
    gender: 'Groom',
    age: 29,
    height: "5' 10\" (178 cm)",
    heightInches: 70,
    maritalStatus: 'Never Married',
    religion: 'Christian',
    community: 'Syrian Orthodox',
    motherTongue: 'Malayalam',
    city: 'Kochi',
    state: 'Kerala',
    country: 'India',
    diet: 'Non-Vegetarian',
    smoke: 'Never',
    drink: 'Socially',
    bio: 'Marine Naval Architect working on green hydrogen vessel design. Passionate sailor, espresso purist, and indie cinema buff. Looking for an open-hearted companion who cherishes conversations by the waterfront and shared quiet evenings.',
    hobbies: ['Sailing & Kayaking', 'Acoustic Percussion', 'Woodworking', 'Documentary Films'],
    values: ['Eco-Consciousness', 'Family Closeness', 'Kindness', 'Open-Mindedness'],
    languagesSpoken: ['Malayalam', 'English', 'Tamil'],
    education: {
      degree: 'M.Tech Ocean Engineering & Naval Architecture',
      college: 'IIT Madras',
      field: 'Hydrodynamics & Clean Propulsion'
    },
    occupation: {
      title: 'Senior Naval Architect & Specialist',
      companySector: 'Engineering',
      employer: 'Nordic Marine Engineering Consultancy, Infopark',
      annualIncome: '₹28 - 34 Lakhs',
      incomeBracket: '20-35L'
    },
    family: {
      type: 'Nuclear',
      fatherOccupation: 'Civil Surgeon (Retd), Kerala Health Services',
      motherOccupation: 'Botanist & Organic Planter',
      siblings: '1 Elder Brother (Orthopedic Surgeon in Leeds, UK)',
      nativePlace: 'Kottayam / Kochi',
      values: 'Liberal & Cultured',
      affluenceLevel: 'Upper Middle Class'
    },
    horoscope: {
      nakshatra: 'N/A',
      rasi: 'N/A',
      manglik: 'Doesn\'t Matter',
      birthTime: '05:50 PM',
      birthPlace: 'Kochi, Kerala',
      horoscopeMatchScore: 30
    },
    verification: {
      isVerified: true,
      idVerified: true,
      mobileVerified: true,
      workVerified: true,
      badgeText: 'Elite Verified'
    },
    partnerPreferences: {
      ageRange: [25, 30],
      heightRange: [62, 69],
      maritalStatus: ['Never Married'],
      religion: ['Christian'],
      motherTongue: ['Malayalam', 'English', 'Tamil'],
      education: ['B.Tech', 'M.Tech', 'MBBS', 'M.Des', 'MBA'],
      occupationSectors: ['Engineering', 'Healthcare', 'Technology', 'Design'],
      preferredLocations: ['Kochi', 'Bengaluru', 'Chennai', 'Europe'],
      diet: ['Non-Vegetarian', 'Eggetarian'],
      manglikPreference: 'Doesn\'t Matter'
    },
    compatibilityScore: 90,
    tags: ['IIT Madras Alum', 'Naval Architect', 'Sailor', 'Kochi Native'],
    photos: [
      '/profiles/prof_07_nikhil.jpg'
    ],
    isShortlisted: false,
    interestStatus: 'none',
    lastActive: 'Online now',
    isOnline: true
  },
  {
    id: 'prof-08',
    name: 'Dr. Pallavi Reddy',
    gender: 'Bride',
    age: 28,
    height: "5' 7\" (170 cm)",
    heightInches: 67,
    maritalStatus: 'Never Married',
    religion: 'Hindu',
    community: 'Reddy',
    motherTongue: 'Telugu',
    city: 'Hyderabad',
    state: 'Telangana',
    country: 'India',
    diet: 'Eggetarian',
    smoke: 'Never',
    drink: 'Socially',
    bio: 'Dermatologist & Cosmetologist. Enthusiastic scuba diver, classical Kuchipudi dancer, and sourdough baker. Seeking a progressive, supportive gentleman with strong moral fiber, great humor, and shared curiosity about world cultures.',
    hobbies: ['Kuchipudi Dance', 'Baking', 'Scuba Diving', 'Podcasts on Neuroscience'],
    values: ['Personal Growth', 'Mutual Respect', 'Compassion', 'Work-Life Balance'],
    languagesSpoken: ['Telugu', 'Hindi', 'English'],
    education: {
      degree: 'MD Dermatology, Venereology & Leprosy (DVL)',
      college: 'Osmania Medical College, Hyderabad',
      field: 'Aesthetic & Clinical Dermatology'
    },
    occupation: {
      title: 'Consultant Dermatologist',
      companySector: 'Healthcare',
      employer: 'Apollo Hospitals & Private Practice, Jubilee Hills',
      annualIncome: '₹36 - 45 Lakhs',
      incomeBracket: '35-50L'
    },
    family: {
      type: 'Nuclear',
      fatherOccupation: 'Managing Director, Infrastructure & EPC Firm',
      motherOccupation: 'Educational Trust Trustee',
      siblings: '1 Younger Brother (Software Engineer at Google, Seattle)',
      nativePlace: 'Hyderabad, Telangana',
      values: 'Liberal & Cultured',
      affluenceLevel: 'High Net Worth'
    },
    horoscope: {
      nakshatra: 'Anuradha',
      rasi: 'Vrischika (Scorpio)',
      manglik: 'Non-Manglik',
      birthTime: '09:12 AM',
      birthPlace: 'Hyderabad, Telangana',
      horoscopeMatchScore: 35
    },
    verification: {
      isVerified: true,
      idVerified: true,
      mobileVerified: true,
      workVerified: true,
      badgeText: 'Medical Council & ID Verified'
    },
    partnerPreferences: {
      ageRange: [28, 33],
      heightRange: [69, 75],
      maritalStatus: ['Never Married'],
      religion: ['Hindu'],
      motherTongue: ['Telugu', 'English', 'Hindi'],
      education: ['MD / MS', 'MBA', 'MS / B.Tech (Tier-1)'],
      occupationSectors: ['Healthcare', 'Technology', 'Business & Entrepreneurship', 'Civil Services'],
      preferredLocations: ['Hyderabad', 'Bengaluru', 'USA', 'Singapore'],
      diet: ['Eggetarian', 'Vegetarian', 'Non-Vegetarian'],
      manglikPreference: 'Non-Manglik'
    },
    compatibilityScore: 95,
    tags: ['MD Dermatologist', 'Kuchipudi Dancer', 'Jubilee Hills', 'Osmania Alum'],
    photos: [
      '/profiles/prof_08_pallavi.jpg'
    ],
    isShortlisted: true,
    interestStatus: 'accepted',
    lastActive: 'Active 30m ago',
    isOnline: true
  },
  {
    id: 'prof-09',
    name: 'Vikramaditya Roy',
    gender: 'Groom',
    age: 32,
    height: "5' 11\" (180 cm)",
    heightInches: 71,
    maritalStatus: 'Divorced',
    religion: 'Hindu',
    community: 'Kayastha',
    motherTongue: 'Bengali',
    city: 'Kolkata',
    state: 'West Bengal',
    country: 'India',
    diet: 'Non-Vegetarian',
    smoke: 'Never',
    drink: 'Socially',
    bio: 'Director of Machine Learning at an AI Research Lab. Divorced amicably (short marriage, mutual consent, no encumbrances). Film enthusiast, amateur photographer, and warm conversationalist who believes second chapters can be the most meaningful.',
    hobbies: ['Black & White Photography', 'Cinema Studies', 'Vinyl Records', 'Badminton'],
    values: ['Emotional Maturity', 'Honesty', 'Kindness', 'Resilience'],
    languagesSpoken: ['Bengali', 'English', 'Hindi'],
    education: {
      degree: 'Ph.D. in Computer Science (AI/ML)',
      college: 'IISc Bangalore & Jadavpur University',
      field: 'Deep Generative Models'
    },
    occupation: {
      title: 'Director of AI Research',
      companySector: 'Technology',
      employer: 'Global AI Research Lab, Salt Lake / Remote',
      annualIncome: '₹60 - 75 Lakhs',
      incomeBracket: '50L+'
    },
    family: {
      type: 'Nuclear',
      fatherOccupation: 'Professor of Physics (Retd), Calcutta University',
      motherOccupation: 'Renowned Tagore Song Exponent',
      siblings: '1 Elder Sister (Senior Economist at World Bank, DC)',
      nativePlace: 'Kolkata, West Bengal',
      values: 'Progressive',
      affluenceLevel: 'Upper Middle Class'
    },
    horoscope: {
      nakshatra: 'Swati',
      rasi: 'Tula (Libra)',
      manglik: 'Non-Manglik',
      birthTime: '04:15 PM',
      birthPlace: 'Kolkata, West Bengal',
      horoscopeMatchScore: 31
    },
    verification: {
      isVerified: true,
      idVerified: true,
      mobileVerified: true,
      workVerified: true,
      badgeText: 'Govt ID & Doctorate Verified'
    },
    partnerPreferences: {
      ageRange: [27, 34],
      heightRange: [62, 69],
      maritalStatus: ['Never Married', 'Divorced'],
      religion: ['Hindu'],
      motherTongue: ['Bengali', 'Hindi', 'English'],
      education: ['Masters', 'Ph.D.', 'B.Tech', 'MBA'],
      occupationSectors: ['Technology', 'Creative & Design', 'Healthcare', 'Academia'],
      preferredLocations: ['Kolkata', 'Bengaluru', 'Delhi NCR', 'Remote'],
      diet: ['Non-Vegetarian', 'Vegetarian'],
      manglikPreference: 'Doesn\'t Matter'
    },
    compatibilityScore: 88,
    tags: ['IISc Ph.D.', 'AI Director', 'Vinyl Collector', 'Divorced / Second Inning'],
    photos: [
      '/profiles/prof_09_vikramaditya.jpg'
    ],
    isShortlisted: false,
    interestStatus: 'none',
    lastActive: 'Active yesterday',
    isOnline: false
  },
  {
    id: 'prof-10',
    name: 'Samyuktha Nair',
    gender: 'Bride',
    age: 26,
    height: "5' 5\" (165 cm)",
    heightInches: 65,
    maritalStatus: 'Never Married',
    religion: 'Hindu',
    community: 'Nair',
    motherTongue: 'Malayalam',
    city: 'Kochi',
    state: 'Kerala',
    country: 'India',
    diet: 'Vegetarian',
    smoke: 'Never',
    drink: 'Never',
    bio: 'Chartered Financial Analyst (CFA) & Sustainable Investment Lead. Passionate about ESG, yoga, indie books, and seaside sunsets. Looking for an ambitious, humble soul who values laughter, empathy, and warm family bonds.',
    hobbies: ['Vinyasa Yoga', 'Sustainable Gardening', 'Baking', 'Book Clubs'],
    values: ['Integrity', 'Empathy', 'Environmental Consciousness', 'Harmony'],
    languagesSpoken: ['Malayalam', 'English', 'Hindi', 'Tamil'],
    education: {
      degree: 'CFA Charterholder & B.Com (Hons)',
      college: 'CFA Institute (USA) & Christ University, Bengaluru',
      field: 'Sustainable Finance & Portfolio Analysis'
    },
    occupation: {
      title: 'ESG Investment Manager',
      companySector: 'Finance',
      employer: 'Global Impact Capital Fund, Kakkanad',
      annualIncome: '₹26 - 30 Lakhs',
      incomeBracket: '20-35L'
    },
    family: {
      type: 'Nuclear',
      fatherOccupation: 'Commodity Trading Business Owner',
      motherOccupation: 'High School English Teacher',
      siblings: '1 Younger Sister (B.Tech student at NIT Calicut)',
      nativePlace: 'Ernakulam / Thrissur',
      values: 'Liberal & Cultured',
      affluenceLevel: 'Upper Middle Class'
    },
    horoscope: {
      nakshatra: 'Aswathi (Ashwini)',
      rasi: 'Mesha (Aries)',
      manglik: 'Non-Manglik',
      birthTime: '07:55 AM',
      birthPlace: 'Kochi, Kerala',
      horoscopeMatchScore: 34
    },
    verification: {
      isVerified: true,
      idVerified: true,
      mobileVerified: true,
      workVerified: true,
      badgeText: 'Elite Verified'
    },
    partnerPreferences: {
      ageRange: [27, 32],
      heightRange: [67, 73],
      maritalStatus: ['Never Married'],
      religion: ['Hindu'],
      motherTongue: ['Malayalam', 'Tamil', 'English'],
      education: ['B.Tech', 'MBA', 'MS', 'CA', 'CFA'],
      occupationSectors: ['Finance', 'Technology', 'Healthcare', 'Engineering'],
      preferredLocations: ['Kochi', 'Bengaluru', 'Chennai', 'Dubai'],
      diet: ['Vegetarian', 'Eggetarian'],
      manglikPreference: 'Non-Manglik or Doesn\'t Matter'
    },
    compatibilityScore: 97,
    tags: ['CFA Charterholder', 'ESG Manager', 'Yoga Practitioner', 'Vegetarian'],
    photos: [
      '/profiles/prof_10_samyuktha.jpg'
    ],
    isShortlisted: true,
    interestStatus: 'none',
    lastActive: 'Online now',
    isOnline: true
  }
];
