import { ExcelExtractor } from '@flatfile/plugin-xlsx-extractor'

export default function flatfileEventListener(listener) {
  listener.use(ExcelExtractor())
}
