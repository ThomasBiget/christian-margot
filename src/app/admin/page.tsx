import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import AdminDashboard from '@/components/admin/dashboard';

export const metadata = {
  title: 'Administration | Portfolio Artistique',
  description: 'Gérez votre portfolio artistique',
};

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/admin/login');
  }
  
  return <AdminDashboard />;
}