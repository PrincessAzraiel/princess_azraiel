import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { username, password, level } = req.body;

  if (!username || !password || !level) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  try {
    // Here you send to your Discord webhook (hide it in env vars later)
    // Example:
    await fetch('https://discord.com/api/webhooks/1366483221516128336/JvNIFLC6lP75Uup4IkNI47tgBXGNWwcPtcqKCQVUK1hcj3NoIN0Ji-ME8QULcVIZS_fk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: `💖 New offering from @${username}!\nLevel: ${level}`
      })
    });

    return res.status(200).json({ message: 'Offering received' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server Error' });
  }
}
