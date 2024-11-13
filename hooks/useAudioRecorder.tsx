import { useState, useRef, useCallback, useEffect } from 'react'
import { useAnswers } from '@/contexts/AnswersContext'

export function useAudioRecorder(questionId: number) {
  const [isRecording, setIsRecording] = useState(false)
  const [audioURL, setAudioURL] = useState<string | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const { interviewId } = useAnswers()

  console.log('useAudioRecorder hook called');

  const startRecording = useCallback(async () => {
    console.log('Starting recording for question:', questionId)
    try {
      // Clear previous recording data
      setAudioURL(null)
      chunksRef.current = []

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }
      mediaRecorderRef.current.onstop = async () => {
        console.log('Recording stopped, processing audio...')
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/mp3' })
        const audioUrl = URL.createObjectURL(audioBlob)
        
        try {
          const uploadedUrl = await uploadAudio(audioBlob)
          console.log('Audio uploaded successfully:', uploadedUrl)
          setAudioURL(uploadedUrl)
        } catch (error) {
          console.error('Failed to upload audio:', error)
        }

        stream.getTracks().forEach(track => track.stop())
      }
      mediaRecorderRef.current.start()
      setIsRecording(true)
      console.log('Recording started successfully');
    } catch (error) {
      console.error('Error in startRecording:', error)
    }
  }, [questionId, interviewId])

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
      console.log('Starting audio upload:', {
        questionId,
        interviewId,
        blobSize: audioBlob.size
      })

      const formData = new FormData()
      formData.append('file', audioBlob, 'audio.mp3')
      formData.append('questionId', questionId.toString())
      formData.append('interviewId', interviewId!)

      console.log('Sending upload request...')
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      console.log('Upload response:', data)

      if (!response.ok) {
        throw new Error(`Upload failed: ${data.error || 'Unknown error'}`)
      }

      return data.url
    } catch (error) {
      console.error('Error in uploadAudio:', error)
      throw error
    }
  }

  // Add this useEffect to log state changes
  useEffect(() => {
    console.log('Audio state updated:', { isRecording, audioURL });
  }, [isRecording, audioURL]);

  return {
    isRecording,
    audioURL,
    transcription: null,
    startRecording,
    stopRecording
  }
}
