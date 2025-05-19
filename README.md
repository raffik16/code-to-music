# Code Composer

Turn your code into music! Code Composer transforms every character in your source code into unique musical compositions, creating a symphony from your programming.

## Features

### 🎵 Two Playback Modes

1. **Character-by-Character**: Plays through your code sequentially, with each character producing its unique sound
2. **Live Type (Musical Keyboard)**: Turn your keyboard into a musical instrument - every keystroke plays a sound in real-time

### 🎹 Sound Mapping

- **Letters** → Musical notes (lowercase and uppercase in different octaves)
- **Numbers** → Higher octave notes
- **Symbols** → Percussion sounds (brackets, operators, punctuation)
- **Line Breaks** → Customizable special effects (gong, cymbal crash, wind chime, bell, harp gliss, and more!)

### 🎨 Visual & Audio Features

- Real-time waveform visualization
- Character highlighting during playback
- MP3 download for your compositions
- Live recording for typing sessions
- Customizable line break sounds

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/code-composer.git
cd code-composer

# Install dependencies
npm install
# or
pnpm install

# Start development server
npm run dev
# or
pnpm dev
```

### Usage

1. Open the app in your browser at `http://localhost:3000`
2. Choose your playback mode:
   - **Character-by-Character**: Paste code and click "Generate Music"
   - **Live Type**: Start typing to hear music immediately
3. Customize your line break sound from the dropdown
4. Watch the visualization and listen to your code
5. Download your creation as an MP3 when you're ready

## Development

This project uses:
- **Nuxt 3** - Vue.js framework
- **Tone.js** - Web audio synthesis and scheduling
- **Tailwind CSS** - Styling
- **TypeScript** - Type safety

### Project Structure

```
code-to-music/
├── components/       # Vue components
├── composables/      # Composition API utilities
├── pages/           # App pages
├── stores/          # Pinia stores
└── assets/          # Static assets
```

### Key Components

- **SimpleCodeEditor**: Code input with syntax highlighting
- **AudioVisualizer**: Real-time waveform display
- **MusicControls**: Playback controls
- **PlaybackMode**: Mode selector and settings
- **DownloadMusic**: MP3 export functionality

### Building for Production

```bash
npm run build
npm run preview
```

## Tips for Better Music

- Mix uppercase and lowercase letters for melodic variety
- Use symbols strategically to add percussion accents
- Try different line break sounds to find your favorite rhythm
- In live mode, experiment with typing speed to create different beats
- Combine letters, numbers, and symbols for rich compositions

## Character Sound Reference

| Character Type | Sound | 
|---------------|-------|
| Lowercase letters (a-z) | Notes: C4-B4 range |
| Uppercase letters (A-Z) | Notes: C5-B5 range |
| Numbers (0-9) | Notes: C6-B6 range |
| Brackets (), [], {} | Percussion: kick, snare, hihat |
| Operators +, -, *, / | Percussion: tom, splash, china |
| Special chars @, #, $ | Effects: bell, coin, triangle |
| Line breaks | Customizable special effects |

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgments

- Built with [Tone.js](https://tonejs.github.io/) for web audio
- Inspired by the beauty of code and music