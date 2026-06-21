/**
 * @fileOverview Universal Translation Dictionaries for the Prosperity Revolution.
 * Comprehensive support for core mission languages to reach every heart.
 */

export type LanguageCode = string;

const baseTranslations = {
  nav: {
    discover: "Discover",
    search: "Search",
    global: "Global",
    matches: "Matches",
    shop: "Shop",
    profile: "Profile"
  },
  login: {
    title: "I LOVE U",
    subtitle: "PROSPERITY REVOLUTION",
    signIn: "Sign In",
    join: "Join",
    launch: "Launch",
    joinRevolution: "Join Revolution",
    guest: "Launch as Guest",
    protocol: "Global Security Protocol",
    ageVerify: "I am 18+ years old",
    respectVerify: "Respect is Mandatory",
    humanVerify: "Verify Human Status",
    launchButton: "Launch Spark",
    joinButton: "Join the Mission"
  },
  home: {
    heroTitle: "Spark Love. End Poverty.",
    heroSubtitle: "Connecting hearts across every city and village to fund local job creation. Respect is Mandatory.",
    launchButton: "Launch Spark",
    supportButton: "Support Mission",
    compliance: "18+ Global Compliance",
    movementTitle: "The Movement",
    metricTitle: "Happiness is the Only Metric.",
    featureAiTitle: "AI Moderated",
    featureAiDesc: "Disrespect is filtered automatically. Join a community where kindness is mandatory.",
    featureRespectTitle: "Pure Respect",
    featureRespectDesc: "Built on mutual honor. Reaching every rural community and global city with love.",
    featureProsperityTitle: "Prosperity",
    featureProsperityDesc: "Every connection funds local job creation to eliminate global poverty forever.",
    footerCopyright: "Reaching Every Heart",
    footerTagline: "Respect & Love is Mandatory ❤️ Eliminating Poverty Globally"
  },
  discover: {
    mystery: "Mystery Connection",
    revealed: "Revealed Heart",
    invite: "Invite",
    spark: "Spark",
    allExplored: "All Hearts Explored",
    restart: "Restart Discovery",
    viewMap: "View Map",
    sponsored: "Sponsored"
  },
  search: {
    title: "Find Hearts",
    subtitle: "SEARCH THE REVOLUTION",
    placeholder: "Nickname or Interest...",
    noResults: "No hearts found for this vibration.",
    searching: "Scanning the network..."
  },
  community: {
    title: "Global Circle Wall",
    subtitle: "Bridging Hearts Across Every City",
    placeholder: "Share a respectful thought...",
    viewOnly: "View Only Mode: Agree to policy to post",
    empty: "The Wall is Silent. Spark the First Message.",
    listen: "Listen",
    flagged: "Flagged by AI"
  },
  matches: {
    title: "My Hearts",
    subtitle: "Community Connections",
    sparks: "Sparks",
    circle: "Circle",
    invites: "Invites",
    emptySparks: "No Sparks Found",
    emptyCircle: "Circle is Empty",
    emptyInvites: "No Invitations",
    active: "Active Spark Room"
  },
  shop: {
    title: "Gift Marketplace",
    subtitle: "Premium gifts for your perfect Sparks.",
    searchPlaceholder: "Search gifts...",
    sellerPortal: "Seller Portal",
    buy: "Buy Gift"
  },
  profile: {
    account: "My Account",
    save: "Save",
    signOut: "Sign Out",
    personal: "Info",
    address: "Address",
    public: "Public",
    security: "Security",
    invite: "Share",
    bioPlaceholder: "Tell the community about your mission...",
    nickname: "Unique Nickname",
    language: "Preferred Language",
    currency: "Local Currency",
    shareTitle: "Share the Love",
    shareSubtitle: "Invite your circle to join the prosperity revolution.",
    shareDescription: "Your connections fund local job creation. Help us reach every heart in every village.",
    copyLink: "Copy Mission Link",
    linkCopied: "Link Secured to Clipboard!",
    anyConnection: "Any Connection"
  }
};

