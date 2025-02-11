import { useState, useRef, useCallback, useEffect } from "react";
import { useAnswers } from "@/contexts/AnswersContext";
import { uploadAudio } from "@/lib/api-utils";

export function useAudioRecorder(
  questionId: number,
  questionIndex: number,
  handleNextQuestion: () => void
) {
  const { interviewId, addAnswer } = useAnswers();

  const [isRecording, setIsRecording] = useState(false);
  const [isUploadError, setIsUploadError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  console.log("useAudioRecorder hook called");

  const onStopRecording = useCallback(async () => {
    const audioBlob = new Blob(chunksRef.current, { type: "audio/mp3" });
    // const audioUrl = URL.createObjectURL(audioBlob);
    try {
      const audioUrl = await uploadAudio(audioBlob, questionId, interviewId!);
      console.log("Audio uploaded successfully:", audioUrl);
      setIsUploadError(false);

      console.log("Submission triggered:", {
        questionIndex,
        questionId,
      });

      console.log("Adding answer to context:", {
        questionId,
        audioUrl,
      });

      addAnswer({
        questionId,
        audioUrl,
        transcription: null,
      });

      handleNextQuestion();
    } catch (error) {
      console.error("Failed to upload audio:", error);
      setIsUploadError(true);
    } finally {
      setIsLoading(false);
    }
  }, [questionId, interviewId, handleNextQuestion, addAnswer, questionIndex]);

  const startRecording = useCallback(async () => {
    console.log("Starting recording for question:", questionId);
    try {
      // Clear previous recording data
      chunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };
      mediaRecorderRef.current.onstop = async () => {
        console.log("Recording stopped, processing audio...");
        await onStopRecording();
        stream.getTracks().forEach((track) => track.stop());
      };
      mediaRecorderRef.current.start();
      setIsRecording(true);
      console.log("Recording started successfully");
    } catch (error) {
      console.error("Error in startRecording:", error);
    }
  }, [questionId, onStopRecording]);

  const stopRecording = useCallback(() => {
    console.log("Stopping recording");
    setIsLoading(true);

    // Active recording
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      console.log("Recording stopped successfully");
    }
    // Retry on upload error
    else if (isUploadError) {
      onStopRecording();
    }
    // No active recording (User didn't enter recording state)
    // Move on to next question
    else {
      console.log("No active recording to stop");
      setIsLoading(false);
      handleNextQuestion();
    }
  }, [isRecording, isUploadError, onStopRecording, handleNextQuestion]);

  // This useEffect logs state changes
  useEffect(() => {
    console.log("Audio state updated:", { isRecording });
  }, [isRecording]);

  return {
    isLoading,
    startRecording,
    stopRecording,
    isUploadError,
  };
}
