// Vercel Serverless Function for redirect
import { createClient } from '@supabase/supabase-js';

// Vercel serverless functions use process.env
// Make sure SUPABASE_URL and SUPABASE_ANON_KEY are set in Vercel dashboard
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  const { shortCode } = req.query;

  console.log('Redirect request for shortCode:', shortCode);

  try {
    const { data: link, error } = await supabase
      .from('links')
      .select('*')
      .eq('short_code', shortCode)
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(404).json({ message: 'Link not found', error: error.message });
    }

    if (!link) {
      console.log('No link found for shortCode:', shortCode);
      return res.status(404).json({ message: 'Link not found' });
    }

    console.log('Link found:', { id: link.id, title: link.title, url: link.original_url });

    // Check is_active with fallback
    const isActive = link.is_active !== undefined ? link.is_active : true;
    if (!isActive) {
      return res.status(410).json({ message: 'Link is no longer active' });
    }

    // Update clicks
    await supabase
      .from('links')
      .update({ clicks: link.clicks + 1 })
      .eq('id', link.id);

    // Track analytics
    await supabase
      .from('analytics')
      .insert([{
        link_id: link.id,
        user_agent: req.headers['user-agent'],
        referer: req.headers['referer'] || req.headers['referrer'],
        ip_address: req.headers['x-forwarded-for'] || req.connection?.remoteAddress
      }]);

    // Handle different QR code types
    const qrType = link.qr_type || 'url';

    if (qrType === 'text') {
      // Display text content
      return res.send(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${link.title || 'QR Code Content'}</title>
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                max-width: 800px;
                margin: 50px auto;
                padding: 20px;
                line-height: 1.6;
              }
              h1 { color: #1f2937; margin-bottom: 20px; }
              .content { 
                background: #f9fafb;
                padding: 20px;
                border-radius: 8px;
                white-space: pre-wrap;
              }
            </style>
          </head>
          <body>
            <h1>${link.title || 'QR Code Text'}</h1>
            <div class="content">${link.original_url}</div>
          </body>
        </html>
      `);
    } else if (qrType === 'image') {
      // Display image
      return res.send(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${link.title || 'QR Code Image'}</title>
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                max-width: 800px;
                margin: 50px auto;
                padding: 20px;
                text-align: center;
              }
              h1 { color: #1f2937; margin-bottom: 20px; }
              img {
                max-width: 100%;
                height: auto;
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              }
            </style>
          </head>
          <body>
            <h1>${link.title || 'QR Code Image'}</h1>
            <img src="${link.original_url}" alt="${link.title || 'Image'}" />
          </body>
        </html>
      `);
    } else {
      // URL - redirect
      return res.redirect(302, link.original_url);
    }
  } catch (error) {
    console.error('Redirect error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
}
