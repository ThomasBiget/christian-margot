import { Separator } from '@/components/ui/separator';

export const metadata = {
  title: 'Mentions Légales | Portfolio Artistique',
  description: 'Informations légales concernant ce site web.',
};

export default function LegalPage() {
  return (
    <div className="pt-24 pb-12 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-playfair mb-8 text-center">Mentions Légales</h1>
        
        <div className="bg-white shadow-sm rounded-lg p-8 mt-12">
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-playfair mb-4">1. Éditeur du site</h2>
              <p className="text-muted-foreground">
                Le site Portfolio Artistique est édité par L&apos;Artiste,
                dont le siège social est situé au 123 Rue des Artistes, 75001 Paris, France.
              </p>
              <p className="text-muted-foreground mt-2">
                Numéro de téléphone : +33 1 23 45 67 89<br />
                Adresse e-mail : contact@lartiste.fr
              </p>
            </section>
            
            <Separator />
            
            <section>
              <h2 className="text-2xl font-playfair mb-4">2. Hébergement</h2>
              <p className="text-muted-foreground">
                Ce site est hébergé par Hébergeur Exemple, société au capital de 10 000 €,
                immatriculée au RCS de Paris sous le numéro 123 456 789,
                dont le siège social est situé au 45 Rue de l&apos;Hébergement, 75002 Paris, France.
              </p>
            </section>
            
            <Separator />
            
            <section>
              <h2 className="text-2xl font-playfair mb-4">3. Propriété intellectuelle</h2>
              <p className="text-muted-foreground">
                L&apos;ensemble des éléments constituant ce site (textes, images, photographies, logos, 
                dessins, vidéos, sons, plans, etc.) sont la propriété exclusive de L&apos;Artiste 
                ou font l&apos;objet d&apos;une autorisation d&apos;utilisation.
              </p>
              <p className="text-muted-foreground mt-2">
                Toute représentation totale ou partielle de ce site ou de son contenu, 
                par quelque procédé que ce soit, sans autorisation préalable et expresse 
                de L&apos;Artiste est interdite et constituerait une contrefaçon sanctionnée 
                par les articles L.335-2 et suivants du Code de la propriété intellectuelle.
              </p>
            </section>
            
            <Separator />
            
            <section>
              <h2 className="text-2xl font-playfair mb-4">4. Limitation de responsabilité</h2>
              <p className="text-muted-foreground">
                L&apos;Artiste ne pourra être tenu responsable des dommages directs et indirects 
                causés au matériel de l&apos;utilisateur, lors de l&apos;accès au site, et résultant 
                soit de l&apos;utilisation d&apos;un matériel ne répondant pas aux spécifications 
                techniques requises, soit de l&apos;apparition d&apos;un bug ou d&apos;une incompatibilité.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}