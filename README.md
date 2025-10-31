# Little Lemon Restaurant Booking System

A modern web application for managing table reservations at Little Lemon restaurant. Built with React, TypeScript, Vite, and Supabase.

## Features

- **User Authentication**: Secure login and registration with email/password authentication
- **Table Booking**: Reserve tables with flexible date, time, and guest count options
- **Booking Management**: View, edit, and cancel reservations
- **Form Validation**: Comprehensive client-side validation for all forms
- **Responsive Design**: Mobile-friendly interface that works across all devices
- **Accessibility**: WCAG-compliant semantic HTML and ARIA labels
- **Real-time Updates**: Instant feedback on booking operations

## Requirements

- Node.js 18+
- npm or yarn package manager
- Supabase account (database is pre-configured)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

The `.env` file is already configured with Supabase credentials. No additional setup is required.

### 3. Start Development Server

```bash
npm run dev
```

The application will open at `http://localhost:5173`

### 4. Build for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/           # Reusable React components
│   ├── LoginForm.tsx      # User login form
│   ├── RegisterForm.tsx   # User registration form
│   ├── BookingForm.tsx    # Table booking form
│   └── BookingsList.tsx   # User bookings display
├── pages/               # Page components
│   ├── AuthPage.tsx      # Authentication page
│   └── Dashboard.tsx     # Main dashboard
├── context/             # React context
│   └── AuthContext.tsx   # Authentication context
├── lib/                 # External library setup
│   └── supabase.ts      # Supabase client initialization
├── utils/               # Utility functions
│   ├── validation.ts    # Form validation functions
│   └── validation.test.ts # Unit tests for validation
├── App.tsx              # Main app component
├── main.tsx             # Entry point
└── index.css            # Global styles
```

## Key Features

### Authentication
- Secure email/password signup
- Login with validation
- Persistent session management
- Automatic logout functionality

### Booking System
- Create bookings with date, time, and guest count
- Maximum 6 guests per reservation
- Bookings available 11 AM to 9 PM
- Up to 30 days in advance
- Closed on weekends

### Validation Rules
- **Date**: Must be today or later, within 30 days
- **Time**: Between 11:00 AM and 9:00 PM
- **Guests**: Between 1 and 6 guests
- **Password**: Minimum 6 characters
- **Phone**: Valid phone number format

### Data Security
- Row Level Security (RLS) policies ensure users can only access their own bookings
- All data is encrypted in transit
- Secure authentication with Supabase Auth

## Testing

The project includes unit tests for validation functions:

```bash
npm test
```

Tests cover:
- Email validation
- Password validation
- Phone number validation
- Date and time validation
- Guest count validation
- Booking form validation

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Android)

## Accessibility

- Full keyboard navigation support
- Semantic HTML structure
- ARIA labels and roles
- Focus management
- Color contrast compliance (WCAG AA)
- Screen reader compatible

## Database Schema

### Users Table (auth.users)
- Managed by Supabase Auth
- Contains authentication information

### Profiles Table
- `id` (uuid): User ID
- `email` (text): User email
- `full_name` (text): User's full name
- `phone` (text): User's phone number
- `created_at` (timestamp): Account creation date
- `updated_at` (timestamp): Last update date

### Bookings Table
- `id` (uuid): Booking ID
- `user_id` (uuid): Reference to user
- `date` (date): Reservation date
- `time` (time): Reservation time
- `number_of_guests` (integer): Number of guests (1-6)
- `occasion` (text): Event type (optional)
- `special_requests` (text): Special notes (optional)
- `status` (text): Booking status
- `created_at` (timestamp): Booking creation date
- `updated_at` (timestamp): Last update date

## Common Issues

### Cannot connect to database
- Ensure your internet connection is stable
- Verify Supabase credentials in `.env` file
- Check that your Supabase project is active

### Bookings not showing
- Clear browser cache and cookies
- Refresh the page
- Ensure you're logged in with the correct account

### Form validation errors
- Check that all required fields are filled
- Verify date is not in the past
- Ensure phone number format is correct

## Support

For issues or questions, please refer to the documentation or contact support.

## License

This project is part of the Little Lemon Restaurant capstone project.
