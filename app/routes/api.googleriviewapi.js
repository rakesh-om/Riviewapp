// /app/routes/api.googleriviewapi.js

import { json } from "@remix-run/node"; // Used for server-side JSON responses

// --- Configuration and Environment Variables ---
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const PLACE_ID = process.env.GOOGLE_PLACE_ID; 

// Note: console.log is useful for debugging but should usually be removed 
// or replaced with a proper logging solution in production.
// console.log(GOOGLE_API_KEY + '**********************');
// console.log(PLACE_ID + '***************************************');

/**
 * @type {import('@remix-run/node').LoaderFunction}
 * The Remix Loader function serves as your API endpoint handler.
 * It is executed securely on the server side.
 */
export async function loader() {
  const endpoint = `/api/googleriviewapi`; // For logging context

  // 1. Validate Configuration
  if (!GOOGLE_API_KEY) {
    console.error(`${endpoint}: Missing GOOGLE_API_KEY.`);
    return json({ error: "Server configuration error: Google API Key is missing." }, { status: 500 });
  }
  if (!PLACE_ID) {
    console.error(`${endpoint}: Missing GOOGLE_PLACE_ID.`);
    return json({ error: "Server configuration error: Google Place ID is missing." }, { status: 500 });
  }

  // 2. Construct the Google Places API URL
  const googleApiUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=name,rating,review&key=${GOOGLE_API_KEY}`;
  
  try {
    // 3. Fetch data from Google's API
    const response = await fetch(googleApiUrl);
    
    // 4. Handle HTTP errors from Google's server (e.g., 400, 403, 500)
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({})); // Try to parse JSON error, fall back to empty object
        const errorMessage = errorData.error_message || `Status: ${response.status} ${response.statusText}`;
        
        console.error(`${endpoint}: Google API returned an error. URL: ${googleApiUrl}. Message: ${errorMessage}`);
        
        // Return a client-friendly error response
        return json(
            { error: "Failed to fetch reviews from Google. Please check API Key and Place ID." }, 
            { status: 502 } // 502 Bad Gateway is appropriate for upstream service errors
        );
    }

    const data = await response.json();

    // 5. Handle successful response, but check for specific Google status (e.g., 'ZERO_RESULTS')
    if (data.status !== 'OK') {
        const googleError = data.status || 'UNKNOWN_ERROR';
        console.warn(`${endpoint}: Google API status not OK. Status: ${googleError}. Message: ${data.error_message || 'N/A'}`);
        // Return an empty array and a warning status if no reviews or place is found
        return json({ reviews: [], placeName: data.result?.name, warning: `Google Status: ${googleError}` }, { status: 200 });
    }

    // 6. Extract and Return the Reviews
    const reviews = data.result?.reviews || [];
    const placeName = data.result?.name || 'Unknown Location';

    return json({ reviews, placeName }, { status: 200 });
  
  } catch (error) {
    // 7. Handle network or other unexpected errors (e.g., DNS issues, timeout)
    console.error(`${endpoint}: Caught a server-side exception while fetching Google Reviews. Error:`, error);
    return json({ error: "Internal Server Error: Network or unknown failure." }, { status: 500 });
  }
}