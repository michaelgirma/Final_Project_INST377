import express from 'express';
import fetch from 'node-fetch';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();

const SUPABASE_URL = 'https://imnomyidwqqbnikghguh.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imltbm9teWlkd3FxYm5pa2doZ3VoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczNDIwMTMsImV4cCI6MjA2MjkxODAxM30.22eYG5zCmJMTiie7IfhXHGcZ1ToDaCb780B81LWVHwU';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

router.post('/import', async (req, res) => {
  try {
    const response = await fetch('https://api.balldontlie.io/v1/teams', {
      headers: {
        Authorization: '0df59db4-87cc-4293-9217-447202ad8aa7',
      },
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Fetch error: ${response.status} - ${text}`);
    }

    const data = await response.json();

    const formattedTeams = data.data.map(team => ({
      team_id: team.id,
      abbreviation: team.abbreviation,
      city: team.city,
      conference: team.conference,
      division: team.division,
      full_name: team.full_name,
      name: team.name,
    }));

    const { data: inserted, error } = await supabase
      .from('teams')
      .insert(formattedTeams);

    if (error) throw error;

    res.json({ message: 'Teams imported successfully', count: inserted.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to import teams' });
  }
});

router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase.from('teams').select('*');

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch teams' });
  }
});

export default router;