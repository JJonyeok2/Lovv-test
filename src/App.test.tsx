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

  it('uses a grounded pale green button color that turns yellow on hover', () => {
    render(<App />)

    const buttonLabels = ['새 여정 만들기', 'AI 일정 짜기', 'AI 일정', '챗봇', '소도시 데이터']

    buttonLabels.forEach((label) => {
      const button = screen.getByRole('link', { name: label })

      expect(button).toHaveClass('bg-[#dbe8d3]')
      expect(button).toHaveClass('border-[#b8c9aa]')
      expect(button).toHaveClass('hover:bg-[#ffe55f]')
    })
  })
})
