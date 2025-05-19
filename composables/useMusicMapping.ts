export const useMusicMapping = (codeAnalysis) => {
  console.log('useMusicMapping called with:', codeAnalysis)
  
  if (!codeAnalysis) {
    throw new Error('Code analysis data is required')
  }
  
  // Create music based on code structure
  const hasContent = codeAnalysis.functions.length > 0 || 
                   codeAnalysis.loops.length > 0 || 
                   codeAnalysis.conditionals.length > 0
  
  // Map functions to melodies
  const melodies = (codeAnalysis.functions || []).map((fn, index) => {
    const linesLength = (fn.lines && fn.lines.length) ? fn.lines.length : 4
    const length = Math.min(linesLength, 16) // Allow longer melodies
    
    // Create more varied note patterns based on function complexity
    const notes = []
    for (let i = 0; i < length; i++) {
      const noteIndex = (index * 2 + i + Math.floor(i / 4)) % 7
      const noteNames = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4']
      notes.push(noteNames[noteIndex])
    }
    
    // Vary durations based on position
    const durations = notes.map((_, i) => {
      if (i % 4 === 0) return '4n'
      if (i % 2 === 0) return '8n'
      return '16n'
    })
    
    return {
      name: fn.name || `function_${index}`,
      notes,
      durations,
      complexity: fn.complexity || linesLength
    }
  })
  
  // Map loops to rhythmic patterns
  const rhythms = (codeAnalysis.loops || []).map((loop, index) => {
    const depth = loop.depth || 1
    const iterations = loop.iterations || 8
    
    // Create more complex rhythm patterns
    const pattern = []
    const durations = []
    
    for (let i = 0; i < iterations; i++) {
      if (i % depth === 0) {
        pattern.push('C2')
        durations.push('8n')
      } else if (i % 3 === 0) {
        pattern.push('G2')
        durations.push('16n')
      } else {
        pattern.push(null)
        durations.push('16n')
      }
    }
    
    return {
      type: loop.type,
      pattern,
      durations
    }
  })
  
  // Map conditionals to harmonies
  const harmonies = (codeAnalysis.conditionals || []).map((cond, index) => {
    const noteNames = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
    const noteIndex = index % noteNames.length
    const rootNote = noteNames[noteIndex]
    
    // Create chord progressions based on conditional type
    const chords = cond.hasElse 
      ? [`${rootNote}maj7`, `${rootNote}min7`, `${rootNote}sus4`]
      : [`${rootNote}min7`, `${rootNote}maj`]
    
    const durations = chords.map(() => '2n')
    
    return {
      chords,
      durations
    }
  })
  
  // Create sequence from all musical elements
  const sequence = createMusicSequence(melodies, rhythms, harmonies, hasContent)
  
  return {
    melodies,
    rhythms,
    harmonies,
    sequence
  }
}

