import fetch from "node-fetch";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default async function handler(req,res) {
    if (req.method === 'GET') {
        try {
            const { data, error } = await supabase.from('players').select('*');
            if (error) throw error;
            return res.status(200).json(data);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Failed to fetch players '});
        }
    }

    if (req.method === 'POST') {
        try {
            const response = await fetch('https://api.balldontlie.io/v1/players?per_page=100', {
                headers: {
                    Authorization: process.env.BALLDONTLIE_API_KEY
                }
            });

            if (!response.ok) {
                const text= await response.text();
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

            const { data: inserted, error } = await supabase.from('players').insert(formattedPlayers);
            if (error) throw error;

            return res.status(200).json({ message: 'Players imported successfully', count: inserted.length });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Failed to import players' });
        }
    }
}