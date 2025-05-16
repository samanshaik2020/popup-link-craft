
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getLinkByShortId, incrementLinkViews } from "@/services/linkService";
import { LinkRecord } from "@/types/popup";
import PopupOverlay from "@/components/PopupOverlay";

const RedirectPage: React.FC = () => {
  const { shortId } = useParams<{ shortId: string }>();
  const [linkData, setLinkData] = useState<LinkRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchLink = async () => {
      if (!shortId) {
        setError("Invalid link");
        setLoading(false);
        return;
      }

      try {
        const linkRecord = await getLinkByShortId(shortId);
        if (linkRecord) {
          setLinkData(linkRecord);
          // Increment the view count
          await incrementLinkViews(shortId);
          
          // Set a timer to show the popup after the specified delay
          setTimeout(() => {
            setShowPopup(true);
          }, linkRecord.delay_seconds * 1000);
        } else {
          setError("Link not found");
        }
      } catch (err) {
        setError("Failed to load link");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLink();
  }, [shortId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !linkData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error</h1>
          <p className="mb-4">{error || "Something went wrong"}</p>
          <a href="/" className="text-primary underline">Return to home</a>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <iframe
        src={linkData.destination_url}
        className="w-full h-full border-0"
        title="Destination website"
        sandbox="allow-scripts allow-same-origin allow-forms"
      ></iframe>
      
      {showPopup && (
        <div className="absolute inset-0 pointer-events-none">
          <PopupOverlay
            popupText={linkData.popup_text}
            buttonText={linkData.button_text}
            buttonUrl={linkData.button_url}
            position={linkData.position}
            onClose={() => setShowPopup(false)}
          />
        </div>
      )}
    </div>
  );
};

export default RedirectPage;
