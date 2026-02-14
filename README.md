# Finzo - Modern Expense Tracker

![Finzo Banner](https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=2000&h=600)
*A sleek, offline-first personal finance application offering insights into your spending habits with a premium user experience.*

## 🚀 Introduction

**Finzo** is a modern, responsive expense tracking application built with **Next.js** and **Tailwind CSS**. Designed for privacy and simplicity, it stores all data locally in your browser, ensuring your financial information remains yours. With a focus on aesthetics and usability, Finzo makes tracking expenses not just easy, but enjoyable.

## ✨ Key Features

*   **📊 Interactive Dashboard**: visualized financial health score and spending summaries.
*   **💸 Expense Management**: Easily add, edit, and delete expenses with category tagging.
*   **🔍 Smart Filtering**: Filter expenses by category, date, price, or search by note.
*   **📈 Visual Analytics**: Beautiful interactive charts to analyze monthly spending trends.
*   **🌗 Dark Mode**: Fully supported dark mode for comfortable night-time usage.
*   **📂 Data Export**: Export your expense data to JSON/CSV for external analysis.
*   **📱 Responsive Design**: optimized for both desktop and mobile devices.
*   **🔒 Local Storage**: 100% offline functionality. No servers, no accounts required.

## 🛠️ Tech Stack

*   **Framework**: [Next.js 15](https://nextjs.org/) (App Directory)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **Charts**: [Recharts](https://recharts.org/)
*   **Animations**: [Framer Motion](https://www.framer.com/motion/) & Tailwind Animate
*   **Notifications**: [Sonner](https://sonner.emilkowal.ski/)
*   **Fonts**: [Geist Sans & Mono](https://vercel.com/font)

## 🏁 Getting Started

Follow these steps to get a local copy up and running.

### Prerequisites

*   Node.js 18.17 or later
*   npm, yarn, or pnpm

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-username/finzo.git
    cd finzo
    ```

2.  **Install dependencies**
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3.  **Start the development server**
    ```bash
    npm run dev
    ```

4.  **Open your browser**
    Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
finzo/
├── app/
│   ├── components/    # Reusable UI components (Sidebar, ExpenseList, Charts)
│   ├── dashboard/     # Main overview page
│   ├── expenses/      # Expense management page
│   ├── summary/       # detailed analytics page
│   ├── settings/      # User preferences and data management
│   ├── layout.tsx     # Root layout with Sidebar and MobileNav
│   └── globals.css    # Global styles and Tailwind directives
├── public/            # Static assets
└── ...config files    # Tailwind, Next.js, TypeScript configs
```

## 🚀 Deployment

The easiest way to deploy Finzo is to use the [Vercel Platform](https://vercel.com/new).

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourusername%2Ffinzo)

1.  Push your code to a GitHub repository.
2.  Import the project into Vercel.
3.  Vercel will automatically detect Next.js and deploy your app.

> **Note**: Since Finzo uses **Local Storage**, data will persist on the user's device but won't sync across devices. This makes it perfect for a privacy-focused, personal deployment.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
