import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { popupLinks, PopupPosition, PopupShape, PopupSize } from '@/lib/supabase/index';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, ExternalLink, Trash2, Image as ImageIcon, X } from "lucide-react";
import { PopupPreview } from '../components/PopupPreview';

// Using PopupShape and PopupSize from Supabase types

type FormData = {
  destinationUrl: string;
  popupMessage: string;
  buttonLabel: string;
  buttonUrl: string;
  popupPosition: PopupPosition;
  popupDelay: number;
  customCode: string;
  popupImage: File | null;
  popupShape: PopupShape;
  popupSize: PopupSize;
  customWidth: string; // For custom size
  customHeight: string; // For custom size
};

const initialFormData: FormData = {
  destinationUrl: '',
  popupMessage: 'Check out our special offer!',
  buttonLabel: 'Learn More',
  buttonUrl: '',
  popupPosition: 'bottom-right',
  popupDelay: 3,
  customCode: '',
  popupImage: null,
  popupShape: 'rounded',
  popupSize: 'medium',
  customWidth: '400',
  customHeight: '300',
};

export default function CreatePopupLink() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [userPopupLinks, setUserPopupLinks] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [createdLink, setCreatedLink] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Redirect if not logged in
  useEffect(() => {
    if (user === null) {
      toast({
        title: "Authentication required",
        description: "Please log in to create popup links",
        variant: "default"
      });
      navigate('/auth');
    }
  }, [user, navigate, toast]);

  // Reference to the file input element
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // State for image preview URL
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, popupImage: file }));
    
    // Create a preview URL for the image
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreviewUrl(null);
    }
  };
  
  // Clear the selected image
  const clearSelectedImage = () => {
    setFormData((prev) => ({ ...prev, popupImage: null }));
    setImagePreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handlePositionChange = (value: string) => {
    setFormData((prev) => ({ ...prev, popupPosition: value as PopupPosition }));
  };

  const handleDelayChange = (value: number[]) => {
    setFormData((prev) => ({ ...prev, popupDelay: value[0] }));
  };
  
  const handleShapeChange = (value: string) => {
    setFormData((prev) => ({ ...prev, popupShape: value as PopupShape }));
  };
  
  const handleSizeChange = (value: string) => {
    setFormData((prev) => ({ ...prev, popupSize: value as PopupSize }));
  };

  const handleCreatePopupLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error, shortUrl } = await popupLinks.createPopupLink({
        destinationUrl: formData.destinationUrl,
        popupMessage: formData.popupMessage,
        buttonLabel: formData.buttonLabel,
        buttonUrl: formData.buttonUrl || formData.destinationUrl,
        popupPosition: formData.popupPosition,
        popupDelay: formData.popupDelay,
        customCode: formData.customCode || undefined,
      });
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Error creating popup link",
          description: error.message,
        });
      } else {
        toast({
          title: "Success!",
          description: "Popup link created successfully.",
        });
        
        // Set the created link
        setCreatedLink(shortUrl);
        
        // Clear form
        setFormData(initialFormData);
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
  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: "Copied!",
      description: "Link copied to clipboard.",
    });
  };

  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  return (
    <div className="container py-10 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8">Create Popup Link</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Create a new popup link</CardTitle>
            <CardDescription>
              Create a short link with a custom popup call-to-action
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreatePopupLink} className="space-y-4">
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
                <p className="text-xs text-muted-foreground">
                  The website that will be displayed in the iframe
                </p>
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
              
              <div className="space-y-2">
                <Label htmlFor="popupImage">Popup Image (Optional)</Label>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <ImageIcon className="h-4 w-4" />
                    <span>{formData.popupImage ? 'Change Image' : 'Upload Image'}</span>
                  </Button>
                  <input
                    ref={fileInputRef}
                    id="popupImage"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Add an image to make your popup more engaging. Recommended size: 600x400px.
                </p>
                
                {imagePreviewUrl && (
                  <div className="relative mt-2 rounded-md overflow-hidden border border-border">
                    <img
                      src={imagePreviewUrl}
                      alt="Preview"
                      className="w-full h-auto max-h-48 object-contain"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6 rounded-full"
                      onClick={clearSelectedImage}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <Label htmlFor="popupShape">Popup Shape</Label>
                  <Select 
                    value={formData.popupShape} 
                    onValueChange={handleShapeChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select shape" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rounded">Rounded</SelectItem>
                      <SelectItem value="square">Square</SelectItem>
                      <SelectItem value="pill">Pill</SelectItem>
                      <SelectItem value="circle">Circle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-4">
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
                  <Label htmlFor="popupSize">Popup Size</Label>
                  <Select 
                    value={formData.popupSize} 
                    onValueChange={handleSizeChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {formData.popupSize === 'custom' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="customWidth">Width (px)</Label>
                      <Input
                        id="customWidth"
                        name="customWidth"
                        type="number"
                        min="200"
                        max="800"
                        placeholder="400"
                        value={formData.customWidth}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customHeight">Height (px)</Label>
                      <Input
                        id="customHeight"
                        name="customHeight"
                        type="number"
                        min="150"
                        max="600"
                        placeholder="300"
                        value={formData.customHeight}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="customCode">Custom Code (Optional)</Label>
                <Input
                  id="customCode"
                  name="customCode"
                  placeholder="my-custom-code"
                  value={formData.customCode}
                  onChange={handleInputChange}
                />
                <p className="text-xs text-muted-foreground">
                  Leave blank to generate a random code
                </p>
              </div>
              
              <div className="pt-4 flex justify-between">
                <Button type="button" variant="outline" onClick={togglePreview}>
                  {showPreview ? "Hide Preview" : "Show Preview"}
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Creating..." : "Create Popup Link"}
                </Button>
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
                  popupPosition={formData.popupPosition}
                  popupDelay={0} // Show immediately in preview
                  popupImage={imagePreviewUrl}
                  popupShape={formData.popupShape}
                  popupSize={formData.popupSize}
                  customWidth={formData.customWidth}
                  customHeight={formData.customHeight}
                />
                <div className="absolute inset-0 bg-gray-100 -z-10 flex items-center justify-center text-gray-400">
                  Website content will appear here
                </div>
              </CardContent>
            </Card>
          )}
          
          {createdLink && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Your Popup Link</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Input value={createdLink} readOnly />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => copyToClipboard(createdLink)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => window.open(createdLink, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
