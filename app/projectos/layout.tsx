import React from 'react';

export default function ProjectOSLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-black m-0 p-0 font-sans z-50 overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: `
        nav, header[class*="nav"] { display: none !important; }
        main { padding: 0 !important; margin: 0 !important; max-width: 100% !important; }
      `}} />
      {children}
    </div>
  );
}