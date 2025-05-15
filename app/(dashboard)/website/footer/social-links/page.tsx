"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface SocialLink {
  id: number
  platform: string
  url: string
  icon: string
  ariaLabel: string
  status: string
  created_at: string
  updated_at: string
}

const SOCIAL_PLATFORMS = [
  { value: "whatsapp", label: "WhatsApp", icon: "FaWhatsapp" },
  { value: "twitter", label: "Twitter", icon: "FaTwitter" },
  { value: "facebook", label: "Facebook", icon: "FaFacebook" },
  { value: "youtube", label: "YouTube", icon: "FaYoutube" },
  { value: "instagram", label: "Instagram", icon: "FaInstagram" },
  { value: "linkedin", label: "LinkedIn", icon: "FaLinkedin" },
]

export default function SocialLinksPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [data, setData] = useState<SocialLink[]>([])
  const [editingItem, setEditingItem] = useState<SocialLink | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const response = await fetch("/api/footer")
      if (!response.ok) throw new Error("Failed to fetch data")
      const result = await response.json()
      setData(result.socialLinks)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load social links data"
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    // Validate form fields
    if (!editingItem?.platform) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a platform"
      });
      return;
    }
    
    if (!editingItem?.url) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a URL"
      });
      return;
    }
    
    // Simple URL validation
    if (!editingItem.url.startsWith('http://') && !editingItem.url.startsWith('https://')) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "URL must start with http:// or https://"
      });
      return;
    }
    
    setSaving(true);

    try {
      if (editingItem) {
        const updatedData = editingItem.id 
          ? data.map(item => item.id === editingItem.id ? editingItem : item)
          : [...data, { ...editingItem, id: Date.now() }]; // Temporary ID for new items
        
        const response = await fetch("/api/footer/social-links", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            socialLinks: updatedData
          })
        });

        if (!response.ok) throw new Error("Failed to update");
        
        setData(updatedData);
        toast({
          title: "Success",
          description: editingItem.id ? "Social link updated successfully" : "Social link added successfully"
        });
      }
      
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update social links"
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this social link?")) return

    try {
      const response = await fetch(`/api/footer/social-links/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        }
      })

      if (!response.ok) throw new Error("Failed to delete")

      toast({
        title: "Success",
        description: "Social link deleted successfully"
      })
      fetchData()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete social link"
      })
    }
  }

  function handleAddEdit(item?: SocialLink) {
    setEditingItem(item || {
      id: 0,
      platform: "",
      url: "",
      icon: "",
      ariaLabel: "",
      status: "active",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    setIsDialogOpen(true)
  }

  function handlePlatformChange(platform: string) {
    const selectedPlatform = SOCIAL_PLATFORMS.find(p => p.value === platform)
    if (selectedPlatform && editingItem) {
      setEditingItem({
        ...editingItem,
        platform,
        icon: selectedPlatform.icon,
        ariaLabel: `Follow us on ${selectedPlatform.label}`
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Footer - Social Links</CardTitle>
            <CardDescription>Manage social media links that appear in the footer</CardDescription>
          </div>
          <Button onClick={() => handleAddEdit()}>
            <Plus className="h-4 w-4 mr-2" />
            Add Social Link
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Platform</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Icon</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="capitalize">{item.platform}</TableCell>
                  <TableCell>{item.url}</TableCell>
                  <TableCell>{item.icon}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleAddEdit(item)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem?.id ? 'Edit' : 'Add'} Social Link</DialogTitle>
            <DialogDescription>
              {editingItem?.id ? 'Edit the social link details below.' : 'Add a new social media link to the footer.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="platform" className="text-sm font-medium">Platform</label>
              <Select
                value={editingItem?.platform}
                onValueChange={handlePlatformChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a platform" />
                </SelectTrigger>
                <SelectContent>
                  {SOCIAL_PLATFORMS.map((platform) => (
                    <SelectItem key={platform.value} value={platform.value}>
                      {platform.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label htmlFor="url" className="text-sm font-medium">URL</label>
              <Input
                id="url"
                value={editingItem?.url || ''}
                onChange={(e) => setEditingItem({ ...editingItem!, url: e.target.value })}
                placeholder="Enter social media URL"
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingItem?.id ? 'Update' : 'Add'} Social Link
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
} 