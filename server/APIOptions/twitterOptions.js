var envVars = require('../../env.json');

module.exports = {
options: { method: 'GET',
  url: 'https://api.twitter.com/1.1/statuses/user_timeline.json',
  qs:
   { oauth_consumer_key: 'mqWa8AeQ946Xu06JQCVcgdg22',
     oauth_token: '94060681-W6UyJxbwIVN57jygEu5fdOiLdJfnJ9PbJbJNvqUW2',
     oauth_signature_method: 'HMAC-SHA1',
     oauth_timestamp: '1489173524',
     oauth_nonce: 'prwE4q',
     oauth_version: '1.0',
     oauth_signature: 'WSDQ2MjQzkpfMBwOsgau7bVhIAc=',
     screen_name: 'jpackel',
     count: '20' },
  headers:
   {'access-token': envVars.twitter_access_token,
    'access-token-secret': envVars.twitter_access_token_secret,
   	'postman-token': 'b8538c8f-a604-f5ec-32d3-20aa4de2e51c',
    'cache-control': 'no-cache' }
  }
}
