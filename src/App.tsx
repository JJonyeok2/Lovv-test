import logoImage from './assets/lovv-logo.png'
import suitcaseImage from './assets/lovv-suitcase.png'

function App() {
  const proofItems = ['AI 일정', '챗봇', '소도시 데이터']

  return (
    <main className="min-h-dvh bg-[#fffcd9] text-[#10392d]">
      <header className="fixed inset-x-0 top-0 z-20 h-14 border-b border-[#d9e1c7] bg-white/95 shadow-[0_3px_10.5px_rgba(16,37,31,0.05)] backdrop-blur">
        <nav className="mx-auto flex h-full max-w-[1440px] items-center justify-between px-9">
          <a href="#home" aria-label="Lovv home" className="block h-14 w-[102px] overflow-hidden">
            <img src={logoImage} alt="Lovv" className="h-full w-full object-cover" />
          </a>
          <a
            href="#onboarding"
            className="inline-flex h-8 w-[132px] items-center justify-center rounded-[10.5px] border border-[#b8c9aa] bg-[#dbe8d3] text-[10.5px] font-bold text-[#10251f] shadow-[0_3px_10.5px_rgba(16,37,31,0.05)] transition hover:border-[#ccb23d] hover:bg-[#ffe55f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#10392d]"
          >
            새 여정 만들기
          </a>
        </nav>
      </header>

      <section
        id="home"
        aria-labelledby="main-entry-title"
        className="mx-auto grid min-h-[732px] max-w-[1440px] grid-cols-[minmax(0,1fr)_430px] items-start gap-20 px-[77px] pt-[145px] max-lg:grid-cols-1 max-lg:px-8 max-lg:pt-28 max-sm:px-5"
      >
        <div className="max-w-[620px]">
          <p className="text-base font-semibold leading-[22px] text-[#577861]">
            한국과 일본 소도시를 가장 쉽게 시작하는 방법
          </p>
          <h1
            id="main-entry-title"
            aria-label="나만 아는 여행 앱, Lovv"
            className="mt-3 text-[58px] font-bold leading-[68px] tracking-normal text-[#10392d] max-sm:text-[42px] max-sm:leading-[50px]"
          >
            <span className="block">나만 아는</span>
            <span className="block">여행 앱, Lovv</span>
          </h1>
          <p className="mt-12 max-w-[600px] text-lg leading-[31px] text-[#10392d] max-sm:mt-7 max-sm:text-base max-sm:leading-7">
            여행 조건을 길게 입력하지 않아도 괜찮아요. <br />
            한국과 일본의 작은 도시를 기준으로 취향에 맞는 여행 흐름을 먼저 제안합니다.
          </p>
          <a
            href="#onboarding"
            className="mt-7 inline-flex h-[52px] w-[178px] items-center justify-center rounded-[18px] border border-[#b8c9aa] bg-[#dbe8d3] text-sm font-semibold text-[#10392d] shadow-[0_12px_28px_-14px_rgba(33,46,33,0.1)] transition hover:-translate-y-0.5 hover:border-[#ccb23d] hover:bg-[#ffe55f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#10392d]"
          >
            AI 일정 짜기
          </a>
        </div>

        <div className="-mt-2.5 justify-self-end max-lg:mt-0 max-lg:justify-self-start">
          <img
            src={suitcaseImage}
            alt="손을 흔드는 초록색 캐리어 캐릭터"
            className="h-[531px] w-[375px] rounded-[17px] object-cover max-sm:h-auto max-sm:w-full"
          />
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-[55px] pb-10 max-sm:px-5">
        <div className="grid min-h-[126px] grid-cols-[1fr_auto] items-center gap-8 rounded-3xl border border-[#e0d6a8] bg-white/80 px-[31px] py-7 shadow-[0_12px_28px_-14px_rgba(33,46,33,0.1)] max-lg:grid-cols-1">
          <div>
            <h2 className="text-[22px] font-semibold leading-7 text-[#10392d]">
              처음엔 작게, 추천은 정확하게
            </h2>
            <p className="mt-2 text-sm leading-5 text-[#577861]">
              한국과 일본 소도시부터 검증하고, 사용자의 테마 선택으로 일정 추천 품질을 높입니다.
            </p>
          </div>
          <ul className="flex flex-wrap gap-3">
            {proofItems.map((item, index) => (
              <li key={item}>
                <a
                  href={item === '챗봇' ? '#chat' : '#onboarding'}
                  className={`inline-flex h-[34px] items-center justify-center rounded-full border border-[#b8c9aa] bg-[#dbe8d3] px-8 text-xs text-[#10392d] transition hover:border-[#ccb23d] hover:bg-[#ffe55f] ${
                    index === 0 ? 'font-semibold' : 'font-medium'
                  }`}
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  )
}

export default App
