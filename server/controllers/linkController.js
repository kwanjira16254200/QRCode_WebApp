import { nanoid } from 'nanoid';
import { supabase } from '../config/supabase.js';

export const createLink = async (req, res) => {
  try {
    const { title, originalUrl, isDynamic = true, qrType = 'url', content, designSettings } = req.body;

    if (!title || !originalUrl) {
      return res.status(400).json({ message: 'Title and URL are required' });
    }

    // Validate qrType
    const validTypes = ['url', 'pdf', 'video', 'image', 'facebook', 'instagram', 'whatsapp', 'text', 'email', 'phone', 'sms', 'wifi', 'vcard', 'location'];
    if (!validTypes.includes(qrType)) {
      return res.status(400).json({ message: 'Invalid QR type' });
    }

    const shortCode = nanoid(8);

    // Prepare insert data - only include fields that exist in the table
    const insertData = {
      user_id: req.user.id,
      title,
      original_url: originalUrl,
      short_code: shortCode
    };

    // Try to add new fields, but don't fail if they don't exist
    try {
      insertData.is_dynamic = isDynamic;
      insertData.qr_type = qrType;
      insertData.content = content || null;
      insertData.design_settings = designSettings || null;
    } catch (e) {
      console.warn('Some fields may not exist in links table:', e.message);
    }

    const { data: link, error } = await supabase
      .from('links')
      .insert([insertData])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      return res.status(500).json({ 
        message: 'Server error', 
        error: error.message,
        hint: error.hint 
      });
    }

    res.status(201).json({
      _id: link.id,
      title: link.title,
      originalUrl: link.original_url,
      shortCode: link.short_code,
      clicks: link.clicks,
      isActive: link.is_active,
      isDynamic: link.is_dynamic,
      qrType: link.qr_type,
      content: link.content,
      designSettings: link.design_settings,
      createdAt: link.created_at
    });
  } catch (error) {
    console.error('Create link error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getLinks = async (req, res) => {
  try {
    const { data: links, error } = await supabase
      .from('links')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ message: 'Server error' });
    }

    const formattedLinks = links.map(link => ({
      _id: link.id,
      title: link.title,
      originalUrl: link.original_url,
      shortCode: link.short_code,
      clicks: link.clicks,
      isActive: link.is_active,
      isDynamic: link.is_dynamic,
      qrType: link.qr_type || 'url',
      content: link.content,
      designSettings: link.design_settings,
      createdAt: link.created_at,
      updatedAt: link.updated_at
    }));

    res.json(formattedLinks);
  } catch (error) {
    console.error('Get links error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getLink = async (req, res) => {
  try {
    const { data: link, error } = await supabase
      .from('links')
      .select('*')
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .single();

    if (error || !link) {
      return res.status(404).json({ message: 'Link not found' });
    }

    res.json({
      _id: link.id,
      title: link.title,
      originalUrl: link.original_url,
      shortCode: link.short_code,
      clicks: link.clicks,
      isActive: link.is_active,
      isDynamic: link.is_dynamic,
      qrType: link.qr_type,
      content: link.content,
      designSettings: link.design_settings,
      createdAt: link.created_at,
      updatedAt: link.updated_at
    });
  } catch (error) {
    console.error('Get link error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateLink = async (req, res) => {
  try {
    const { title, originalUrl, isActive, qrType, content, designSettings } = req.body;

    // ตรวจสอบว่า link เป็น dynamic หรือไม่
    const { data: existingLink } = await supabase
      .from('links')
      .select('is_dynamic')
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .single();

    if (!existingLink) {
      return res.status(404).json({ message: 'Link not found' });
    }

    // ถ้าเป็น Static QR และพยายามแก้ไข URL
    if (!existingLink.is_dynamic && originalUrl) {
      return res.status(400).json({ 
        message: 'ไม่สามารถแก้ไข URL ของ Static QR Code ได้' 
      });
    }

    const updateData = {};
    if (title) updateData.title = title;
    if (originalUrl) updateData.original_url = originalUrl;
    if (typeof isActive !== 'undefined') updateData.is_active = isActive;
    if (qrType) updateData.qr_type = qrType;
    if (content) updateData.content = content;
    if (designSettings) updateData.design_settings = designSettings;
    updateData.updated_at = new Date().toISOString();

    const { data: link, error } = await supabase
      .from('links')
      .update(updateData)
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .select()
      .single();

    if (error || !link) {
      return res.status(404).json({ message: 'Link not found' });
    }

    res.json({
      _id: link.id,
      title: link.title,
      originalUrl: link.original_url,
      shortCode: link.short_code,
      clicks: link.clicks,
      isActive: link.is_active,
      isDynamic: link.is_dynamic,
      qrType: link.qr_type,
      content: link.content,
      designSettings: link.design_settings,
      createdAt: link.created_at,
      updatedAt: link.updated_at
    });
  } catch (error) {
    console.error('Update link error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteLink = async (req, res) => {
  try {
    const { error } = await supabase
      .from('links')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.user.id);

    if (error) {
      return res.status(404).json({ message: 'Link not found' });
    }

    res.json({ message: 'Link deleted successfully' });
  } catch (error) {
    console.error('Delete link error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getLinkAnalytics = async (req, res) => {
  try {
    const { data: link, error: linkError } = await supabase
      .from('links')
      .select('*')
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .single();

    if (linkError || !link) {
      return res.status(404).json({ message: 'Link not found' });
    }

    const { data: analytics, error: analyticsError } = await supabase
      .from('analytics')
      .select('*')
      .eq('link_id', req.params.id)
      .order('timestamp', { ascending: false })
      .limit(100);

    const { data: dailyData } = await supabase
      .rpc('get_daily_stats', { link_uuid: req.params.id });

    const dailyStats = dailyData || [];

    res.json({
      totalClicks: link.clicks,
      recentClicks: analytics || [],
      dailyStats: dailyStats.slice(0, 30)
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const { count: totalLinks } = await supabase
      .from('links')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', req.user.id);

    const { data: links } = await supabase
      .from('links')
      .select('id, clicks')
      .eq('user_id', req.user.id);

    const totalClicks = links?.reduce((sum, link) => sum + link.clicks, 0) || 0;

    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const { count: weeklyClicks } = await supabase
      .from('analytics')
      .select('*', { count: 'exact', head: true })
      .in('link_id', links?.map(l => l.id) || [])
      .gte('timestamp', last7Days.toISOString());

    const { data: recentAnalytics } = await supabase
      .from('analytics')
      .select('*, links(title, short_code)')
      .in('link_id', links?.map(l => l.id) || [])
      .order('timestamp', { ascending: false })
      .limit(10);

    res.json({
      totalLinks: totalLinks || 0,
      totalClicks,
      weeklyClicks: weeklyClicks || 0,
      recentActivity: recentAnalytics || []
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
