import { useEffect, useRef, useState } from "react";
import { PageHeader } from "../components/PageHeader";
import { SpeakButton } from "../components/SpeakButton";
import { Icon } from "../components/Icon";
import {
  categories,
  categoryLabel,
  terms,
  type CategoryId,
} from "../data/glossary";

type Filter = "all" | CategoryId;

export function Glossary() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      // Ctrl+K (Cmd+K on Mac) jumps to search. A modifier key avoids
      // accidental activation by speech input or a single stray key (WCAG 2.1.4).
      if (event.key.toLowerCase() !== "k" || !(event.ctrlKey || event.metaKey) || event.altKey) {
        return;
      }
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName) ||
          target.isContentEditable)
      ) {
        return;
      }
      event.preventDefault();
      searchRef.current?.focus();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const normalized = query.trim().toLowerCase();
  const visible = terms
    .filter((term) => filter === "all" || term.category === filter)
    .filter((term) => {
      if (!normalized) return true;
      return (
        term.term.toLowerCase().includes(normalized) ||
        term.plain.toLowerCase().includes(normalized) ||
        term.matters.toLowerCase().includes(normalized) ||
        term.ask.toLowerCase().includes(normalized)
      );
    })
    .sort((a, b) => a.term.localeCompare(b.term));

  const countMessage = normalized || filter !== "all"
    ? `${visible.length} of ${terms.length} terms shown.`
    : `Showing all ${terms.length} terms.`;

  return (
    <>
      <PageHeader
        eyebrow="Plain language"
        title="Plain words for a complicated system."
        lede="Each term gets three things: what it means, why it matters, and what to ask. No jargon explaining jargon."
      />

      <div className="toolbar">
        <div className="search-field">
          <Icon name="search" size={19} className="search-icon" />
          <label htmlFor="term-search" className="sr-only">
            Search medical and insurance terms
          </label>
          <input
            ref={searchRef}
            id="term-search"
            type="search"
            className="search-input"
            placeholder="Try “deductible” or “biopsy”"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <span className="kbd-hint" aria-hidden="true">
            <kbd>Ctrl</kbd> <kbd>K</kbd>
          </span>
        </div>

        <div className="chip-row" role="group" aria-label="Filter by category">
          <button
            type="button"
            className="chip"
            aria-pressed={filter === "all"}
            onClick={() => setFilter("all")}
          >
            All terms
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              className="chip"
              aria-pressed={filter === category.id}
              onClick={() => setFilter(category.id)}
            >
              {category.label}
            </button>
          ))}
        </div>

        <p className="result-count" role="status" aria-live="polite">
          {countMessage}
        </p>
      </div>

      {visible.length === 0 ? (
        <div className="empty-state">
          <h2>No match for “{query}”.</h2>
          <p>
            Try a simpler word, check the spelling, or clear the category filter.
            You can also ask your provider to explain the term in writing.
          </p>
          <button
            type="button"
            className="button button-secondary"
            onClick={() => {
              setQuery("");
              setFilter("all");
              searchRef.current?.focus();
            }}
          >
            Clear search and filters
          </button>
        </div>
      ) : (
        <ul className="term-list">
          {visible.map((term) => (
            <li key={term.term}>
              <article className="term-card">
                <div className="term-card-head">
                  <div>
                    <h2 className="term-name">{term.term}</h2>
                    <p className="term-cat">{categoryLabel(term.category)}</p>
                  </div>
                  <SpeakButton
                    id={`term-${term.term}`}
                    label="Read term"
                    context={term.term}
                    text={`${term.term}. ${term.plain} Why it matters: ${term.matters} Ask: ${term.ask}`}
                  />
                </div>
                <p className="term-plain">{term.plain}</p>
                <p className="term-matters">
                  <strong>Why it matters.</strong> {term.matters}
                </p>
                <p className="term-ask">
                  <span className="ask-label">Ask this</span>
                  {term.ask}
                </p>
              </article>
            </li>
          ))}
        </ul>
      )}

      <p className="journey-footnote">
        <Icon name="book" size={16} />
        Definitions are general information, not medical or legal advice. Your
        plan and provider may use a term differently — ask them to explain it.
      </p>
    </>
  );
}
