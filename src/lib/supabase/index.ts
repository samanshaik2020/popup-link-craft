// Export everything from the client
export { supabase } from './client';

// Export auth related
export { auth } from './auth';
export type { User } from './auth';

// Export popup links related
export { popupLinks } from './popupLinks';

// Export types
export type { 
  Database,
  PopupLink,
  PopupPosition,
  PopupShape,
  PopupSize
} from './types';
