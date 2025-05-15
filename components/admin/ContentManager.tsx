import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const sections = [
  { id: 'announcements', label: 'Announcements' },
  { id: 'header', label: 'Header Navigation' },
  { id: 'footer', label: 'Footer' },
  { id: 'hero', label: 'Hero Section' },
  { id: 'how', label: 'How It Works' },
  { id: 'services', label: 'Services' },
  { id: 'testimonials', label: 'Testimonials' },
  { id: 'users', label: 'Users' }
];

export default function ContentManager() {
  const [contents, setContents] = useState<Record<string, string>>({});
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState(sections[0].id);

  useEffect(() => {
    loadAllContent();
  }, []);

  const loadAllContent = async () => {
    for (const section of sections) {
      await loadContent(section.id);
    }
  };

  const loadContent = async (sectionId: string) => {
    try {
      setLoadingStates(prev => ({ ...prev, [sectionId]: true }));
      const response = await fetch(`/api/content?section=${sectionId}`);
      const data = await response.json();
      setContents(prev => ({
        ...prev,
        [sectionId]: JSON.stringify(data, null, 2)
      }));
    } catch (error) {
      toast.error(`Failed to load ${sectionId} content`);
    } finally {
      setLoadingStates(prev => ({ ...prev, [sectionId]: false }));
    }
  };

  const handleSave = async (sectionId: string) => {
    try {
      setLoadingStates(prev => ({ ...prev, [sectionId]: true }));
      let parsedContent;
      try {
        parsedContent = JSON.parse(contents[sectionId]);
      } catch (e) {
        toast.error('Invalid JSON format');
        return;
      }

      const response = await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          section: sectionId,
          content: parsedContent,
        }),
      });

      if (!response.ok) throw new Error('Failed to save');
      toast.success(`${sections.find(s => s.id === sectionId)?.label} saved successfully`);
    } catch (error) {
      toast.error(`Failed to save ${sectionId} content`);
    } finally {
      setLoadingStates(prev => ({ ...prev, [sectionId]: false }));
    }
  };

  const handleContentChange = (sectionId: string, value: string) => {
    setContents(prev => ({ ...prev, [sectionId]: value }));
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold mb-6">Content Manager</h2>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 lg:grid-cols-8 w-full">
            {sections.map((section) => (
              <TabsTrigger 
                key={section.id} 
                value={section.id}
                className="text-sm"
              >
                {section.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {sections.map((section) => (
            <TabsContent key={section.id} value={section.id} className="mt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">{section.label}</h3>
                  <Button
                    onClick={() => handleSave(section.id)}
                    disabled={loadingStates[section.id]}
                    className="min-w-[120px]"
                  >
                    {loadingStates[section.id] ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                </div>
                <Textarea
                  value={contents[section.id] || ''}
                  onChange={(e) => handleContentChange(section.id, e.target.value)}
                  className="min-h-[400px] font-mono"
                  placeholder={loadingStates[section.id] ? 'Loading...' : 'JSON content will appear here...'}
                />
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </Card>
  );
} 