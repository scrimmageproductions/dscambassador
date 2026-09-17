import { useRef, useState, type ChangeEvent, type DragEvent, type FormEvent } from 'react'
import { Button } from '../ui/Button'

type UploadStatus = 'uploading' | 'done'
type UploadedFile = { id: string; name: string; size: number; status: UploadStatus }

const ACCEPTED_TYPES = ['application/pdf', 'image/png', 'image/jpeg']

const assetItems = [
  { key: 'cards', label: 'Physical Membership Cards' },
  { key: 'flyers', label: 'Event Flyers & Printed Materials' },
  { key: 'banners', label: 'DSC Standing Banners' },
  { key: 'tablecloth', label: 'Branded Tablecloth' },
] as const

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function QtyStepper({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="hairline flex shrink-0 items-center gap-1 rounded-full px-1 py-1">
      <button
        type="button"
        onClick={() => onChange(Math.max(0, value - 1))}
        aria-label="Decrease quantity"
        className="flex h-7 w-7 items-center justify-center rounded-full text-cream-wash transition-colors hover:bg-cream/10 hover:text-cream"
      >
        &minus;
      </button>
      <input
        type="number"
        min={0}
        value={value}
        onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))}
        aria-label="Quantity"
        className="w-10 bg-transparent text-center text-sm text-cream [appearance:textfield] focus-visible:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        aria-label="Increase quantity"
        className="flex h-7 w-7 items-center justify-center rounded-full text-cream-wash transition-colors hover:bg-cream/10 hover:text-cream"
      >
        +
      </button>
    </div>
  )
}

