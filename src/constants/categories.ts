/**
 * @fileOverview Standardized Categories for the Prosperity Marketplace and Idea Pool.
 * Used to classify artisan stores, product listings, and community thoughts globally.
 */

export const shoppingCategories = [
  "Fashion",
  "Electronics",
  "Food",
  "Home",
  "Books",
  "Services",
  "Handmade",
  "Technology",
  "Education",
  "Other"
];

export const ideaCategories = [
  {
    name: "Economics",
    icon: "💰",
    value: "economics",
    description: "Requires Seller or Advertiser status"
  },
  {
    name: "Technology",
    icon: "💻",
    value: "technology",
    description: "Requires Seller or Admin status"
  },
  {
    name: "Science",
    icon: "🔬",
    value: "science",
    description: "Requires Verified Heart status"
  },
  {
    name: "Politics",
    icon: "🏛",
    value: "politics",
    description: "Restricted to Platform Administrators"
  },
  {
    name: "Philosophy",
    icon: "🧠",
    value: "philosophy",
    description: "Requires Verified Heart status"
  },
  {
    name: "General",
    icon: "🌎",
    value: "general",
    description: "Open to all Community Hearts"
  }
];
