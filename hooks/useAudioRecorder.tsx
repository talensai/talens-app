import { useState, useRef, useCallback } from 'react'

export function useAudioRecorder() {
  const [isRecording, setIsRecording] = useState(false)
  const [audioURL, setAudioURL] = useState<string | null>(null)
  const [transcription, setTranscription] = useState<string | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const startRecording = useCallback(async () => {
    try {
      // Clear previous recording data
      setAudioURL(null)
      setTranscription(null)
      chunksRef.current = []

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }
      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/mp3' })
        const audioUrl = URL.createObjectURL(audioBlob)
        setAudioURL(audioUrl)
        
        // Transcribe the audio
        try {
          const formData = new FormData()
          formData.append('file', audioBlob, 'audio.mp3')
          formData.append('model', 'whisper-1')

          const response = await fetch('/api/transcribe', {
            method: 'POST',
            body: formData,
          })

          if (response.ok) {
            const data = await response.json()
            setTranscription(data.text)
          } else {
            console.error('Transcription failed')
          }
        } catch (error) {
          console.error('Error transcribing audio:', error)
        }

        // Stop all tracks on the stream to release the microphone
        stream.getTracks().forEach(track => track.stop())

        console.log('Audio recording completed')
      }
      mediaRecorderRef.current.start()
      setIsRecording(true)
    } catch (error) {
      console.error('Error accessing microphone:', error)
    }
  }, [])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }, [isRecording])

  return {
    isRecording,
    audioURL,
    transcription,
    startRecording,
    stopRecording
  }
}
