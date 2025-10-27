type PageHeaderProps = {
  title: string;
  subtitle?: string;
  className?: string;
};

export function PageHeader({ title, subtitle, className }: PageHeaderProps) {
  return (
    <div className={`mb-8 text-center ${className}`}>
      <h1 className="font-headline text-3xl font-bold tracking-tight text-primary md:text-4xl">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-2 text-lg text-muted-foreground">{subtitle}</p>
      )}
    </div>
  );
}
