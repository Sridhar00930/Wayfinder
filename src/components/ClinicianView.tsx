import {
  avoidByCode,
  displayPhone,
  formatDialed,
  needByCode,
  needGroups,
  passportSpeech,
  telHref,
  type SharedPassport,
} from "../data/passport";
import { Icon } from "./Icon";
import { SpeakButton } from "./SpeakButton";

/**
 * What the person across the desk sees: large type, grouped by task,
 * written as actions. Used for scanned links, "show this screen", and print.
 */
export function ClinicianView({
  passport,
  headingLevel = 1,
  speakId = "passport-clinician",
}: {
  passport: SharedPassport;
  headingLevel?: 1 | 2;
  speakId?: string;
}) {
  const Heading = headingLevel === 1 ? "h1" : "h2";
  const Sub = headingLevel === 1 ? "h2" : "h3";
  const groups = needGroups
    .map((group) => ({
      group,
      items: passport.needs
        .map((code) => needByCode.get(code))
        .filter((need) => need && need.group === group.id),
    }))
    .filter(({ items }) => items.length > 0);
  const avoids = passport.avoids.map((code) => avoidByCode.get(code)).filter(Boolean);
  const contactHref = passport.contactPhone ? telHref(passport.contactPhone) : null;

  return (
    <article className="clinician-card" aria-labelledby={`${speakId}-title`}>
      <header className="clinician-head">
        <p className="clinician-eyebrow">
          <Icon name="id-card" size={18} />
          Access needs · shared by the patient
        </p>
        <Heading id={`${speakId}-title`} tabIndex={-1}>
          {passport.name ? (
            <>
              <bdi>{passport.name}</bdi>
              {passport.pronouns ? (
                <span className="clinician-pronouns">
                  {" "}
                  (<bdi>{passport.pronouns}</bdi>)
                </span>
              ) : null}
            </>
          ) : (
            "My access needs"
          )}
        </Heading>
        <p className="clinician-lede">Here is what helps me get care.</p>
        <p className="clinician-authorship">
          <strong>Written by the patient.</strong> This is not a medical order or a medical record. If
          anything here seems medical or unusual, check it with the patient and their care team.
        </p>
        <div className="clinician-actions print-hide">
          <SpeakButton id={speakId} text={passportSpeech(passport)} label="Read this aloud" />
        </div>
      </header>

      {groups.length > 0 ? (
        <section className="clinician-section" aria-labelledby={`${speakId}-do`}>
          <Sub id={`${speakId}-do`} className="clinician-section-title">
            <Icon name="check" size={22} />
            Please do
          </Sub>
          <div className="clinician-groups">
            {groups.map(({ group, items }) => (
              <div key={group.id} className="clinician-group">
                <p className="clinician-group-title">
                  <span className="clinician-group-icon">
                    <Icon name={group.icon} size={20} />
                  </span>
                  {group.staffTitle}
                </p>
                <ul className="clinician-list">
                  {items.map((need) => (
                    <li key={need!.code}>{need!.staff}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {avoids.length > 0 ? (
        <section className="clinician-section clinician-avoid" aria-labelledby={`${speakId}-dont`}>
          <Sub id={`${speakId}-dont`} className="clinician-section-title">
            <Icon name="close" size={22} />
            Please don’t
          </Sub>
          <ul className="clinician-list">
            {avoids.map((avoid) => (
              <li key={avoid!.code}>{avoid!.staff}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {passport.note ? (
        <section className="clinician-section" aria-labelledby={`${speakId}-note`}>
          <Sub id={`${speakId}-note`} className="clinician-section-title">
            <Icon name="chat" size={22} />
            In my words <span className="clinician-tag">written by the patient</span>
          </Sub>
          <p className="clinician-note">
            <bdi>{passport.note}</bdi>
          </p>
        </section>
      ) : null}

      {passport.contactPhone ? (
        <section className="clinician-section" aria-labelledby={`${speakId}-contact`}>
          <Sub id={`${speakId}-contact`} className="clinician-section-title">
            <Icon name="phone" size={22} />
            My person
          </Sub>
          <p className="clinician-note">
            {passport.contactName ? (
              <>
                <bdi>{passport.contactName}</bdi>:{" "}
              </>
            ) : null}
            {contactHref ? (
              <a href={contactHref}>{formatDialed(contactHref)}</a>
            ) : (
              <bdi>{displayPhone(passport.contactPhone)}</bdi>
            )}
          </p>
        </section>
      ) : null}

      <footer className="clinician-foot">
        <Icon name="lock" size={16} />
        <p>
          Shared with Wayfinder. This information is carried inside the link itself. It was not
          uploaded, and nothing is stored on a server. Ask me before you copy it into a record.
        </p>
      </footer>
    </article>
  );
}
