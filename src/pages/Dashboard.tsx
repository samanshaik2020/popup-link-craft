import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { popupLinks, PopupPosition } from '@/lib/supabase';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, ExternalLink, Trash2, Edit, Save, X } from "lucide-react";
import { PopupPreview } from '../components/PopupPreview';

// Using the PopupLink type from supabase.ts
import { PopupLink } from '@/lib/supabase';

type FormData = {
  destinationUrl: string;
  popupMessage: string;
  buttonLabel: string;
  buttonUrl: string;
  popupPosition: PopupPosition;
  popupDelay: number;
  customCode: string;
};

const initialFormData: FormData = {
  destinationUrl: '',
  popupMessage: 'Check out our special offer!',
  buttonLabel: 'Learn More',
  buttonUrl: '',
  popupPosition: 'bottom-right',
  popupDelay: 3,
  customCode: '',
};

export default function Dashboard() {
  const [userLinks, setUserLinks] = useState<PopupLink[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [editingLink, setEditingLink] = useState<PopupLink | null>(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if not logged in
  useEffect(() => {
    if (user === null) {
      navigate('/auth');
    }
  }, [user, navigate]);

  // Fetch user links
  useEffect(() => {
    const fetchLinks = async () => {
      if (user) {
        setIsFetching(true);
        try {
          const { data, error } = await popupLinks.getAllPopupLinks();
          
          if (error) {
            toast({
              variant: "destructive",
              title: "Error fetching links",
              description: error.message,
            });
          } else if (data) {
            setUserLinks(data as PopupLink[]);
          }
        } catch (err: any) {
          toast({
            variant: "destructive",
            title: "Error",
            description: err.message,
          });
        } finally {
          setIsFetching(false);
        }
      }
    };

    fetchLinks();
  }, [user, toast]);

  // Handle input changes for the edit form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle position change for the edit form
  const handlePositionChange = (value: string) => {
    setFormData((prev) => ({ ...prev, popupPosition: value as PopupPosition }));
  };

  // Handle delay change for the edit form
  const handleDelayChange = (value: number[]) => {
    setFormData((prev) => ({ ...prev, popupDelay: value[0] }));
  };

  // Start editing a link
  const startEditing = (link: PopupLink) => {
    setEditingLink(link);
    setFormData({
      destinationUrl: link.destination_url,
      popupMessage: link.popup_message,
      buttonLabel: link.button_label,
      buttonUrl: link.button_url,
      popupPosition: link.popup_position as PopupPosition,
      popupDelay: link.popup_delay,
      customCode: link.short_code,
    });
    setShowPreview(false);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingLink(null);
    setFormData(initialFormData);
    setShowPreview(false);
  };

  // Save edited link
  const saveEditedLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLink) return;
    
    setLoading(true);

    try {
      // First delete the old link
      await popupLinks.deletePopupLink(editingLink.short_code);
      
      // Then create a new one with the same short code
      const { data, error } = await popupLinks.createPopupLink({
        destinationUrl: formData.destinationUrl,
        popupMessage: formData.popupMessage,
        buttonLabel: formData.buttonLabel,
        buttonUrl: formData.buttonUrl || formData.destinationUrl,
        popupPosition: formData.popupPosition as PopupPosition,
        popupDelay: formData.popupDelay,
        customCode: formData.customCode, // Use the same short code
      });
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Error updating link",
          description: error.message,
        });
      } else {
        toast({
          title: "Success!",
          description: "Link updated successfully.",
        });
        
        // Refresh links
        const { data: updatedLinks } = await popupLinks.getAllPopupLinks();
        if (updatedLinks) {
          setUserLinks(updatedLinks as PopupLink[]);
        }
        
        // Clear form and exit edit mode
        cancelEditing();
      }
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  // Copy link to clipboard
  const copyToClipboard = (shortCode: string) => {
    const shortUrl = `${import.meta.env.VITE_SHORT_LINK_BASE_URL}${shortCode}`;
    navigator.clipboard.writeText(shortUrl);
    toast({
      title: "Copied!",
      description: "Link copied to clipboard.",
    });
  };

  // Delete link
  const handleDeleteLink = async (shortCode: string) => {
    try {
      const { error } = await popupLinks.deletePopupLink(shortCode);
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Error deleting link",
          description: error.message,
        });
      } else {
        toast({
          title: "Success",
          description: "Link deleted successfully.",
        });
        
        // Update links list
        setUserLinks(userLinks.filter(link => link.short_code !== shortCode));
      }
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message,
      });
    }
  };

  // Toggle preview
  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  return (
    <div className="container py-10 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8">Popup Links Dashboard</h1>
      
      {editingLink ? (
        // Edit Link Form
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Edit Popup Link</CardTitle>
              <CardDescription>
                Update your popup link settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={saveEditedLink} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="destinationUrl">Destination URL</Label>
                  <Input
                    id="destinationUrl"
                    name="destinationUrl"
                    placeholder="https://example.com"
                    value={formData.destinationUrl}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="popupMessage">Popup Message</Label>
                  <Textarea
                    id="popupMessage"
                    name="popupMessage"
                    placeholder="Check out our special offer!"
                    value={formData.popupMessage}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="buttonLabel">Button Label</Label>
                    <Input
                      id="buttonLabel"
                      name="buttonLabel"
                      placeholder="Learn More"
                      value={formData.buttonLabel}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="buttonUrl">Button URL (Optional)</Label>
                    <Input
                      id="buttonUrl"
                      name="buttonUrl"
                      placeholder="https://example.com/offer"
                      value={formData.buttonUrl}
                      onChange={handleInputChange}
                    />
                    <p className="text-xs text-muted-foreground">
                      If left empty, will use destination URL
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="popupPosition">Popup Position</Label>
                  <Select 
                    value={formData.popupPosition} 
                    onValueChange={handlePositionChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="top-left">Top Left</SelectItem>
                      <SelectItem value="top-right">Top Right</SelectItem>
                      <SelectItem value="bottom-left">Bottom Left</SelectItem>
                      <SelectItem value="bottom-right">Bottom Right</SelectItem>
                      <SelectItem value="center">Center</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="popupDelay">Popup Delay (seconds)</Label>
                    <span>{formData.popupDelay}s</span>
                  </div>
                  <Slider
                    id="popupDelay"
                    min={0}
                    max={10}
                    step={1}
                    value={[formData.popupDelay]}
                    onValueChange={handleDelayChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="customCode">Short Code</Label>
                  <Input
                    id="customCode"
                    name="customCode"
                    value={formData.customCode}
                    readOnly
                    disabled
                  />
                  <p className="text-xs text-muted-foreground">
                    Short code cannot be changed
                  </p>
                </div>
                
                <div className="pt-4 flex justify-between">
                  <Button type="button" variant="outline" onClick={togglePreview}>
                    {showPreview ? "Hide Preview" : "Show Preview"}
                  </Button>
                  <div className="space-x-2">
                    <Button type="button" variant="outline" onClick={cancelEditing}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                      {loading ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
          
          <div>
            {showPreview && (
              <Card>
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                  <CardDescription>
                    This is how your popup will look
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[500px] relative overflow-hidden border rounded-md">
                  <PopupPreview 
                    popupMessage={formData.popupMessage}
                    buttonLabel={formData.buttonLabel}
                    buttonUrl={formData.buttonUrl || formData.destinationUrl}
                    popupPosition={formData.popupPosition as PopupPosition}
                    popupDelay={0} // Show immediately in preview
                  />
                  <div className="absolute inset-0 bg-gray-100 -z-10 flex items-center justify-center text-gray-400">
                    Website content will appear here
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      ) : (
        // Link History Table
        <Card>
          <CardHeader>
            <CardTitle>My Popup Links</CardTitle>
            <CardDescription>
              View and manage all your popup links
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isFetching ? (
              <div className="text-center py-4">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p>Loading your links...</p>
              </div>
            ) : userLinks.length === 0 ? (
              <div className="text-center py-8">
                <p className="mb-4">You haven't created any popup links yet.</p>
                <Button onClick={() => navigate('/create')}>
                  Create Your First Link
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Short Link</TableHead>
                    <TableHead>Destination URL</TableHead>
                    <TableHead>Popup Message</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Clicks</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userLinks.map((link) => (
                    <TableRow key={link.id}>
                      <TableCell>
                        <div className="font-medium">{link.short_code}</div>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {link.destination_url}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {link.popup_message}
                      </TableCell>
                      <TableCell>
                        {new Date(link.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{link.clicks}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => copyToClipboard(link.short_code)}
                            title="Copy link"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => window.open(`${import.meta.env.VITE_SHORT_LINK_BASE_URL}${link.short_code}`, '_blank')}
                            title="Open link"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => startEditing(link)}
                            title="Edit link"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteLink(link.short_code)}
                            title="Delete link"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <div></div>
            <Button onClick={() => navigate('/create')}>
              Create New Link
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
