const axios = require('axios');

// Step 1: Get Access Token
async function getAccessToken() {
  const url = 'https://test.api.amadeus.com/v1/security/oauth2/token';
  const data = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: 'wXsejmh6KtjL7O9u05lccZL7oUIYnF0e',
    client_secret: 'snbk9SkFvesjD1Id'
  });

  try {
    const response = await axios.post(url, data.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    return response.data.access_token;
  } catch (err) {
    console.error('Error getting token:', err.response?.data || err.message);
    throw err;
  }
}

// Step 2: Search for Flights
async function searchFlights(token) {
  const url = 'https://test.api.amadeus.com/v2/shopping/flight-offers';
  const params = {
    originLocationCode: 'DEL',
    destinationLocationCode: 'BOM',
    departureDate: '2025-05-25',
    adults: 1,
    max: 5
  };

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization:` Bearer ${token}`
      },
      params
    });

    console.log('Flight Offers:', JSON.stringify(response.data, null, 2));
  } catch (err) {
    console.error('Error fetching flights:', err.response?.data || err.message);
  }
}

// Run both steps
(async () => {
  const token = await getAccessToken();
  await searchFlights(token);
})();