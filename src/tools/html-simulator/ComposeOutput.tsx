import { ReadOnlyCodeEditor } from '../../components/ui/ReadOnlyCodeEditor'

interface ComposeOutputProps {
  value: string
}

export function ComposeOutput({ value }: ComposeOutputProps) {
  return <ReadOnlyCodeEditor value={value} language="html" wordWrap="on" />
}
