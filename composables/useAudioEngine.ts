import { ref } from 'vue'
import * as Tone from 'tone'

export const useAudioEngine = () => {
  const isPlaying = ref(false)
  const audioData = ref([])
  const currentCharIndex = ref(-1)
  const hasGenerated = ref(false)
  let synths = []
  let parts = []
  let characterSequence = null
  let recorder = null

  const initAudio = async () => {
    console.log('Initializing audio...')
    await Tone.start()
    console.log('Tone.js started, state:', Tone.Transport.state)
    console.log('Current BPM:', Tone.Transport.bpm.value)
    Tone.Transport.bpm.value = 120
  }

  const generateAudio = async (musicMapping) => {
    console.log('generateAudio called')
    try {
      await initAudio()
      
      // Clean up previous instances
      console.log('Cleaning up previous instances...')
      
      // Stop transport and cancel scheduled events
      if (Tone.Transport.state === 'started') {
        Tone.Transport.stop()
      }
      Tone.Transport.cancel()
      Tone.Transport.position = 0
      
      // Dispose of synths
      synths.forEach(synth => {
        try {
          synth.dispose()
        } catch (error) {
          console.error('Error disposing synth:', error)
        }
      })
      
      // Stop and dispose of parts
      parts.forEach(part => {
        try {
          part.stop(0)
          part.cancel()
          part.dispose()
        } catch (error) {
          console.error('Error disposing part:', error)
        }
      })
      
      // Clear arrays and reset state
      synths = []
      parts = []
      characterSequence = null
      currentCharIndex.value = -1
      
      const { sequence } = musicMapping
      console.log('Sequence length:', sequence.length)
      
      // Set fixed tempo
      Tone.Transport.bpm.value = 120
      
      // Character-by-character mode
      characterSequence = sequence
      await setupCharacterPlayback()
      
      hasGenerated.value = true
      console.log(`Generated ${parts.length} parts successfully`)
      return true
    } catch (error) {
      console.error('Error generating audio:', error)
      return false
    }
  }
  
  const setupCharacterPlayback = async () => {
    // Create synths for character playback
    const noteSynth = new Tone.PolySynth().toDestination()
    noteSynth.volume.value = -5
    synths.push(noteSynth)
    
    // Percussion sounds
    const kick = new Tone.MembraneSynth().toDestination()
    kick.volume.value = -5
    synths.push(kick)
    
    const snare = new Tone.NoiseSynth({
      noise: { type: 'white' },
      envelope: { attack: 0.005, decay: 0.1, sustain: 0 }
    }).toDestination()
    snare.volume.value = -10
    synths.push(snare)
    
    const hihat = new Tone.MetalSynth({
      frequency: 200,
      envelope: { attack: 0.001, decay: 0.05, release: 0.01 },
      harmonicity: 5.1,
      modulationIndex: 32,
      resonance: 4000,
      octaves: 1.5
    }).toDestination()
    hihat.volume.value = -15
    synths.push(hihat)
    
    // Special effects for line breaks
    const gong = new Tone.MetalSynth({
      frequency: 60,
      envelope: { attack: 0.1, decay: 1.5, release: 2 },
      harmonicity: 0.5,
      modulationIndex: 32,
      resonance: 1000,
      octaves: 4
    }).toDestination()
    gong.volume.value = -8
    synths.push(gong)
    
    const bell = new Tone.PolySynth().toDestination()
    bell.volume.value = -10
    synths.push(bell)
    
    // Create part for character sequence
    const characterPart = new Tone.Part((time, event) => {
      currentCharIndex.value = event.index
      
      console.log(`Playing character '${event.char}' at position ${event.index} (line ${event.line}, col ${event.column})`)
      
      switch (event.type) {
        case 'note':
          console.log(`  Sound: Note ${event.pitch}`)
          noteSynth.triggerAttackRelease(event.pitch, event.duration, time)
          break
          
        case 'percussion':
          console.log(`  Sound: Percussion ${event.sound}`)
          switch (event.sound) {
            case 'kick':
              kick.triggerAttackRelease('C1', event.duration, time)
              break
            case 'snare':
              snare.triggerAttackRelease(event.duration, time)
              break
            case 'hihat':
            case 'openhat':
            case 'closehat':
              hihat.triggerAttackRelease(event.duration, time)
              break
            default:
              // Use hihat for other percussion sounds
              hihat.triggerAttackRelease(event.duration, time)
          }
          break
          
        case 'special':
          console.log(`  Sound: Special ${event.sound} (line break)`)
          switch (event.sound) {
            case 'gong':
              gong.triggerAttackRelease(event.duration, time)
              break
            case 'bell':
              bell.triggerAttackRelease(['C5', 'E5', 'G5'], event.duration, time)
              break
            case 'crash':
              hihat.frequency.value = 800
              hihat.triggerAttackRelease('2n', time)
              hihat.frequency.value = 200 // Reset
              break
            case 'chime':
            case 'windchime':
              // Wind chime effect
              bell.triggerAttackRelease(['E5'], '16n', time)
              bell.triggerAttackRelease(['G5'], '16n', time + 0.1)
              bell.triggerAttackRelease(['B5'], '16n', time + 0.2)
              break
            case 'harp':
              // Harp glissando
              const harpNotes = ['C4', 'E4', 'G4', 'C5', 'E5', 'G5', 'C6']
              harpNotes.forEach((note, i) => {
                noteSynth.triggerAttackRelease(note, '16n', time + i * 0.05)
              })
              break
            case 'reverse':
              // Simulate reverse cymbal with volume envelope
              const originalVolume = hihat.volume.value
              hihat.volume.value = -40
              hihat.triggerAttackRelease('2n', time)
              // Gradually increase volume
              Tone.Transport.scheduleOnce(() => {
                hihat.volume.rampTo(originalVolume, 2)
              }, time)
              Tone.Transport.scheduleOnce(() => {
                hihat.volume.value = originalVolume
              }, time + 2)
              break
            case 'whoosh':
              // Whoosh sound using noise
              snare.triggerAttackRelease('8n', time)
              break
            case 'thunder':
              // Thunder using kick and noise
              kick.triggerAttackRelease('C0', '2n', time)
              snare.triggerAttackRelease('2n', time + 0.1)
              break
            case 'wave':
              // Ocean wave using noise
              snare.envelope.attack = 1
              snare.envelope.decay = 0.5
              snare.envelope.release = 1.5
              snare.triggerAttackRelease('2n', time)
              // Reset envelope
              snare.envelope.attack = 0.001
              snare.envelope.decay = 0.1
              snare.envelope.release = 0.1
              break
            case 'bird':
              // Bird chirp
              const birdNotes = ['G6', 'E6', 'C6', 'G6']
              birdNotes.forEach((note, i) => {
                noteSynth.triggerAttackRelease(note, '32n', time + i * 0.1)
              })
              break
            default:
              gong.triggerAttackRelease(event.duration, time)
          }
          break
          
        case 'silence':
          console.log(`  Sound: Silence (space)`)
          // No sound for spaces
          break
      }
    }, characterSequence.map(event => [event.time, event]))
    
    characterPart.loop = false
    parts.push(characterPart)
  }
  
  
  const playAudio = async () => {
    console.log('playAudio called')
    try {
      await Tone.start()
      console.log('Tone.js state before play:', Tone.Transport.state)
      
      parts.forEach((part, index) => {
        console.log(`Starting part ${index}`)
        part.start(0)
      })
      
      console.log('Starting transport...')
      Tone.Transport.start()
      isPlaying.value = true
      console.log('Audio playback started, transport state:', Tone.Transport.state)
      
    } catch (error) {
      console.error('Error playing audio:', error)
    }
  }
  
  const pauseAudio = () => {
    console.log('Pausing audio')
    Tone.Transport.pause()
    isPlaying.value = false
    console.log('Transport state:', Tone.Transport.state)
  }
  
  const stopAudio = () => {
    console.log('Stopping audio')
    try {
      // Stop the transport first
      Tone.Transport.stop()
      Tone.Transport.cancel() // Cancel all scheduled events
      
      // Clear the transport position
      Tone.Transport.position = 0
      
      // Stop and dispose of parts
      parts.forEach((part, index) => {
        console.log(`Stopping part ${index}`)
        try {
          part.stop(0) // Stop at time 0 to avoid negative values
          part.cancel() // Cancel all scheduled events
          part.dispose() // Dispose of the part
        } catch (partError) {
          console.error(`Error stopping part ${index}:`, partError)
        }
      })
      parts = [] // Clear the parts array
      
      isPlaying.value = false
      currentCharIndex.value = -1
      console.log('Transport state:', Tone.Transport.state)
    } catch (error) {
      console.error('Error stopping audio:', error)
    }
  }
  
  const downloadMP3 = async () => {
    console.log('Starting MP3 recording...')
    try {
      await Tone.start()
      
      // Create a new recorder
      recorder = new Tone.Recorder()
      
      // Connect to master output
      Tone.getDestination().connect(recorder)
      
      // Start recording
      await recorder.start()
      
      // Reset and play the entire sequence
      Tone.Transport.position = 0
      parts.forEach(part => {
        part.stop()
        part.start(0)
      })
      Tone.Transport.start()
      
      // Wait for the music to complete
      const duration = getDuration()
      await new Promise(resolve => setTimeout(resolve, duration * 1000))
      
      // Stop recording
      const recording = await recorder.stop()
      
      // Stop playback
      Tone.Transport.stop()
      parts.forEach(part => part.stop())
      
      // Create download link
      const blob = new Blob([recording], { type: 'audio/mp3' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'code-music.mp3'
      a.click()
      URL.revokeObjectURL(url)
      
      console.log('MP3 download complete')
    } catch (error) {
      console.error('Error recording MP3:', error)
    } finally {
      if (recorder) {
        recorder.dispose()
        recorder = null
      }
      isPlaying.value = false
    }
  }
  
  const getDuration = () => {
    // Calculate the duration of the music
    let maxDuration = 0
    
    parts.forEach(part => {
      const loopEnd = part.loopEnd
      if (loopEnd) {
        // Convert Tone.js time to seconds
        const seconds = Tone.Time(loopEnd).toSeconds()
        maxDuration = Math.max(maxDuration, seconds)
      }
    })
    
    // Default to 30 seconds if no loop end found
    return maxDuration || 30
  }
  
  const resetAudio = () => {
    console.log('Resetting audio engine')
    
    try {
      // Stop the transport first
      if (Tone.Transport.state === 'started') {
        Tone.Transport.stop()
      }
      Tone.Transport.cancel()
      Tone.Transport.position = 0
      
      // Dispose of synths
      synths.forEach(synth => {
        try {
          synth.dispose()
        } catch (error) {
          console.error('Error disposing synth during reset:', error)
        }
      })
      
      // Stop and dispose of parts
      parts.forEach(part => {
        try {
          part.stop(0)
          part.cancel()
          part.dispose()
        } catch (error) {
          console.error('Error disposing part during reset:', error)
        }
      })
      
      // Clear everything
      synths = []
      parts = []
      characterSequence = null
      currentCharIndex.value = -1
      hasGenerated.value = false
      isPlaying.value = false
      
      console.log('Audio engine reset complete')
    } catch (error) {
      console.error('Error during audio reset:', error)
    }
  }
  
  return {
    generateAudio,
    playAudio,
    pauseAudio,
    stopAudio,
    downloadMP3,
    resetAudio,
    isPlaying,
    audioData,
    currentCharIndex,
    hasGenerated
  }
}