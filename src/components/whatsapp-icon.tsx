
import { cn } from "@/lib/utils";

type WhatsAppIconProps = {
  className?: string;
  size?: number;
  title?: string;
};

export default function WhatsAppIcon({ className, size = 24, title = "WhatsApp" }: WhatsAppIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={cn("fill-current", className)}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={title}
      title={title}
    >
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.77.46 3.45 1.26 4.94l-1.38 5.25 5.37-1.38c1.44.77 3.06 1.23 4.79 1.23h.01c5.46 0 9.91-4.45 9.91-9.91s-4.45-9.91-9.91-9.91zM17.5 14.3c-.24-.12-1.44-.71-1.67-.79s-.38-.12-.53.12-.62.79-.76.95c-.14.18-.29.18-.53.06s-1.04-.38-1.98-1.22c-.74-.65-1.23-1.47-1.38-1.71s-.03-.35.09-.47c.11-.11.24-.29.35-.44s.18-.24.27-.41c.09-.18.04-.32-.02-.44s-.53-1.29-.73-1.76c-.2-.47-.41-.41-.56-.41h-.47c-.15 0-.38.06-.59.29s-.79.76-.79 1.85c0 1.09.81 2.15.92 2.31s1.47 2.23 3.58 3.18c.5.24.9.38 1.2.47s.59.15.81.09c.27-.06.88-.36 1-.71s.12-.65.09-.71c-.03-.06-.18-.09-.41-.21z" />
    </svg>
  );
}
