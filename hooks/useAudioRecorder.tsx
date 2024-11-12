import { useState, useRef, useCallback, useEffect } from 'react'

export function useAudioRecorder() {
  const [isRecording, setIsRecording] = useState(false)
  const [audioURL, setAudioURL] = useState<string | null>(null)
  const [transcription, setTranscription] = useState<string | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  console.log('useAudioRecorder hook called');

  const startRecording = useCallback(async () => {
    console.log('Starting recording');
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

        // Upload the audio to Supabase
        await uploadAudio(audioBlob)

        // Stop all tracks on the stream to release the microphone
        stream.getTracks().forEach(track => track.stop())

        console.log('Audio recording completed')
      }
      mediaRecorderRef.current.start()
      setIsRecording(true)
      console.log('Recording started successfully');
    } catch (error) {
      console.error('Error accessing microphone:', error);
      console.error('Error starting recording:', error);
    }
  }, [])

  const stopRecording = useCallback(() => {
    console.log('Stopping recording');
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      console.log('Recording stopped successfully');
    } else {
      console.log('No active recording to stop');
    }
  }, [isRecording])

  const uploadAudio = async (audioBlob: Blob) => {
    try {
      const formData = new FormData()
      formData.append('file', audioBlob, 'audio.mp3')
      formData.append('questionId', 'your-question-id') // Replace with actual question ID

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        console.error('Failed to upload audio')
      }
    } catch (error) {
      console.error('Error uploading audio:', error)
    }
  }

  // Add this useEffect to log state changes
  useEffect(() => {
    console.log('Audio state updated:', { isRecording, audioURL, transcription });
  }, [isRecording, audioURL, transcription]);

  return {
    isRecording,
    audioURL,
    transcription,
    startRecording,
    stopRecording
  }
}
