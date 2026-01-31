# BREATHE SPEC

**Train Your Breath. Master Your Mind.**

Military-grade breathing techniques used by Navy SEALs, now available to everyone.

## Features

- **5 Breathing Techniques**: Box Breathing, Tactical Breathing, Physiological Sigh, 4-7-8 Breathing, and Energizing Breath
- **Immersive UI**: Beautiful dark-themed interface with animated breathing circles
- **Audio & Haptic Feedback**: Subtle chimes and vibration patterns for phase transitions
- **PWA Support**: Install on any device for offline access
- **No Account Required**: All data stored locally on your device

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS 3.4
- **Animation**: Framer Motion 11
- **State**: Zustand
- **Icons**: Lucide React

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Project Structure

```
breathe-spec/
├── app/                    # Next.js App Router pages
│   ├── breathe/           # Breathing session pages
│   ├── onboarding/        # First-time user flow
│   └── page.tsx           # Landing page
├── components/
│   ├── breathing/         # Core breathing components
│   ├── landing/           # Landing page sections
│   ├── onboarding/        # Onboarding steps
│   └── ui/                # Reusable UI components
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities and configurations
└── store/                 # Zustand state management
```

## Breathing Techniques

1. **Box Breathing (4-4-4-4)** - Navy SEAL standard for alert calm
2. **Tactical Breathing (4-pause-8)** - Rapid calm-down for acute stress
3. **Physiological Sigh** - Fastest scientifically-proven stress reduction
4. **4-7-8 Breathing** - Deep relaxation and sleep preparation
5. **Energizing Breath** - Alertness and energy boost

## License

MIT
