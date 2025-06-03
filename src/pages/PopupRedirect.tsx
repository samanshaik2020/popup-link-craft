import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { popupLinks, PopupLink } from '@/lib/supabase/index';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function PopupRedirect() {
  const { shortCode } = useParams<{ shortCode: string }>();
  const [popupLink, setPopupLink] = useState<PopupLink | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchLinkData = async () => {
      if (!shortCode) {
        setError('No short code provided');
        setLoading(false);
        return;
      }

      try {
        // Get the link details
        const { data, error: fetchError } = await popupLinks.getPopupLinkByShortCode(shortCode);
        
        if (fetchError || !data) {
          setError('Link not found or has been removed');
          setLoading(false);
          return;
        }

        // Register the click
        await popupLinks.registerClick(shortCode);
        
        // Set the popup link data
        setPopupLink(data as PopupLink);
        setLoading(false);

        // Set timer for showing popup
        if (data.popup_delay > 0) {
          setTimeout(() => {
            setShowPopup(true);
          }, data.popup_delay * 1000);
        } else {
          setShowPopup(true);
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred');
        setLoading(false);
      }
    };

    fetchLinkData();
  }, [shortCode]);

  const handleButtonClick = async () => {
    if (shortCode && popupLink) {
      // Register button click
      await popupLinks.registerButtonClick(shortCode);
      
      // Open the button URL in a new tab
      window.open(popupLink.button_url, '_blank');
    }
  };

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !popupLink) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <h1 className="text-2xl font-bold mb-2">Link Error</h1>
        <p className="mb-4 text-muted-foreground">{error}</p>
        <Button onClick={() => window.location.href = '/'}>
          Go Home
        </Button>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Iframe with destination website */}
      <iframe
        src={popupLink.destination_url}
        className="w-full h-full border-0"
        title="Destination Website"
        sandbox="allow-scripts allow-same-origin allow-forms"
      />

      {/* Popup overlay */}
      {showPopup && (
        <div
          className={cn(
            'absolute z-50 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out',
            positionClasses[popupLink.popup_position as keyof typeof positionClasses]
          )}
        >
          <div className="space-y-3">
            <p className="text-sm">{popupLink.popup_message}</p>
            <Button 
              className="w-full"
              onClick={handleButtonClick}
            >
              {popupLink.button_label}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
