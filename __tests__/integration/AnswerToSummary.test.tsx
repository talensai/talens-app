import { render, screen, waitFor } from '@testing-library/react'
import { AnswersProvider } from '@/contexts/AnswersContext'
import SummaryPage from '@/app/summary/page'

// Mock the useEvaluation hook
jest.mock('@/hooks/useEvaluation', () => ({
  useEvaluation: () => ({
    evaluateResponse: jest.fn(),
    isLoading: false,
    evaluation: null
  })
}))

describe('Answer to Summary Flow', () => {
  beforeEach(() => {
    // Clear sessionStorage before each test
    window.sessionStorage.clear()

    // Mock fetch for quizData.json
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({
          questions: [
            {
              id: 1,
              title: 'Test Question',
              questionText: 'What is test question?',
              instructions: 'Test instructions'
            }
          ]
        })
      })
    ) as jest.Mock
  })

  it('should display stored answer in summary page', async () => {
    // Pre-populate sessionStorage with a test answer
    const testAnswer = {
      questionId: 1,
      audioUrl: 'blob:http://localhost:3000/test-audio',
      transcription: 'Test answer transcription'
    }
    sessionStorage.setItem('interviewAnswers', JSON.stringify([testAnswer]))

    // Render the summary page with the AnswersProvider
    render(
      <AnswersProvider>
        <SummaryPage />
      </AnswersProvider>
    )

    // Wait for the content to be rendered
    await waitFor(() => {
      expect(screen.getByText('Test answer transcription')).toBeInTheDocument()
    })
    
    // Verify audio element
    const audioElements = await waitFor(() => 
      screen.getAllByText('Your browser does not support the audio element.')
        .map(el => el.parentElement) as HTMLAudioElement[]
    )
    expect(audioElements[0].querySelector('source')).toHaveAttribute(
      'src',
      'blob:http://localhost:3000/test-audio'
    )
  })
})
