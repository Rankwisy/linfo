'use client'

import { useState, useCallback, useRef } from 'react'
import Papa from 'papaparse'
import {
  UploadIcon,
  FileTextIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  XIcon,
  LoaderIcon,
  SkipForwardIcon,
} from 'lucide-react'
import { checkDuplicates, importListings } from '@/lib/admin/actions'
import { silos } from '@/data/silos'
import { cities } from '@/data/cities'

// ─── DB fields available for mapping ─────────────────────────────────────────

const DB_FIELDS = [
  { value: '', label: '— skip —' },
  { value: 'name', label: 'Name *' },
  { value: 'city', label: 'City *' },
  { value: 'category', label: 'Category' },
  { value: 'subcategory', label: 'Subcategory' },
  { value: 'address', label: 'Address' },
  { value: 'phone', label: 'Phone' },
  { value: 'email', label: 'Email' },
  { value: 'website', label: 'Website' },
  { value: 'description', label: 'Description' },
  { value: 'short_description', label: 'Short description' },
  { value: 'image_url', label: 'Image URL' },
  { value: 'lat', label: 'Latitude' },
  { value: 'lng', label: 'Longitude' },
  { value: 'rating', label: 'Rating' },
  { value: 'review_count', label: 'Review count' },
]

// Guess DB field from CSV column name
function guessField(col: string): string {
  const c = col.toLowerCase().trim()
  if (/^name$|business.?name|company|nom/.test(c)) return 'name'
  if (/^city$|ville|stad/.test(c)) return 'city'
  if (/categ/.test(c)) return 'category'
  if (/subcateg|sous/.test(c)) return 'subcategory'
  if (/address|adresse|rue/.test(c)) return 'address'
  if (/phone|tel|gsm/.test(c)) return 'phone'
  if (/email|mail/.test(c)) return 'email'
  if (/web|site|url/.test(c)) return 'website'
  if (/desc.*short|short.*desc|excerpt/.test(c)) return 'short_description'
  if (/description|about/.test(c)) return 'description'
  if (/image|photo|logo/.test(c)) return 'image_url'
  if (/^lat/.test(c)) return 'lat'
  if (/^lng|^lon/.test(c)) return 'lng'
  if (/rating|note/.test(c)) return 'rating'
  if (/review|avis/.test(c)) return 'review_count'
  return ''
}

type Step = 'upload' | 'mapping' | 'preview' | 'done'

interface DuplicateInfo { index: number; isDuplicate: boolean }
interface ImportResult { imported: number; skipped: number; errors: number }

// ─── Step indicators ──────────────────────────────────────────────────────────

const STEPS: { id: Step; label: string }[] = [
  { id: 'upload', label: 'Upload CSV' },
  { id: 'mapping', label: 'Map Fields' },
  { id: 'preview', label: 'Preview' },
  { id: 'done', label: 'Done' },
]

function StepBar({ current }: { current: Step }) {
  const idx = STEPS.findIndex((s) => s.id === current)
  return (
    <div className="flex items-center gap-0 mb-8">
      {STEPS.map((step, i) => (
        <div key={step.id} className="flex items-center">
          <div className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                i < idx
                  ? 'bg-blue-600 text-white'
                  : i === idx
                  ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              {i < idx ? <CheckCircleIcon size={14} /> : i + 1}
            </div>
            <span
              className={`text-xs font-medium hidden sm:block ${
                i <= idx ? 'text-gray-700' : 'text-gray-400'
              }`}
            >
              {step.label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div
              className={`h-px w-8 sm:w-16 mx-2 ${i < idx ? 'bg-blue-400' : 'bg-gray-200'}`}
            />
          )}
        </div>
      ))}
    </div>
  )
}

// ─── Main wizard ──────────────────────────────────────────────────────────────

