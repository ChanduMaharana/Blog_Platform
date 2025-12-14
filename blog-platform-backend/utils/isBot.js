export function isBot(userAgent = '') {
  return /googlebot|bingbot|yandex|duckduckbot|baiduspider|facebookexternalhit|twitterbot|linkedinbot/i
    .test(userAgent);
}
