/**
 * Provider-private wire types for DeepSeek's Anthropic-compatible Messages API. Citeable
 * result items and citation excerpts arrive in separate blocks; the provider joins them by
 * URL. These types do not create a dependency on `ctx.llm`.
 * @module @deepseek-ai/dsh-web-search-deepseek/types
 */

/** A `web_search_result` item inside a `web_search_tool_result` block. */
export interface WebSearchResultItem {
  type: string
  url: string
  title?: string | null
  /** Provider-supplied page age/recency string (mapped to `publishedAt`). */
  page_age?: string | null
}

/** A `web_search_tool_result` content block: the citeable result shape. */
export interface WebSearchToolResultBlock {
  type: 'web_search_tool_result'
  content?: WebSearchResultItem[]
}

/** One citation location inside a `text` block (the snippet source). */
export interface CitationLocation {
  type?: string
  url?: string | null
  cited_text?: string | null
}

/** A `text` content block: the model's prose plus per-URL citations. */
export interface TextBlock {
  type: 'text'
  text?: string | null
  citations?: CitationLocation[]
}

/** Any content block; only `web_search_tool_result` and `text` are consumed. */
export type ContentBlock = WebSearchToolResultBlock | TextBlock | { type: string }

/** DeepSeek's Anthropic Messages response envelope. */
export interface AnthropicResponse {
  content?: ContentBlock[]
}

/** DeepSeek's error response envelope (best-effort; fields vary). */
export interface AnthropicError {
  error?: { message?: string } | string
  message?: string
}

/** One `url_citation` annotation payload inside an OpenRouter assistant message. */
export interface OpenRouterUrlCitation {
  url: string
  title?: string | null
  /** Excerpt of the cited page; mapped to the search source snippet. */
  content?: string | null
}

/** An `url_citation` entry inside `message.annotations[]`. */
export interface OpenRouterUrlCitationAnnotation {
  type: 'url_citation'
  url_citation: OpenRouterUrlCitation
}

/** Any annotation; only `url_citation` is consumed, unknown types are skipped. */
export type OpenRouterAnnotation = OpenRouterUrlCitationAnnotation | { type: string }

/** An OpenRouter Chat Completions assistant message (web plugin response). */
export interface OpenRouterMessage {
  content: string | null
  annotations?: OpenRouterAnnotation[]
}

/** One Chat Completions choice; only the first is consumed. */
export interface OpenRouterChoice {
  message?: OpenRouterMessage | null
}

/** OpenRouter Chat Completions response envelope for the web plugin. */
export interface OpenRouterChatCompletion {
  choices?: OpenRouterChoice[]
  error?: { message?: string } | string
}
