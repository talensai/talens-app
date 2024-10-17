import { Button } from "@/components/ui/button"
import { useAudioRecorder } from "@/hooks/useAudioRecorder"
import { useAnswers } from "@/contexts/AnswersContext"
import { useEffect } from 'react'

export function AudioRecorder({ questionId }: { questionId: number }) {
  const { isRecording, audioURL, transcription, startRecording, stopRecording } = useAudioRecorder()
  const { addAnswer } = useAnswers()

  console.log('AudioRecorder rendered for questionId:', questionId);

  const handleStopRecording = () => {
    console.log('Stopping recording for questionId:', questionId);
    stopRecording();
  }

  useEffect(() => {
    if (!isRecording && audioURL && transcription) {
      console.log('Adding answer:', { questionId, audioUrl: audioURL, transcription });
      addAnswer({ questionId, audioUrl: audioURL, transcription });
    } else {
      console.log('Waiting for audioURL and transcription to be available');
    }
  }, [isRecording, audioURL, transcription]);

  return (
    <div className="mt-4">
      <Button
        onClick={isRecording ? handleStopRecording : startRecording}
        className={isRecording ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}
      >
        {isRecording ? "Stop Recording" : "Start Recording"}
      </Button>
    </div>
  )
}
