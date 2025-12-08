import { useLoaderData, json } from "@remix-run/react";



import { Card, Page, Text, Layout } from "@shopify/polaris";

/**
 * @type {import('@remix-run/node').LoaderFunction}
 */
export async function loader() {
  // IMPORTANT: When running on your deployed app, use the full URL.
  // For local development, you might need to use a relative path like:
  // const reviewsUrl = "/api/googleriviewapi"; 
  
  // Use the full internal endpoint URL
  const reviewsUrl = new URL("/api/googleriviewapi", process.env.SHOPIFY_APP_URL); 

  try {
    // 1. Fetch data from your internal, secure API endpoint
    const response = await fetch(reviewsUrl.toString());

    if (!response.ok) {
      // Handle errors from your internal API
      const errorData = await response.json();
      throw new Error(errorData.error || `Internal API failed with status ${response.status}`);
    }

    // 2. Parse the successful JSON data
    const data = await response.json();
    
    // 3. Return the data to the component
    return json(data);

  } catch (error) {
    console.error("Error fetching Google Reviews in loader:", error.message);
    // Return an error object or empty data if the fetch fails
    return json({ reviews: [], placeName: "Error loading reviews", error: error.message }, { status: 500 });
  }
}

// ----------------------------------------------------------------------
// 2. The Component (The View)
// ----------------------------------------------------------------------

export default function Index() {
  // Get the data returned from the loader function
  const { reviews, placeName, error } = useLoaderData();

  if (error) {
    return (
      <Page title="Google Reviews Dashboard">
        <Layout>
          <Layout.Section>
            <Card>
              <Text as="h2" variant="headingMd">
                Error Loading Reviews 🛑
              </Text>
              <p>Could not fetch data from the API. Check your API key and Place ID.</p>
              <p>Details: **{error}**</p>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }

  return (
    <Page title={`Reviews for ${placeName}`}>
      <Layout>
        <Layout.Section>
          <Card>
            <Text as="h2" variant="headingMd">
              Latest Google Reviews ({reviews.length} shown)
            </Text>
            {reviews.length > 0 ? (
              <div style={{ marginTop: '20px' }}>
                {reviews.map((review, index) => (
                  <ReviewCard key={index} review={review} />
                ))}
              </div>
            ) : (
              <p>No reviews found for this place ID.</p>
            )}
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

// ----------------------------------------------------------------------
// 3. Simple Display Component
// ----------------------------------------------------------------------

function ReviewCard({ review }) {
  // review structure: { author_name, rating, text, relative_time_description }
  return (
    <Card sectioned title={review.author_name} style={{ marginBottom: '15px' }}>
      <Text as="h3" variant="headingSm">
        Rating: {review.rating} ⭐
      </Text>
      <p>{review.text}</p>
      <Text as="p" variant="bodySm" color="subdued" alignment="end">
        {review.relative_time_description}
      </Text>
    </Card>
  );
}