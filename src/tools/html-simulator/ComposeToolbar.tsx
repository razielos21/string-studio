import {
  Undo2,
  Redo2,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link2,
  Unlink,
  Image as ImageIcon,
  Code,
  SeparatorHorizontal,
  Eraser,
} from 'lucide-react'
import { Select } from '../../components/ui/Select'
import { ToolbarButton } from './ToolbarButton'
import { UrlPopoverButton } from './UrlPopoverButton'
import { FORMAT_BLOCK_SELECT_OPTIONS, LANGUAGE_SELECT_OPTIONS, FONT_SELECT_OPTIONS, type ComposeLang, type ComposeFont } from './compose.utils'

export interface ActiveFormats {
  bold: boolean
  italic: boolean
  underline: boolean
  strikeThrough: boolean
  insertUnorderedList: boolean
  insertOrderedList: boolean
  justifyLeft: boolean
  justifyCenter: boolean
  justifyRight: boolean
  link: boolean
  code: boolean
}

interface ComposeToolbarProps {
  activeFormats: ActiveFormats
  currentBlock: string
  color: string
  highlightColor: string
  hasSelection: boolean
  exec: (command: string, value?: string) => void
  onUndo: () => void
  onRedo: () => void
  onToggleCode: () => void
  onInsertLink: (url: string) => void
  onInsertImage: (url: string) => void
  lang: ComposeLang
  onLangChange: (lang: ComposeLang) => void
  font: ComposeFont
  onFontChange: (font: ComposeFont) => void
}

export function ComposeToolbar({
  activeFormats,
  currentBlock,
  color,
  highlightColor,
  hasSelection,
  exec,
  onUndo,
  onRedo,
  onToggleCode,
  onInsertLink,
  onInsertImage,
  lang,
  onLangChange,
  font,
  onFontChange,
}: ComposeToolbarProps) {
  return (
    <div
      className="flex items-center gap-1.5 px-3 py-2 border-b border-[var(--border)] bg-[var(--bg-surface)] flex-wrap"
      role="toolbar"
      aria-label="Text formatting"
    >
      <ToolbarButton onClick={onUndo} title="Undo">
        <Undo2 size={14} />
      </ToolbarButton>
      <ToolbarButton onClick={onRedo} title="Redo">
        <Redo2 size={14} />
      </ToolbarButton>

      <div className="w-px h-5 mx-1" style={{ background: 'var(--border)' }} />

      <ToolbarButton active={activeFormats.bold} onClick={() => exec('bold')} title="Bold">
        <Bold size={14} />
      </ToolbarButton>
      <ToolbarButton active={activeFormats.italic} onClick={() => exec('italic')} title="Italic">
        <Italic size={14} />
      </ToolbarButton>
      <ToolbarButton active={activeFormats.underline} onClick={() => exec('underline')} title="Underline">
        <Underline size={14} />
      </ToolbarButton>
      <ToolbarButton active={activeFormats.strikeThrough} onClick={() => exec('strikeThrough')} title="Strikethrough">
        <Strikethrough size={14} />
      </ToolbarButton>

      <input
        type="color"
        value={color}
        title="Text color"
        onChange={(e) => exec('foreColor', e.target.value)}
        className="w-7 h-7 rounded-md cursor-pointer bg-transparent"
        style={{ border: '1px solid var(--border)', padding: 2 }}
      />
      <input
        type="color"
        value={highlightColor}
        title="Highlight color"
        onChange={(e) => exec('hiliteColor', e.target.value)}
        className="w-7 h-7 rounded-md cursor-pointer bg-transparent"
        style={{ border: '1px solid var(--border)', padding: 2 }}
      />

      <div className="w-px h-5 mx-1" style={{ background: 'var(--border)' }} />

      <Select
        options={FORMAT_BLOCK_SELECT_OPTIONS}
        value={currentBlock}
        onChange={(e) => exec('formatBlock', `<${e.target.value}>`)}
      />

      <div className="w-px h-5 mx-1" style={{ background: 'var(--border)' }} />

      <ToolbarButton active={activeFormats.insertUnorderedList} onClick={() => exec('insertUnorderedList')} title="Bullet list">
        <List size={14} />
      </ToolbarButton>
      <ToolbarButton active={activeFormats.insertOrderedList} onClick={() => exec('insertOrderedList')} title="Numbered list">
        <ListOrdered size={14} />
      </ToolbarButton>

      <div className="w-px h-5 mx-1" style={{ background: 'var(--border)' }} />

      <ToolbarButton active={activeFormats.justifyLeft} onClick={() => exec('justifyLeft')} title="Align left">
        <AlignLeft size={14} />
      </ToolbarButton>
      <ToolbarButton active={activeFormats.justifyCenter} onClick={() => exec('justifyCenter')} title="Align center">
        <AlignCenter size={14} />
      </ToolbarButton>
      <ToolbarButton active={activeFormats.justifyRight} onClick={() => exec('justifyRight')} title="Align right">
        <AlignRight size={14} />
      </ToolbarButton>

      <div className="w-px h-5 mx-1" style={{ background: 'var(--border)' }} />

      <UrlPopoverButton
        icon={<Link2 size={14} />}
        title={hasSelection ? 'Insert link' : 'Select text first'}
        placeholder="https://example.com"
        disabled={!hasSelection}
        onConfirm={onInsertLink}
      />

      <ToolbarButton
        active={false}
        disabled={!activeFormats.link}
        onClick={() => exec('unlink')}
        title={activeFormats.link ? 'Remove link' : 'Place cursor in a link to remove it'}
      >
        <Unlink size={14} />
      </ToolbarButton>

      <UrlPopoverButton
        icon={<ImageIcon size={14} />}
        title="Insert image"
        placeholder="https://example.com/image.png"
        onConfirm={onInsertImage}
      />

      <ToolbarButton active={activeFormats.code} onClick={onToggleCode} title="Inline code">
        <Code size={14} />
      </ToolbarButton>
      <ToolbarButton onClick={() => exec('insertHorizontalRule')} title="Insert horizontal rule">
        <SeparatorHorizontal size={14} />
      </ToolbarButton>

      <ToolbarButton onClick={() => exec('removeFormat')} title="Clear formatting">
        <Eraser size={14} />
      </ToolbarButton>

      <div className="flex-1" />

      <Select
        label="Font"
        options={FONT_SELECT_OPTIONS}
        value={font}
        onChange={(e) => onFontChange(e.target.value as ComposeFont)}
      />

      <Select
        label="Language"
        options={LANGUAGE_SELECT_OPTIONS}
        value={lang}
        onChange={(e) => onLangChange(e.target.value as ComposeLang)}
      />
    </div>
  )
}
