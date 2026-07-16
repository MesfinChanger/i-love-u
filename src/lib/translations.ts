
/**
 * @fileOverview Universal Translation Dictionaries for the Prosperity Revolution.
 * Comprehensive support for core mission languages to reach every heart.
 */

export type LanguageCode = string;

const baseTranslations = {
  nav: {
    home: "Home",
    discover: "Discover",
    search: "Search",
    global: "Global",
    pool: "Idea Pool",
    matches: "Matches",
    shop: "Shop",
    profile: "Profile"
  },
  pool: {
    title: "Prosperity Pool",
    subtitle: "Swim in the Ocean of Knowledge",
    placeholder: "Dive in with a respectful thought...",
    selectTopic: "Select Topic",
    economy: "Economy",
    politics: "Politics",
    science: "Science",
    technology: "Technology",
    philosophy: "Philosophy",
    general: "General",
    post: "Launch Thought",
    empty: "The pool is still. Be the first to dive in.",
    policyNote: "Respect & Love is Mandatory in the pool."
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
    joinButton: "Join the Mission",
    forgotPassword: "Forgot Password?"
  },
  home: {
    heroTitle: "Spark Love. End Poverty.",
    heroSubtitle: "Connecting hearts across every city and village to create opportunities, friendships, and positive change. Respect is Mandatory.",
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
    anyConnection: "Any Connection",
    deleteAccount: "Delete Account",
    deleteWarningTitle: "Are you absolutely sure?",
    deleteWarningDesc: "This action cannot be undone. All your matches, messages, and mission history will be permanently deleted.",
    deleteConfirm: "Yes, Delete Forever",
    deleteCancel: "Keep My Account"
  },
  feedback: {
    title: "Community Heartbeat",
    subtitle: "Shape the Revolution",
    category: "Feedback Type",
    app: "App Ripple (Bug)",
    mission: "Mission Idea",
    story: "Love Story",
    placeholder: "How can we improve the revolution?",
    submit: "Send to Mission Control",
    successTitle: "Mission Recorded",
    successDesc: "Your heart's voice has reached us. Together, we eliminate poverty. ❤️"
  }
};

export const TRANSLATIONS: Record<LanguageCode, any> = {
  English: baseTranslations,
  Spanish: {
    ...baseTranslations,
    nav: { home: "Inicio", discover: "Descubrir", search: "Buscar", global: "Global", pool: "Piscina de Ideas", matches: "Corazones", shop: "Tienda", profile: "Perfil" },
    pool: { title: "Piscina de Prosperidad", subtitle: "Nade en el océano del conocimiento", economy: "Economía", politics: "Política", science: "Ciencia", technology: "Tecnología" },
    login: { ...baseTranslations.login, forgotPassword: "¿Olvidaste tu contraseña?" }
  },
  French: {
    ...baseTranslations,
    nav: { home: "Accueil", discover: "Découvrir", search: "Rechercher", global: "Global", pool: "Bassin d'idées", matches: "Cœurs", shop: "Boutique", profile: "Profil" },
    login: { ...baseTranslations.login, forgotPassword: "Mot de passe oublié ?" }
  }
};

export const DEFAULT_LANGUAGE = "English";
