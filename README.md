# Pearl Thoughts

A modern, minimal platform for Managing Teacher. Built with Next.js, Tailwind CSS, and Zod for type-safe form validation.

## Live Demo

[pearl-thoughts-kappa.vercel.app](https://pearl-thoughts-kappa.vercel.app)

## Demo Video

[![Pearl Thoughts Demo](https://img.shields.io/badge/Demo-Video-blue)](https://www.loom.com/share/7e85be382911463798c22fbdf2af3588)

## Tech Stack

- **Framework:** Next.js
- **Styling:** Tailwind CSS
- **Validation:** Zod
- **Language:** TypeScript
- **Deployment:** Vercel

## Design Philosophy

The application follows a component-based architecture where each section is divided into separate, reusable components. The sidebar and navbar have been combined into a single unified navigation component for better user experience and cleaner code organization.

Drawing inspiration from my previous work of an event management system similiar to BookMyShow, I've combined those UI patterns with the provided design references to create something both simple and visually appealing. The design maintains the core functionalities while presenting them in an intuitive, simple and modern interface.

### ✅ Unified Validation & State
All form validation and state logic are kept on the same page to make the codebase easy to follow and debug. However, the logic can be modularized into hooks and schema files when scaling.

### 🔔 Instant Feedback with Toasts
Toasts are used for real-time notifications like form success, errors, and status updates — helping users stay informed without interrupting their workflow.

### 🎯 Micro Interactions
Smooth transitions, micro animations, and visual feedback improve user engagement and make interactions more intuitive.

## Project Structure

```
📦src
 ┣ 📂app
 ┃ ┣ 📂Teacher
 ┃ ┃ ┣ 📂Dashboard
 ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┣ 📂Feedback
 ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┣ 📂Payments
 ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┣ 📂Performance
 ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┣ 📂Qualifications
 ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┣ 📂Scheduling
 ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┣ 📂Settings
 ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┣ 📂Teacher-List
 ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┗ 📜layout.tsx
 ┃ ┣ 📜favicon.ico
 ┃ ┣ 📜globals.css
 ┃ ┣ 📜layout.tsx
 ┃ ┗ 📜page.tsx
 ┣ 📂components
 ┃ ┣ 📂ui
 ┃ ┃ ┣ 📜button.tsx
 ┃ ┃ ┣ 📜card.tsx
 ┃ ┃ ┣ 📜dialog.tsx
 ┃ ┃ ┣ 📜input.tsx
 ┃ ┃ ┣ 📜label.tsx
 ┃ ┃ ┣ 📜select.tsx
 ┃ ┃ ┣ 📜tabs.tsx
 ┃ ┃ ┗ 📜textarea.tsx
 ┃ ┣ 📜AuthButton.tsx
 ┃ ┣ 📜Contact.tsx
 ┃ ┣ 📜Details.tsx
 ┃ ┣ 📜Header.tsx
 ┃ ┣ 📜Main.tsx
 ┃ ┣ 📜Navigation.tsx
 ┃ ┣ 📜Practical.tsx
 ┃ ┣ 📜Schedule.tsx
 ┃ ┗ 📜Today.tsx
 ┗ 📂lib
 ┃ ┗ 📜utils.ts
```

## Features

### 📊 Dashboard Overview
The platform features a clean and informative dashboard that offers teachers a snapshot of their academic and administrative details in one place.

### 👤 Teacher Profile
Displays comprehensive personal and professional information:
- Full name, role, work and personal email
- Contact number and full mailing address
- Clearly structured layout for quick access and readability

### 📚 Lesson Overview
Teachers can view all their active courses along with:
- Course name and pricing
- Skill level (e.g., Intermediate, Advanced)
- Years of experience for each subject
- Support for multiple courses with an expandable layout (`+2 more`)

### 📅 Daily Schedule Snapshot
Highlights all classes scheduled for the current day:
- Includes time, student name, subject, and duration
- Easily scannable to manage time and sessions throughout the day

### 🗓️ Weekly Availability Management
Offers a grid-based weekly scheduler with:
- Time slots from **7:30 AM to 6:00 PM**
- Days spanning **Monday through Sunday**
- Status indicators like `Scheduled`, `Available`, `Invoiced`, and more
- Designed for intuitive time management and session tracking
  
## Features That can Be Implemented in Future

**Dashboard**: Comprehensive overview with key metrics and quick access to all major functions.

**Teacher Management**: Complete teacher profiles with qualifications, performance tracking, and scheduling capabilities.

**Scheduling System**: Intuitive calendar-based scheduling with availability management and booking confirmation.

**Performance Analytics**: Data visualization for teacher performance metrics and student feedback analysis.

**Payment Integration**: Streamlined payment processing with transaction history and financial reporting.

**Feedback System**: Real-time feedback collection and analysis with rating systems.

**Settings Management**: User preferences, notification settings, and system configuration options.

The navigation is designed to be intuitive with clear visual hierarchies and consistent interaction patterns throughout the application. Each section maintains its own state while seamlessly integrating with the overall user experience.

## Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/pearl-thoughts.git
cd pearl-thoughts
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables (Not needed here)
```bash
cp .env.example .env.local
```

4. Run the development server
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Deploy automatically on every push to main branch

### Manual Deployment

```bash
npm run build
npm run start
```

## Future Enhancements

- User authentication system
- Database integration for persistent storage
- Search and filtering capabilities
- Data Export and import functionality
- Media upload support

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

## License

This project is licensed under No License.

## Author

**Vinayak Pathak**

- Linkedin: [My Linkedin](https://www.linkedin.com/in/pathakvinayak/)
- Portfolio: [My Portfolio](https://vinayakpathak.vercel.app)
