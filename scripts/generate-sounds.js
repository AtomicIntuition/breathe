const fs = require('fs');
const path = require('path');

// Generate a simple sine wave tone as a WAV file
function generateTone(frequency, duration, volume = 0.3, sampleRate = 44100) {
  const numSamples = Math.floor(sampleRate * duration);
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
  const blockAlign = numChannels * (bitsPerSample / 8);
  const dataSize = numSamples * blockAlign;
  const fileSize = 36 + dataSize;

  const buffer = Buffer.alloc(44 + dataSize);
  let offset = 0;

  // RIFF header
  buffer.write('RIFF', offset); offset += 4;
  buffer.writeUInt32LE(fileSize, offset); offset += 4;
  buffer.write('WAVE', offset); offset += 4;

  // fmt chunk
  buffer.write('fmt ', offset); offset += 4;
  buffer.writeUInt32LE(16, offset); offset += 4; // chunk size
  buffer.writeUInt16LE(1, offset); offset += 2; // audio format (PCM)
  buffer.writeUInt16LE(numChannels, offset); offset += 2;
  buffer.writeUInt32LE(sampleRate, offset); offset += 4;
  buffer.writeUInt32LE(byteRate, offset); offset += 4;
  buffer.writeUInt16LE(blockAlign, offset); offset += 2;
  buffer.writeUInt16LE(bitsPerSample, offset); offset += 2;

  // data chunk
  buffer.write('data', offset); offset += 4;
  buffer.writeUInt32LE(dataSize, offset); offset += 4;

  // Generate sine wave with envelope
  const attackSamples = Math.floor(sampleRate * 0.02);
  const releaseSamples = Math.floor(sampleRate * 0.1);
  const sustainEnd = numSamples - releaseSamples;

  for (let i = 0; i < numSamples; i++) {
    let envelope = 1.0;

    // Attack
    if (i < attackSamples) {
      envelope = i / attackSamples;
    }
    // Release
    else if (i > sustainEnd) {
      envelope = (numSamples - i) / releaseSamples;
    }

    const sample = Math.sin(2 * Math.PI * frequency * i / sampleRate);
    const value = Math.floor(sample * volume * envelope * 32767);
    buffer.writeInt16LE(Math.max(-32768, Math.min(32767, value)), offset);
    offset += 2;
  }

  return buffer;
}

// Generate a chord (multiple frequencies)
function generateChord(frequencies, duration, volume = 0.15, sampleRate = 44100) {
  const numSamples = Math.floor(sampleRate * duration);
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
  const blockAlign = numChannels * (bitsPerSample / 8);
  const dataSize = numSamples * blockAlign;
  const fileSize = 36 + dataSize;

  const buffer = Buffer.alloc(44 + dataSize);
  let offset = 0;

  // RIFF header
  buffer.write('RIFF', offset); offset += 4;
  buffer.writeUInt32LE(fileSize, offset); offset += 4;
  buffer.write('WAVE', offset); offset += 4;

  // fmt chunk
  buffer.write('fmt ', offset); offset += 4;
  buffer.writeUInt32LE(16, offset); offset += 4;
  buffer.writeUInt16LE(1, offset); offset += 2;
  buffer.writeUInt16LE(numChannels, offset); offset += 2;
  buffer.writeUInt32LE(sampleRate, offset); offset += 4;
  buffer.writeUInt32LE(byteRate, offset); offset += 4;
  buffer.writeUInt16LE(blockAlign, offset); offset += 2;
  buffer.writeUInt16LE(bitsPerSample, offset); offset += 2;

  // data chunk
  buffer.write('data', offset); offset += 4;
  buffer.writeUInt32LE(dataSize, offset); offset += 4;

  const attackSamples = Math.floor(sampleRate * 0.03);
  const releaseSamples = Math.floor(sampleRate * 0.3);
  const sustainEnd = numSamples - releaseSamples;

  for (let i = 0; i < numSamples; i++) {
    let envelope = 1.0;

    if (i < attackSamples) {
      envelope = i / attackSamples;
    } else if (i > sustainEnd) {
      envelope = (numSamples - i) / releaseSamples;
    }

    // Sum all frequencies
    let sample = 0;
    for (const freq of frequencies) {
      sample += Math.sin(2 * Math.PI * freq * i / sampleRate);
    }
    sample /= frequencies.length;

    const value = Math.floor(sample * volume * envelope * 32767);
    buffer.writeInt16LE(Math.max(-32768, Math.min(32767, value)), offset);
    offset += 2;
  }

  return buffer;
}

