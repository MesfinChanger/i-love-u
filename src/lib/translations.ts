/**
 * @fileOverview Core UI translations for the I Love U platform.
 * Supports the mission of reaching every city and village.
 */

export type LanguageCode = string;

export const TRANSLATIONS: Record<LanguageCode, any> = {
  English: {
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
      humanVerify: "Verify Human Status"
    },
    discover: {
      mystery: "Mystery Connection",
      revealed: "Revealed Heart",
      invite: "Invite",
      spark: "Spark",
      allExplored: "All Hearts Explored"
    },
    search: {
      title: "Find Hearts",
      subtitle: "SEARCH THE REVOLUTION",
      placeholder: "Nickname or Interest...",
      noResults: "No hearts found for this vibration.",
      searching: "Scanning the network..."
    },
    profile: {
      account: "My Account",
      save: "Save",
      signOut: "Sign Out",
      personal: "Info",
      address: "Address",
      public: "Public",
      security: "Security"
    }
  },
  Spanish: {
    nav: {
      discover: "Descubrir",
      search: "Buscar",
      global: "Global",
      matches: "Corazones",
      shop: "Tienda",
      profile: "Perfil"
    },
    login: {
      title: "TE AMO",
      subtitle: "REVOLUCIÓN DE PROSPERIDAD",
      signIn: "Entrar",
      join: "Unirse",
      launch: "Iniciar",
      joinRevolution: "Unirse a la Revolución",
      guest: "Invitado",
      protocol: "Protocolo de Seguridad",
      ageVerify: "Tengo 18+ años",
      respectVerify: "El Respeto es Obligatorio",
      humanVerify: "Verificar Humano"
    },
    discover: {
      mystery: "Conexión Misteriosa",
      revealed: "Corazón Revelado",
      invite: "Invitar",
      spark: "Chispa",
      allExplored: "Corazones Explorados"
    },
    search: {
      title: "Buscar Corazones",
      subtitle: "BUSCAR EN LA REVOLUCIÓN",
      placeholder: "Apodo o Interés...",
      noResults: "No se encontraron corazones.",
      searching: "Escaneando la red..."
    },
    profile: {
      account: "Mi Cuenta",
      save: "Guardar",
      signOut: "Cerrar Sesión",
      personal: "Info",
      address: "Dirección",
      public: "Público",
      security: "Seguridad"
    }
  },
  French: {
    nav: {
      discover: "Découvrir",
      search: "Chercher",
      global: "Global",
      matches: "Matchs",
      shop: "Boutique",
      profile: "Profil"
    },
    login: {
      title: "JE T'AIME",
      subtitle: "RÉVOLUTION DE PROSPÉRITÉ",
      signIn: "Connexion",
      join: "Rejoindre",
      launch: "Lancer",
      joinRevolution: "Rejoindre la Révolution",
      guest: "Mode Invité",
      protocol: "Protocole de Sécurité",
      ageVerify: "J'ai 18+ ans",
      respectVerify: "Le Respect est Obligatoire",
      humanVerify: "Vérification Humaine"
    },
    discover: {
      mystery: "Connexion Mystère",
      revealed: "Cœur Révélé",
      invite: "Inviter",
      spark: "Étincelle",
      allExplored: "Tous les Cœurs Explorés"
    },
    search: {
      title: "Chercher des Cœurs",
      subtitle: "RECHERCHE DANS LA RÉVOLUTION",
      placeholder: "Surnom ou Intérêt...",
      noResults: "Aucun cœur trouvé.",
      searching: "Balayage du réseau..."
    },
    profile: {
      account: "Mon Compte",
      save: "Sauvegarder",
      signOut: "Déconnexion",
      personal: "Info",
      address: "Adresse",
      public: "Public",
      security: "Sécurité"
    }
  },
  Swahili: {
    nav: {
      discover: "Gundua",
      search: "Tafuta",
      global: "Ulimwengu",
      matches: "Mechi",
      shop: "Duka",
      profile: "Wasifu"
    },
    login: {
      title: "NAKUPENDA",
      subtitle: "MAPINDUZI YA MAFANIKIO",
      signIn: "Ingia",
      join: "Jiunge",
      launch: "Anza",
      joinRevolution: "Jiunge na Mapinduzi",
      guest: "Mgeni",
      protocol: "Itifaki ya Usalama",
      ageVerify: "Nina umri wa 18+",
      respectVerify: "Heshima ni Lazima",
      humanVerify: "Thibitisha Binadamu"
    },
    discover: {
      mystery: "Uhusiano wa Siri",
      revealed: "Moyo Uliofichuliwa",
      invite: "Alika",
      spark: "Cheche",
      allExplored: "Mioyo Yote Imegunduliwa"
    },
    search: {
      title: "Tafuta Mioyo",
      subtitle: "TAFUTA MAPINDUZI",
      placeholder: "Jina la Utani au Maslahi...",
      noResults: "Hakuna mioyo iliyopatikana.",
      searching: "Inatafuta kwenye mtandao..."
    },
    profile: {
      account: "Akaunti Yangu",
      save: "Hifadhi",
      signOut: "Ondoka",
      personal: "Habari",
      address: "Anwani",
      public: "Umma",
      security: "Usalama"
    }
  }
};

export const DEFAULT_LANGUAGE = "English";