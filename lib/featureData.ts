export type Platform = {
  id: string;
  name: string;
  cost: number;
};

export type Feature = {
  id: string;
  name: string;
  category: string;
  cost: number; // Represents average cost (calculated from assumed base hours * $100 baseline)
  runCost?: number;
};

export type AddOn = {
  id: string;
  name: string;
  buildCost: number;
  opEx: number;
};

export const platforms: Platform[] = [
  { id: 'mobile', name: 'Mobile App', cost: 15000 },
  { id: 'web', name: 'Web Platform', cost: 12000 },
  { id: 'cross', name: 'Web + Mobile (Cross-Platform)', cost: 22000 },
];

export const projectFeatures: Feature[] = [
  // Main Features
  { id: 'f1', name: 'Email/Password Sign Up', category: 'Main Features', cost: 1500 },
  { id: 'f2', name: 'Facebook Sign Up', category: 'Main Features', cost: 800 },
  { id: 'f3', name: 'Twitter Sign Up', category: 'Main Features', cost: 800 },
  { id: 'f4', name: 'Google Sign Up', category: 'Main Features', cost: 800 },
  { id: 'f5', name: 'LinkedIn Sign Up', category: 'Main Features', cost: 800 },
  { id: 'f6', name: 'GitHub Sign Up', category: 'Main Features', cost: 800 },
  { id: 'f7', name: 'User Invitation Emails', category: 'Main Features', cost: 1200 },
  { id: 'f8', name: 'Multi-tenant Accounts', category: 'Main Features', cost: 3500 },
  { id: 'f9', name: 'Subdomains', category: 'Main Features', cost: 2000 },
  { id: 'f10', name: 'Custom Domains', category: 'Main Features', cost: 2500 },

  // User Generated Content
  { id: 'u1', name: 'Dashboard', category: 'User Generated Content', cost: 4000 },
  { id: 'u2', name: 'Activity Feed', category: 'User Generated Content', cost: 3500 },
  { id: 'u3', name: 'Media Uploading', category: 'User Generated Content', cost: 2000 },
  { id: 'u4', name: 'User Profile', category: 'User Generated Content', cost: 1500 },
  { id: 'u5', name: 'Transactional Emails', category: 'User Generated Content', cost: 1000 },
  { id: 'u6', name: 'Tags', category: 'User Generated Content', cost: 800 },
  { id: 'u7', name: 'Ratings or Reviews', category: 'User Generated Content', cost: 2500 },
  { id: 'u8', name: 'Media Manipulation', category: 'User Generated Content', cost: 3000 },
  { id: 'u9', name: 'Searching', category: 'User Generated Content', cost: 2500 },

  // Dates & Locations
  { id: 'd1', name: 'Calendaring', category: 'Dates & Locations', cost: 3000 },
  { id: 'd2', name: 'Display of Map Data', category: 'Dates & Locations', cost: 2500 },
  { id: 'd3', name: 'Geolocation', category: 'Dates & Locations', cost: 3500 },
  { id: 'd4', name: 'Bookings', category: 'Dates & Locations', cost: 4500 },

  // Social & Engagement
  { id: 's1', name: 'Messaging', category: 'Social & Engagement', cost: 5000 },
  { id: 's2', name: 'Forms or Commenting', category: 'Social & Engagement', cost: 2000 },
  { id: 's3', name: 'Social Sharing', category: 'Social & Engagement', cost: 1000 },
  { id: 's4', name: 'Push to FB Open Graph', category: 'Social & Engagement', cost: 1500 },
  { id: 's5', name: 'Push Notifications', category: 'Social & Engagement', cost: 3000 },

  // Billing & eCommerce
  { id: 'b1', name: 'Subscription Plans', category: 'Billing & eCommerce', cost: 4000, runCost: 20 },
  { id: 'b2', name: 'Shopping Cart', category: 'Billing & eCommerce', cost: 5000, runCost: 10 },
  { id: 'b3', name: 'User Marketplace', category: 'Billing & eCommerce', cost: 8000, runCost: 100 },
  { id: 'b4', name: 'Payment Processing', category: 'Billing & eCommerce', cost: 3500 },
  { id: 'b5', name: 'Product Management', category: 'Billing & eCommerce', cost: 4000, runCost: 5 },

  // Admin, Feedback & Analytics
  { id: 'a1', name: 'CMS Integration', category: 'Admin, Feedback & Analytics', cost: 3500 },
  { id: 'a2', name: 'User Admin Pages', category: 'Admin, Feedback & Analytics', cost: 2500 },
  { id: 'a3', name: 'Moderation/Content Approval', category: 'Admin, Feedback & Analytics', cost: 3000 },
  { id: 'a4', name: 'Support / Intercom', category: 'Admin, Feedback & Analytics', cost: 1500 },
  { id: 'a5', name: 'Usage Analytics', category: 'Admin, Feedback & Analytics', cost: 2000 },
  { id: 'a6', name: 'Crash Reporting', category: 'Admin, Feedback & Analytics', cost: 1000 },
  { id: 'a7', name: 'Performance Monitoring', category: 'Admin, Feedback & Analytics', cost: 1500 },
  { id: 'a8', name: 'Multilingual Support', category: 'Admin, Feedback & Analytics', cost: 4000 },

  // External APIs & Integrations
  { id: 'e1', name: 'Connect to 3rd Party Services', category: 'External APIs & Integrations', cost: 3000 },
  { id: 'e2', name: 'API for Others to Integrate', category: 'External APIs & Integrations', cost: 4500 },
  { id: 'e3', name: 'SMS Messaging', category: 'External APIs & Integrations', cost: 2000 },
  { id: 'e4', name: 'Phone Number Masking', category: 'External APIs & Integrations', cost: 2500 },

  // Security
  { id: 'se1', name: 'SSL Certificate Security', category: 'Security', cost: 500 },
  { id: 'se2', name: 'DDoS Protection', category: 'Security', cost: 1500 },
  { id: 'se3', name: 'Two-Factor Authentication', category: 'Security', cost: 2500 },

  // Mobile Specific
  { id: 'm1', name: 'App Icon Design', category: 'Mobile Specific', cost: 1000 },
  { id: 'm2', name: 'Cloud Syncing', category: 'Mobile Specific', cost: 3500, runCost: 50 },
  { id: 'm3', name: 'Device Sensor Data', category: 'Mobile Specific', cost: 4000, runCost: 5 },
  { id: 'm4', name: 'Barcodes / QR Codes', category: 'Mobile Specific', cost: 2000 },
  { id: 'm5', name: 'Health Data', category: 'Mobile Specific', cost: 5000, runCost: 20 },
];

export const projectAddOns: AddOn[] = [
  { id: 'a1', name: 'Custom AI Chatbot (RAG)', buildCost: 8000, opEx: 150 },
  { id: 'a2', name: 'Generative AI Features', buildCost: 12000, opEx: 300 },
];
