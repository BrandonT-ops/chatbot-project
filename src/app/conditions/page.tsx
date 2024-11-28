import React from "react";

const ConditionsPage = () => {
  const today = new Date();
  const formattedDate = today.toISOString().split("T")[0];
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white shadow-md py-8">
        <h1 className="text-3xl lg:text-4xl font-bold text-center text-gray-900">
          Conditions d&apos;utilisation de Maguida
        </h1>
        <p className="text-center text-gray-600 text-sm mt-2">
          Dernière mise à jour : {formattedDate}
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
            l&apos;intelligence artificielle. Votre confidentialité est une priorité
            pour Richenel&apos;s AI Agency SARL, société immatriculée sous le
            numéro RCCM RC/YAO/2024/B/1323. Cette politique explique comment
            nous collectons, utilisons, protégeons et partageons vos
            informations. En utilisant Maguida, vous acceptez les termes de
            cette Politique de Confidentialité. Si vous avez des questions,
            contactez-nous à{" "}
            <a
              href="mailto:contact@raia.cm"
              className="text-blue-600 underline"
            >
              contact@raia.cm
            </a>
            .
          </p>
          <p className="text-gray-700 leading-relaxed">
            En utilisant Maguida, vous acceptez les présentes Conditions
            d&apos;utilisation. Veuillez les lire attentivement avant
            d&apos;accéder ou d&apos;utiliser notre service.
          </p>
        </section>

        {/* Section 2: Utilisation des données */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            2. Définition des termes
          </h2>
          <ul className="list-disc space-y-3 text-gray-700 pl-5">
            <li>
              &quot;Service&quot; : désigne la plateforme Maguida, ses
              fonctionnalités, et les services associés.
            </li>
            <li>
              &quot;Utilisateur&quot; : désigne toute personne accédant au
              Service, qu&apos;elle ait ou non un compte.
            </li>
            <li>
              &quot;Contenu utilisateur&quot; : désigne les requêtes, messages
              ou données fournies par les utilisateurs via le chatbot ou tout
              autre moyen sur la plateforme.
            </li>
            <li>
              &quot;Nous&quot; ou &quot;Richenel&apos;s AI Agency&quot; :
              désigne l&apos;entité juridique gestionnaire de Maguida.
            </li>
          </ul>
        </section>

        {/* Section 3: Données collectées */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            3. Acceptation des Conditions d&apos;utilisation
          </h2>
          <p className="text-gray-700 mb-4">
            En accédant ou en utilisant Maguida, vous acceptez de vous conformer
            aux présentes Conditions d&apos;utilisation. Si vous n&apos;acceptez pas ces
            termes, vous n&apos;êtes pas autorisé à utiliser le Service.
          </p>
        </section>

        {/* Section 4: Partage des données */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            4. Services offerts
          </h2>
          <p className="text-gray-700 mb-4">Maguida permet :</p>
          <ol className="list-disc space-y-3 text-gray-700 pl-5">
            <li>
              La recherche de produits en ligne via un moteur de recherche basé
              sur l&apos;IA.
            </li>
            <li>
              L&apos;interaction avec un chatbot conçu pour répondre aux questions
              liées aux produits.
            </li>
            <li>
              La consultation de résultats et recommandations pertinentes en
              fonction de vos requêtes.
            </li>
          </ol>
        </section>

        {/* Section 5: Protection des données */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            5. Utilisation autorisée
          </h2>
          <p className="text-gray-700">
            Vous acceptez d&apos;utiliser Maguida uniquement :
          </p>
          <ul className="list-disc space-y-2 text-gray-700 pl-5 mt-4">
            <li>
              À des fins personnelles et non commerciales, sauf autorisation
              écrite préalable de Richenel&apos;s AI Agency.
            </li>
            <li>Conformément aux lois et réglementations applicables.</li>
          </ul>
          <p className="text-gray-700">Il est strictement interdit :</p>
          <ol className="list-disc space-y-2 text-gray-700 pl-5 mt-4">
            <li>
              De tenter d&apos;accéder de manière non autorisée à nos systèmes ou à
              ceux de nos partenaires.
            </li>
            <li>
              D&apos;utiliser des moyens automatisés pour extraire des données ou
              perturber le Service (exemple : robots, crawlers).
            </li>
            <li>
              De transmettre des contenus illégaux, nuisibles ou portant
              atteinte aux droits de tiers.
            </li>
          </ol>
        </section>

        {/* Section 5: Protection des données */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            6. Propriété intellectuelle
          </h2>
          <ol className="list-disc space-y-2 text-gray-700 pl-5 mt-4">
            <li>
              Tous les droits de propriété intellectuelle relatifs au Service, y
              compris le code, le design, le contenu, et les bases de données,
              appartiennent exclusivement à Richenel&apos;s AI Agency.
            </li>
            <li>
              Vous ne pouvez copier, modifier, distribuer ou exploiter
              commercialement tout ou partie du Service sans autorisation écrite
              préalable.
            </li>
          </ol>
        </section>

        {/* Section 5: Protection des données */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            7. Contenu utilisateur
          </h2>
          <ol className="list-disc space-y-2 text-gray-700 pl-5 mt-4">
            <li>
              Responsabilité : Vous êtes responsable des contenus que vous
              soumettez via le chatbot ou toute autre fonctionnalité de Maguida.
            </li>
            <li>
              Licence accordée : En soumettant du contenu, vous accordez à
              Richenel&apos;s AI Agency une licence non exclusive, mondiale et
              gratuite pour utiliser, reproduire et analyser ces contenus dans
              le cadre du fonctionnement et de l&apos;amélioration du Service.
            </li>
            <li>
              Suppression : Nous nous réservons le droit de supprimer tout
              contenu inapproprié, illégal ou contraire à nos politiques.
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            8. Confidentialité et données personnelles
          </h2>
          <ol className="list-disc space-y-2 text-gray-700 pl-5 mt-4">
            <li>
              L&apos;utilisation de vos données est régie par notre Politique de
              Confidentialité, disponible à l&apos;adresse suivante : 
              <a href="/terms"> politique de confidentialité</a>
            </li>
            <li>
              Nous collectons des données telles que vos requêtes et
              interactions avec le chatbot pour améliorer notre Service. Aucune
              donnée personnelle identifiable ne sera vendue à des tiers.
            </li>
            <li>
              Vous avez le droit de demander l&apos;accès, la rectification ou la
              suppression de vos données en nous contactant à contact@raia.cm.
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            9. Limitation de responsabilité
          </h2>
          <ol className="list-disc space-y-2 text-gray-700 pl-5 mt-4">
            <li>
              Maguida est fourni &quot;tel quel&quot;. Nous ne garantissons pas que le
              Service sera exempt d&apos;erreurs ou d&apos;interruptions.
            </li>
            <li>
              Richenel&apos;s AI Agency ne peut être tenue responsable des pertes ou
              dommages directs, indirects, spéciaux ou consécutifs liés à
              l&apos;utilisation de Maguida.
            </li>
            <li>
              Les résultats affichés par le moteur de recherche ou le chatbot
              sont générés automatiquement et peuvent contenir des
              inexactitudes. L&apos;utilisateur est seul responsable de
              l&apos;interprétation et de l&apos;utilisation de ces résultats.
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            10. Modifications des Conditions
          </h2>
          <p className="text-gray-700">
            Nous nous réservons le droit de modifier ces Conditions à tout
            moment. Les modifications seront publiées sur cette page avec une
            mise à jour de la date en haut. En continuant d&apos;utiliser le Service
            après une modification, vous acceptez les nouvelles Conditions.{" "}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            11. Résolution des litiges
          </h2>
          <ol className="list-disc space-y-2 text-gray-700 pl-5 mt-4">
            <li>
              Tout litige résultant de l&apos;utilisation de Maguida sera soumis aux
              lois de la République du Cameroun.
            </li>
            <li>
              En cas de différend, une tentative de résolution amiable devra
              être entreprise avant toute action en justice.
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            12. Suspension et résiliation
          </h2>
          <ol className="list-disc space-y-2 text-gray-700 pl-5 mt-4">
            <li>
              Nous pouvons suspendre ou résilier votre accès au Service sans
              préavis en cas de non-respect des présentes Conditions.
            </li>
            <li>Vous pouvez cesser d&apos;utiliser le Service à tout moment.</li>
          </ol>
        </section>

        {/* Footer */}
        <footer className="text-center text-sm text-gray-600 mt-12">

        <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-9">
              Acceptation
            </h2>
            <p className="text-center text-gray-600 text-sm mt-2 mb-9">
              En accédant à Maguida, vous reconnaissez avoir lu et accepté ces
              Conditions d&apos;utilisation.
            </p>
          </section>
          <p>
            Pour toute question ou préoccupation concernant ces Conditions ou le
            Service, veuillez nous contacter :{" "}
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

export default ConditionsPage;