// Generate arpeggio (notes played in sequence)
function generateArpeggio(frequencies, noteDuration, volume = 0.2, sampleRate = 44100) {
  const totalDuration = frequencies.length * noteDuration + 0.5; // Extra for release
  const numSamples = Math.floor(sampleRate * totalDuration);
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
  const blockAlign = numChannels * (bitsPerSample / 8);
  const dataSize = numSamples * blockAlign;
  const fileSize = 36 + dataSize;

  const buffer = Buffer.alloc(44 + dataSize);
  let offset = 0;

  // RIFF header
  buffer.write('RIFF', offset); offset += 4;
  buffer.writeUInt32LE(fileSize, offset); offset += 4;
  buffer.write('WAVE', offset); offset += 4;

  // fmt chunk
  buffer.write('fmt ', offset); offset += 4;
  buffer.writeUInt32LE(16, offset); offset += 4;
  buffer.writeUInt16LE(1, offset); offset += 2;
  buffer.writeUInt16LE(numChannels, offset); offset += 2;
  buffer.writeUInt32LE(sampleRate, offset); offset += 4;
  buffer.writeUInt32LE(byteRate, offset); offset += 4;
  buffer.writeUInt16LE(blockAlign, offset); offset += 2;
  buffer.writeUInt16LE(bitsPerSample, offset); offset += 2;

  // data chunk
  buffer.write('data', offset); offset += 4;
  buffer.writeUInt32LE(dataSize, offset); offset += 4;

  const samplesPerNote = Math.floor(sampleRate * noteDuration);
  const attackSamples = Math.floor(sampleRate * 0.02);
  const releaseSamples = Math.floor(sampleRate * 0.4);

  for (let i = 0; i < numSamples; i++) {
    let sample = 0;

    // Add contribution from each note
    for (let n = 0; n < frequencies.length; n++) {
      const noteStart = n * samplesPerNote;
      const noteEnd = noteStart + samplesPerNote + releaseSamples;

      if (i >= noteStart && i < noteEnd) {
        const noteTime = i - noteStart;
        let envelope = 1.0;

        if (noteTime < attackSamples) {
          envelope = noteTime / attackSamples;
        } else if (noteTime > samplesPerNote) {
          envelope = Math.max(0, 1 - (noteTime - samplesPerNote) / releaseSamples);
        }

        // Reduce volume for higher notes
        const noteVolume = volume * (1 - n * 0.1);
        sample += Math.sin(2 * Math.PI * frequencies[n] * i / sampleRate) * envelope * noteVolume;
      }
    }

    const value = Math.floor(sample * 32767);
    buffer.writeInt16LE(Math.max(-32768, Math.min(32767, value)), offset);
    offset += 2;
  }

  return buffer;
}

const soundsDir = path.join(__dirname, '..', 'public', 'sounds');

// Ensure directory exists
if (!fs.existsSync(soundsDir)) {
  fs.mkdirSync(soundsDir, { recursive: true });
}

// Generate sounds
const sounds = {
  // Phase change - gentle chime
  'phase-change.wav': generateTone(528, 0.2, 0.25),

  // Session start - welcoming tone
  'session-start.wav': generateTone(440, 0.3, 0.3),

  // Inhale start - uplifting G4
  'inhale.wav': generateTone(392, 0.25, 0.25),

  // Exhale start - grounding C4
  'exhale.wav': generateTone(262, 0.25, 0.25),

  // Hold start - calming E4
  'hold.wav': generateTone(330, 0.2, 0.2),

  // Session complete - ascending C major arpeggio
  'session-complete.wav': generateArpeggio([523.25, 659.25, 783.99, 1046.5], 0.12, 0.2),
};

for (const [filename, buffer] of Object.entries(sounds)) {
  const filepath = path.join(soundsDir, filename);
  fs.writeFileSync(filepath, buffer);
  console.log(`Generated: ${filename} (${buffer.length} bytes)`);
}

console.log('\nAll sounds generated successfully!');
