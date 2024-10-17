import { Button } from "@/components/ui/button"
import { useAudioRecorder } from "@/hooks/useAudioRecorder"

export function AudioRecorder() {
  const { isRecording, audioURL, transcription, startRecording, stopRecording } = useAudioRecorder()

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
      {transcription && (
        <div className="mt-2">
          <h3 className="text-lg font-semibold">Transcription:</h3>
          <p>{transcription}</p>
        </div>
      )}
    </div>
  )
}
