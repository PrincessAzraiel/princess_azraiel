type DataStore = {
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
};

let dataStore: DataStore = {};

export const getClientId = () => {
  let id = localStorage.getItem('client_id');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('client_id', id);
  }
  return id;
};

export const collectPart = async (key: 'location' | 'offering', value: DataStore['location'] | DataStore['offering']) => {
  dataStore[key] = value;
  dataStore.clientId = getClientId();

  if (dataStore.location && dataStore.offering) {
    try {
      const response = await fetch('/api/submit-offering', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataStore),
      });

      if (!response.ok) throw new Error('Submission failed');
      
      // Reset store while keeping client ID
      dataStore = { clientId: dataStore.clientId };
    } catch (error) {
      console.error('Submission error:', error);
    }
  }
};