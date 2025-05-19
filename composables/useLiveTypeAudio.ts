import { ref } from 'vue'
import * as Tone from 'tone'
import { useCharacterMusic } from './useCharacterMusic'

export const useLiveTypeAudio = () => {
  const isActive = ref(false)
  let synths = []
  let analyzer = null
  let recorder = null
  
  const { getCharacterSound } = useCharacterMusic()
  
  const initLiveType = async () => {
    console.log('Initializing live type audio...')
    console.log('Tone state before:', Tone.Transport.state)
    await Tone.start()
    console.log('Tone state after:', Tone.Transport.state)
    
    // Clean up previous synths
    if (synths.length > 0) {
      console.log('Cleaning up previous synths:', synths.length)
      synths.forEach(synth => synth.dispose())
    }
    synths = []
    
    // Create analyzer for visualization
    analyzer = new Tone.Analyser('waveform', 2048)
    Tone.getDestination().connect(analyzer)
    
    // Create synths for live playback
    const noteSynth = new Tone.PolySynth().toDestination()
    noteSynth.volume.value = -5
    synths.push(noteSynth)
    
    // Percussion sounds
    const kick = new Tone.MembraneSynth().toDestination()
    kick.volume.value = -5
    synths.push(kick)
    
    const snare = new Tone.NoiseSynth({
      noise: { type: 'white' },
      envelope: { attack: 0.001, decay: 0.1, sustain: 0 }
    }).toDestination()
    snare.volume.value = -10
    synths.push(snare)
    
    const hihat = new Tone.MetalSynth({
      frequency: 200,
      envelope: { attack: 0.001, decay: 0.1, release: 0.01 },
      harmonicity: 5.1,
      modulationIndex: 32,
      resonance: 4000,
      octaves: 1.5
    }).toDestination()
    hihat.volume.value = -15
    synths.push(hihat)
    
    const tom = new Tone.MembraneSynth({
      pitchDecay: 0.05,
      octaves: 4,
      frequency: 150
    }).toDestination()
    tom.volume.value = -8
    synths.push(tom)
    
    // Special sounds
    const gongSynth = new Tone.MetalSynth({
      frequency: 120,
      envelope: { attack: 0.01, decay: 3, release: 1 },
      harmonicity: 3.1,
      modulationIndex: 16,
      resonance: 3000,
      octaves: 1.2
    }).toDestination()
    gongSynth.volume.value = -10
    synths.push(gongSynth)
    
    const bellSynth = new Tone.PolySynth().toDestination()
    bellSynth.set({
      envelope: { attack: 0.001, decay: 2, sustain: 0, release: 1 },
      volume: -8
    })
    synths.push(bellSynth)
    
    const chimeSynth = new Tone.MetalSynth({
      frequency: 300,
      envelope: { attack: 0.001, decay: 1.2, release: 0.8 },
      harmonicity: 12,
      modulationIndex: 20,
      resonance: 800,
      octaves: 2
    }).toDestination()
    chimeSynth.volume.value = -12
    synths.push(chimeSynth)
    
    isActive.value = true
    console.log('Live type audio initialized. Synths created:', synths.length)
  }
  
  const playCharacter = async (char, lineBreakSound = 'gong') => {
    if (!isActive.value) return
    
    const sound = getCharacterSound(char, lineBreakSound)
    const time = Tone.now()
    
    // Debug line break sounds
    if (char === '\n') {
      console.log('Line break detected, using sound:', lineBreakSound)
    }
    
    try {
      if (sound.type === 'note' && sound.pitch) {
        synths[0].triggerAttackRelease(sound.pitch, '16n', time)
      } else if (sound.type === 'percussion') {
        switch (sound.sound) {
          case 'kick':
            synths[1].triggerAttackRelease('C1', '16n', time)
            break
          case 'snare':
            synths[2].triggerAttackRelease('16n', time)
            break
          case 'hihat':
            synths[3].triggerAttackRelease('16n', time)
            break
          case 'tom':
            synths[4].triggerAttackRelease('G2', '16n', time)
            break
        }
      } else if (sound.type === 'special') {
        switch (sound.sound) {
          case 'gong':
            synths[5].triggerAttackRelease('C2', '4n', time)
            break
          case 'bell':
            synths[6].triggerAttackRelease(['E5', 'G#5', 'B5'], '8n', time)
            break
          case 'chime':
          case 'windchime':
            synths[7].triggerAttackRelease('16n', time)
            // Create additional chime sounds
            setTimeout(() => synths[7].triggerAttackRelease('16n'), 100)
            setTimeout(() => synths[7].triggerAttackRelease('16n'), 200)
            break
          case 'crash':
            // Cymbal crash
            const crashSynth = new Tone.MetalSynth({
              frequency: 300,
              envelope: { attack: 0.01, decay: 2, release: 3 },
              harmonicity: 5.1,
              modulationIndex: 32,
              resonance: 4000,
              octaves: 1.5
            }).toDestination()
            crashSynth.volume.value = -8
            crashSynth.triggerAttackRelease('8n', time)
            setTimeout(() => crashSynth.dispose(), 4000)
            break
          case 'harp':
            // Harp glissando
            const notes = ['C4', 'E4', 'G4', 'C5', 'E5', 'G5', 'C6']
            notes.forEach((note, i) => {
              setTimeout(() => synths[0].triggerAttackRelease(note, '16n'), i * 50)
            })
            break
          case 'reverse':
            // Reverse cymbal effect (simulated with envelope)
            const reverseSynth = new Tone.MetalSynth({
              frequency: 200,
              envelope: { attack: 2, decay: 0.1, sustain: 0, release: 0.1 },
              harmonicity: 5.1,
              modulationIndex: 32,
              resonance: 4000,
              octaves: 1.5
            }).toDestination()
            reverseSynth.volume.value = -10
            reverseSynth.triggerAttackRelease('4n', time)
            setTimeout(() => reverseSynth.dispose(), 3000)
            break
          case 'whoosh':
            // Whoosh sound
            const whooshSynth = new Tone.NoiseSynth({
              noise: { type: 'pink' },
              envelope: { attack: 0.2, decay: 0.5, sustain: 0, release: 0.3 }
            }).toDestination()
            whooshSynth.volume.value = -15
            whooshSynth.triggerAttackRelease('8n', time)
            setTimeout(() => whooshSynth.dispose(), 1000)
            break
          case 'thunder':
            // Thunder sound
            const thunderKick = new Tone.MembraneSynth({
              pitchDecay: 0.5,
              octaves: 4,
              frequency: 30
            }).toDestination()
            thunderKick.volume.value = -5
            thunderKick.triggerAttackRelease('C0', '2n', time)
            
            const thunderNoise = new Tone.NoiseSynth({
              noise: { type: 'brown' },
              envelope: { attack: 0.5, decay: 2, sustain: 0.3, release: 1 }
            }).toDestination()
            thunderNoise.volume.value = -15
            thunderNoise.triggerAttackRelease('2n', time + 0.1)
            
            setTimeout(() => {
              thunderKick.dispose()
              thunderNoise.dispose()
            }, 4000)
            break
          case 'wave':
            // Ocean wave sound
            const waveSynth = new Tone.NoiseSynth({
              noise: { type: 'white' },
              envelope: { attack: 1, decay: 0.5, sustain: 0.5, release: 1.5 }
            }).toDestination()
            waveSynth.volume.value = -18
            waveSynth.triggerAttackRelease('2n', time)
            setTimeout(() => waveSynth.dispose(), 4000)
            break
          case 'bird':
            // Bird chirp
            const chirpNotes = ['G6', 'E6', 'C6', 'G6']
            chirpNotes.forEach((note, i) => {
              setTimeout(() => synths[0].triggerAttackRelease(note, '32n'), i * 100)
            })
            break
          case 'splash':
            synths[3].triggerAttackRelease('16n', time)
            synths[7].triggerAttackRelease('16n', time + 0.05)
            break
          case 'china':
            synths[7].triggerAttackRelease('8n', time)
            break
          case 'accent':
            synths[0].triggerAttackRelease(['C5', 'E5', 'G5'], '16n', time)
            break
          case 'coin':
            synths[6].triggerAttackRelease(['B5', 'F#6'], '32n', time)
            break
          case 'triangle':
            const triangleSynth = new Tone.MetalSynth({
              frequency: 800,
              envelope: { attack: 0.001, decay: 0.1, release: 0.05 },
              harmonicity: 5.1,
              modulationIndex: 6,
              resonance: 3000,
              octaves: 1.5
            }).toDestination()
            triangleSynth.volume.value = -15
            triangleSynth.triggerAttackRelease('32n', time)
            triangleSynth.dispose()
            break
          case 'woodblock':
            const woodblockSynth = new Tone.MembraneSynth({
              pitchDecay: 0.008,
              octaves: 2,
              frequency: 400
            }).toDestination()
            woodblockSynth.volume.value = -15
            woodblockSynth.triggerAttackRelease('C5', '32n', time)
            woodblockSynth.dispose()
            break
          case 'conga':
            synths[4].triggerAttackRelease('C3', '16n', time)
            break
          case 'shaker':
            const shakerSynth = new Tone.NoiseSynth({
              noise: { type: 'white' },
              envelope: { attack: 0.005, decay: 0.05, sustain: 0.02, release: 0.05 }
            }).toDestination()
            shakerSynth.volume.value = -20
            shakerSynth.triggerAttackRelease('32n', time)
            shakerSynth.dispose()
            break
          case 'tambourine':
            synths[3].triggerAttackRelease('32n', time)
            const tambSynth = new Tone.MetalSynth({
              frequency: 400,
              envelope: { attack: 0.001, decay: 0.05, release: 0.01 },
              harmonicity: 8.5,
              modulationIndex: 40,
              resonance: 4500,
              octaves: 1.2
            }).toDestination()
            tambSynth.volume.value = -18
            tambSynth.triggerAttackRelease('32n', time + 0.01)
            tambSynth.dispose()
            break
        }
      }
    } catch (error) {
      console.error('Error playing character sound:', error)
    }
  }
  
  const stopLiveType = () => {
    console.log('Stopping live type audio')
    synths.forEach(synth => synth.dispose())
    synths = []
    if (analyzer) {
      analyzer.dispose()
      analyzer = null
    }
    if (recorder) {
      recorder.dispose()
      recorder = null
    }
    isActive.value = false
  }
  
  const getAudioData = () => {
    if (!analyzer) return []
    // Convert Float32Array to regular Array for Vue prop compatibility
    const data = analyzer.getValue()
    return Array.from(data)
  }
  
  const startRecording = async () => {
    console.log('Starting recording in live mode...')
    try {
      await Tone.start()
      
      // Create a new recorder
      recorder = new Tone.Recorder()
      
      // Connect to master output
      Tone.getDestination().connect(recorder)
      
      // Start recording
      await recorder.start()
      console.log('Recording started')
      return true
    } catch (error) {
      console.error('Error starting recording:', error)
      return false
    }
  }
  
  const stopRecording = async () => {
    console.log('Stopping recording in live mode...')
    if (!recorder) return null
    
    try {
      // Stop the recorder
      const recording = await recorder.stop()
      
      // Clean up
      recorder.dispose()
      recorder = null
      
      return recording
    } catch (error) {
      console.error('Error stopping recording:', error)
      return null
    }
  }
  
  return {
    initLiveType,
    playCharacter,
    stopLiveType,
    getAudioData,
    startRecording,
    stopRecording,
    isActive
  }
}