import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { popupLinks } from '@/lib/supabase/index';

export default function Redirect() {
  const { shortCode } = useParams<{ shortCode: string }>();
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAndRedirect = async () => {
      if (!shortCode) {
        setError('No short code provided');
        return;
      }

      try {
        // Get the link details
        const { data, error: fetchError } = await popupLinks.getPopupLinkByShortCode(shortCode);
        
        if (fetchError || !data) {
          setError('Link not found or has been removed');
          return;
        }

        // Register the click
        await popupLinks.registerClick(shortCode);
        
        // Redirect to the destination URL
        window.location.href = data.destination_url;
      } catch (err: any) {
        setError(err.message || 'An error occurred');
      }
    };

    fetchAndRedirect();
  }, [shortCode, navigate]);

  // Show loading or error state
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      {error ? (
        <div className="max-w-md">
          <h1 className="text-2xl font-bold mb-2">Link Error</h1>
          <p className="mb-4 text-muted-foreground">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
          >
            Go Home
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p>Redirecting you...</p>
        </div>
      )}
    </div>
  );
}
