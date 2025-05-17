import { useEffect, useState } from 'react';
import { PopupPosition } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Import types from CreatePopupLink
type PopupShape = 'rounded' | 'square' | 'pill' | 'circle';
type PopupSize = 'small' | 'medium' | 'large' | 'custom';

interface PopupPreviewProps {
  popupMessage: string;
  buttonLabel: string;
  buttonUrl: string;
  popupPosition: PopupPosition;
  popupDelay: number;
  popupImage?: string | null; // URL for image preview
  popupShape?: PopupShape;
  popupSize?: PopupSize;
  customWidth?: string;
  customHeight?: string;
}

export const PopupPreview = ({
  popupMessage,
  buttonLabel,
  buttonUrl,
  popupPosition,
  popupDelay,
  popupImage,
  popupShape = 'rounded',
  popupSize = 'medium',
  customWidth = '400',
  customHeight = '300',
}: PopupPreviewProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, popupDelay * 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [popupDelay]);

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
  };
  
  // Define shape classes based on the selected shape
  const shapeClasses = {
    'rounded': 'rounded-lg',
    'square': 'rounded-none',
    'pill': 'rounded-full',
    'circle': 'rounded-full aspect-square',
  };
  
  // Define size classes based on the selected size
  const sizeClasses = {
    'small': 'w-64',
    'medium': 'w-80',
    'large': 'w-96',
    'custom': '',  // Custom size will use inline styles
  };

  if (!visible) return null;
  
  // Calculate styles for custom size
  const customStyles = popupSize === 'custom' ? {
    width: `${customWidth}px`,
    height: `${customHeight}px`,
  } : {};

  return (
    <div
      className={cn(
        'absolute z-50 bg-white dark:bg-gray-800 shadow-lg p-4 border border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out overflow-auto',
        positionClasses[popupPosition],
        shapeClasses[popupShape],
        popupSize !== 'custom' && sizeClasses[popupSize]
      )}
      style={customStyles}
    >
      <div className="space-y-3">
        {popupImage && (
          <div className="mb-3">
            <img 
              src={popupImage} 
              alt="Popup image" 
              className="w-full h-auto rounded-md" 
            />
          </div>
        )}
        <p className="text-sm">{popupMessage}</p>
        <Button 
          className="w-full"
          onClick={() => window.open(buttonUrl, '_blank')}
        >
          {buttonLabel}
        </Button>
      </div>
    </div>
  );
}
