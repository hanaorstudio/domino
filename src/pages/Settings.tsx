
import React from 'react';
import NavBar from '../components/layout/NavBar';
import Sidebar from '../components/layout/Sidebar';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Moon, Sun, BellRing, Globe, Shield, Palette } from 'lucide-react';

const SettingsPage: React.FC = () => {
  const handleSave = () => {
    toast.success('Settings saved successfully');
  };

  return (
    <div className="flex h-screen w-full bg-gradient-light">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto p-6">
          <NavBar />
          
          <div className="max-w-3xl mx-auto">
            <div className="glass-panel rounded-xl p-6">
              <h1 className="text-2xl font-semibold mb-6">Settings</h1>
              
              <Tabs defaultValue="appearance">
                <TabsList className="mb-6">
                  <TabsTrigger value="appearance">
                    <Palette className="mr-2 h-4 w-4" />
                    Appearance
                  </TabsTrigger>
                  <TabsTrigger value="notifications">
                    <BellRing className="mr-2 h-4 w-4" />
                    Notifications
                  </TabsTrigger>
                  <TabsTrigger value="privacy">
                    <Shield className="mr-2 h-4 w-4" />
                    Privacy
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="appearance" className="space-y-6">
                  <div className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="flex items-center">
                          <Moon className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Dark Mode</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Switch between light and dark mode
                        </p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                  
                  <div className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="flex items-center">
                          <Globe className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Language</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Choose your preferred language
                        </p>
                      </div>
                      <select className="bg-background border border-input rounded-md px-2 py-1 text-sm">
                        <option>English</option>
                        <option>Spanish</option>
                        <option>French</option>
                      </select>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="notifications" className="space-y-6">
                  <div className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="text-sm font-medium">Email Notifications</span>
                        <p className="text-xs text-muted-foreground">
                          Receive email notifications for application updates
                        </p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                  
                  <div className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="text-sm font-medium">Push Notifications</span>
                        <p className="text-xs text-muted-foreground">
                          Receive push notifications in your browser
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="privacy" className="space-y-6">
                  <div className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="text-sm font-medium">Data Sharing</span>
                        <p className="text-xs text-muted-foreground">
                          Allow anonymous usage data for improving the app
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </TabsContent>
                
                <div className="mt-6 flex justify-end">
                  <Button onClick={handleSave}>Save Settings</Button>
                </div>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
