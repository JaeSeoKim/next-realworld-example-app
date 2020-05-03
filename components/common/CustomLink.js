import Link from "next/link";

const CustomLink = ({ className, href, as, children }) =>
  as ? (
    <Link href={href} as={as}>
      <a className={className}>{children}</a>
    </Link>
  ) : (
    <Link href={href}>
      <a className={className}>{children}</a>
    </Link>
  );

export default CustomLink;
