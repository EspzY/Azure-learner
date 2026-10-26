import manifest from '../../../public/icons/manifest.json';
import { nb } from '@/content/nb';

export const portalIconRegistry = manifest;

/** Missing mappings stay explicit; never substitute a generic service metaphor. */
export function resolvePortalIcon(kind: string) {
  const key = Object.hasOwn(manifest.aliases, kind)
    ? manifest.aliases[kind as keyof typeof manifest.aliases]
    : kind;
  return Object.hasOwn(manifest.assets, key)
    ? manifest.assets[key as keyof typeof manifest.assets]
    : undefined;
}

export function ServiceIcon({ kind, size = 16 }: { kind: string; size?: number }) {
  const asset = resolvePortalIcon(kind);
  if (!asset)
    return (
      <span
        className="portal-icon-missing"
        data-icon-missing={kind}
        title={nb.portalUi.missingIcon}
      >
        ?
      </span>
    );
  const src = `/icons/${asset.file}`;
  return asset.family === 'azure' ? (
    // Plain local SVG retains the source bytes, colours and viewBox.
    <img
      src={src}
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      className="portal-service-icon"
      data-icon={kind}
      data-icon-source={asset.family}
    />
  ) : (
    <span
      aria-hidden="true"
      className="portal-action-icon"
      data-icon={kind}
      data-icon-source={asset.family}
      style={{
        width: size,
        height: size,
        maskImage: `url("${src}")`,
        WebkitMaskImage: `url("${src}")`,
      }}
    />
  );
}
