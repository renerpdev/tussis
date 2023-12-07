import React from 'react'
import { HiEmojiSad } from 'react-icons/hi'

type Props = {
  fallback: React.ReactNode
  children: React.ReactNode
}

const Fallback = () => (
  <div className="h-[100dvh] flex items-center justify-center flex-col text-center bg-black p-4">
    <h1 className="text-3xl font-black text-white">
      Something went wrong. Please try again later.
    </h1>
    <p className="my-3 text-white">
      If the problem persists, please contact the{' '}
      <a href="mailto:caballetes-ahorrativa0n@icloud.com">support team</a>.
    </p>
    <p>
      <HiEmojiSad
        size={80}
        className="text-red-600 animate-pulse"
      />
    </p>
  </div>
)

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
    // Example "componentStack":
    //   in ComponentThatThrows (created by App)
    //   in ErrorBoundary (created by App)
    //   in div (created by App)
    //   in App
    console.log(error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback || <Fallback />
    }

    return this.props.children
  }
}
