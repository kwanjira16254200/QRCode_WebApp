import { supabase } from '../config/supabase.js';
import { nanoid } from 'nanoid';

// Create a new gallery
export const createGallery = async (req, res) => {
  try {
    const { title, images } = req.body;
    const userId = req.user.id;

    if (!title || !images || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ 
        message: 'Title and images array are required' 
      });
    }

    const galleryId = nanoid(10);

    const { data: gallery, error } = await supabase
      .from('galleries')
      .insert([{
        id: galleryId,
        title,
        images,
        user_id: userId
      }])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ 
        message: 'Failed to create gallery',
        error: error.message 
      });
    }

    res.status(201).json({
      id: gallery.id,
      title: gallery.title,
      images: gallery.images,
      userId: gallery.user_id,
      createdAt: gallery.created_at
    });
  } catch (error) {
    console.error('Create gallery error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get gallery by ID (public - no auth required)
export const getGallery = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: gallery, error } = await supabase
      .from('galleries')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !gallery) {
      return res.status(404).json({ message: 'Gallery not found' });
    }

    res.json({
      id: gallery.id,
      title: gallery.title,
      images: gallery.images,
      createdAt: gallery.created_at
    });
  } catch (error) {
    console.error('Get gallery error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all galleries for a user
export const getUserGalleries = async (req, res) => {
  try {
    const userId = req.user.id;

    const { data: galleries, error } = await supabase
      .from('galleries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ 
        message: 'Failed to fetch galleries',
        error: error.message 
      });
    }

    res.json(galleries.map(g => ({
      id: g.id,
      title: g.title,
      images: g.images,
      imageCount: g.images.length,
      createdAt: g.created_at
    })));
  } catch (error) {
    console.error('Get user galleries error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete gallery
export const deleteGallery = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if gallery belongs to user
    const { data: gallery, error: fetchError } = await supabase
      .from('galleries')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (fetchError || !gallery) {
      return res.status(404).json({ message: 'Gallery not found' });
    }

    // Delete gallery
    const { error: deleteError } = await supabase
      .from('galleries')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (deleteError) {
      console.error('Delete error:', deleteError);
      return res.status(500).json({ 
        message: 'Failed to delete gallery',
        error: deleteError.message 
      });
    }

    res.json({ message: 'Gallery deleted successfully' });
  } catch (error) {
    console.error('Delete gallery error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
