import WizardShell from './components/WizardShell'
import { useWizardState } from './hooks/useWizardState'

export default function App() {
  const wizard = useWizardState()
  return <WizardShell wizard={wizard} />
}
