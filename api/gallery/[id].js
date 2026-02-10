// Vercel Serverless Function for gallery display
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  const { id } = req.query;

  console.log('Gallery request for id:', id);

  try {
    const { data: gallery, error } = await supabase
      .from('galleries')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !gallery) {
      console.error('Gallery error:', error);
      return res.status(404).send(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Gallery Not Found</title>
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                max-width: 800px;
                margin: 50px auto;
                padding: 20px;
                text-align: center;
              }
              h1 { color: #ef4444; }
            </style>
          </head>
          <body>
            <h1>Gallery Not Found</h1>
            <p>The gallery you're looking for doesn't exist.</p>
          </body>
        </html>
      `);
    }

    const images = gallery.images || [];
    const imageHTML = images.map((url, index) => `
      <div class="image-container">
        <img src="${url}" alt="Image ${index + 1}" loading="lazy" />
      </div>
    `).join('');

    return res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${gallery.title || 'Image Gallery'}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              background: #f9fafb;
              padding: 20px;
            }
            .container {
              max-width: 1200px;
              margin: 0 auto;
            }
            h1 {
              color: #1f2937;
              margin-bottom: 30px;
              text-align: center;
              font-size: 2rem;
            }
            .gallery {
              display: grid;
              grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
              gap: 20px;
            }
            .image-container {
              background: white;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              transition: transform 0.3s ease;
            }
            .image-container:hover {
              transform: translateY(-5px);
            }
            .image-container img {
              width: 100%;
              height: 300px;
              object-fit: cover;
              display: block;
            }
            @media (max-width: 768px) {
              .gallery {
                grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
              }
              .image-container img {
                height: 200px;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>${gallery.title || 'Image Gallery'}</h1>
            <div class="gallery">
              ${imageHTML}
            </div>
          </div>
        </body>
      </html>
    `);
  } catch (error) {
    console.error('Gallery error:', error);
    return res.status(500).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Error</title>
        </head>
        <body>
          <h1>Server Error</h1>
          <p>Something went wrong.</p>
        </body>
      </html>
    `);
  }
}
