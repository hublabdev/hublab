'use client'

import React from 'react'
import Link from 'next/link'
import { IconCheck, IconChevronRight } from '../../../components/ui/icons'

const plans = [
  {
    name: 'Free',
    description: 'Para proyectos personales y aprendizaje',
    price: '0',
    period: 'siempre',
    features: [
      '10 proyectos',
      '53 cápsulas disponibles',
      'Exportar a iOS, Android, Web',
      '50 exportaciones/día',
      '30 requests/minuto',
      'Soporte comunitario',
    ],
    limitations: [
      'Sin soporte prioritario',
      'Sin custom branding',
    ],
    cta: 'Empezar Gratis',
    href: '/dashboard',
    highlight: false,
  },
  {
    name: 'Pro',
    description: 'Para desarrolladores y equipos pequeños',
    price: '29',
    period: '/mes',
    features: [
      'Proyectos ilimitados',
      '53 cápsulas + nuevas primero',
      'Todas las plataformas',
      '500 exportaciones/día',
      '120 requests/minuto',
      'Soporte por email',
      'API access completo',
      'Temas personalizados',
      'Sin marca HubLab',
    ],
    limitations: [],
    cta: 'Empezar Prueba',
    href: '/dashboard',
    highlight: true,
  },
  {
    name: 'Enterprise',
    description: 'Para empresas con necesidades avanzadas',
    price: 'Custom',
    period: '',
    features: [
      'Todo lo de Pro',
      '5000 exportaciones/día',
      '600 requests/minuto',
      'Soporte prioritario 24/7',
      'SLA garantizado',
      'Cápsulas personalizadas',
      'On-premise disponible',
      'SSO/SAML',
      'Auditoría y compliance',
    ],
    limitations: [],
    cta: 'Contactar Ventas',
    href: 'mailto:enterprise@hublab.dev',
    highlight: false,
  },
]

const faqs = [
  {
    question: '¿Qué significa "código nativo real"?',
    answer: 'HubLab genera código SwiftUI para iOS, Jetpack Compose para Android, React para Web, etc. No hay bridges ni runtimes adicionales - es el mismo código que escribirías manualmente.',
  },
  {
    question: '¿Puedo usar el código generado comercialmente?',
    answer: 'Sí, el código generado es 100% tuyo. Puedes usarlo en proyectos comerciales sin restricciones ni royalties.',
  },
  {
    question: '¿Necesito conocer Swift/Kotlin para usar HubLab?',
    answer: 'No necesariamente. HubLab genera código listo para compilar. Pero conocer el lenguaje te ayudará a personalizar y extender el código generado.',
  },
  {
    question: '¿Hay límite en el tamaño de los proyectos?',
    answer: 'No hay límite de cápsulas por proyecto. Los límites se aplican al número de exportaciones y requests a la API.',
  },
  {
    question: '¿Ofrecen descuentos para estudiantes?',
    answer: 'Sí, ofrecemos el plan Pro gratis para estudiantes verificados. Contacta a education@hublab.dev con tu email .edu.',
  },
  {
    question: '¿Puedo cancelar en cualquier momento?',
    answer: 'Sí, puedes cancelar tu suscripción en cualquier momento. Seguirás teniendo acceso hasta el final del período facturado.',
  },
]

export default function PricingPage() {
  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="border-b border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold sm:text-5xl">Precios Simples</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Empieza gratis, escala cuando lo necesites. Sin sorpresas.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl border bg-background p-8 ${
                  plan.highlight
                    ? 'border-primary shadow-lg ring-1 ring-primary'
                    : 'border-border'
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-sm font-medium text-primary-foreground">
                    Más Popular
                  </div>
                )}

                <div className="text-center">
                  <h3 className="text-xl font-semibold">{plan.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>

                  <div className="mt-6">
                    {plan.price === 'Custom' ? (
                      <span className="text-4xl font-bold">Custom</span>
                    ) : (
                      <>
                        <span className="text-4xl font-bold">${plan.price}</span>
                        <span className="text-muted-foreground">{plan.period}</span>
                      </>
                    )}
                  </div>
                </div>

                <ul className="mt-8 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <IconCheck className="text-green-500 mt-0.5 flex-shrink-0" size={16} />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                  {plan.limitations.map((limitation) => (
                    <li key={limitation} className="flex items-start gap-3 text-muted-foreground">
                      <span className="mt-0.5 flex-shrink-0 w-4 text-center">—</span>
                      <span className="text-sm">{limitation}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <Link
                    href={plan.href}
                    className={`flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-medium transition-colors ${
                      plan.highlight
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                        : 'border border-border hover:bg-muted'
                    }`}
                  >
                    {plan.cta}
                    <IconChevronRight size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="border-t border-border bg-muted/30 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold">Comparación de Planes</h2>

          <div className="mt-12 overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-4 px-6 text-left font-medium">Característica</th>
                  <th className="py-4 px-6 text-center font-medium">Free</th>
                  <th className="py-4 px-6 text-center font-medium text-primary">Pro</th>
                  <th className="py-4 px-6 text-center font-medium">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  ['Proyectos', '10', 'Ilimitados', 'Ilimitados'],
                  ['Cápsulas', '53', '53 + Early Access', 'Custom'],
                  ['Exportaciones/día', '50', '500', '5000'],
                  ['Requests/minuto', '30', '120', '600'],
                  ['Plataformas', 'Todas', 'Todas', 'Todas + Custom'],
                  ['API Access', 'Limitado', 'Completo', 'Completo + Webhooks'],
                  ['Soporte', 'Comunidad', 'Email', '24/7 Prioritario'],
                  ['SLA', '—', '—', '99.9%'],
                  ['On-premise', '—', '—', 'Disponible'],
                ].map(([feature, free, pro, enterprise]) => (
                  <tr key={feature}>
                    <td className="py-4 px-6 text-sm font-medium">{feature}</td>
                    <td className="py-4 px-6 text-center text-sm text-muted-foreground">{free}</td>
                    <td className="py-4 px-6 text-center text-sm">{pro}</td>
                    <td className="py-4 px-6 text-center text-sm text-muted-foreground">{enterprise}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold">Preguntas Frecuentes</h2>

          <div className="mt-12 space-y-6">
            {faqs.map((faq) => (
              <div key={faq.question} className="rounded-xl border border-border bg-background p-6">
                <h3 className="font-semibold">{faq.question}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-gradient-to-b from-primary/5 to-transparent py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold">¿Listo para empezar?</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Crea tu primera app nativa en minutos. Gratis para siempre.
          </p>

          <div className="mt-8 flex items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-lg bg-primary px-8 py-4 text-lg font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Empezar Gratis
              <IconChevronRight size={20} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
