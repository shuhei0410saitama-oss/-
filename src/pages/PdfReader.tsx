import { useState, useRef, useCallback, useEffect } from 'react'
import * as pdfjsLib from 'pdfjs-dist'

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString()

/** 括弧・記号を読み上げテキストに変換するマッピング */
const PUNCTUATION_MAP: Record<string, string> = {
  '「': ' かぎかっこ ',
  '」': ' かぎかっこ閉じ ',
  '『': ' 二重かぎかっこ ',
  '』': ' 二重かぎかっこ閉じ ',
  '（': ' かっこ ',
  '）': ' かっこ閉じ ',
  '(': ' かっこ ',
  ')': ' かっこ閉じ ',
  '【': ' すみつきかっこ ',
  '】': ' すみつきかっこ閉じ ',
  '〈': ' やまかっこ ',
  '〉': ' やまかっこ閉じ ',
  '《': ' 二重やまかっこ ',
  '》': ' 二重やまかっこ閉じ ',
  '"': ' 引用符 ',
  '\u201D': ' 引用符閉じ ',
  '・': ' なかぐろ ',
  '…': ' てんてんてん ',
  '―': ' ダッシュ ',
  '–': ' ダッシュ ',
  '—': ' ダッシュ ',
  '〜': ' から ',
  '~': ' から ',
  '※': ' こめじるし ',
  '→': ' やじるし ',
  '←': ' ひだりやじるし ',
  '↑': ' うえやじるし ',
  '↓': ' したやじるし ',
  '★': ' ほし ',
  '☆': ' ほし ',
  '●': ' くろまる ',
  '○': ' しろまる ',
  '◎': ' にじゅうまる ',
  '△': ' さんかく ',
  '▲': ' くろさんかく ',
  '□': ' しかく ',
  '■': ' くろしかく ',
  '◆': ' くろひしがた ',
  '◇': ' しろひしがた ',
}

/** スペースを読み上げるための変換 */
function convertSpaces(text: string): string {
  return text.replace(/ {2,}/g, (match) => ` ${match.length}つスペース `)
    .replace(/\u3000/g, ' 全角スペース ')
}

/** 括弧・記号を読み上げテキストに変換 */
function convertPunctuation(text: string, readPunctuation: boolean, readSpaces: boolean): string {
  let result = text

  if (readPunctuation) {
    for (const [char, reading] of Object.entries(PUNCTUATION_MAP)) {
      result = result.split(char).join(reading)
    }
  }

  if (readSpaces) {
    result = convertSpaces(result)
  }

  return result
}

interface PageText {
  pageNum: number
  text: string
}

