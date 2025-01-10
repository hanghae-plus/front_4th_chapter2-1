interface HeadingProps {
  label: string;
}

export function Heading({ label }: HeadingProps) {
  return `
    <h1 class="text-2xl font-bold mb-4">${label}</h1>
  `;
}
