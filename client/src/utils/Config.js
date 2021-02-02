function fixedEncodeURI(str) {
  return encodeURI(str).replace(/%5B/g, '[').replace(/%5D/g, ']');
}

const wsUrl = fixedEncodeURI(
  'http://[2a02:2149:840f:3200:d85d:e680:e068:7e57]:8883'
);

export const backendApiUrl = {
  server: 'http://[2a02:2149:840f:3200:d85d:e680:e068:7e57]:5000/',
  ws: 'http://[2a02:2149:840f:3200:d85d:e680:e068:7e57]:8883',
};
