import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('MVP main entry screen', () => {
  it('renders the Lovv landing content from the MVP Figma frame', () => {
    render(<App />)

    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /나만 아는 여행 앱, Lovv/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'AI 일정 짜기' })).toHaveAttribute('href', '#onboarding')
    expect(screen.getByText('처음엔 작게, 추천은 정확하게')).toBeInTheDocument()
  })
})
