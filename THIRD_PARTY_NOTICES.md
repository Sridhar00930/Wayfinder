# Third-party notices

Wayfinder uses or adapts the following work.

## QR Code generator (src/lib/qr.ts)

The QR encoder's structure is adapted from the QR Code generator library by
Project Nayuki (https://www.nayuki.io/page/qr-code-generator-library),
used under the MIT License:

> Copyright (c) Project Nayuki. (MIT License)
>
> Permission is hereby granted, free of charge, to any person obtaining a copy of
> this software and associated documentation files (the "Software"), to deal in
> the Software without restriction, including without limitation the rights to
> use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
> the Software, and to permit persons to whom the Software is furnished to do so,
> subject to the following conditions:
>
> - The above copyright notice and this permission notice shall be included in
>   all copies or substantial portions of the Software.
> - The Software is provided "as is", without warranty of any kind, express or
>   implied, including but not limited to the warranties of merchantability,
>   fitness for a particular purpose and noninfringement. In no event shall the
>   authors or copyright holders be liable for any claim, damages or other
>   liability, whether in an action of contract, tort or otherwise, arising from,
>   out of or in connection with the Software or the use or other dealings in the
>   Software.

"QR Code" is a registered trademark of DENSO WAVE INCORPORATED.

## Fonts

- **Atkinson Hyperlegible**, by the Braille Institute of America, under the SIL
  Open Font License 1.1.
- **Fraunces**, by Undercase Type, under the SIL Open Font License 1.1.

Both are loaded from Google Fonts. That is the only request the app makes to
another website. To avoid it, self-host the fonts and remove the
`fonts.googleapis.com` links from `index.html`.

## Libraries

- **React** and **React DOM**: MIT License, Copyright (c) Meta Platforms, Inc. and affiliates.
- **Vite**, **@vitejs/plugin-react**: MIT License.
- **TypeScript**: Apache License 2.0, Microsoft Corporation.

## Ideas and terms

- "Spoon theory" is a metaphor for limited energy, written by Christine
  Miserandino (butyoudontlooksick.com). Wayfinder references it with credit and
  is not affiliated with her.
- The 988 Suicide & Crisis Lifeline and 911 are public services. Wayfinder is not
  affiliated with them or with any clinic, insurer, or government agency named
  or described in the app.

## Artwork

The dragon and compass illustrations in `src/components/Dragons.tsx` and all
icons in `src/components/Icon.tsx` were drawn for this project.
