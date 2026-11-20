interface FooterCopyrightProps {
  siteTitle: string;
  copyright?: string;
}

export function FooterCopyright({
  siteTitle,
  copyright,
}: FooterCopyrightProps): React.JSX.Element {
  return (
    <p>
      {copyright ?? `© 2026 ${siteTitle}. Seluruh hak cipta dilindungi.`}
    </p>
  );
}