export default function ImportWizard() {
  const [step, setStep] = useState<Step>('upload')
  const [csvRows, setCsvRows] = useState<Record<string, string>[]>([])
  const [csvColumns, setCsvColumns] = useState<string[]>([])
  const [fieldMap, setFieldMap] = useState<Record<string, string>>({})
  const [filename, setFilename] = useState('')
  const [duplicates, setDuplicates] = useState<DuplicateInfo[]>([])
  const [skipDuplicates, setSkipDuplicates] = useState(true)
  const [loading, setLoading] = useState(false)
  const [importResult, setImportResult] = useState<ImportResult | null>(null)
  const [importError, setImportError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  // ── Step 1: Upload ────────────────────────────────────────────────────────
  const handleFile = useCallback((file: File) => {
    setFilename(file.name)
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows = results.data as Record<string, string>[]
        const cols = results.meta.fields ?? []
        setCsvRows(rows)
        setCsvColumns(cols)
        // Auto-guess field mapping
        const guessed: Record<string, string> = {}
        cols.forEach((col) => { guessed[col] = guessField(col) })
        setFieldMap(guessed)
        setStep('mapping')
      },
      error: (err) => alert(`Parse error: ${err.message}`),
    })
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const file = e.dataTransfer.files[0]
      if (file?.name.endsWith('.csv')) handleFile(file)
    },
    [handleFile]
  )

  // ── Step 2: Mapping → Step 3: Preview ────────────────────────────────────
  const handleMappingNext = useCallback(async () => {
    const hasName = Object.values(fieldMap).includes('name')
    if (!hasName) { alert('You must map at least the "Name" field.'); return }

    setLoading(true)
    const checks = await checkDuplicates(
      csvRows.map((r) => ({
        name: r[Object.keys(fieldMap).find((k) => fieldMap[k] === 'name') ?? ''] ?? '',
        city: r[Object.keys(fieldMap).find((k) => fieldMap[k] === 'city') ?? ''] ?? '',
      }))
    )
    setDuplicates(checks)
    setLoading(false)
    setStep('preview')
  }, [csvRows, fieldMap])

  // ── Step 4: Import ────────────────────────────────────────────────────────
  const handleImport = useCallback(async () => {
    setLoading(true)
    setImportError(null)
    const result = await importListings(csvRows, fieldMap, skipDuplicates)
    setLoading(false)
    if (result.success) {
      setImportResult(result.data ?? { imported: 0, skipped: 0, errors: 0 })
      setStep('done')
    } else {
      setImportError(result.error)
    }
  }, [csvRows, fieldMap, skipDuplicates])

  const dupCount = duplicates.filter((d) => d.isDuplicate).length
  const validCount = csvRows.filter((_, i) => !skipDuplicates || !duplicates[i]?.isDuplicate).filter((r) => {
    const nameCol = Object.keys(fieldMap).find((k) => fieldMap[k] === 'name')
    return nameCol && r[nameCol]?.trim()
  }).length

  return (
    <div>
      <StepBar current={step} />

      {/* ── Step 1: Upload ─────────────────────────────────────────────────── */}
      {step === 'upload' && (
        <div>
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-colors"
          >
            <UploadIcon size={40} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 font-medium mb-1">Drop your CSV file here</p>
            <p className="text-sm text-gray-400">or click to browse</p>
            <input
              ref={fileRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
          </div>

          <div className="mt-6 bg-gray-50 rounded-xl p-4">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Expected CSV format</h4>
            <code className="text-xs text-gray-600 block font-mono leading-relaxed">
              name,city,category,phone,email,website<br />
              &quot;Taxi Express&quot;,bruxelles,transport,+32 2 000 00 00,,,<br />
              &quot;Burger King&quot;,liege,restauration,,,https://bk.be
            </code>
          </div>
        </div>
      )}

      {/* ── Step 2: Field mapping ───────────────────────────────────────────── */}
      {step === 'mapping' && (
        <div>
          <div className="flex items-center gap-3 mb-5">
            <FileTextIcon size={18} className="text-gray-400" />
            <div>
              <p className="text-sm font-semibold text-gray-800">{filename}</p>
              <p className="text-xs text-gray-400">{csvRows.length} rows · {csvColumns.length} columns</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
            <div className="grid grid-cols-2 px-4 py-2.5 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              <span>CSV Column</span>
              <span>Maps to DB Field</span>
            </div>
            <div className="divide-y divide-gray-50">
              {csvColumns.map((col) => (
                <div key={col} className="grid grid-cols-2 items-center px-4 py-2.5 gap-4">
                  <span className="text-sm font-mono text-gray-700 truncate">{col}</span>
                  <select
                    value={fieldMap[col] ?? ''}
                    onChange={(e) =>
                      setFieldMap((prev) => ({ ...prev, [col]: e.target.value }))
                    }
                    className="text-sm border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {DB_FIELDS.map((f) => (
                      <option key={f.value} value={f.value}>{f.label}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* Sample preview */}
          {csvRows.length > 0 && (
            <div className="bg-gray-50 rounded-xl p-4 mb-6 overflow-x-auto">
              <p className="text-xs font-semibold text-gray-500 mb-2">Sample (first row)</p>
              <div className="flex gap-4">
                {csvColumns.map((col) => (
                  <div key={col} className="min-w-[100px]">
                    <p className="text-xs text-gray-400">{col}</p>
                    <p className="text-xs font-medium text-gray-700 truncate max-w-[120px]">
                      {csvRows[0][col] ?? '—'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => setStep('upload')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <ArrowLeftIcon size={13} /> Back
            </button>
            <button
              onClick={handleMappingNext}
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60"
            >
              {loading ? <LoaderIcon size={13} className="animate-spin" /> : null}
              Preview & Check Duplicates <ArrowRightIcon size={13} />
            </button>
          </div>
        </div>
      )}

      {/* ── Step 3: Preview ─────────────────────────────────────────────────── */}
      {step === 'preview' && (
        <div>
          {/* Summary */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">{csvRows.length}</div>
              <div className="text-xs text-gray-500 mt-1">Total rows</div>
            </div>
            <div className="bg-white rounded-xl border border-amber-200 p-4 text-center">
              <div className="text-2xl font-bold text-amber-600">{dupCount}</div>
              <div className="text-xs text-gray-500 mt-1">Duplicates detected</div>
            </div>
            <div className="bg-white rounded-xl border border-green-200 p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{validCount}</div>
              <div className="text-xs text-gray-500 mt-1">Will be imported</div>
            </div>
          </div>

          {/* Duplicate option */}
          {dupCount > 0 && (
            <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5">
              <AlertCircleIcon size={16} className="text-amber-600 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-amber-800">
                  {dupCount} duplicate{dupCount > 1 ? 's' : ''} found (same name + city already in DB)
                </p>
              </div>
              <label className="flex items-center gap-2 cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={skipDuplicates}
                  onChange={(e) => setSkipDuplicates(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-amber-700 font-medium flex items-center gap-1">
                  <SkipForwardIcon size={12} /> Skip duplicates
                </span>
              </label>
            </div>
          )}

          {/* Preview table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
            <div className="overflow-x-auto max-h-[400px]">
              <table className="w-full text-xs">
                <thead className="sticky top-0 bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-3 py-2.5 text-left font-semibold text-gray-500">#</th>
                    {csvColumns.filter((c) => fieldMap[c]).slice(0, 6).map((col) => (
                      <th key={col} className="px-3 py-2.5 text-left font-semibold text-gray-500 whitespace-nowrap">
                        {fieldMap[col]}
                      </th>
                    ))}
                    <th className="px-3 py-2.5 text-left font-semibold text-gray-500">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {csvRows.slice(0, 200).map((row, i) => {
                    const isDup = duplicates[i]?.isDuplicate
                    return (
                      <tr
                        key={i}
                        className={isDup && skipDuplicates ? 'opacity-40' : isDup ? 'bg-amber-50' : ''}
                      >
                        <td className="px-3 py-2 text-gray-400">{i + 1}</td>
                        {csvColumns.filter((c) => fieldMap[c]).slice(0, 6).map((col) => (
                          <td key={col} className="px-3 py-2 text-gray-700 max-w-[140px] truncate">
                            {row[col] || <span className="text-gray-300">—</span>}
                          </td>
                        ))}
                        <td className="px-3 py-2">
                          {isDup ? (
                            <span className="inline-flex items-center gap-1 text-amber-600 font-medium">
                              <AlertCircleIcon size={10} />
                              {skipDuplicates ? 'Skip' : 'Duplicate'}
                            </span>
                          ) : (
                            <span className="text-green-600 font-medium">✓ New</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            {csvRows.length > 200 && (
              <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 text-xs text-gray-400">
                Showing first 200 of {csvRows.length} rows.
              </div>
            )}
          </div>

          {importError && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700 mb-4">
              <AlertCircleIcon size={14} /> {importError}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => setStep('mapping')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <ArrowLeftIcon size={13} /> Back
            </button>
            <button
              onClick={handleImport}
              disabled={loading || validCount === 0}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60"
            >
              {loading ? <LoaderIcon size={13} className="animate-spin" /> : <UploadIcon size={13} />}
              Import {validCount} listing{validCount !== 1 ? 's' : ''}
            </button>
          </div>
        </div>
      )}

      {/* ── Step 4: Done ────────────────────────────────────────────────────── */}
      {step === 'done' && importResult && (
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
            <CheckCircleIcon size={32} className="text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Import complete!</h2>

          <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto mt-6 mb-8">
            <div className="bg-green-50 rounded-xl p-4">
              <div className="text-2xl font-bold text-green-600">{importResult.imported}</div>
              <div className="text-xs text-gray-500 mt-1">Imported</div>
            </div>
            <div className="bg-amber-50 rounded-xl p-4">
              <div className="text-2xl font-bold text-amber-600">{importResult.skipped}</div>
              <div className="text-xs text-gray-500 mt-1">Skipped</div>
            </div>
            <div className="bg-red-50 rounded-xl p-4">
              <div className="text-2xl font-bold text-red-600">{importResult.errors}</div>
              <div className="text-xs text-gray-500 mt-1">Errors</div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <a
              href="/admin/listings"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              View listings
            </a>
            <button
              onClick={() => {
                setStep('upload')
                setCsvRows([])
                setCsvColumns([])
                setFieldMap({})
                setFilename('')
                setDuplicates([])
                setImportResult(null)
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Import another file
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
