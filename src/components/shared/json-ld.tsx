type JsonLdPayload = Record<string, unknown> | Record<string, unknown>[] | null;

interface JsonLdProps {
  data: JsonLdPayload;
}

export function JsonLd({ data }: JsonLdProps): React.JSX.Element | null {
  if (!data || (Array.isArray(data) && data.length === 0)) {
    return null;
  }

  const serialized = JSON.stringify(data).replaceAll("<", "\\u003c");

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serialized }}
    />
  );
}
