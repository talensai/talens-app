import { render, screen } from '@testing-library/react'
import SummaryPage from '@/app/summary/page'
import { AnswersProvider } from '@/contexts/AnswersContext'
import * as AnswersContext from '@/contexts/AnswersContext'

// Mock the useAnswers hook
jest.mock('@/contexts/AnswersContext', () => ({
  ...jest.requireActual('@/contexts/AnswersContext'),
  useAnswers: jest.fn()
}))

// Mock the useEvaluation hook
jest.mock('@/hooks/useEvaluation', () => ({
  useEvaluation: () => ({
    evaluateResponse: jest.fn(),
    isLoading: false,
    evaluation: null
  })
}))

describe('SummaryPage', () => {
  const mockAnswers = [
    {
      questionId: 1,
      audioUrl: 'blob:http://localhost:3000/test-audio-1',
      transcription: 'Test transcription 1'
    },
    {
      questionId: 2,
      audioUrl: 'blob:http://localhost:3000/test-audio-2',
      transcription: 'Test transcription 2'
    }
  ]

  beforeEach(() => {
    // Mock fetch for quizData.json
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({
          questions: [
            {
              id: 1,
              title: 'Test Question 1',
              questionText: 'What is test question 1?',
              instructions: 'Instructions 1'
            },
            {
              id: 2,
              title: 'Test Question 2',
              questionText: 'What is test question 2?',
              instructions: 'Instructions 2'
            }
          ]
        })
      })
    ) as jest.Mock

    // Mock the useAnswers implementation
    jest.spyOn(AnswersContext, 'useAnswers').mockImplementation(() => ({
      answers: mockAnswers,
      addAnswer: jest.fn()
    }))
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders summary page with answers from context', async () => {
    render(
      <AnswersProvider>
        <SummaryPage />
      </AnswersProvider>
    )

    // Check if the page title is rendered
    expect(screen.getByText('Interview Summary')).toBeInTheDocument()

    // Wait for and check if questions are rendered
    expect(await screen.findByText('Question 1: Test Question 1')).toBeInTheDocument()
    expect(await screen.findByText('Question 2: Test Question 2')).toBeInTheDocument()

    // Check if transcriptions are rendered
    expect(screen.getByText('Test transcription 1')).toBeInTheDocument()
    expect(screen.getByText('Test transcription 2')).toBeInTheDocument()

    // Check if audio elements are present
    const audioElements = screen.getAllByText('Your browser does not support the audio element.')
      .map(el => el.parentElement) as HTMLAudioElement[]
    expect(audioElements).toHaveLength(2)
    expect(audioElements[0].querySelector('source')).toHaveAttribute('src', 'blob:http://localhost:3000/test-audio-1')
    expect(audioElements[1].querySelector('source')).toHaveAttribute('src', 'blob:http://localhost:3000/test-audio-2')

    // Check if evaluate buttons are present
    const evaluateButtons = screen.getAllByText('Evaluate Response')
    expect(evaluateButtons).toHaveLength(2)
  })

  it('handles empty answers gracefully', async () => {
    // Mock useAnswers to return empty answers array
    jest.spyOn(AnswersContext, 'useAnswers').mockImplementation(() => ({
      answers: [],
      addAnswer: jest.fn()
    }))

    render(
      <AnswersProvider>
        <SummaryPage />
      </AnswersProvider>
    )

    // Check if the page still renders
    expect(screen.getByText('Interview Summary')).toBeInTheDocument()

    // Wait for questions to load
    expect(await screen.findByText('Question 1: Test Question 1')).toBeInTheDocument()
    expect(await screen.findByText('Question 2: Test Question 2')).toBeInTheDocument()

    // Check if "No response recorded" message is shown
    const noResponseMessages = screen.getAllByText('No response recorded')
    expect(noResponseMessages).toHaveLength(2)
  })
})
