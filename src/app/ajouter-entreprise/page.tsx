'use client'
import { useState, useTransition } from 'react'
import Link from 'next/link'
import { MapPinIcon, BuildingIcon, PhoneIcon, GlobeIcon, MailIcon, CheckCircleIcon, ChevronRightIcon } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { silos } from '@/data/silos'
import { cities } from '@/data/cities'
import { submitBusiness } from './actions'

const CATEGORY_OPTIONS = silos.flatMap((silo) =>
  silo.subcategories.map((sub) => ({
    label: `${silo.icon} ${sub.name}`,
    category: silo.dbCategory ?? silo.slug,
    subcategory: sub.dbSubcategory ?? sub.slug,
    siloName: silo.name,
  }))
)

export default function AjouterEntreprisePage() {
  const [isPending, startTransition] = useTransition()
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)

    // Inject category/subcategory from selected option
    const opt = CATEGORY_OPTIONS.find((o) => `${o.category}::${o.subcategory}` === selectedCategory)
    if (!opt) { setError('Veuillez sélectionner une catégorie.'); return }
    formData.set('category', opt.category)
    formData.set('subcategory', opt.subcategory)

    startTransition(async () => {
      const result = await submitBusiness(formData)
      if (result.success) {
        setSuccess(true)
      } else {
        setError(result.error ?? 'Erreur inconnue.')
      }
    })
  }

  if (success) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-10 max-w-md w-full text-center">
            <div className="flex justify-center mb-4">
              <CheckCircleIcon size={56} className="text-green-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Entreprise soumise !</h1>
            <p className="text-gray-500 mb-6">
              Merci ! Votre entreprise a bien été enregistrée sur Linfo.be et sera visible très prochainement.
            </p>
            <div className="flex flex-col gap-3">
              <Link
                href="/"
                className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors text-center"
              >
                Retour à l&apos;accueil
              </Link>
              <button
                onClick={() => { setSuccess(false); setError(null); setSelectedCategory('') }}
                className="w-full py-3 rounded-xl border border-gray-200 text-gray-600 font-medium text-sm hover:bg-gray-50 transition-colors"
              >
                Ajouter une autre entreprise
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        {/* Hero */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-3xl mx-auto px-4 py-10">
            <nav className="flex items-center gap-2 text-sm text-gray-400 mb-4">
              <Link href="/" className="hover:text-blue-600 transition-colors">Accueil</Link>
              <ChevronRightIcon size={14} />
              <span className="text-gray-700">Ajouter mon entreprise</span>
            </nav>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                <BuildingIcon size={24} className="text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Référencez votre entreprise gratuitement</h1>
                <p className="text-gray-500 mt-0.5 text-sm">Visibilité immédiate sur l&apos;annuaire belge Linfo.be — 100% gratuit.</p>
              </div>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              {[
                { icon: '🎯', title: 'Visibilité locale', desc: 'Apparaissez dans les recherches de votre ville' },
                { icon: '⚡', title: 'Inscription rapide', desc: 'Formulaire en 2 minutes, en ligne immédiatement' },
                { icon: '💶', title: '100% gratuit', desc: 'Aucun frais d\'inscription ni abonnement' },
              ].map((b) => (
                <div key={b.title} className="bg-blue-50 rounded-xl p-4 text-center">
                  <div className="text-2xl mb-1">{b.icon}</div>
                  <div className="text-xs font-semibold text-blue-800">{b.title}</div>
                  <div className="text-xs text-blue-600 mt-0.5">{b.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="max-w-3xl mx-auto px-4 py-8">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

            {/* Section 1 — Identité */}
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">1</span>
                Identité de l&apos;entreprise
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Nom de l&apos;entreprise <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Ex: Taxi Express Bruxelles"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Ville <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="city"
                      required
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="">Sélectionner…</option>
                      {cities.map((c) => (
                        <option key={c.slug} value={c.slug}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Catégorie <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="">Sélectionner…</option>
                      {silos.map((silo) => (
                        <optgroup key={silo.slug} label={`${silo.icon} ${silo.name}`}>
                          {silo.subcategories.map((sub) => (
                            <option
                              key={sub.slug}
                              value={`${silo.dbCategory ?? silo.slug}::${sub.dbSubcategory ?? sub.slug}`}
                            >
                              {sub.name}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Adresse
                  </label>
                  <input
                    type="text"
                    name="address"
                    placeholder="Ex: Rue de la Loi 1, 1000 Bruxelles"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Section 2 — Contact */}
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">2</span>
                Coordonnées de contact
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                      <PhoneIcon size={13} className="text-gray-400" /> Téléphone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="+32 2 000 00 00"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                      <MailIcon size={13} className="text-gray-400" /> Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="contact@monentreprise.be"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                    <GlobeIcon size={13} className="text-gray-400" /> Site web
                  </label>
                  <input
                    type="url"
                    name="website"
                    placeholder="https://www.monentreprise.be"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Section 3 — Description */}
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">3</span>
                Description de l&apos;activité
              </h2>
              <textarea
                name="description"
                rows={4}
                placeholder="Décrivez votre entreprise, vos services, votre zone d'intervention… (optionnel)"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
              <p className="text-xs text-gray-400 mt-1">Facultatif — aide les clients à mieux vous trouver.</p>
            </div>

            {/* Submit */}
            <div className="p-6 bg-gray-50">
              {error && (
                <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
                  {error}
                </div>
              )}
              <button
                type="submit"
                disabled={isPending}
                className="w-full py-3.5 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isPending ? 'Envoi en cours…' : '✓ Soumettre mon entreprise gratuitement'}
              </button>
              <p className="text-center text-xs text-gray-400 mt-3">
                En soumettant, vous acceptez que vos informations soient publiées sur Linfo.be. Aucune carte de crédit requise.
              </p>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  )
}
