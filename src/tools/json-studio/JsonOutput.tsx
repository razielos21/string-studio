import { ReadOnlyCodeEditor } from '../../components/ui/ReadOnlyCodeEditor'

interface JsonOutputProps {
  value: string
}

export function JsonOutput({ value }: JsonOutputProps) {
  return <ReadOnlyCodeEditor value={value} language="json" />
}
