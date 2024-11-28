import React from "react";

const TermsPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white shadow-md py-8">
        <h1 className="text-3xl lg:text-4xl font-bold text-center text-gray-900">
          Politique de Confidentialité de Maguida
        </h1>
        <p className="text-center text-gray-600 text-sm mt-2">
          Dernière mise à jour : [Date]
        </p>
      </div>

      <div className="p-6 sm:p-8 lg:p-10 max-w-5xl mx-auto bg-white shadow-lg rounded-lg mt-8 space-y-12">
        {/* Section 1: Introduction */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            1. Introduction
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Bienvenue sur Maguida (accessible à l&apos;adresse{" "}
            <a
              href="https://maguida.cm"
              className="text-blue-600 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://maguida.cm
            </a>
            ), un moteur de recherche de produits en ligne basé sur
            l’intelligence artificielle. Votre confidentialité est une priorité
            pour Richenel&apos;s AI Agency SARL, société immatriculée sous le numéro
            RCCM RC/YAO/2024/B/1323. Cette politique explique comment nous
            collectons, utilisons, protégeons et partageons vos informations. En
            utilisant Maguida, vous acceptez les termes de cette Politique de
            Confidentialité. Si vous avez des questions, contactez-nous à{" "}
            <a
              href="mailto:contact@raia.cm"
              className="text-blue-600 underline"
            >
              contact@raia.cm
            </a>
            .
          </p>
        </section>

        {/* Section 2: Utilisation des données */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            2. Utilisation des données
          </h2>
          <ul className="list-disc space-y-3 text-gray-700 pl-5">
            <li>Améliorer le service : analyser les requêtes pour rendre les résultats plus pertinents.</li>
            <li>Maintenir et sécuriser la plateforme : détecter et prévenir les activités frauduleuses ou non autorisées.</li>
            <li>Communication : répondre à vos demandes ou signalements.</li>
            <li>Analyse statistique : comprendre les tendances d’utilisation pour optimiser notre service.</li>
          </ul>
        </section>

        {/* Section 3: Données collectées */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            3. Données collectées
          </h2>
          <p className="text-gray-700 mb-4">
            Nous collectons deux types de données :
          </p>
          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-gray-900">
                Données fournies par l’utilisateur
              </h3>
              <ul className="list-disc space-y-2 text-gray-700 pl-5">
                <li>Requêtes saisies via le moteur de recherche ou le chatbot.</li>
                <li>Informations soumises via des formulaires (ex. : feedback ou contact).</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                Données collectées automatiquement
              </h3>
              <ul className="list-disc space-y-2 text-gray-700 pl-5">
                <li>Adresse IP et données de géolocalisation approximative.</li>
                <li>Données techniques comme le type de navigateur et l’appareil utilisé.</li>
                <li>Journaux d’activité (heure et date des requêtes).</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 4: Partage des données */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            4. Partage des données
          </h2>
          <p className="text-gray-700 mb-4">
            Nous ne vendons ni ne louons vos données personnelles à des tiers.
            Cependant, nous pouvons partager des données :
          </p>
          <ul className="list-disc space-y-3 text-gray-700 pl-5">
            <li>
              Avec des prestataires de services tiers pour maintenir ou améliorer
              notre service (ex. : hébergement, analyse).
            </li>
            <li>Si requis par la loi ou dans le cadre d&apos;une procédure légale.</li>
            <li>
              En cas de fusion, acquisition ou vente d&apos;actifs, vos données
              pourront être transférées au nouvel opérateur.
            </li>
          </ul>
        </section>

        {/* Section 5: Protection des données */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            5. Protection des données
          </h2>
          <p className="text-gray-700">
            Nous mettons en œuvre des mesures techniques et organisationnelles
            pour protéger vos données, y compris :
          </p>
          <ul className="list-disc space-y-2 text-gray-700 pl-5 mt-4">
            <li>Chiffrement des données en transit et au repos.</li>
            <li>Contrôles d&apos;accès stricts pour limiter l&apos;accès aux données sensibles.</li>
            <li>Surveillance régulière de la plateforme pour détecter et prévenir les vulnérabilités.</li>
          </ul>
        </section>

        {/* Footer */}
        <footer className="text-center text-sm text-gray-600 mt-12">
          <p>
            Pour toute question ou demande concernant cette politique, contactez-nous à{" "}
            <a
              href="mailto:contact@raia.cm"
              className="text-blue-600 underline"
            >
              contact@raia.cm
            </a>
            .
          </p>
        </footer>
      </div>
    </div>
  );
};

export default TermsPage;
