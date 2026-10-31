import { useMemo } from "react";
import { encodeQr, qrPath } from "../lib/qr";

/** Renders a QR as crisp SVG. Always dark-on-white, even in high contrast, so it scans. */
export function QrCode({
  value,
  label,
  size = 240,
  describedBy,
}: {
  value: string;
  label: string;
  size?: number;
  describedBy?: string;
}) {
  const qr = useMemo(() => {
    try {
      return encodeQr(value, "M");
    } catch {
      return null;
    }
  }, [value]);

  if (!qr) {
    return <p className="field-help">This passport is too long for a QR code. Shorten your note.</p>;
  }

  const dim = qr.size + 8;
  return (
    <svg
      className="qr-code"
      role="img"
      aria-label={label}
      aria-describedby={describedBy}
      width={size}
      height={size}
      viewBox={`0 0 ${dim} ${dim}`}
      shapeRendering="crispEdges"
    >
      <rect width={dim} height={dim} fill="#ffffff" />
      <path d={qrPath(qr)} fill="#000000" />
    </svg>
  );
}
