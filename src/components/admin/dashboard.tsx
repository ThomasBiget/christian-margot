'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ArtworksList from '@/components/admin/artworks-list';
import NewArtworkForm from '@/components/admin/new-artwork-form';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('artworks');
  
  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: '/' });
    toast.success('Déconnexion réussie');
  };
  
  return (
    <div className="pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-playfair">Administration</h1>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Déconnexion
          </Button>
        </div>
        
        <Separator className="my-6" />
        
        <Tabs defaultValue="artworks" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="artworks">Gérer les œuvres</TabsTrigger>
            <TabsTrigger value="new">Ajouter une œuvre</TabsTrigger>
          </TabsList>
          
          <TabsContent value="artworks">
            <ArtworksList />
          </TabsContent>
          
          <TabsContent value="new">
            <NewArtworkForm onSuccess={() => setActiveTab('artworks')} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}