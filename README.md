# Light-it Challenge — React Native (Expo)

Frontend mobile challenge built with **React Native (Expo)** as the mobile adaptation of the patient management web app.

# How to run locally

1. # Clone the repository

   bash
   git clone https://github.com/charlie1203/light-it-challenge.git
   cd light-it-challenge

2. # Install dependencies

   run -> npm install

3. # Environment variables

   -> Create a .env file in the root directory and paste this 2 lines:
   EXPO_PUBLIC_API_BASE_URL=https://63bedcf7f5cfc0949b634fc8.mockapi.io
   EXPO_PUBLIC_API_PATIENTS_PATH=/users

4. # Start the project

   npm start

5. # Run the app

   -> Scan the QR code with Expo Go (Android/IOS), or
   -> Press a / i to open in Android / IOS emulator.

_##_ Design decisions & tools _##_

# Project setup

The app was crafted with Expo -> React Native, using the blank-typescript template.
Expo provides a fast developer tool with cross-platform testing via Expo Go, making it ideal to test and visualize the app’s behavior and user experience in real time.

# Architecture

The project follows a simple, modular structure:

src/
|--- components/ → Reusable UI components (PatientCard, PatientForm, Notification)
|--- screens/ → Main screen (HomeScreen)
|--- services/ → API layer and data fetching logic
|--- types/ → Shared TypeScript types

This organization separates UI, data, and types clearly while keeping the codebase small and easy to extend.

# API & data

Patient data comes from the public MockAPI endpoint:
https://63bedcf7f5cfc0949b634fc8.mockapi.io/users

I used environment variables (EXPO_PUBLIC_API_BASE_URL, EXPO_PUBLIC_API_PATIENTS_PATH) to keep config outside the code.
The app loads patients on mount and lets you add or edit them locally — no backend persistence, as requested.

🧾 Forms & Validation

Forms use react-hook-form with Zod for simple schema validation, to make sure each entry is complete and valid before saving.

🎨 UI & Styling

Everything is styled by hand with React Native’s StyleSheet — no UI libraries.
I aimed for a clean layout with:

Expandable patient cards

A modal form for add/edit

A small loader and toast notifications for feedback

⚙️ Design Choices

Kept it on a single screen for simplicity.
Used a modal instead of a new route for better flow.
Environment variables for structure.
And no external UI libs — all components are custom.
