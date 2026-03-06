import React from 'react';

export default function PrincessOSLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-black m-0 p-0 font-sans z-50">
      {/* THE OVERRIDE: 
        Since we cannot conditionally hide the <Nav /> in the RootLayout, 
        we inject a style tag that applies only when this nested layout is active.
      */}
      <style dangerouslySetInnerHTML={{ __html: `
        /* Hide standard nav and header tags */
        nav, header[class*="nav"] {
          display: none !important;
        }
        
        /* If your <Nav /> component uses a specific div class instead of a <nav> tag, 
           you can add it below (e.g., .my-custom-nav { display: none !important; }) 
        */

        /* Reset any padding/margin the parent <main> tag might be applying */
        main {
          padding: 0 !important;
          margin: 0 !important;
          max-width: 100% !important;
        }
      `}} />
      
      {children}
    </div>
  );
}