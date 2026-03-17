import { projectFeatures, projectAddOns } from '@/lib/featureData'

// Map from semantic AI IDs to actual feature IDs in featureData.ts
const aiIdToFeatureId: Record<string, string> = {
  "email_signup": "f1",
  "facebook_signup": "f2",
  "twitter_signup": "f3",
  "google_signup": "f4",
  "linkedin_signup": "f5",
  "github_signup": "f6",
  "user_invitation_emails": "f7",
  "multi_tenant_accounts": "f8",
  "subdomains": "f9",
  "custom_domains": "f10",
  "dashboard": "u1",
  "activity_feed": "u2",
  "media_uploading": "u3",
  "user_profile": "u4",
  "transactional_emails": "u5",
  "tags": "u6",
  "ratings_reviews": "u7",
  "media_manipulation": "u8",
  "searching": "u9",
  "calendaring": "d1",
  "map_data": "d2",
  "geolocation": "d3",
  "bookings": "d4",
  "messaging": "s1",
  "forms_commenting": "s2",
  "social_sharing": "s3",
  "fb_open_graph": "s4",
  "push_notifications": "s5",
  "subscription_plans": "b1",
  "shopping_cart": "b2",
  "user_marketplace": "b3",
  "payment_processing": "b4",
  "product_management": "b5",
  "cms_integration": "a1",
  "user_admin_pages": "a2",
  "moderation_approval": "a3",
  "support_intercom": "a4",
  "usage_analytics": "a5",
  "crash_reporting": "a6",
  "performance_monitoring": "a7",
  "multilingual_support": "a8",
  "third_party_services": "e1",
  "api_for_others": "e2",
  "sms_messaging": "e3",
  "phone_masking": "e4",
  "ssl_security": "se1",
  "ddos_protection": "se2",
  "two_factor_auth": "se3",
  "app_icon_design": "m1",
  "cloud_syncing": "m2",
  "device_sensor_data": "m3",
  "barcodes_qr": "m4",
  "health_data": "m5",
};

const aiIdToAddOnId: Record<string, string> = {
  "ai_chatbot": "a1", 
  "gen_ai_features": "a2"
};

const validPlatformIds = new Set(['mobile', 'web', 'cross']);
const validFeatureIds = new Set(projectFeatures.map(f => f.id));
const validAddOnIds = new Set(projectAddOns.map(a => a.id));

export function validateAIResponse(parsed: Record<string, unknown>): {
  platform: string
  features: string[]
  addOns: string[]
} {
  // Validate platform
  let platform = 'web'
  if (typeof parsed.platform === 'string' && validPlatformIds.has(parsed.platform.toLowerCase())) {
    platform = parsed.platform.toLowerCase()
  }

  const features: string[] = [];
  const addOns: string[] = [];

  if (Array.isArray(parsed.features)) {
    parsed.features.forEach((id: unknown) => {
      if (typeof id === 'string') {
        const lowerId = id.toLowerCase();
        // Check if it's a feature
        if (aiIdToFeatureId[lowerId] && validFeatureIds.has(aiIdToFeatureId[lowerId])) {
          features.push(aiIdToFeatureId[lowerId]);
        }
        // Check if it's an addOn
        else if (aiIdToAddOnId[lowerId] && validAddOnIds.has(aiIdToAddOnId[lowerId])) {
          addOns.push(aiIdToAddOnId[lowerId]);
        }
      }
    });
  }

  return { platform, features, addOns }
}
