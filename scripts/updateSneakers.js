const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');

const sneakers = require('../data/sneakers.json');

async function checkAvailability(sneaker) {
  try {
    const response = await axios.get(sneaker.url);
    const $ = cheerio.load(response.data);

    const soldOutText = $('button[disabled], .sold-out, .product__form .product__submit[disabled]').text().toLowerCase();
    const isSoldOut = soldOutText.includes('vypredané') || soldOutText.includes('sold out');

    // Nájdi obrázok a cenu
    const image = $('meta[property="og:image"]').attr('content') || '';
    const price = $('[data-product-price], .price').first().text().trim() || '';

    return {
      ...sneaker,
      available: !isSoldOut,
      image: image,
      price: price
    };
  } catch (error) {
    console.error(`Chyba pri kontrole: ${sneaker.name}`, error.message);
    return { ...sneaker, available: false };
  }
}

(async () => {
  const updatedSneakers = [];
  for (const sneaker of sneakers) {
    const updated = await checkAvailability(sneaker);
    console.log(`${updated.name}: ${updated.available ? 'Dostupné' : 'Nedostupné'}`);
    updatedSneakers.push(updated);
  }

  fs.writeFileSync('./data/sneakers.json', JSON.stringify(updatedSneakers, null, 2));
})();
