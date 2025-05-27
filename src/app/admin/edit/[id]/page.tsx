import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getArtworkById } from '@/lib/artwork';
import EditArtworkForm from '@/components/admin/edit-artwork-form';

interface EditArtworkPageProps {
  params: {
    id: string;
  };
}

export default async function EditArtworkPage({ params }: EditArtworkPageProps) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/admin/login');
  }
  
  const artwork = await getArtworkById(params.id);
  
  if (!artwork) {
    redirect('/admin');
  }
  
  return (
    <div className="pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-playfair mb-8">Modifier une œuvre</h1>
        <EditArtworkForm artwork={artwork} />
      </div>
    </div>
  );
}