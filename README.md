# UniqYou - AI Fashion Customization Platform

**UniqYou** is a next-generation e-commerce experience that combines **Generative AI** with **3D Visualization** to allow users to customize fashion items in real-time.

## 🚀 Features

*   **AI Design Assistant**: Chat with an AI stylist to change colors, textures, and styles using natural language (e.g., "Change the dress to Midnight Blue").
*   **Real-time 3D Rendering**: High-fidelity 3D visualization of products using `React Three Fiber`.
*   **Smart Shader Engine**: Custom-built shader architecture that applies colors realistically by respecting fabric physics (Luminance Matching & Gamma Corrected Dyeing).
*   **Virtual Try-On Experience**: "Ghost Mannequin" visualization for a professional look.
*   **Shopping Bag**: Fully functional cart with quantity controls and real-time total calculation.

## 🛠️ Tech Stack

*   **Framework**: [Next.js 15](https://nextjs.org/) (React 19)
*   **Language**: TypeScript
*   **3D Engine**: [Three.js](https://threejs.org/) & [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
*   **AI Integration**: [OpenAI API](https://openai.com/) (GPT-4o)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Animations**: [Framer Motion](https://www.framer.com/motion/)

## 📦 Installation & Setup

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/uniqyou.git
    cd uniqyou
    ```

2.  **Install Dependencies**:
    This project uses `npm` (Node Package Manager).
    ```bash
    npm install
    ```

3.  **Environment Configuration**:
    Create a `.env.local` file in the root directory and add your OpenAI API Key:
    ```env
    OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxx
    ```

4.  **Run the Development Server**:
    ```bash
    npm run dev
    ```

5.  **Open the App**:
    Visit `http://localhost:3000` in your browser.

## 🎨 How to Use

1.  **Select a Product**: Browse the collection (Women, Men, Kids, Accessories).
2.  **Chat with AI**: click on the "AI Design" chat badge.
    *   *Type*: "Show me this in Emerald Green."
    *   *Type*: "I want a gold silk texture."
3.  **Visual Confirmation**: The 3D viewer will update instantly to reflect your design.
4.  **Add to Cart**: Click "Add to Bag" to purchase your custom creation.

## 📂 Project Structure

*   `app/`: Next.js App Router pages.
*   `components/`: React components (3D Viewer, Chat Interface, Cart).
*   `lib/`: Utility functions and AI server actions (`ai-action.ts`).
*   `context/`: Global state management (`CartContext`).
*   `public/images/`: Static assets and mannequin images.

## 🧩 Key Dependencies

(See `package.json` for full list)
*   `react`, `next`: Core framework.
*   `three`, `@react-three/fiber`, `@react-three/drei`: 3D functionalities.
*   `openai`: AI completions.
*   `framer-motion`: UI animations.
