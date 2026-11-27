const buttonBaseClasses =
  "h-[38px] cursor-pointer items-center justify-center font-sans text-[14px] font-normal text-white transition-transform duration-300 hover:-translate-y-[5px] [clip-path:polygon(12px_0,100%_0,100%_calc(100%_-_12px),calc(100%_-_12px)_100%,0_100%,0_12px)]";

const buttonVariantClasses = {
  main: "bg-main",
  secondary: "bg-grey",
};

const buttonSizeClasses = {
  regular: "w-[101px]",
  wide: "w-[170px]",
};

export default function Button({
  onClick,
  children,
  className = "",
  href,
  size = "regular",
  variant = "main",
}) {
  const classes = [
    buttonBaseClasses,
    href ? "inline-flex" : "flex",
    buttonSizeClasses[size],
    buttonVariantClasses[variant],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