export const TRANSLATIONS: Record<LanguageCode, any> = {
  English: baseTranslations,
  Spanish: {
    ...baseTranslations,
    nav: { discover: "Descubrir", search: "Buscar", global: "Global", matches: "Corazones", shop: "Tienda", profile: "Perfil" },
    login: { ...baseTranslations.login, title: "TE AMO", signIn: "Entrar", join: "Unirse", launch: "Iniciar", joinRevolution: "Unirse a la Revolución", guest: "Invitado", ageVerify: "Tengo 18+ años", respectVerify: "El Respeto es Obligatorio", humanVerify: "Verificar Humano" },
    home: { ...baseTranslations.home, heroTitle: "Chispa de Amor. Fin de la Pobreza.", heroSubtitle: "Uniendo corazones en cada ciudad y pueblo para financiar la creación de empleo local. El respeto es obligatorio.", launchButton: "Iniciar Chispa", supportButton: "Apoyar Misión", metricTitle: "La Felicidad es la Única Métrica." },
    discover: { ...baseTranslations.discover, mystery: "Conexión Misteriosa", revealed: "Corazón Revelado", invite: "Invitar", spark: "Chispa" }
  },
  French: {
    ...baseTranslations,
    nav: { discover: "Découvrir", search: "Rechercher", global: "Global", matches: "Cœurs", shop: "Boutique", profile: "Profil" },
    login: { ...baseTranslations.login, title: "JE T'AIME", signIn: "Se Connecter", join: "Rejoindre", launch: "Lancer", joinRevolution: "Rejoindre la Révolution" },
    home: { ...baseTranslations.home, heroTitle: "Étincelle d'Amour. Fin de la Pauvreté.", heroSubtitle: "Relier les cœurs dans chaque ville et village pour financer la création d'emplois locaux. Le respect est obligatoire.", metricTitle: "Le Bonheur est la Seule Mesure." },
    discover: { ...baseTranslations.discover, mystery: "Connexion Mystère", revealed: "Cœur Révélé", invite: "Inviter", spark: "Étincelle" }
  },
  Swahili: {
    ...baseTranslations,
    nav: { discover: "Gundua", search: "Tafuta", global: "Ulimwengu", matches: "Mioyo Yangu", shop: "Duka", profile: "Wasifu" },
    home: { ...baseTranslations.home, heroTitle: "Cheche ya Upendo. Komesha Umaskini.", heroSubtitle: "Kuunganisha mioyo katika kila mji na kijiji ili kufadhili uundaji wa nafasi za kazi nchini. Heshima ni lazima.", metricTitle: "Furaha ndio Kipimo Pekee." }
  },
  Japanese: {
    ...baseTranslations,
    nav: { discover: "発見", search: "検索", global: "グローバル", matches: "マッチ", shop: "ショップ", profile: "プロフィール" },
    login: { ...baseTranslations.login, title: "愛してる", signIn: "サインイン", join: "参加する", launch: "起動", joinRevolution: "革命に参加する" },
    home: { ...baseTranslations.home, heroTitle: "愛を。貧困を終わらせる。", heroSubtitle: "すべての都市と村の心をつなぎ、地元の雇用創出に資金を提供します。尊敬は必須です。", metricTitle: "幸福こそが唯一の基準です。" }
  },
  Portuguese: {
    ...baseTranslations,
    nav: { discover: "Descobrir", search: "Buscar", global: "Global", matches: "Corações", shop: "Loja", profile: "Perfil" },
    login: { ...baseTranslations.login, title: "EU TE AMO", signIn: "Entrar", join: "Registrar", launch: "Lançar", joinRevolution: "Juntar-se à Revolução" },
    home: { ...baseTranslations.home, heroTitle: "Gera Amor. Acaba com a Pobreza.", heroSubtitle: "Conectando corações em todas as cidades e vilas para financiar a criação de empregos locais. O respeito é obrigatório.", metricTitle: "A Felicidade é a Única Métrica." }
  },
  Amharic: {
    ...baseTranslations,
    nav: { discover: "ይፈልጉ", search: "ይፈልጉ", global: "ዓለም አቀፍ", matches: "ልቦች", shop: "ሱቅ", profile: "መገለጫ" },
    home: { ...baseTranslations.home, heroTitle: "የፍቅር ብልጭታ። ድህነትን ያብቁ።", heroSubtitle: "የአካባቢ የሥራ ዕድል ፈጠራን ለመደገፍ በየከተማውና በየመንደሩ ልቦችን ማገናኘት። መከባበር ግዴታ ነው።", metricTitle: "ደስታ ብቸኛው መለኪያ ነው።" }
  },
  Arabic: {
    ...baseTranslations,
    nav: { discover: "اكتشف", search: "بحث", global: "عالمي", matches: "قلوبي", shop: "متجر", profile: "الملف الشخصي" },
    home: { ...baseTranslations.home, heroTitle: "شرارة الحب. إنهاء الفقر.", heroSubtitle: "ربط القلوب عبر كل مدينة وقرية لتمويل خلق فرص العمل المحلية. الاحترام إلزامي.", metricTitle: "السعادة هي المقياس الوحيد." }
  },
  Hindi: {
    ...baseTranslations,
    nav: { discover: "खोजें", search: "खोजें", global: "वैश्विक", matches: "मेरे दिल", shop: "दुकान", profile: "प्रोफ़ाइल" },
    home: { ...baseTranslations.home, heroTitle: "प्यार जगाएं। गरीबी मिटाएं।", heroSubtitle: "स्थानीय रोजगार सृजन के लिए हर शहर और गांव के दिलों को जोड़ना। सम्मान अनिवार्य है।", metricTitle: "खुशी ही एकमात्र पैमाना है।" }
  }
};

export const DEFAULT_LANGUAGE = "English";
