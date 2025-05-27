import { Separator } from '@/components/ui/separator';

export const metadata = {
  title: 'Politique de Confidentialité | Portfolio Artistique',
  description: 'Informations sur la politique de confidentialité du site web.',
};

export default function PrivacyPage() {
  return (
    <div className="pt-24 pb-12 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-playfair mb-8 text-center">Politique de Confidentialité</h1>
        
        <div className="bg-white shadow-sm rounded-lg p-8 mt-12">
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-playfair mb-4">1. Collecte des informations</h2>
              <p className="text-muted-foreground">
                Nous recueillons des informations lorsque vous naviguez sur notre site.
                Les informations recueillies incluent votre adresse IP, le type de navigateur que vous utilisez,
                les pages que vous consultez et l&apos;heure de votre visite.
              </p>
            </section>
            
            <Separator />
            
            <section>
              <h2 className="text-2xl font-playfair mb-4">2. Utilisation des informations</h2>
              <p className="text-muted-foreground">
                Toutes les informations que nous recueillons peuvent être utilisées pour :
              </p>
              <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                <li>Personnaliser votre expérience et répondre à vos besoins individuels</li>
                <li>Améliorer notre site Web</li>
                <li>Améliorer le service client et vos besoins de support</li>
                <li>Vous contacter par e-mail</li>
              </ul>
            </section>
            
            <Separator />
            
            <section>
              <h2 className="text-2xl font-playfair mb-4">3. Cookies</h2>
              <p className="text-muted-foreground">
                Nous utilisons des cookies pour comprendre et enregistrer vos préférences pour vos futures visites
                et compiler des données globales sur le trafic du site afin d&apos;offrir une meilleure expérience de site.
              </p>
            </section>
            
            <Separator />
            
            <section>
              <h2 className="text-2xl font-playfair mb-4">4. Protection des informations</h2>
              <p className="text-muted-foreground">
                Nous mettons en œuvre diverses mesures de sécurité pour préserver la sécurité de vos informations personnelles.
                Nous utilisons un chiffrement à la pointe de la technologie pour protéger les informations sensibles transmises en ligne.
              </p>
            </section>
            
            <Separator />
            
            <section>
              <h2 className="text-2xl font-playfair mb-4">5. Consentement</h2>
              <p className="text-muted-foreground">
                En utilisant notre site, vous consentez à notre politique de confidentialité.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}