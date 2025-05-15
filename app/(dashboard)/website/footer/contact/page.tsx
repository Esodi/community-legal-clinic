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
  DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"

interface ContactItem {
  id: number
  label: string
  value: string | null
  isMain: boolean
  isAddress: boolean
  isContact: boolean
  status: string
  created_at: string
  updated_at: string
}

interface ContactData {
  id: number | null
  title: string
  status: string
  created_at: string
  updated_at: string
  items: ContactItem[]
}

export default function ContactPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [data, setData] = useState<ContactData>({
    id: null,
    title: "",
    status: "active",
    created_at: "",
    updated_at: "",
    items: []
  })
  const [editingItem, setEditingItem] = useState<ContactItem | null>(null)
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
      setData(result.contactUs)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load contact section data"
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    try {
      if (!editingItem) return;

      let updatedItems: ContactItem[];
      
      if (editingItem.id === 0) {
        // Adding new item
        updatedItems = [...data.items, { ...editingItem, id: Date.now() }];
      } else {
        // Updating existing item
        updatedItems = data.items.map(item => 
          item.id === editingItem.id ? editingItem : item
        );
      }

      const response = await fetch("/api/footer/contact", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: data.title,
          items: updatedItems
        })
      });

      if (!response.ok) throw new Error("Failed to update");

      toast({
        title: "Success",
        description: editingItem.id === 0 ? "Contact item added successfully" : "Contact item updated successfully"
      });
      
      setData(prev => ({
        ...prev,
        items: updatedItems
      }));
      
      setIsDialogOpen(false);
      setEditingItem(null);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update contact section"
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this item?")) return

    try {
      const response = await fetch(`/api/footer/contact/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        }
      })

      if (!response.ok) throw new Error("Failed to delete")

      toast({
        title: "Success",
        description: "Contact item deleted successfully"
      })
      fetchData()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete contact item"
      })
    }
  }

  function handleAddEdit(item?: ContactItem) {
    if (item) {
      // For editing, use the exact item
      setEditingItem(item);
    } else {
      // For adding new item, create a new object
      setEditingItem({
        id: 0,
        label: "",
        value: "",
        isMain: false,
        isAddress: false,
        isContact: false,
        status: "active",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }
    setIsDialogOpen(true);
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
            <CardTitle>Footer - Contact Us Section</CardTitle>
            <CardDescription>Manage contact information that appears in the footer</CardDescription>
          </div>
          <Button onClick={() => handleAddEdit()}>
            <Plus className="h-4 w-4 mr-2" />
            Add Contact Item
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">Section Title</label>
              <Input
                id="title"
                value={data.title}
                onChange={(e) => setData({ ...data, title: e.target.value })}
                placeholder="Enter section title"
              />
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Label</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.label}</TableCell>
                    <TableCell>{item.value || '-'}</TableCell>
                    <TableCell>
                      {item.isMain ? 'Main' : ''}
                      {item.isAddress ? 'Address' : ''}
                      {item.isContact ? 'Contact' : ''}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleAddEdit(item)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem?.id ? 'Edit' : 'Add'} Contact Item</DialogTitle>
            <DialogDescription>
              {editingItem?.id ? 'Edit the contact item details below.' : 'Add a new contact item to the footer.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="label" className="text-sm font-medium">Label</label>
              <Input
                id="label"
                value={editingItem?.label || ''}
                onChange={(e) => setEditingItem({ ...editingItem!, label: e.target.value })}
                placeholder="Enter label"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="value" className="text-sm font-medium">Value (optional)</label>
              <Input
                id="value"
                value={editingItem?.value || ''}
                onChange={(e) => setEditingItem({ ...editingItem!, value: e.target.value })}
                placeholder="Enter value"
              />
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isMain"
                  checked={editingItem?.isMain}
                  onCheckedChange={(checked) => 
                    setEditingItem({ ...editingItem!, isMain: checked as boolean })
                  }
                />
                <label htmlFor="isMain">Main</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isAddress"
                  checked={editingItem?.isAddress}
                  onCheckedChange={(checked) => 
                    setEditingItem({ ...editingItem!, isAddress: checked as boolean })
                  }
                />
                <label htmlFor="isAddress">Address</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isContact"
                  checked={editingItem?.isContact}
                  onCheckedChange={(checked) => 
                    setEditingItem({ ...editingItem!, isContact: checked as boolean })
                  }
                />
                <label htmlFor="isContact">Contact</label>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingItem?.id ? 'Update' : 'Add'} Item
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
} 