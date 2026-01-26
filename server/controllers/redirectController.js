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

    res.redirect(302, link.original_url);
  } catch (error) {
    console.error('Redirect error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
