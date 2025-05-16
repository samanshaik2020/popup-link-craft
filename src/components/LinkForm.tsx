
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { PopupPosition } from "@/types/popup";
import LinkPreview from "./LinkPreview";

interface LinkFormProps {
  onSubmit: (linkData: LinkData) => Promise<string>;
}

export interface LinkData {
  destinationUrl: string;
  popupText: string;
  buttonText: string;
  buttonUrl: string;
  position: PopupPosition;
  delaySeconds: number;
}

const LinkForm: React.FC<LinkFormProps> = ({ onSubmit }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState<LinkData>({
    destinationUrl: "",
    popupText: "Sign up for our newsletter!",
    buttonText: "Subscribe",
    buttonUrl: "",
    position: "bottom-right",
    delaySeconds: 3,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePositionChange = (value: string) => {
    setFormData((prev) => ({ ...prev, position: value as PopupPosition }));
  };

  const handleDelayChange = (value: number[]) => {
    setFormData((prev) => ({ ...prev, delaySeconds: value[0] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.destinationUrl) {
      toast.error("Please enter a destination URL");
      return;
    }
    
    // Validate URL format
    try {
      new URL(formData.destinationUrl);
      if (formData.buttonUrl) {
        new URL(formData.buttonUrl);
      }
    } catch (error) {
      toast.error("Please enter a valid URL");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const generatedUrl = await onSubmit(formData);
      setShortUrl(generatedUrl);
      toast.success("Link created successfully!");
    } catch (error) {
      console.error("Error creating link:", error);
      toast.error("Failed to create link. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="destinationUrl">Destination URL</Label>
            <Input
              id="destinationUrl"
              name="destinationUrl"
              placeholder="https://example.com"
              value={formData.destinationUrl}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="popupText">Popup Message</Label>
            <Input
              id="popupText"
              name="popupText"
              placeholder="Sign up for our newsletter!"
              value={formData.popupText}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="buttonText">Button Text</Label>
            <Input
              id="buttonText"
              name="buttonText"
              placeholder="Subscribe"
              value={formData.buttonText}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="buttonUrl">Button Target URL</Label>
            <Input
              id="buttonUrl"
              name="buttonUrl"
              placeholder="https://example.com/signup"
              value={formData.buttonUrl}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="position">Popup Position</Label>
            <Select
              value={formData.position}
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
            <Label htmlFor="delaySeconds">
              Delay Before Showing ({formData.delaySeconds} seconds)
            </Label>
            <Slider
              id="delaySeconds"
              min={0}
              max={10}
              step={1}
              value={[formData.delaySeconds]}
              onValueChange={handleDelayChange}
            />
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Creating..." : "Generate Short Link"}
          </Button>
        </form>

        {shortUrl && (
          <div className="p-4 border rounded-lg bg-muted">
            <p className="text-sm font-medium mb-2">Your short link is ready:</p>
            <div className="flex items-center gap-2">
              <Input readOnly value={shortUrl} className="flex-1" />
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(shortUrl);
                  toast.success("Copied to clipboard!");
                }}
                size="sm"
              >
                Copy
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="border rounded-lg p-4 bg-muted/50">
        <h3 className="font-medium mb-4">Link Preview</h3>
        <div className="bg-white border rounded-lg overflow-hidden h-[500px]">
          <LinkPreview formData={formData} />
        </div>
      </div>
    </div>
  );
};

export default LinkForm;