export function EventRequestModule() {
  const [submitted, setSubmitted] = useState(false)
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [dragActive, setDragActive] = useState(false)
  const [quantities, setQuantities] = useState<Record<string, number>>({
    cards: 0,
    flyers: 0,
    banners: 0,
    tablecloth: 0,
  })
  const [customItem, setCustomItem] = useState('')
  const [customQty, setCustomQty] = useState(0)
  const nextId = useRef(0)

  function addFiles(fileList: FileList | null) {
    if (!fileList) return
    const accepted = Array.from(fileList).filter((f) => ACCEPTED_TYPES.includes(f.type))
    const newFiles: UploadedFile[] = accepted.map((f) => ({
      id: `${Date.now()}-${nextId.current++}`,
      name: f.name,
      size: f.size,
      status: 'uploading',
    }))
    if (newFiles.length === 0) return
    setFiles((prev) => [...prev, ...newFiles])
    newFiles.forEach((nf, i) => {
      setTimeout(
        () => {
          setFiles((prev) => prev.map((f) => (f.id === nf.id ? { ...f, status: 'done' } : f)))
        },
        700 + i * 350,
      )
    })
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setDragActive(false)
    addFiles(e.dataTransfer.files)
  }

  function handleFileInput(e: ChangeEvent<HTMLInputElement>) {
    addFiles(e.target.files)
    e.target.value = ''
  }

  function removeFile(id: string) {
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }

  function updateQty(key: string, value: number) {
    setQuantities((prev) => ({ ...prev, [key]: value }))
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitted(true)
  }

  function reset() {
    setSubmitted(false)
    setFiles([])
    setQuantities({ cards: 0, flyers: 0, banners: 0, tablecloth: 0 })
    setCustomItem('')
    setCustomQty(0)
  }

  if (submitted) {
    return (
      <div className="hairline bg-ink p-8 text-center md:p-12" role="status">
        <p className="label-mono text-[0.68rem] text-gold">Request received</p>
        <p className="mt-4 font-display text-2xl text-cream md:text-3xl">Sent for approval.</p>
        <p className="mt-3 text-sm text-cream-3">
          Budget and asset status show up under Event Reports once reviewed.
        </p>
        <button
          type="button"
          onClick={reset}
          className="label-mono mt-6 text-[0.65rem] text-cream-wash underline underline-offset-4 hover:text-cream"
        >
          Submit another
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div
        className="hairline rounded-2xl p-6 transition-shadow duration-300 hover:shadow-[0_0_40px_-16px_rgba(243,237,227,0.15)] md:p-8"
        style={{ backgroundColor: '#0D0D0D' }}
      >
        <p className="label-mono text-[0.68rem] text-gold">Event budget &amp; reimbursement</p>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="req-event-name" className="label-mono text-[0.62rem] text-cream-wash">
              Event Name
            </label>
            <input
              id="req-event-name"
              required
              placeholder="e.g. ETHDenver Side Event"
              className="hairline mt-2 w-full bg-surface px-4 py-3 text-sm text-cream placeholder:text-cream-wash/40 focus-visible:outline-cream"
            />
          </div>
          <div>
            <label htmlFor="req-location" className="label-mono text-[0.62rem] text-cream-wash">
              Location
            </label>
            <input
              id="req-location"
              required
              placeholder="e.g. Denver, CO"
              className="hairline mt-2 w-full bg-surface px-4 py-3 text-sm text-cream placeholder:text-cream-wash/40 focus-visible:outline-cream"
            />
          </div>
          <div>
            <label htmlFor="req-headcount" className="label-mono text-[0.62rem] text-cream-wash">
              Expected Headcount
            </label>
            <input
              id="req-headcount"
              type="number"
              min={0}
              required
              placeholder="e.g. 40"
              className="hairline mt-2 w-full bg-surface px-4 py-3 text-sm text-cream placeholder:text-cream-wash/40 focus-visible:outline-cream"
            />
          </div>
          <div>
            <label htmlFor="req-budget" className="label-mono text-[0.62rem] text-cream-wash">
              Requested Budget Amount (USD)
            </label>
            <div className="hairline mt-2 flex items-center bg-surface px-4 focus-within:outline focus-within:outline-2 focus-within:outline-cream">
              <span className="text-sm text-cream-wash">$</span>
              <input
                id="req-budget"
                type="number"
                min={0}
                step="0.01"
                required
                placeholder="0.00"
                className="w-full bg-transparent py-3 pl-2 text-sm text-cream placeholder:text-cream-wash/40 focus-visible:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="mt-6">
          <p className="label-mono text-[0.62rem] text-cream-wash">Invoice &amp; receipt upload</p>
          <div
            onDragOver={(e) => {
              e.preventDefault()
              setDragActive(true)
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            className={`mt-2 flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-6 py-10 text-center transition-colors ${
              dragActive ? 'border-cream bg-cream/5' : 'border-cream/20'
            }`}
          >
            <p className="text-sm text-cream-3">Drag and drop PDFs, PNGs, or JPGs here</p>
            <label className="label-mono cursor-pointer text-[0.65rem] text-cream-wash underline underline-offset-4 hover:text-cream">
              or browse files
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg"
                multiple
                onChange={handleFileInput}
                className="sr-only"
              />
            </label>
          </div>

          {files.length > 0 && (
            <ul className="mt-4 space-y-2">
              {files.map((f) => (
                <li
                  key={f.id}
                  className="hairline flex items-center justify-between gap-3 rounded-lg px-4 py-2.5 text-sm"
                >
                  <span className="min-w-0 truncate text-cream-2">{f.name}</span>
                  <span className="flex shrink-0 items-center gap-3">
                    <span className="label-mono text-[0.58rem] text-cream-wash/70">
                      {formatSize(f.size)}
                    </span>
                    <span
                      className={`label-mono flex items-center gap-1.5 text-[0.6rem] ${
                        f.status === 'done' ? 'text-gold' : 'text-cream-wash'
                      }`}
                    >
                      {f.status === 'uploading' && (
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cream-wash" />
                      )}
                      {f.status === 'done' ? 'Uploaded' : 'Uploading…'}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFile(f.id)}
                      aria-label={`Remove ${f.name}`}
                      className="text-cream-wash transition-colors hover:text-cream"
                    >
                      &times;
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div
        className="hairline rounded-2xl p-6 md:p-8"
        style={{ backgroundColor: '#0D0D0D' }}
      >
        <p className="label-mono text-[0.68rem] text-gold">Physical assets request</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {assetItems.map((item) => (
            <div
              key={item.key}
              className="hairline flex items-center justify-between gap-4 rounded-xl bg-ink/60 px-5 py-4 transition-shadow duration-300 hover:shadow-[0_0_30px_-12px_rgba(196,165,116,0.3)]"
            >
              <p className="text-sm text-cream-2">{item.label}</p>
              <QtyStepper value={quantities[item.key]} onChange={(v) => updateQty(item.key, v)} />
            </div>
          ))}

          <div className="hairline rounded-xl bg-ink/60 px-5 py-4 sm:col-span-2">
            <p className="label-mono text-[0.62rem] text-cream-wash">Custom asset request</p>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
              <input
                value={customItem}
                onChange={(e) => setCustomItem(e.target.value)}
                placeholder="Describe the item"
                className="hairline w-full flex-1 bg-surface px-4 py-2.5 text-sm text-cream placeholder:text-cream-wash/40 focus-visible:outline-cream"
              />
              <QtyStepper value={customQty} onChange={setCustomQty} />
            </div>
          </div>
        </div>
      </div>

      <Button type="submit" variant="solid">
        Submit Event Request
      </Button>
    </form>
  )
}
