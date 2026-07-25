import { Component } from 'react';
import { FiRefreshCw } from 'react-icons/fi';

export class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    if (import.meta.env.DEV) {
      console.error('Application render error', error, errorInfo);
    }
  }

  handleReload = () => window.location.reload();

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main className="grid min-h-screen place-items-center bg-slate-950 px-6 text-white">
        <div className="max-w-md text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-300">
            Atmos
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight">
            The dashboard could not be displayed.
          </h1>
          <p className="mt-3 text-slate-300">
            Reload the page to recover from the unexpected interface error.
          </p>
          <button
            type="button"
            onClick={this.handleReload}
            className="mx-auto mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            <FiRefreshCw aria-hidden="true" />
            Reload dashboard
          </button>
        </div>
      </main>
    );
  }
}
