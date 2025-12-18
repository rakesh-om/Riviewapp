import { json } from "@remix-run/node";

export const action = async ({ request }) => {
  const formData = await request.formData();
  const actionType = formData.get("actionType");
  const apiKey = process.env.SERP_API_KEY;

  if (!apiKey) {
    return json({ error: "Server Error: SERP_API_KEY missing in .env" }, { status: 500 });
  }

  try {
    
    if (actionType === "search") {
      const query = formData.get("query");
      if (!query) return json({ error: "Search query required" }, { status: 400 });

    
      const url = `https://serpapi.com/search.json?engine=google_maps&q=${encodeURIComponent(query)}&type=search&api_key=${apiKey}&google_domain=google.com`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.error) return json({ error: data.error }, { status: 400 });

      let results = [];
      if (data.place_results) results = [data.place_results];
      else if (data.local_results) results = data.local_results;

      return json({ 
        success: true, 
        type: "search_results",
        results: results.map(place => ({
            title: place.title,
            address: place.address,
            rating: place.rating,
            thumbnail: place.thumbnail,
            place_id: place.place_id, 
            data_id: place.data_id, 
            reviews: [] 
        }))
      });
    }

    
    if (actionType === "reviews") {
    
      const dataId = formData.get("dataId");
      const placeId = formData.get("placeId");
      const title = formData.get("title"); 

    
      let apiParams = "";
      if (dataId && dataId !== "undefined") {
          apiParams = `data_id=${dataId}`;
      } else if (placeId) {
          apiParams = `place_id=${placeId}`;
      } else {
          return json({ error: "No ID found for this business." }, { status: 400 });
      }

      console.log(`⭐ Fetching Text Reviews using Params: ${apiParams}`);

      
      const url = `https://serpapi.com/search.json?engine=google_maps_reviews&${apiParams}&api_key=${apiKey}&hl=en`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.error) {
        console.error("SerpApi Error:", data.error);
        return json({ error: data.error }, { status: 400 });
      }

    
      const reviewsArray = data.reviews || [];
      const placeInfo = data.place_info || {};

      console.log(`✅ Reviews Found: ${reviewsArray.length}`);

      return json({
        success: true,
        type: "reviews_data",
        businessName: placeInfo.title || title || "Business Name",
        rating: placeInfo.rating || 0,
        total_reviews: placeInfo.reviews || reviewsArray.length, 
        reviews: reviewsArray 
      });
    }

    return json({ error: "Invalid Action" }, { status: 400 });

  } catch (error) {
    console.error("SerpApi Error:", error);
    return json({ error: "Failed to connect to SerpApi" }, { status: 500 });
  }
};