export default function PdfReader() {
  const [pages, setPages] = useState<PageText[]>([])
  const [fileName, setFileName] = useState('')
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Range selection
  const [startPage, setStartPage] = useState(1)
  const [endPage, setEndPage] = useState(1)

  // TTS settings
  const [readPunctuation, setReadPunctuation] = useState(true)
  const [readSpaces, setReadSpaces] = useState(true)
  const [rate, setRate] = useState(1.0)
  const [pitch, setPitch] = useState(1.0)
  const [selectedVoice, setSelectedVoice] = useState('')
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])

  // TTS state
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [currentReadPage, setCurrentReadPage] = useState<number | null>(null)

  // Preview
  const [previewText, setPreviewText] = useState('')

  const fileInputRef = useRef<HTMLInputElement>(null)
  const synthRef = useRef(window.speechSynthesis)

  // Load voices
  useEffect(() => {
    function loadVoices() {
      const v = synthRef.current.getVoices()
      const jaVoices = v.filter((voice) => voice.lang.startsWith('ja'))
      setVoices(jaVoices.length > 0 ? jaVoices : v)
      if (jaVoices.length > 0 && !selectedVoice) {
        setSelectedVoice(jaVoices[0].name)
      }
    }
    loadVoices()
    speechSynthesis.addEventListener('voiceschanged', loadVoices)
    return () => speechSynthesis.removeEventListener('voiceschanged', loadVoices)
  }, [selectedVoice])

  // Cleanup on unmount
  useEffect(() => {
    const synth = synthRef.current
    return () => {
      synth.cancel()
    }
  }, [])

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.type !== 'application/pdf') {
      setError('PDFファイルを選択してください。')
      return
    }

    setLoading(true)
    setError('')
    setPages([])
    synthRef.current.cancel()
    setIsSpeaking(false)
    setIsPaused(false)

    try {
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
      const numPages = pdf.numPages
      setTotalPages(numPages)
      setFileName(file.name)
      setStartPage(1)
      setEndPage(numPages)

      const extractedPages: PageText[] = []
      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i)
        const content = await page.getTextContent()
        const text = content.items
          .map((item) => ('str' in item ? item.str : ''))
          .join('')
        extractedPages.push({ pageNum: i, text })
      }
      setPages(extractedPages)
    } catch {
      setError('PDFの読み込みに失敗しました。ファイルが壊れているか、対応していない形式の可能性があります。')
    } finally {
      setLoading(false)
    }
  }, [])

  const getSelectedText = useCallback(() => {
    const selected = pages.filter(
      (p) => p.pageNum >= startPage && p.pageNum <= endPage,
    )
    return selected.map((p) => p.text).join('\n')
  }, [pages, startPage, endPage])

  const updatePreview = useCallback(() => {
    const raw = getSelectedText()
    const converted = convertPunctuation(raw, readPunctuation, readSpaces)
    setPreviewText(converted)
  }, [getSelectedText, readPunctuation, readSpaces])

  useEffect(() => {
    if (pages.length > 0) {
      updatePreview()
    }
  }, [pages, startPage, endPage, readPunctuation, readSpaces, updatePreview])

  const speak = useCallback(() => {
    synthRef.current.cancel()

    const selectedPages = pages.filter(
      (p) => p.pageNum >= startPage && p.pageNum <= endPage,
    )

    if (selectedPages.length === 0) return

    let pageIndex = 0

    function speakPage(index: number) {
      if (index >= selectedPages.length) {
        setIsSpeaking(false)
        setCurrentReadPage(null)
        return
      }

      const page = selectedPages[index]
      setCurrentReadPage(page.pageNum)

      const text = convertPunctuation(page.text, readPunctuation, readSpaces)
      if (!text.trim()) {
        speakPage(index + 1)
        return
      }

      // SpeechSynthesis has a limit on utterance length in some browsers.
      // Split into chunks of ~200 characters at sentence boundaries.
      const chunks = splitIntoChunks(text, 200)
      let chunkIndex = 0

      function speakChunk() {
        if (chunkIndex >= chunks.length) {
          speakPage(index + 1)
          return
        }

        const utterance = new SpeechSynthesisUtterance(chunks[chunkIndex])
        utterance.rate = rate
        utterance.pitch = pitch
        utterance.lang = 'ja-JP'

        if (selectedVoice) {
          const voice = synthRef.current.getVoices().find((v) => v.name === selectedVoice)
          if (voice) utterance.voice = voice
        }

        utterance.onend = () => {
          chunkIndex++
          speakChunk()
        }

        utterance.onerror = (event) => {
          if (event.error !== 'canceled') {
            chunkIndex++
            speakChunk()
          }
        }

        synthRef.current.speak(utterance)
      }

      speakChunk()
    }

    setIsSpeaking(true)
    setIsPaused(false)
    pageIndex = 0
    speakPage(pageIndex)
  }, [pages, startPage, endPage, readPunctuation, readSpaces, rate, pitch, selectedVoice])

  const pause = useCallback(() => {
    synthRef.current.pause()
    setIsPaused(true)
  }, [])

  const resume = useCallback(() => {
    synthRef.current.resume()
    setIsPaused(false)
  }, [])

  const stop = useCallback(() => {
    synthRef.current.cancel()
    setIsSpeaking(false)
    setIsPaused(false)
    setCurrentReadPage(null)
  }, [])

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">PDF 音読リーダー</h1>
      <p className="text-gray-600 mb-6">
        PDFをアップロードして、指定したページ範囲を音読します。「」などの括弧やスペースも読み上げます。
      </p>

      {/* File Upload */}
      <div className="mb-6">
        <label
          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault()
            const file = e.dataTransfer.files[0]
            if (file && fileInputRef.current) {
              const dt = new DataTransfer()
              dt.items.add(file)
              fileInputRef.current.files = dt.files
              fileInputRef.current.dispatchEvent(new Event('change', { bubbles: true }))
            }
          }}
        >
          <div className="text-center">
            <p className="text-lg font-medium text-gray-700">
              {fileName || 'PDFファイルをドラッグ＆ドロップ、またはクリックして選択'}
            </p>
            {totalPages > 0 && (
              <p className="text-sm text-gray-500 mt-1">
                {totalPages} ページ
              </p>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={handleFileUpload}
          />
        </label>
      </div>

      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent" />
          <p className="mt-2 text-gray-600">PDFを読み込み中...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {pages.length > 0 && (
        <>
          {/* Page Range */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
            <h2 className="font-semibold mb-3">読み上げ範囲</h2>
            <div className="flex items-center gap-3 flex-wrap">
              <label className="flex items-center gap-1">
                <span className="text-sm">開始ページ:</span>
                <input
                  type="number"
                  min={1}
                  max={totalPages}
                  value={startPage}
                  onChange={(e) => setStartPage(Math.max(1, Math.min(totalPages, Number(e.target.value))))}
                  className="w-20 border border-gray-300 rounded px-2 py-1 text-sm"
                />
              </label>
              <span className="text-gray-400">〜</span>
              <label className="flex items-center gap-1">
                <span className="text-sm">終了ページ:</span>
                <input
                  type="number"
                  min={1}
                  max={totalPages}
                  value={endPage}
                  onChange={(e) => setEndPage(Math.max(1, Math.min(totalPages, Number(e.target.value))))}
                  className="w-20 border border-gray-300 rounded px-2 py-1 text-sm"
                />
              </label>
              <span className="text-sm text-gray-500">/ 全 {totalPages} ページ</span>
            </div>
          </div>

          {/* TTS Settings */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
            <h2 className="font-semibold mb-3">読み上げ設定</h2>

            <div className="space-y-3">
              {/* Toggles */}
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={readPunctuation}
                    onChange={(e) => setReadPunctuation(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">括弧・記号を読み上げる（「」→ "かぎかっこ"）</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={readSpaces}
                    onChange={(e) => setReadSpaces(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">スペースを読み上げる</span>
                </label>
              </div>

              {/* Speed */}
              <div className="flex items-center gap-3">
                <span className="text-sm w-16">速度:</span>
                <input
                  type="range"
                  min={0.5}
                  max={2.0}
                  step={0.1}
                  value={rate}
                  onChange={(e) => setRate(Number(e.target.value))}
                  className="flex-1"
                />
                <span className="text-sm w-12 text-right">{rate.toFixed(1)}x</span>
              </div>

              {/* Pitch */}
              <div className="flex items-center gap-3">
                <span className="text-sm w-16">音の高さ:</span>
                <input
                  type="range"
                  min={0.5}
                  max={2.0}
                  step={0.1}
                  value={pitch}
                  onChange={(e) => setPitch(Number(e.target.value))}
                  className="flex-1"
                />
                <span className="text-sm w-12 text-right">{pitch.toFixed(1)}</span>
              </div>

              {/* Voice Selection */}
              {voices.length > 0 && (
                <div className="flex items-center gap-3">
                  <span className="text-sm w-16">音声:</span>
                  <select
                    value={selectedVoice}
                    onChange={(e) => setSelectedVoice(e.target.value)}
                    className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
                  >
                    {voices.map((voice) => (
                      <option key={voice.name} value={voice.name}>
                        {voice.name} ({voice.lang})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-3 mb-4">
            {!isSpeaking ? (
              <button
                onClick={speak}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                再生
              </button>
            ) : (
              <>
                {!isPaused ? (
                  <button
                    onClick={pause}
                    className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-medium"
                  >
                    一時停止
                  </button>
                ) : (
                  <button
                    onClick={resume}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    再開
                  </button>
                )}
                <button
                  onClick={stop}
                  className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                >
                  停止
                </button>
              </>
            )}
            {currentReadPage !== null && (
              <span className="flex items-center text-sm text-gray-600">
                読み上げ中: {currentReadPage} ページ目
              </span>
            )}
          </div>

          {/* Preview */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
            <h2 className="font-semibold mb-2">読み上げプレビュー（変換後テキスト）</h2>
            <div className="max-h-64 overflow-y-auto bg-gray-50 rounded p-3 text-sm whitespace-pre-wrap break-words leading-relaxed">
              {previewText || '（テキストなし）'}
            </div>
          </div>

          {/* Original text per page */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h2 className="font-semibold mb-2">抽出テキスト（元のテキスト）</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {pages
                .filter((p) => p.pageNum >= startPage && p.pageNum <= endPage)
                .map((page) => (
                  <div
                    key={page.pageNum}
                    className={`border rounded p-3 ${
                      currentReadPage === page.pageNum
                        ? 'border-blue-400 bg-blue-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="text-xs font-medium text-gray-500 mb-1">
                      ページ {page.pageNum}
                    </div>
                    <div className="text-sm whitespace-pre-wrap break-words">
                      {page.text || '（テキストなし）'}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

/** テキストを句点・改行を区切りとしてチャンク分割する */
function splitIntoChunks(text: string, maxLen: number): string[] {
  const chunks: string[] = []
  let remaining = text

  while (remaining.length > 0) {
    if (remaining.length <= maxLen) {
      chunks.push(remaining)
      break
    }

    // Try to find a natural break point (。、！？\n)
    let breakPoint = -1
    for (let i = maxLen; i >= maxLen / 2; i--) {
      const ch = remaining[i]
      if (ch === '。' || ch === '、' || ch === '！' || ch === '？' || ch === '\n') {
        breakPoint = i + 1
        break
      }
    }

    if (breakPoint === -1) {
      // No natural break found, just split at maxLen
      breakPoint = maxLen
    }

    chunks.push(remaining.slice(0, breakPoint))
    remaining = remaining.slice(breakPoint)
  }

  return chunks
}
