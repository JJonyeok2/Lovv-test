import { fireEvent, render, screen } from '@testing-library/react'
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

    const buttonLabels = ['새 여정 만들기', 'AI 일정 짜기', 'AI 일정', '챗봇', '소도시 보기']

    buttonLabels.forEach((label) => {
      const button = screen.getByRole('link', { name: label })

      expect(button).toHaveClass('bg-[#dbe8d3]')
      expect(button).toHaveClass('border-[#b8c9aa]')
      expect(button).toHaveClass('hover:bg-[#ffe55f]')
    })
  })

  it('renders onboarding preference choices and stores the selected preference', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: '대도시 예시로 여행 취향을 가볍게 고르기' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /교토 · 경주/ })).toHaveAttribute('aria-pressed', 'true')

    fireEvent.click(screen.getByRole('button', { name: /후쿠오카 · 부산/ }))

    expect(screen.getByText('미식 +2')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('link', { name: '이 느낌으로 대화 시작' }))

    expect(localStorage.getItem('lovv.preference')).toContain('후쿠오카 · 부산')
  })
})