const createMusicSequence = (melodies, rhythms, harmonies, hasContent) => {
  const sequence = []
  let time = 0
  
  try {
    // If we have analyzed content, create music based on it
    if (hasContent) {
      console.log('Creating sequence from analyzed code')
      
      // Add melody notes with timing
      if (melodies && melodies.length > 0) {
        melodies.forEach((melody, melodyIndex) => {
          const startTime = melodyIndex * 4 // Space out melodies
          melody.notes.forEach((note, i) => {
            const duration = melody.durations[i] || '8n'
            const noteTime = startTime + (i * 0.25)
            sequence.push({
              type: 'melody',
              pitch: note,
              duration: duration,
              time: noteTime
            })
          })
        })
      }
      
      // Add rhythm patterns
      if (rhythms && rhythms.length > 0) {
        rhythms.forEach((rhythm, rhythmIndex) => {
          const startTime = rhythmIndex * 2
          rhythm.pattern.forEach((note, i) => {
            if (note) {
              const duration = rhythm.durations[i] || '16n'
              const noteTime = startTime + (i * 0.125)
              sequence.push({
                type: 'bass',
                pitch: note,
                duration: duration,
                time: noteTime
              })
            }
          })
        })
      }
      
      // Add harmony chords
      if (harmonies && harmonies.length > 0) {
        harmonies.forEach((harmony, harmonyIndex) => {
          const startTime = harmonyIndex * 4
          harmony.chords.forEach((chord, i) => {
            const duration = harmony.durations[i] || '2n'
            const chordTime = startTime + (i * 2)
            // Convert chord to notes
            const chordNotes = getChordNotes(chord)
            chordNotes.forEach(note => {
              sequence.push({
                type: 'harmony',
                pitch: note,
                duration: duration,
                time: chordTime
              })
            })
          })
        })
      }
      
      // Add drums based on code structure
      const drumPattern = createDrumPattern(melodies.length, rhythms.length)
      drumPattern.forEach(beat => {
        sequence.push(beat)
      })
      
    } else {
      // Default pattern for empty code
      console.log('No content found, creating default pattern')
      const defaultMelody = ['C4', 'E4', 'G4', 'C5', 'B4', 'G4', 'E4', 'C4']
      defaultMelody.forEach((note, i) => {
        sequence.push({
          type: 'melody',
          pitch: note,
          duration: '8n',
          time: i * 0.5
        })
      })
      
      // Add simple bass
      ['C2', 'G2', 'A2', 'F2'].forEach((note, i) => {
        sequence.push({
          type: 'bass',
          pitch: note,
          duration: '2n',
          time: i * 2
        })
      })
      
      // Add simple drums
      for (let i = 0; i < 16; i++) {
        if (i % 4 === 0) {
          sequence.push({
            type: 'drum',
            pitch: 'kick',
            duration: '4n',
            time: i * 0.25
          })
        }
        if (i % 4 === 2) {
          sequence.push({
            type: 'drum',
            pitch: 'snare',
            duration: '4n',
            time: i * 0.25
          })
        }
      }
    }
    
    console.log('Created sequence with', sequence.length, 'notes')
    return sequence
  } catch (error) {
    console.error('Error in createMusicSequence:', error)
    // Return a minimal sequence
    return [
      { type: 'melody', pitch: 'C4', duration: '4n', time: 0 },
      { type: 'melody', pitch: 'E4', duration: '4n', time: 0.5 },
      { type: 'melody', pitch: 'G4', duration: '4n', time: 1 },
      { type: 'melody', pitch: 'C5', duration: '4n', time: 1.5 }
    ]
  }
}

const getChordNotes = (chord) => {
  // Simple chord to notes conversion
  const chordMap = {
    'Cmaj': ['C3', 'E3', 'G3'],
    'Cmin': ['C3', 'Eb3', 'G3'],
    'Cmaj7': ['C3', 'E3', 'G3', 'B3'],
    'Cmin7': ['C3', 'Eb3', 'G3', 'Bb3'],
    'Csus4': ['C3', 'F3', 'G3'],
    // Add more chords as needed
  }
  
  // Extract root note and type
  const root = chord.substring(0, 1)
  const type = chord.substring(1)
  
  // If we have a direct mapping, use it
  if (chordMap[chord]) {
    return chordMap[chord]
  }
  
  // Otherwise, create a simple triad
  return [`${root}3`, `${root}#3`, `${root}4`]
}

const createDrumPattern = (melodyCount, rhythmCount) => {
  const pattern = []
  const complexity = melodyCount + rhythmCount
  const patternLength = 16 * (1 + Math.floor(complexity / 4))
  
  for (let i = 0; i < patternLength; i++) {
    // Kick drum on beats
    if (i % 4 === 0) {
      pattern.push({
        type: 'drum',
        pitch: 'kick',
        duration: '8n',
        time: i * 0.25
      })
    }
    
    // Snare on offbeats
    if (i % 4 === 2) {
      pattern.push({
        type: 'drum',
        pitch: 'snare',
        duration: '8n',
        time: i * 0.25
      })
    }
    
    // Hi-hat patterns based on complexity
    if (complexity > 2 && i % 2 === 1) {
      pattern.push({
        type: 'drum',
        pitch: 'hihat',
        duration: '16n',
        time: i * 0.25
      })
    }
  }
  
  return pattern
}