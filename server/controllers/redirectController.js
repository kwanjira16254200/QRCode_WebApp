import { supabase } from '../config/supabase.js';

export const redirect = async (req, res) => {
  try {
    const { shortCode } = req.params;

    const { data: link, error } = await supabase
      .from('links')
      .select('*')
      .eq('short_code', shortCode)
      .single();

    if (error || !link) {
      return res.status(404).json({ message: 'Link not found' });
    }

    if (!link.is_active) {
      return res.status(410).json({ message: 'Link is no longer active' });
    }

    await supabase
      .from('links')
      .update({ clicks: link.clicks + 1 })
      .eq('id', link.id);

    await supabase
      .from('analytics')
      .insert([{
        link_id: link.id,
        user_agent: req.headers['user-agent'],
        referer: req.headers['referer'] || req.headers['referrer'],
        ip_address: req.ip || req.connection.remoteAddress
      }]);

    // Handle different QR code types
    const qrType = link.qr_type || 'url';

    if (qrType === 'text') {
      // For text QR codes, display the text content
      res.send(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${link.title || 'QR Code Content'}</title>
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
                line-height: 1.6;
              }
              .container {
                background: #f9fafb;
                border-radius: 8px;
                padding: 30px;
                margin-top: 40px;
              }
              h1 {
                color: #1f2937;
                margin-bottom: 20px;
              }
              .content {
                background: white;
                padding: 20px;
                border-radius: 6px;
                white-space: pre-wrap;
                word-wrap: break-word;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>${link.title || 'QR Code Content'}</h1>
              <div class="content">${link.original_url}</div>
            </div>
          </body>
        </html>
      `);
    } else if (qrType === 'image') {
      // For image QR codes, display the image or redirect to URL
      if (link.original_url.startsWith('data:')) {
        // Base64 image - display it
        res.send(`
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>${link.title || 'QR Code Image'}</title>
              <style>
                body {
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                  max-width: 1200px;
                  margin: 0 auto;
                  padding: 20px;
                  text-align: center;
                }
                h1 {
                  color: #1f2937;
                  margin-bottom: 20px;
                }
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
        // URL - redirect to it
        res.redirect(302, link.original_url);
      }
    } else {
      // Default: URL type - redirect
      res.redirect(302, link.original_url);
    }
  } catch (error) {
    console.error('Redirect error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
