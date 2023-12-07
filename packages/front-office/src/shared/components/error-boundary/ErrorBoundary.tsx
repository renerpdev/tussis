import React from 'react'
import { useTranslation } from 'react-i18next'
import { HiEmojiSad } from 'react-icons/hi'

const adminEmail = import.meta.env.VITE_ADMIN_EMAIL

type Props = {
  fallback: React.ReactNode
  children: React.ReactNode
}

const Fallback = () => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'pages.error-boundary',
  })

  return (
    <div className="h-[100dvh] flex items-center justify-center flex-col text-center bg-black p-4">
      <h1 className="text-3xl font-black text-white">{t('title')}</h1>
      <p
        className="my-3 text-white"
        dangerouslySetInnerHTML={{
          __html: t('message', { email: adminEmail }),
        }}
      />
      <p>
        <HiEmojiSad
          size={80}
          className="text-red-600 animate-pulse"
        />
      </p>
    </div>
  )
}

export default class ErrorBoundary extends React.Component {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  componentDidCatch(error: any, info: any) {
    console.log(error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <Fallback />
    }

    return this.props.children
  }
}
