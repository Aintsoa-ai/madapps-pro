import { ShieldCheck, Info, FileText } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">À propos de MadApps Pro</h1>
          <p className="text-lg text-gray-600">Version 1.0.0</p>
        </div>
        
        <div className="space-y-8">
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                <Info className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Notre Mission</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              MadApps Pro (AintStore) est la plateforme de distribution d'applications et de jeux de nouvelle génération pour Madagascar et au-delà. 
              Nous nous engageons à fournir des applications de haute qualité, sécurisées et performantes, développées par les meilleurs talents.
            </p>
          </section>

          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Politique de Confidentialité</h2>
            </div>
            <p className="text-gray-600 leading-relaxed mb-4">
              La protection de vos données personnelles est notre priorité absolue. Nous collectons uniquement les informations nécessaires au bon fonctionnement de la plateforme (comme votre adresse email pour l'authentification et votre historique de téléchargements).
            </p>
            <p className="text-gray-600 leading-relaxed">
              Nous ne vendons ni ne partageons vos données personnelles avec des tiers sans votre consentement explicite. Toutes les communications et transactions sont sécurisées par chiffrement de bout en bout.
            </p>
          </section>

          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                <FileText className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Conditions d'Utilisation (CGU)</h2>
            </div>
            <ul className="list-disc list-inside text-gray-600 leading-relaxed space-y-2">
              <li>L'utilisation de la plateforme implique l'acceptation intégrale de ces conditions.</li>
              <li>Les applications téléchargées sont réservées à un usage personnel et ne peuvent être redistribuées.</li>
              <li>Tout comportement abusif, frauduleux ou non respectueux entraînera la suspension immédiate du compte.</li>
              <li>MadApps Pro se réserve le droit de modifier le contenu et les fonctionnalités de la plateforme à tout moment.</li>
            </ul>
          </section>
        </div>
        
        <div className="mt-12 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} Aintsoa-ai. Tous droits réservés.
        </div>
      </div>
    </div>
  );
}
