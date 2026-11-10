import { useId } from 'react';

// Owner-supplied landing SVG. Paths, transforms, fills and viewBox stay exact.
export function BifrostBrandMark({ className, title }: { className?: string; title?: string }) {
  const baseId = `bifrost-base-${useId()}`;
  return (
    <svg
      className={className}
      viewBox="0 0 1024 1024"
      xmlns="http://www.w3.org/2000/svg"
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {title && <title>{title}</title>}
      <defs>
        <path
          id={baseId}
          d="M206 584L482 425C500 414 524 414 542 425L818 584C835 594 835 612 818 622L542 781C524 792 500 792 482 781L206 622C189 612 189 594 206 584Z"
        />
      </defs>
      <use href={`#${baseId}`} transform="translate(-28 48)" fill="#5016a7" />
      <use href={`#${baseId}`} transform="translate(-14 24)" fill="#631cce" />
      <use href={`#${baseId}`} fill="#8f52ed" />
      <path d="M270 619L512 479L754 619L512 759L270 619Z" fill="#631cce" />
      <path d="M270 473L512 334V479L270 619V473Z" fill="#bfa3ff" />
      <path d="M512 334L754 473V619L512 479V334Z" fill="#8f52ed" />
      <path d="M241 473V665L512 822V630L241 473Z" fill="#631cce" />
      <path d="M783 473V665L512 822V630L783 473Z" fill="#5016a7" />
      <path d="M270 473V619L512 759V613L270 473Z" fill="#8f52ed" />
      <path d="M754 473V619L512 759V613L754 473Z" fill="#7a3ddb" />
      <path
        fillRule="evenodd"
        d="M241 473L512 317L783 473L512 630L241 473ZM270 473L512 613L754 473L512 334L270 473Z"
        fill="#ad8aff"
      />
      <path
        d="M395 299L504 236C509 233 515 233 520 236L629 299C635 302 635 310 629 313L520 376C515 379 509 379 504 376L395 313C389 310 389 302 395 299Z"
        fill="#48c8f5"
      />
      <path
        d="M391 306V439C391 445 394 449 399 452L504 513C509 516 512 514 512 508V378L391 306Z"
        fill="#1599ed"
      />
      <path
        d="M633 306V439C633 445 630 449 625 452L520 513C515 516 512 514 512 508V378L633 306Z"
        fill="#0078d4"
      />
    </svg>
  );
}
