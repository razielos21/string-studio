import { Component, type ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface Props {
  children: ReactNode
  toolName?: string
}

interface State {
  hasError: boolean
  message: string
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, message: '' }
  }

  static getDerivedStateFromError(error: unknown): State {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred.'
    return { hasError: true, message }
  }

  handleReset = () => {
    this.setState({ hasError: false, message: '' })
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center">
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)' }}
        >
          <AlertTriangle size={26} style={{ color: 'var(--error)' }} />
        </div>
        <div>
          <p className="text-base font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
            {this.props.toolName ? `${this.props.toolName} crashed` : 'Something went wrong'}
          </p>
          <p className="text-sm max-w-sm" style={{ color: 'var(--text-muted)' }}>
            {this.state.message}
          </p>
        </div>
        <button
          onClick={this.handleReset}
          className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer"
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border)',
            color: 'var(--text-secondary)',
          }}
        >
          <RefreshCw size={13} />
          Try again
        </button>
      </div>
    )
  }
}
