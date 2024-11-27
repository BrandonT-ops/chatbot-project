#!/bin/bash

# Chemin du projet
PROJECT_DIR="/var/www/maguida_frontend/"
BRANCH="main"  # Changez si nécessaire

# Étape 1 : Aller dans le répertoire du projet
echo "➡️  Navigation vers le répertoire du projet..."
cd $PROJECT_DIR || { echo "Erreur : Répertoire non trouvé"; exit 1; }

# Étape 2 : Récupérer les dernières modifications
echo "📥 Mise à jour du dépôt Git..."
git pull origin main

# Étape 3 : Installer les dépendances
echo "📦 Installation des dépendances..."
npm install

# Étape 4 : Construire le projet
echo "🏗️  Construction du projet..."
npm run build

# Étape 5 : Redémarrer l'application avec PM2
echo "🔄 Redémarrage de l'application avec PM2..."
pm2 restart nextjs-app || pm2 start npm --name "nextjs-app" -- start

# Étape 6 : Vérification
echo "✅ Déploiement terminé. Vérifiez votre application à l'adresse configurée."

exit 0
