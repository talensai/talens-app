import { render, act } from '@testing-library/react'
import { useAnswers, AnswersProvider } from '@/contexts/AnswersContext'
import { renderHook } from '@testing-library/react'

describe('AnswersContext', () => {
  beforeEach(() => {
    // Clear sessionStorage before each test
    window.sessionStorage.clear()
  })

  it('should store and retrieve answers correctly', () => {
    const wrapper = ({ children }) => <AnswersProvider>{children}</AnswersProvider>
    const { result } = renderHook(() => useAnswers(), { wrapper })

    const testAnswer = {
      questionId: 1,
      audioUrl: 'blob:http://localhost:3000/test-audio',
      transcription: 'Test transcription text'
    }

    act(() => {
      result.current.addAnswer(testAnswer)
    })

    // Check if answer was added to context
    expect(result.current.answers).toHaveLength(1)
    expect(result.current.answers[0]).toEqual(testAnswer)

    // Verify it was saved to sessionStorage
    const storedAnswers = JSON.parse(sessionStorage.getItem('interviewAnswers') || '[]')
    expect(storedAnswers).toHaveLength(1)
    expect(storedAnswers[0]).toEqual(testAnswer)
  })

  it('should load existing answers from sessionStorage', () => {
    const existingAnswers = [{
      questionId: 1,
      audioUrl: 'blob:http://localhost:3000/test-audio',
      transcription: 'Existing transcription'
    }]

    // Pre-populate sessionStorage
    sessionStorage.setItem('interviewAnswers', JSON.stringify(existingAnswers))

    const wrapper = ({ children }) => <AnswersProvider>{children}</AnswersProvider>
    const { result } = renderHook(() => useAnswers(), { wrapper })

    expect(result.current.answers).toHaveLength(1)
    expect(result.current.answers[0]).toEqual(existingAnswers[0])
  })
})
