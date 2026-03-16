export type Platform = {
  id: string;
  name: string;
  cost: number;
  timeWeeks: number;
};

export type Feature = {
  id: string;
  name: string;
  category: string;
  cost: number; // Represents average cost (calculated from assumed base hours * $100 baseline)
  runCost?: number;
  timeWeeks: number;
};

export type AddOn = {
  id: string;
  name: string;
  buildCost: number;
  opEx: number;
  timeWeeks: number;
};

export const platforms: Platform[] = [
  { id: 'mobile', name: 'Mobile App', cost: 15000, timeWeeks: 6 },
  { id: 'web', name: 'Web Platform', cost: 12000, timeWeeks: 4 },
  { id: 'cross', name: 'Web + Mobile (Cross-Platform)', cost: 22000, timeWeeks: 8 },
];

export const projectFeatures: Feature[] = [
  // Main Features
  { id: 'f1', name: 'Email/Password Sign Up', category: 'Main Features', cost: 1500, timeWeeks: 0.5 },
  { id: 'f2', name: 'Facebook Sign Up', category: 'Main Features', cost: 800, timeWeeks: 0.5 },
  { id: 'f3', name: 'Twitter Sign Up', category: 'Main Features', cost: 800, timeWeeks: 0.5 },
  { id: 'f4', name: 'Google Sign Up', category: 'Main Features', cost: 800, timeWeeks: 0.5 },
  { id: 'f5', name: 'LinkedIn Sign Up', category: 'Main Features', cost: 800, timeWeeks: 0.5 },
  { id: 'f6', name: 'GitHub Sign Up', category: 'Main Features', cost: 800, timeWeeks: 0.5 },
  { id: 'f7', name: 'User Invitation Emails', category: 'Main Features', cost: 1200, timeWeeks: 0.5 },
  { id: 'f8', name: 'Multi-tenant Accounts', category: 'Main Features', cost: 3500, timeWeeks: 2.0 },
  { id: 'f9', name: 'Subdomains', category: 'Main Features', cost: 2000, timeWeeks: 1.0 },
  { id: 'f10', name: 'Custom Domains', category: 'Main Features', cost: 2500, timeWeeks: 1.0 },

  // User Generated Content
  { id: 'u1', name: 'Dashboard', category: 'User Generated Content', cost: 4000, timeWeeks: 1.5 },
  { id: 'u2', name: 'Activity Feed', category: 'User Generated Content', cost: 3500, timeWeeks: 1.5 },
  { id: 'u3', name: 'Media Uploading', category: 'User Generated Content', cost: 2000, timeWeeks: 1.0 },
  { id: 'u4', name: 'User Profile', category: 'User Generated Content', cost: 1500, timeWeeks: 1.0 },
  { id: 'u5', name: 'Transactional Emails', category: 'User Generated Content', cost: 1000, timeWeeks: 0.5 },
  { id: 'u6', name: 'Tags', category: 'User Generated Content', cost: 800, timeWeeks: 0.5 },
  { id: 'u7', name: 'Ratings or Reviews', category: 'User Generated Content', cost: 2500, timeWeeks: 1.0 },
  { id: 'u8', name: 'Media Manipulation', category: 'User Generated Content', cost: 3000, timeWeeks: 2.0 },
  { id: 'u9', name: 'Searching', category: 'User Generated Content', cost: 2500, timeWeeks: 1.5 },

  // Dates & Locations
  { id: 'd1', name: 'Calendaring', category: 'Dates & Locations', cost: 3000, timeWeeks: 1.5 },
  { id: 'd2', name: 'Display of Map Data', category: 'Dates & Locations', cost: 2500, timeWeeks: 1.0 },
  { id: 'd3', name: 'Geolocation', category: 'Dates & Locations', cost: 3500, timeWeeks: 1.0 },
  { id: 'd4', name: 'Bookings', category: 'Dates & Locations', cost: 4500, timeWeeks: 2.0 },

  // Social & Engagement
  { id: 's1', name: 'Messaging', category: 'Social & Engagement', cost: 5000, timeWeeks: 2.5 },
  { id: 's2', name: 'Forms or Commenting', category: 'Social & Engagement', cost: 2000, timeWeeks: 1.0 },
  { id: 's3', name: 'Social Sharing', category: 'Social & Engagement', cost: 1000, timeWeeks: 0.5 },
  { id: 's4', name: 'Push to FB Open Graph', category: 'Social & Engagement', cost: 1500, timeWeeks: 0.5 },
  { id: 's5', name: 'Push Notifications', category: 'Social & Engagement', cost: 3000, timeWeeks: 1.0 },

  // Billing & eCommerce
  { id: 'b1', name: 'Subscription Plans', category: 'Billing & eCommerce', cost: 4000, runCost: 20, timeWeeks: 2.0 },
  { id: 'b2', name: 'Shopping Cart', category: 'Billing & eCommerce', cost: 5000, runCost: 10, timeWeeks: 1.5 },
  { id: 'b3', name: 'User Marketplace', category: 'Billing & eCommerce', cost: 8000, runCost: 100, timeWeeks: 3.0 },
  { id: 'b4', name: 'Payment Processing', category: 'Billing & eCommerce', cost: 3500, timeWeeks: 2.0 },
  { id: 'b5', name: 'Product Management', category: 'Billing & eCommerce', cost: 4000, runCost: 5, timeWeeks: 1.5 },

  // Admin, Feedback & Analytics
  { id: 'a1', name: 'CMS Integration', category: 'Admin, Feedback & Analytics', cost: 3500, timeWeeks: 1.5 },
  { id: 'a2', name: 'User Admin Pages', category: 'Admin, Feedback & Analytics', cost: 2500, timeWeeks: 1.5 },
  { id: 'a3', name: 'Moderation/Content Approval', category: 'Admin, Feedback & Analytics', cost: 3000, timeWeeks: 1.5 },
  { id: 'a4', name: 'Support / Intercom', category: 'Admin, Feedback & Analytics', cost: 1500, timeWeeks: 0.5 },
  { id: 'a5', name: 'Usage Analytics', category: 'Admin, Feedback & Analytics', cost: 2000, timeWeeks: 1.0 },
  { id: 'a6', name: 'Crash Reporting', category: 'Admin, Feedback & Analytics', cost: 1000, timeWeeks: 0.5 },
  { id: 'a7', name: 'Performance Monitoring', category: 'Admin, Feedback & Analytics', cost: 1500, timeWeeks: 1.0 },
  { id: 'a8', name: 'Multilingual Support', category: 'Admin, Feedback & Analytics', cost: 4000, timeWeeks: 2.0 },

  // External APIs & Integrations
  { id: 'e1', name: 'Connect to 3rd Party Services', category: 'External APIs & Integrations', cost: 3000, timeWeeks: 1.5 },
  { id: 'e2', name: 'API for Others to Integrate', category: 'External APIs & Integrations', cost: 4500, timeWeeks: 2.0 },
  { id: 'e3', name: 'SMS Messaging', category: 'External APIs & Integrations', cost: 2000, timeWeeks: 1.0 },
  { id: 'e4', name: 'Phone Number Masking', category: 'External APIs & Integrations', cost: 2500, timeWeeks: 1.0 },

  // Security
  { id: 'se1', name: 'SSL Certificate Security', category: 'Security', cost: 500, timeWeeks: 0.5 },
  { id: 'se2', name: 'DDoS Protection', category: 'Security', cost: 1500, timeWeeks: 0.5 },
  { id: 'se3', name: 'Two-Factor Authentication', category: 'Security', cost: 2500, timeWeeks: 1.0 },

  // Mobile Specific
  { id: 'm1', name: 'App Icon Design', category: 'Mobile Specific', cost: 1000, timeWeeks: 0.5 },
  { id: 'm2', name: 'Cloud Syncing', category: 'Mobile Specific', cost: 3500, runCost: 50, timeWeeks: 1.5 },
  { id: 'm3', name: 'Device Sensor Data', category: 'Mobile Specific', cost: 4000, runCost: 5, timeWeeks: 1.5 },
  { id: 'm4', name: 'Barcodes / QR Codes', category: 'Mobile Specific', cost: 2000, timeWeeks: 1.0 },
  { id: 'm5', name: 'Health Data', category: 'Mobile Specific', cost: 5000, runCost: 20, timeWeeks: 1.5 },
];

export const projectAddOns: AddOn[] = [
  { id: 'a1', name: 'Custom AI Chatbot (RAG)', buildCost: 8000, opEx: 150, timeWeeks: 4.0 },
  { id: 'a2', name: 'Generative AI Features', buildCost: 12000, opEx: 300, timeWeeks: 5.0 },
];
