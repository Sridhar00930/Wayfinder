import { useState } from "react";
import { PageHeader } from "../components/PageHeader";
import { SpeakButton } from "../components/SpeakButton";
import { focusLater } from "../lib/focus";
import { Icon } from "../components/Icon";
import {
  accessTags,
  providers,
  tagLabel,
  type AccessTagId,
} from "../data/providers";

export function FindCare() {
  const [query, setQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<AccessTagId[]>([]);

  const normalized = query.trim().toLowerCase();

  const toggleTag = (id: AccessTagId) => {
    setSelectedTags((current) =>
      current.includes(id)
        ? current.filter((tag) => tag !== id)
        : [...current, id],
    );
  };

  const visible = providers.filter((provider) => {
    const matchesTags = selectedTags.every((tag) =>
      provider.tags.includes(tag),
    );
    if (!matchesTags) return false;
    if (!normalized) return true;
    const haystack = [
      provider.name,
      provider.kind,
      provider.area,
      provider.note,
      provider.ask,
      ...provider.tags.map(tagLabel),
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(normalized);
  });

  const clearAll = () => {
    focusLater("#care-search");
    setSelectedTags([]);
    setQuery("");
  };

  return (
    <>
      <PageHeader
        eyebrow="Find care · Sample directory"
        title="Care that fits your body, not the other way around."
        lede="Filter for the access features that matter to you. Then call and confirm — online accessibility information is often out of date."
      >
        <p className="sample-badge">
          <Icon name="spark" size={16} />
          Demo data: these Gwinnett County clinics are fictional, built to show
          how the filters work.
        </p>
      </PageHeader>

      <div className="filter-panel">
        <div className="search-field">
          <Icon name="search" size={19} className="search-icon" />
          <label htmlFor="care-search" className="sr-only">
            Search sample clinics
          </label>
          <input
            id="care-search"
            type="search"
            className="search-input"
            placeholder="Search by clinic, type, or city"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>

        <fieldset className="filter-fieldset">
          <legend>Access needs</legend>
          <div className="filter-chips">
            {accessTags.map((tag) => (
              <label key={tag.id} className="filter-chip">
                <input
                  type="checkbox"
                  checked={selectedTags.includes(tag.id)}
                  onChange={() => toggleTag(tag.id)}
                />
                <span>{tag.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="filter-foot">
          <p className="result-count" role="status" aria-live="polite">
            Showing {visible.length} of {providers.length} sample clinics.
          </p>
          {selectedTags.length > 0 || query ? (
            <button
              type="button"
              className="clear-filters"
              onClick={clearAll}
            >
              Clear filters
            </button>
          ) : null}
        </div>
      </div>

      <details className="details-panel">
        <summary>What to ask before you book</summary>
        <ul className="check-list">
          <li>Is the entrance step-free, and are the doors automatic?</li>
          <li>
            How wide are the exam room door and the restroom door? Is there a
            turning space for a wheelchair?
          </li>
          <li>
            Do you have a height-adjustable exam table? What is its lowest
            height?
          </li>
          <li>
            Is there a transfer lift, and are staff trained to help me transfer
            safely?
          </li>
          <li>
            Can you book a qualified ASL interpreter or CART at no cost to me?
          </li>
          <li>
            Can I wait somewhere quiet and be notified by text instead of my
            name being called?
          </li>
          <li>
            Can I bring my service animal, and where can it stay during an exam
            or procedure?
          </li>
          <li>Can I book extra time, or the first or last appointment?</li>
          <li>
            Who else will bill me — the lab, the anesthesiologist, the imaging
            center?
          </li>
        </ul>
      </details>

      {visible.length === 0 ? (
        <div className="empty-state">
          <h2>No sample clinic matches all of those filters.</h2>
          <p>
            Try removing one filter. In real life, you can also call the
            clinic's ADA coordinator and ask whether they can meet your needs
            even if it is not listed online.
          </p>
          <button
            type="button"
            className="button button-secondary"
            onClick={clearAll}
          >
            Clear filters
          </button>
        </div>
      ) : (
        <ul className="provider-list">
          {visible.map((provider) => (
            <li key={provider.id}>
              <article className="provider-card">
                <div className="provider-head">
                  <div>
                    <h2 className="provider-name">{provider.name}</h2>
                    <p className="provider-meta">
                      {provider.kind} · {provider.area} · {provider.distance}
                    </p>
                  </div>
                  <span className="verified">
                    Sample · not verified
                  </span>
                </div>
                <p className="provider-note">{provider.note}</p>
                <ul className="tag-list" aria-label="Access features">
                  {provider.tags.map((tag) => (
                    <li key={tag} className="tag">
                      {tagLabel(tag)}
                    </li>
                  ))}
                </ul>
                <p className="provider-ask">
                  <span className="ask-label">Ask when you call</span>
                  “{provider.ask}”
                </p>
                <SpeakButton
                  id={`provider-${provider.id}`}
                  label="Read clinic details"
                  context={provider.name}
                  text={`${provider.name}. ${provider.kind} in ${provider.area}. ${provider.note} Access features: ${provider.tags
                    .map(tagLabel)
                    .join(", ")}. Ask when you call: ${provider.ask}`}
                />
              </article>
            </li>
          ))}
        </ul>
      )}

      <p className="journey-footnote">
        <Icon name="book" size={16} />
        Sample data for a demo, not a recommendation. Before any real
        appointment, call the clinic and confirm the specific features you need.
      </p>
    </>
  );
}
