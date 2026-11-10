# Microsoft Learn adapter — disabled design

Reviewed **2026-10-22**. No client, credentials, tokens, ingestion job or live API requests exist.

## Current platform

Authenticated base: `https://learn.microsoft.com/api/v1`. The developer reference currently requires `api-version=2023-11-01-preview`. Entra app-only access documents scope `https://learn.microsoft.com/.default`; delegated access lists `https://learn.microsoft.com/PublicContent.Read.All`. The legacy unauthenticated Catalog endpoint is not the target; Microsoft describes deprecation beginning June 2026. Revalidate exact resource paths and onboarding before implementation.

The Catalog supplies metadata/links, **not complete lessons to consume inside AzureLab**. API access does not grant redistribution rights. Never scrape lesson units, media or proprietary assessments. Original learning content stays independent of imported metadata.

References: [overview supplied in brief](https://learn.microsoft.com/en-us/training/support/integrations-learn-platform-api-catalog), [developer reference](https://learn.microsoft.com/en-us/training/support/integrations-learn-platform-api-catalog-endpoints-developer-reference), [authenticated quickstart](https://learn.microsoft.com/en-us/training/support/integrations-learn-platform-api-catalog-quickstart), [FAQ and terms guidance](https://learn.microsoft.com/en-us/training/support/integrations-learn-platform-api-faq).

## Proposed interfaces

```ts
interface LearnCatalogAdapter {
  // Server-only; never exposes authentication to the browser.
  listMetadata(query: { locale: string; updatedAfter?: string; cursor?: string }): Promise<{
    items: LearnMetadata[];
    nextCursor?: string;
    fetchedAt: string;
  }>;
}
interface LearnMetadata {
  provider: 'microsoft-learn';
  uid: string;
  type: 'module' | 'learning-path' | 'certification' | 'course';
  title: string;
  canonicalUrl: string;
  locale: string;
  providerUpdatedAt?: string;
  apiVersion: string;
  fetchedAt: string;
  sourceId: string;
}
interface ContentSource {
  id: string;
  publisher: string;
  url: string;
  attribution: string;
  licensing: {
    status: 'reference-only' | 'permission-validated' | 'pending';
    termsUrl: string;
    reviewedAt: string;
    reviewer: string;
  };
  sourceVersion: string;
  reviewedAt: string;
  competencyRefs: { competencyId: string; revision: string }[];
  credentialMappingIds: string[]; // separate versioned overlay, not exam codes in core content
}
```

Future modules reference metadata UIDs rather than importing lesson bodies. Provider completion is not proof of AzureLab mastery. Returned descriptions/images/URLs do not imply unrestricted reuse permissions.

Phase 1A's [learning journey](LEARNING_JOURNEY.md#certification-is-a-versioned-overlay) and [source register](SOURCE_REGISTER.md) replace the earlier three-exam mapping sketch with a credential-neutral content reference and a separately reviewed overlay. This is a change to the proposed content architecture, not a new API client or authentication validation.

## Activation prerequisites

1. Explicit owner authorization, identity setup and current onboarding/terms validation.
2. Field-level attribution/storage-rights review with date/reviewer; verify actual schemas and API version using authorized test responses.
3. Default-off server capability with least-privilege credentials outside browser/repository. No reserved environment variables in Phase 0.
4. Validated payloads and allowlisted HTTPS links. Handle pagination, deletions, locale fallback, timeouts, token errors and bounded `429` backoff. Cache only as permitted; expose timestamps.
5. Fixture tests first; original learning remains available if access fails or is revoked. No scraping fallback.

Some reference pages display authorization notices despite readable sections. This research is documentation review, not a successful authenticated API call or validated legal permission. Authentication and terms must be validated before activation.
