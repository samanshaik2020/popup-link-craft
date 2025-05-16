
import React from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { PopupPosition } from "@/types/popup";

interface PopupOverlayProps {
  popupText: string;
  buttonText: string;
  buttonUrl: string;
  position: PopupPosition;
  onClose: () => void;
}

const PopupOverlay: React.FC<PopupOverlayProps> = ({
  popupText,
  buttonText,
  buttonUrl,
  position,
  onClose,
}) => {
  const getPositionClasses = () => {
    switch (position) {
      case "top-left":
        return "top-4 left-4";
      case "top-right":
        return "top-4 right-4";
      case "bottom-left":
        return "bottom-4 left-4";
      case "bottom-right":
        return "bottom-4 right-4";
      case "center":
        return "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2";
      default:
        return "bottom-4 right-4";
    }
  };

  const handleButtonClick = () => {
    if (buttonUrl) {
      window.open(buttonUrl, "_blank");
    }
  };

  return (
    <div
      className={cn(
        "absolute pointer-events-auto max-w-xs w-full bg-white rounded-lg shadow-lg border border-gray-200 p-4",
        getPositionClasses()
      )}
    >
      <div className="flex justify-between items-start mb-2">
        <p className="text-sm font-medium pr-6">{popupText}</p>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors p-1 -mt-1 -mr-1"
        >
          <X size={16} />
        </button>
      </div>
      {buttonText && (
        <Button
          size="sm"
          className="mt-2 w-full"
          onClick={handleButtonClick}
        >
          {buttonText}
        </Button>
      )}
    </div>
  );
};

export default PopupOverlay;
