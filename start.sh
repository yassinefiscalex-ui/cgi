#!/bin/bash

echo "🚀 Démarrage du CGI Reader - Interface Legifrance"
echo "=================================================="

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Veuillez installer Node.js d'abord."
    exit 1
fi

# Vérifier si npm est installé
if ! command -v npm &> /dev/null; then
    echo "❌ npm n'est pas installé. Veuillez installer npm d'abord."
    exit 1
fi

# Installer les dépendances si nécessaire
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Erreur lors de l'installation des dépendances"
        exit 1
    fi
fi

# Vérifier si le fichier de données existe
if [ ! -f "cgi_2025.json" ]; then
    echo "❌ Le fichier cgi_2025.json n'est pas trouvé"
    echo "   Veuillez vous assurer que le fichier de données est présent"
    exit 1
fi

# Démarrer le serveur
echo "🌐 Démarrage du serveur sur le port 3000..."
echo "   Interface: http://localhost:3000"
echo "   API: http://localhost:3000/api"
echo ""
echo "Appuyez sur Ctrl+C pour arrêter le serveur"
echo ""

# Démarrer en mode développement
npm run dev