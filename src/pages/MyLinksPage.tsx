
import React, { useEffect, useState } from "react";
import { getUserLinks } from "@/services/linkService";
import { LinkRecord } from "@/types/popup";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const MyLinksPage: React.FC = () => {
  const [links, setLinks] = useState<LinkRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const userLinks = await getUserLinks();
        setLinks(userLinks);
      } catch (error) {
        console.error("Error fetching links:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLinks();
  }, []);

  const copyToClipboard = (shortId: string) => {
    const url = `${window.location.origin}/r/${shortId}`;
    navigator.clipboard.writeText(url);
    
    toast.success("Link copied to clipboard!");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Links</h1>
        
        {links.length === 0 ? (
          <div className="text-center py-12 bg-muted rounded-lg">
            <h3 className="text-xl font-medium mb-2">No links created yet</h3>
            <p className="text-muted-foreground mb-6">
              Create your first popup link to get started
            </p>
            <Button asChild>
              <a href="/create">Create New Link</a>
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Short Link</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead className="text-right">Views</TableHead>
                  <TableHead className="text-right">Clicks</TableHead>
                  <TableHead className="text-right">Created</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {links.map((link) => (
                  <TableRow key={link.id}>
                    <TableCell>
                      <a 
                        href={`/r/${link.short_id}`}
                        target="_blank"
                        className="text-primary hover:underline"
                      >
                        {`/r/${link.short_id}`}
                      </a>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {link.destination_url}
                    </TableCell>
                    <TableCell className="text-right">{link.views}</TableCell>
                    <TableCell className="text-right">{link.clicks}</TableCell>
                    <TableCell className="text-right">
                      {new Date(link.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(link.short_id)}
                      >
                        Copy
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyLinksPage;
