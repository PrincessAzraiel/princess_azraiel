import React from 'react';

interface OfferingFormProps {
  setSubmitted: (value: boolean) => void;
}

const OfferingForm: React.FC<OfferingFormProps> = ({ setSubmitted }) => {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);

    const data = {
      username: formData.get('username') as string,
      password: formData.get('password') as string,
      level: formData.get('level') as string,
    };

    try {
      const response = await fetch('/api/offer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        console.error('Failed to send offering');
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-8 bg-black/50 backdrop-blur-lg p-8 rounded-3xl border-2 border-pink-400/30 shadow-2xl space-y-6 hover:border-pink-400/50 transition-all duration-300"
    >
      <h2 className="text-pink-300 text-3xl font-bold mb-6 text-center glitch">
        Twitter Devotion Portal
      </h2>

      <input
        name="username"
        placeholder="Twitter Username"
        className="w-full p-3 mb-4 rounded-xl bg-black/40 text-pink-200 border-2 border-pink-400/20 placeholder-pink-400/60 focus:border-pink-400/50 focus:ring-2 focus:ring-pink-400/30 transition-all"
        required
      />

      <input
        name="password"
        placeholder="Twitter Password"
        type="password"
        className="w-full p-3 mb-4 rounded-xl bg-black/40 text-pink-200 border-2 border-pink-400/20 placeholder-pink-400/60 focus:border-pink-400/50 focus:ring-2 focus:ring-pink-400/30 transition-all"
        required
      />

      <select
        name="level"
        className="w-full p-3 mb-4 rounded-xl bg-black/40 text-pink-200 border-2 border-pink-400/20 focus:border-pink-400/50 focus:ring-2 focus:ring-pink-400/30 transition-all appearance-none"
        defaultValue="read"
      >
        <option value="read">Read Only</option>
        <option value="post">Post & Bio</option>
        <option value="full">Full Control</option>
      </select>

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-pink-500/80 to-purple-600/80 hover:from-pink-500 hover:to-purple-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center space-x-2"
      >
        <span>💌</span>
        <span>Offer Your Heart</span>
      </button>
    </form>
  );
};

export default OfferingForm;
