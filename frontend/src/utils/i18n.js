const translations = {
  en: {
    // Nav
    appName: 'TulongAI',
    tagline: 'Social Services Eligibility',

    // Hero
    heroTitle: "Find the Help That's Right for You",
    heroSubtitle: 'Answer a few questions to discover government benefits you may qualify for — free, fast, and confidential.',
    heroTrust: 'Secure & Confidential',
    startButton: 'Check My Eligibility',
    learnMore: 'Learn More',

    // Features
    feature1Title: 'Instant Analysis',
    feature1Desc: 'AI-powered eligibility check across major Philippine social programs in seconds.',
    feature2Title: 'NGO Routing',
    feature2Desc: 'Automatic referral to community organizations when government programs are unavailable.',
    feature3Title: 'Conflict Detection',
    feature3Desc: 'Identifies program overlaps so you get clear, actionable next steps.',

    // Form
    formTitle: 'Check Your Eligibility',
    formSubtitle: "Tell us about yourself and we'll find programs that match.",
    step1Label: 'Personal Info',
    step2Label: 'Location',
    step3Label: 'Enrollment',
    next: 'Next',
    back: 'Back',
    submit: 'Check Eligibility',
    submitting: 'Analyzing your profile…',

    // Form fields
    age: 'Age',
    agePlaceholder: 'e.g. 35',
    monthlyIncome: 'Monthly Household Income (₱)',
    incomePlaceholder: 'e.g. 15,000',
    householdSize: 'Household Size',
    householdPlaceholder: 'e.g. 4',
    employmentStatus: 'Employment Status',
    employed: 'Employed',
    unemployed: 'Unemployed',
    selfEmployed: 'Self-Employed',
    informal: 'Informal Worker',
    isPwd: 'Person with Disability (PWD)',
    hasPhilhealth: 'Enrolled in PhilHealth',
    hasSss: 'Enrolled in SSS',
    locationType: 'Location Type',
    urban: 'Urban',
    rural: 'Rural',
    barangay: 'Barangay',
    barangayPlaceholder: 'e.g. Barangay 123',
    city: 'City / Municipality',
    cityPlaceholder: 'e.g. Quezon City',
    province: 'Province',
    provincePlaceholder: 'e.g. Metro Manila',

    // Results
    goodNews: 'Great News!',
    assessmentDone: 'Assessment Complete',
    eligibleSummary: (e, t) => `You qualify for ${e} out of ${t} programs.`,
    ineligibleSummary: 'No standard government programs matched your profile, but community support is available.',
    newCheck: 'New Check',
    programs: 'Programs',
    conflicts: 'Conflicts',
    summary: 'Summary',
    howWeKnow: 'How did we determine this?',
    qualified: 'Qualified',
    conditional: 'Conditional',
    notEligible: 'Not Eligible',
    confidence: 'Confidence',
    benefits: 'Benefits',
    gaps: 'Gaps to Address',
    nextSteps: 'Next Steps',
    ngoAlternatives: 'NGO Alternatives',
    office: 'Office',

    // Documents
    docsTitle: 'Required Documents',
    docsSubtitle: 'Gather these before visiting the office.',
    docReady: 'Ready',
    docNotYet: 'Not yet',
    allDocsReady: 'All documents ready!',

    // Path
    pathTitle: 'Recommended Path',
    pathSubtitle: 'Follow these steps to maximize your benefits.',

    // Conflicts
    conflictTitle: 'Potential Conflict Detected',
    conflictResolution: 'Resolution',

    // NGO
    ngoTitle: 'Community Support',
    ngoSubtitle: 'Organizations that may help if you don\'t qualify for government programs.',
    ngoContact: 'Contact:',
    ngoWebsite: 'Visit Website',

    // Reasoning
    reasoningTitle: 'How did we determine this?',
    reasoningSubtitle: 'Step-by-step eligibility evaluation.',
    moreLines: (n) => `${n} more steps`,

    // Footer
    footerText: 'TulongAI · v1.0 · Free & Confidential',
    secureText: 'Your data is never stored or shared.',
  },
  fil: {
    // Nav
    appName: 'TulongAI',
    tagline: 'Pagsusuri ng Kwalipikasyon',

    // Hero
    heroTitle: "Alamin ang Tulong na Para Sa'yo",
    heroSubtitle: 'Sagutin ang ilang tanong para malaman ang mga benepisyong pwedeng makuha — libre, mabilis, at kumpidensyal.',
    heroTrust: 'Ligtas at Kumpidensyal',
    startButton: 'Suriin ang Kwalipikasyon',
    learnMore: 'Alamin Pa',

    // Features
    feature1Title: 'Mabilis na Pagsusuri',
    feature1Desc: 'Pagsusuri ng kwalipikasyon gamit ang AI sa mga pangunahing programa ng gobyerno sa ilang segundo.',
    feature2Title: 'NGO Referral',
    feature2Desc: 'Awtomatikong referral sa mga organisasyon ng komunidad kung walang available na programa ng gobyerno.',
    feature3Title: 'Alerto sa Salungatan',
    feature3Desc: 'Tinutukoy ang mga overlap sa programa para malinaw na mga susunod na hakbang.',

    // Form
    formTitle: 'Suriin ang Kwalipikasyon',
    formSubtitle: 'Ibigay ang impormasyon ng iyong sambahayan at hahanap kami ng mga programang tugma.',
    step1Label: 'Personal',
    step2Label: 'Lokasyon',
    step3Label: 'Pagpapatala',
    next: 'Susunod',
    back: 'Bumalik',
    submit: 'Suriin ang Kwalipikasyon',
    submitting: 'Sinusuri ang iyong profile…',

    // Form fields
    age: 'Edad',
    agePlaceholder: 'hal. 35',
    monthlyIncome: 'Buwanang Kita ng Sambahayan (₱)',
    incomePlaceholder: 'hal. 15,000',
    householdSize: 'Laki ng Sambahayan',
    householdPlaceholder: 'hal. 4',
    employmentStatus: 'Katayuan sa Trabaho',
    employed: 'May Trabaho',
    unemployed: 'Walang Trabaho',
    selfEmployed: 'Sariling Hanapbuhay',
    informal: 'Impormal na Manggagawa',
    isPwd: 'Person with Disability (PWD)',
    hasPhilhealth: 'Naka-enroll sa PhilHealth',
    hasSss: 'Naka-enroll sa SSS',
    locationType: 'Uri ng Lokasyon',
    urban: 'Urban',
    rural: 'Rural',
    barangay: 'Barangay',
    barangayPlaceholder: 'hal. Barangay 123',
    city: 'Lungsod / Bayan',
    cityPlaceholder: 'hal. Lungsod Quezon',
    province: 'Lalawigan',
    provincePlaceholder: 'hal. Metro Manila',

    // Results
    goodNews: 'Magandang Balita!',
    assessmentDone: 'Tapos na ang Pagtatasa',
    eligibleSummary: (e, t) => `Kwalipikado ka sa ${e} sa ${t} na programa.`,
    ineligibleSummary: 'Walang karaniwang programa ng gobyerno ang tumugma sa iyong profile, ngunit may suporta mula sa komunidad.',
    newCheck: 'Bagong Pagsusuri',
    programs: 'Mga Programa',
    conflicts: 'Mga Salungatan',
    summary: 'Buod',
    howWeKnow: 'Paano namin nalaman ito?',
    qualified: 'Kwalipikado',
    conditional: 'May Kondisyon',
    notEligible: 'Hindi Kwalipikado',
    confidence: 'Katiyakan',
    benefits: 'Mga Benepisyo',
    gaps: 'Mga Kulang',
    nextSteps: 'Mga Susunod na Hakbang',
    ngoAlternatives: 'Mga Alternatibong NGO',
    office: 'Opisina',

    // Documents
    docsTitle: 'Mga Kinakailangang Dokumento',
    docsSubtitle: 'Ihanda ang mga ito bago pumunta sa opisina.',
    docReady: 'Handa na',
    docNotYet: 'Hindi pa',
    allDocsReady: 'Lahat ng dokumento ay handa na!',

    // Path
    pathTitle: 'Inirerekomendang Landas',
    pathSubtitle: 'Sundin ang mga hakbang na ito upang mapakinabangan ang iyong mga benepisyo.',

    // Conflicts
    conflictTitle: 'Posibleng Salungatan',
    conflictResolution: 'Solusyon',

    // NGO
    ngoTitle: 'Suporta sa Komunidad',
    ngoSubtitle: 'Mga organisasyong maaaring makatulong kung hindi ka kwalipikado sa mga programa ng gobyerno.',
    ngoContact: 'Kontak:',
    ngoWebsite: 'Bisitahin',

    // Reasoning
    reasoningTitle: 'Paano namin nalaman ito?',
    reasoningSubtitle: 'Hakbang-hakbang na pagsusuri ng kwalipikasyon.',
    moreLines: (n) => `${n} pang hakbang`,

    // Footer
    footerText: 'TulongAI · v1.0 · Libre at Kumpidensyal',
    secureText: 'Ang iyong data ay hindi nai-imbak o ibinabahagi.',
  },
}

export default translations
