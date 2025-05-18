import fetch from "node-fetch";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase.from('teams').select('*');
      if (error) throw error;
      return res.status(200).json(data);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to fetch teams' });
    }
  }

  if (req.method === 'POST') {
    try {
      const response = await fetch('https://api.balldontlie.io/v1/teams', {
        headers: {
          Authorization: process.env.BALLDONTLIE_API_KEY
        }
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

      const { data: inserted, error } = await supabase.from('teams').insert(formattedTeams);
      if (error) throw error;

      return res.status(200).json({ message: 'Teams imported successfully', count: inserted.length });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to import teams' });
    }
  }
}