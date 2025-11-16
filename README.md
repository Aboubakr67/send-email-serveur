# 📧 Send Email Server

Serveur Node.js sécurisé pour gérer l'envoi d'emails depuis un formulaire de contact (par exemple portfolio). Utilise le SMTP Hostinger pour envoyer des notifications et des emails de confirmation automatiques.

---

## 🚀 Fonctionnalités

- ✅ **Envoi de 2 emails** : Notification pour l'admin + Confirmation pour l'expéditeur
- ✅ **Templates HTML professionnels** : Emails stylés et responsives
- ✅ **Sécurité renforcée** : Rate limiting, validation, CORS, Helmet
- ✅ **SMTP Hostinger** : Utilisation de votre propre serveur email
- ✅ **Variables d'environnement** : Configuration sécurisée via `.env`

---

## 📦 Prérequis

- **Node.js** v22 ou supérieur
- **npm**
- Un compte **Hostinger** avec un plan email configuré
- Email configuré : `contact@votre-domaine.com`

---

## 🛠️ Installation

### 1. Cloner le projet

```bash
git clone https://github.com/Aboubakr67/send-email-serveur.git
```

### 3. Installer les dépendances

```bash
npm install
```

---

## ⚙️ Configuration

### Créer le fichier `.env`

Créez un fichier `.env` à la racine du projet :

```env
# Configuration Email Hostinger
EMAIL_USER=contact@votre-domaine.com
EMAIL_PASS=votre_mot_de_passe_email

# Configuration serveur
PORT=3000
FRONTEND_URL=http://localhost:5173

# SMTP Hostinger
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
```

**⚠️ Important :**

- Remplacez `EMAIL_USER` par votre vrai email Hostinger
- Remplacez `EMAIL_PASS` par le mot de passe de votre email

---

## 📂 Structure du projet

```
send-email-server/
├── server.js          # Serveur principal
├── .env              # Variables d'environnement (à créer)
├── .gitignore        # Fichiers à ignorer
├── package.json      # Dépendances
└── README.md         # Ce fichier
```

---

## 🚀 Démarrage

### Mode développement

```bash
npm run start
```

Le serveur démarre sur `http://localhost:3000`

---

**🎉 Serveur prêt à l'emploi ! Bon développement !**
