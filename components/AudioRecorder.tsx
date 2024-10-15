import { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"

export function AudioRecorder() {
  const [isRecording, setIsRecording] = useState(false)
  const [audioURL, setAudioURL] = useState<string | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/mp3' })
        const audioUrl = URL.createObjectURL(audioBlob)
        setAudioURL(audioUrl)
        // Here you would typically send the audioBlob to your server or storage solution
        console.log('Audio recording completed')
      }
      mediaRecorderRef.current.start()
      setIsRecording(true)
    } catch (error) {
      console.error('Error accessing microphone:', error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  return (
    <div className="mt-4">
      <Button
        onClick={isRecording ? stopRecording : startRecording}
        className={isRecording ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}
      >
        {isRecording ? "Stop Recording" : "Start Recording"}
      </Button>
      {audioURL && (
        <div className="mt-2">
          <audio src={audioURL} controls />
        </div>
      )}
    </div>
  )
}