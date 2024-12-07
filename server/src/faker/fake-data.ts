import axios from "axios";
import { faker } from "@faker-js/faker";

const fetchUnsplashImage = async (query: string): Promise<string> => {
  if (!process.env.UNSPLASH_ACCESS_KEY) {
    throw new Error(
      "Unsplash API key is missing. Please set UNSPLASH_ACCESS_KEY in your environment."
    );
  }

  try {
    const response = await axios.get("https://api.unsplash.com/search/photos", {
      params: {
        query,
        per_page: 1,
      },
      headers: {
        Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
      },
    });
    const results = response.data.results;
    return results.length > 0
      ? results[0].urls.small
      : "https://via.placeholder.com/150";
  } catch (error) {
    console.error(`Error fetching image for query "${query}":`, error);
    return "https://via.placeholder.com/150";
  }
};

const generateRandomProducts = async (n: number) => {
  const products = await Promise.all(
    Array.from({ length: n }, async () => {
      const query = faker.commerce.product();
      const imageUrl = await fetchUnsplashImage(query);
      const hsl = faker.color.hsl();
      const color = `hsl(${Math.round(hsl[0])}, ${Math.round(
        hsl[1] * 100
      )}%, ${Math.round(hsl[2] * 100)}%)`;

      return {
        _id: faker.string.uuid(),
        name: faker.commerce.productName(),
        shortName: query,
        description: faker.string.alpha({
          length: {
            min: 70,
            max: 250,
          },
        }),
        price: faker.commerce.price(),
        color: color,
        department: faker.commerce.department(),
        material: faker.commerce.productMaterial(),
        imageUrl,
      };
    })
  );
  return products;
};

export { generateRandomProducts };
