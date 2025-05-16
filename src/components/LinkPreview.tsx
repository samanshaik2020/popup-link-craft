
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import PopupOverlay from "./PopupOverlay";
import { LinkData } from "./LinkForm";

interface LinkPreviewProps {
  formData: LinkData;
}

const LinkPreview: React.FC<LinkPreviewProps> = ({ formData }) => {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, formData.delaySeconds * 1000);

    return () => clearTimeout(timer);
  }, [formData.delaySeconds]);

  const resetPopup = () => {
    setShowPopup(false);
    setTimeout(() => {
      setShowPopup(true);
    }, formData.delaySeconds * 1000);
  };

  return (
    <div className="relative w-full h-full bg-gray-100 overflow-hidden">
      {/* Fake browser chrome */}
      <div className="bg-gray-200 p-2 flex items-center space-x-2 border-b">
        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        <div className="flex-1 bg-white text-xs py-1 px-2 rounded text-gray-500 truncate">
          {formData.destinationUrl || "https://example.com"}
        </div>
      </div>

      {/* Fake content */}
      <div className="p-4 h-[calc(100%-32px)] overflow-auto">
        <div className="bg-white p-4 rounded shadow-sm mb-4">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="bg-white p-4 rounded shadow-sm mb-4">
          <div className="h-24 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
        <div className="bg-white p-4 rounded shadow-sm">
          <div className="grid grid-cols-3 gap-4">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>

      {/* Popup overlay */}
      {showPopup && (
        <div className="absolute inset-0 pointer-events-none">
          <PopupOverlay
            popupText={formData.popupText}
            buttonText={formData.buttonText}
            buttonUrl={formData.buttonUrl}
            position={formData.position}
            onClose={resetPopup}
          />
        </div>
      )}
    </div>
  );
};

export default LinkPreview;
