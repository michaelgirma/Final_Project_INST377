import express from 'express';
import fetch from 'node-fetch';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();

const SUPABASE_URL = 'https://imnomyidwqqbnikghguh.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imltbm9teWlkd3FxYm5pa2doZ3VoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczNDIwMTMsImV4cCI6MjA2MjkxODAxM30.22eYG5zCmJMTiie7IfhXHGcZ1ToDaCb780B81LWVHwU';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

router.post('/import', async (req, res) => {
  try {
    const response = await fetch('https://api.balldontlie.io/v1/players?per_page=100', {
      headers: {
        Authorization: '0df59db4-87cc-4293-9217-447202ad8aa7' 
      }
    });

    if (!response.ok) {
        const text = await response.text();  
        throw new Error(`Fetch error: ${response.status} - ${text}`);
    }

    const data = await response.json();

    const formattedPlayers = data.data.map(player => ({
      first_name: player.first_name,
      last_name: player.last_name,
      team_name: player.team.full_name,
      position: player.position || 'N/A',
      jersey_number: player.jersey_number || 'N/A',
      college: player.college || 'N/A',
      draft_year: player.draft_year || 'N/A',
      draft_round: player.draft_round || 'N/A',
      draft_number: player.draft_number || 'N/A',
      height: player.height || 'N/A',
      weight: player.weight || 'N/A',
    }));

    const { data: inserted, error } = await supabase
      .from('players')
      .insert(formattedPlayers);

    if (error) throw error;

    res.json({ message: 'Players imported successfully', count: inserted.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to import players' });
  }
});

router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase.from('players').select('*');

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch players' });
  }
});

export default router;