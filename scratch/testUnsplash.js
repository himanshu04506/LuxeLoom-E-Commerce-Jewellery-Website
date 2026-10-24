const axios = require('axios');

const ringPhotoIds = [
  '1605100804763-247f67b3557e',
  '1603561591411-07134e71a2a9',
  '1605100804763-247f67b3557e',
  '1603561591411-07134e71a2a9'
];

async function check() {
  for (let i = 0; i < ringPhotoIds.length; i++) {
    const id = ringPhotoIds[i];
    const url = `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&q=80&fm=webp&sig=${i}`;
    try {
      const res = await axios.head(url);
      console.log(`URL ${i}: status ${res.status}`);
    } catch (e) {
      console.log(`URL ${i}: error ${e.message}`);
    }
  }
}

check();
