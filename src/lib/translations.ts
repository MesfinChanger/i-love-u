

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
    nav: { home: "Inicio", discover: "Descubrir", search: "Buscar", global: "Global", matches: "Corazones", shop: "Tienda", profile: "Perfil" },
    login: { ...baseTranslations.login, title: "TE AMO", signIn: "Entrar", join: "Unirse", launch: "Iniciar", joinRevolution: "Unirse a la Revolución", guest: "Invitado", ageVerify: "Tengo 18+ años", respectVerify: "El Respeto es Obligatorio", humanVerify: "Verificar Humano" },
    home: { ...baseTranslations.home, heroTitle: "Chispa de Amor. Fin de la Pobreza.", heroSubtitle: "Uniendo corazones en cada ciudad y pueblo para crear oportunidades, amistades y cambios positivos. El respeto es obligatorio.", launchButton: "Iniciar Chispa", supportButton: "Apoyar Misión", metricTitle: "La Felicidad es la Única Métrica." },
    discover: { ...baseTranslations.discover, mystery: "Conexión Misteriosa", revealed: "Corazón Revelado", invite: "Invitar", spark: "Chispa" },
    feedback: { title: "Latido de la Comunidad", subtitle: "Dale forma a la Revolución", category: "Tipo de Comentarios", app: "Problema técnico", mission: "Idea de la Misión", story: "Historia de Amor", placeholder: "¿Cómo podemos mejorar la revolución?", submit: "Enviar a Control de Misión", successTitle: "Misión Registrada", successDesc: "La voz de tu corazón nos ha llegado. Juntos eliminamos la pobreza. ❤️" }
  },
  French: {
    ...baseTranslations,
    nav: { home: "Accueil", discover: "Découvrir", search: "Rechercher", global: "Global", matches: "Cœurs", shop: "Boutique", profile: "Profil" },
    login: { ...baseTranslations.login, title: "JE T'AIME", signIn: "Se Connecter", join: "Rejoindre", launch: "Lancer", joinRevolution: "Rejoindre la Révolution" },
    home: { ...baseTranslations.home, heroTitle: "Étincelle d'Amour. Fin de la Pauvreté.", heroSubtitle: "Relier les cœurs dans chaque ville et village pour créer des opportunités, des amitiés et des changements positifs. Le respect est obligatoire.", metricTitle: "Le Bonheur est la Seule Mesure." },
    discover: { ...baseTranslations.discover, mystery: "Connexion Mystère", revealed: "Cœur Révélé", invite: "Inviter", spark: "Étincelle" },
    feedback: { title: "Battement de Cœur Communautaire", subtitle: "Façonner la Révolution", category: "Type de Retour", app: "Problème technique", mission: "Idée de Mission", story: "Histoire d'Amour", placeholder: "Comment pouvons-nous améliorer la révolution ?", submit: "Envoyer au Contrôle de Mission", successTitle: "Mission Enregistrée", successDesc: "La voix de votre cœur nous est parvenue. Ensemble, nous éliminons la pauvreté. ❤️" }
  },
  Swahili: {
    ...baseTranslations,
    nav: { home: "Nyumbani", discover: "Gundua", search: "Tafuta", global: "Ulimwengu", matches: "Mioyo Yangu", shop: "Duka", profile: "Wasifu" },
    home: { ...baseTranslations.home, heroTitle: "Cheche ya Upendo. Komesha Umaskini.", heroSubtitle: "Kuunganisha mioyo katika kila mji na kijiji ili kuunda fursa, urafiki, na mabadiliko chanya. Heshima ni lazima.", metricTitle: "Furaha ndio Kipimo Pekee." },
    feedback: { title: "Mapigo ya Moyo ya Jumuiya", subtitle: "Jenga Mapinduzi", category: "Aina ya Maoni", app: "Tatizo la Programu", mission: "Wazo la Misheni", story: "Hadithi ya Mapenzi", placeholder: "Tunawezaje kuboresha mapinduzi?", submit: "Tuma kwa Udhibiti wa Misheni", successTitle: "Misheni Imehifadhiwa", successDesc: "Sauti ya moyo wako imetufikia. Pamoja, tunaangamiza umaskini. ❤️" }
  },
  Amharic: {
    ...baseTranslations,
    nav: { home: "መነሻ", discover: "ይፈልጉ", search: "ይፈልጉ", global: "ዓለም አቀፍ", matches: "ልቦች", shop: "ሱቅ", profile: "መገለጫ" },
    home: { ...baseTranslations.home, heroTitle: "የፍቅር ብልጭታ። ድህነትን ያብቁ።", heroSubtitle: "እድሎችን፣ ወዳጅነትን እና አወንታዊ ለውጦችን ለመፍጠር በየከተማው እና በየመንደሩ ልቦችን ማገናኘት። መከባበር ግዴታ ነው።", metricTitle: "ደስታ ብቸኛው መለኪያ ነው።" }
  }
};

export const DEFAULT_LANGUAGE = "English";

