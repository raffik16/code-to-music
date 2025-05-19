import { Note } from 'tonal'

export const useCharacterMusic = () => {
  // Map characters to musical notes
  const charToNote = {
    // Letters (uppercase and lowercase get different octaves)
    'a': 'C4', 'A': 'C5',
    'b': 'D4', 'B': 'D5',
    'c': 'E4', 'C': 'E5',
    'd': 'F4', 'D': 'F5',
    'e': 'G4', 'E': 'G5',
    'f': 'A4', 'F': 'A5',
    'g': 'B4', 'G': 'B5',
    'h': 'C5', 'H': 'C6',
    'i': 'D5', 'I': 'D6',
    'j': 'E5', 'J': 'E6',
    'k': 'F5', 'K': 'F6',
    'l': 'G5', 'L': 'G6',
    'm': 'A5', 'M': 'A6',
    'n': 'B5', 'N': 'B6',
    'o': 'C4', 'O': 'C5',
    'p': 'D4', 'P': 'D5',
    'q': 'E4', 'Q': 'E5',
    'r': 'F4', 'R': 'F5',
    's': 'G4', 'S': 'G5',
    't': 'A4', 'T': 'A5',
    'u': 'B4', 'U': 'B5',
    'v': 'C5', 'V': 'C6',
    'w': 'D5', 'W': 'D6',
    'x': 'E5', 'X': 'E6',
    'y': 'F5', 'Y': 'F6',
    'z': 'G5', 'Z': 'G6',
    
    // Numbers
    '0': 'C3',
    '1': 'D3',
    '2': 'E3',
    '3': 'F3',
    '4': 'G3',
    '5': 'A3',
    '6': 'B3',
    '7': 'C4',
    '8': 'D4',
    '9': 'E4',
    
    // Special characters (percussion/effects)
    ' ': null, // Space = silence
    '.': 'kick',
    ',': 'hihat',
    ';': 'snare',
    ':': 'snare',
    '(': 'openhat',
    ')': 'closehat',
    '[': 'crash',
    ']': 'crash',
    '{': 'ride',
    '}': 'ride',
    '=': 'clap',
    '+': 'cowbell',
    '-': 'tom',
    '_': 'tom',
    '/': 'splash',
    '\\': 'splash',
    '|': 'china',
    '!': 'accent',
    '?': 'accent',
    '@': 'bell',
    '#': 'bell',
    '$': 'coin',
    '%': 'coin',
    '^': 'triangle',
    '&': 'woodblock',
    '*': 'conga',
    
    // Quotes
    '"': 'shaker',
    "'": 'tambourine',
    
    // Line break (will be configurable)
    '\n': 'special'
  }
  
  // Available line break sounds
  const lineBreakSounds = [
    { label: 'Gong', value: 'gong' },
    { label: 'Cymbal Crash', value: 'crash' },
    { label: 'Wind Chime', value: 'windchime' },
    { label: 'Bell', value: 'bell' },
    { label: 'Harp Gliss', value: 'harp' },
    { label: 'Reverse Cymbal', value: 'reverse' },
    { label: 'Whoosh', value: 'whoosh' },
    { label: 'Thunder', value: 'thunder' },
    { label: 'Ocean Wave', value: 'wave' },
    { label: 'Bird Chirp', value: 'bird' }
  ]
  
  const getCharacterSound = (char, lineBreakSound = 'gong') => {
    const sound = charToNote[char]
    
    if (sound === 'special') {
      // Handle line break with selected sound
      console.log('Special character detected:', char, 'Using sound:', lineBreakSound)
      return {
        type: 'special',
        sound: lineBreakSound,
        char: char,
        duration: '2n'
      }
    } else if (sound === null) {
      // Silence for spaces
      return {
        type: 'silence',
        char: char,
        duration: '16n'
      }
    } else if (sound === undefined) {
      // Unknown character - use a default sound
      return {
        type: 'percussion',
        sound: 'hihat',
        char: char,
        duration: '16n'
      }
    } else if (typeof sound === 'string' && (sound.includes('C') || sound.includes('D') || sound.includes('E') || 
               sound.includes('F') || sound.includes('G') || sound.includes('A') || 
               sound.includes('B'))) {
      // Musical note
      return {
        type: 'note',
        pitch: sound,
        char: char,
        duration: '16n'
      }
    } else {
      // Percussion sound
      return {
        type: 'percussion',
        sound: sound,
        char: char,
        duration: '16n'
      }
    }
  }
  
  const createCharacterSequence = (code, lineBreakSound = 'gong') => {
    const sequence = []
    let time = 0
    const timeIncrement = 0.125 // 16th note duration
    
    for (let i = 0; i < code.length; i++) {
      const char = code[i]
      const sound = getCharacterSound(char, lineBreakSound)
      
      sequence.push({
        ...sound,
        time: time,
        index: i,
        line: code.substring(0, i).split('\n').length,
        column: i - code.lastIndexOf('\n', i - 1) - 1
      })
      
      // Increment time (longer pause for line breaks)
      if (char === '\n') {
        time += timeIncrement * 4 // Quarter note duration for line breaks
      } else if (char === ' ') {
        time += timeIncrement / 2 // Shorter pause for spaces
      } else {
        time += timeIncrement
      }
    }
    
    return sequence
  }
  
  return {
    charToNote,
    lineBreakSounds,
    getCharacterSound,
    createCharacterSequence
  }
}