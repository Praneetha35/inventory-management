# 🌟 PantryPal: Simplify Your Kitchen, Amplify Your Cooking! 🌟

Welcome to PantryPal, your go-to app for effortless pantry management and meal inspiration. Built with Next.js, PantryPal transforms your kitchen experience with its AI-powered features.

## Key Features

✅ **Real-time Inventory Tracking**: Keep track of all your pantry items in real-time.

📸 **AI-powered Image Recognition**: Snap a photo of your grocery items, and PantryPal uses the GPT-4o mini API to automatically add them to your inventory.

🍲 **Smart Recipe Suggestions**: Let PantryPal scan your pantry and suggest mouthwatering recipes based on what you have, powered by the GPT-4o mini API.

🔍 **Search Functionality**: Quickly look up items in your pantry with the search feature.

## Tech Stack

- ⚛️ **Next.js**
- 🔥 **Firebase**
- 🤖 **OpenAI API**
- 🎨 **Material-UI**
- 🚀 **Vercel**

## Getting Started

### Prerequisites

Make sure you have Node.js and npm installed on your machine.

### Installation

1. **Clone the repository**:

    ```bash
    git clone https://github.com/yourusername/pantrypal.git
    cd pantrypal
    ```

2. **Install dependencies**:

    ```bash
    npm install
    ```

3. **Set up Firebase**:

    - Create a Firebase project in the [Firebase Console](https://console.firebase.google.com/).
    - Enable Firestore and configure your Firebase project.
    - Create a `.env.local` file in the root directory and add your Firebase configuration:

    ```env
    NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
    NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
    ```

4. **Run the development server**:

    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

### Adding Items

1. **Live Camera Functionality**: Use your mobile or browser camera to snap a photo of your grocery items. PantryPal will automatically recognize and add them to your inventory.

2. **Manual Entry**: Use the form to manually add, delete, or update pantry items.

### Recipe Suggestions

- Let PantryPal scan your pantry and suggest recipes based on the items you have. Simply click on the "Recipe Maker" feature.

### Search

- Use the search bar to quickly find items in your pantry.

## Deployment

PantryPal is deployed on Vercel with CI/CD configured for seamless updates.

## Demo

🎥 **Watch the demo on YouTube**: [YouTube Video](https://youtube.com/link-to-demo)
