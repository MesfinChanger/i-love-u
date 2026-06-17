
export interface FlutterTemplate {
  id: string;
  name: string;
  category: 'E-commerce' | 'Social' | 'Portfolio' | 'News' | 'Chat' | 'Fitness';
  description: string;
  imageKey: string;
  features: string[];
  defaultConfig: {
    primaryColor: string;
    packageName: string;
  };
}

export const FLUTTER_TEMPLATES: FlutterTemplate[] = [
  {
    id: 'ecommerce-01',
    name: 'SwiftShop',
    category: 'E-commerce',
    description: 'A complete shopping experience with cart, wishlist, and product galleries.',
    imageKey: 'ecommerce-template',
    features: ['Stripe Integration', 'Wishlist Support', 'Multi-variant Products', 'Product Search'],
    defaultConfig: {
      primaryColor: '#4C26DB',
      packageName: 'com.example.swiftshop'
    }
  },
  {
    id: 'social-01',
    name: 'VibeStream',
    category: 'Social',
    description: 'Dynamic social feed with real-time updates, profiles, and media sharing.',
    imageKey: 'social-template',
    features: ['Real-time Feed', 'User Profiles', 'Image Sharing', 'Like/Comment system'],
    defaultConfig: {
      primaryColor: '#E91E63',
      packageName: 'com.example.vibestream'
    }
  },
  {
    id: 'portfolio-01',
    name: 'CreativeDeck',
    category: 'Portfolio',
    description: 'Elegant personal portfolio to showcase projects, skills, and professional experience.',
    imageKey: 'portfolio-template',
    features: ['Project Gallery', 'Skill Charts', 'Contact Form', 'Resume Download'],
    defaultConfig: {
      primaryColor: '#0C7ABD',
      packageName: 'com.example.portfolio'
    }
  },
  {
    id: 'news-01',
    name: 'DailyDigest',
    category: 'News',
    description: 'Modern blog and news reader with offline support and category filtering.',
    imageKey: 'news-template',
    features: ['RSS Integration', 'Bookmarks', 'Search', 'Categorized Feed'],
    defaultConfig: {
      primaryColor: '#333333',
      packageName: 'com.example.news'
    }
  },
  {
    id: 'chat-01',
    name: 'TalkSpace',
    category: 'Chat',
    description: 'Secure and fast messaging app with group chats and encrypted messaging.',
    imageKey: 'chat-template',
    features: ['Real-time Messaging', 'Group Chats', 'Push Notifications', 'Profile Customization'],
    defaultConfig: {
      primaryColor: '#4CAF50',
      packageName: 'com.example.chat'
    }
  },
  {
    id: 'fitness-01',
    name: 'PulseFlow',
    category: 'Fitness',
    description: 'Workout tracker and goal setting app with interactive progress charts.',
    imageKey: 'fitness-template',
    features: ['Workout Logging', 'Progress Charts', 'Custom Routines', 'Calories Tracker'],
    defaultConfig: {
      primaryColor: '#FF5722',
      packageName: 'com.example.fitness'
    }
  }
];
