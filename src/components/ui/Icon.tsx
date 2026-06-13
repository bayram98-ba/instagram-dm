type IconProps = { size?: number; className?: string };
const S = ({ size = 20, className = "", children }: IconProps & { children: React.ReactNode }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor"
    strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {children}
  </svg>
);

export function IconHome(p: IconProps) { return <S {...p}><path d="M3 8.5 10 3l7 5.5V17a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8.5Z"/><path d="M7 18v-6h6v6"/></S>; }
export function IconChat(p: IconProps) { return <S {...p}><path d="M2 5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6l-4 3V5Z"/></S>; }
export function IconOrders(p: IconProps) { return <S {...p}><path d="M6 2h8l2 4v11a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6L6 2Z"/><path d="M3 6h14"/><path d="M10 11v4M8 13h4"/></S>; }
export function IconCatalog(p: IconProps) { return <S {...p}><rect x="2" y="2" width="7" height="7" rx="1.5"/><rect x="11" y="2" width="7" height="7" rx="1.5"/><rect x="2" y="11" width="7" height="7" rx="1.5"/><rect x="11" y="11" width="7" height="7" rx="1.5"/></S>; }
export function IconSettings(p: IconProps) { return <S {...p}><circle cx="10" cy="10" r="2.5"/><path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.22 4.22l1.42 1.42M14.36 14.36l1.42 1.42M4.22 15.78l1.42-1.42M14.36 5.64l1.42-1.42"/></S>; }
export function IconInstagram(p: IconProps) { return <S {...p}><rect x="2" y="2" width="16" height="16" rx="5"/><circle cx="10" cy="10" r="3.5"/><circle cx="14.5" cy="5.5" r=".8" fill="currentColor" stroke="none"/></S>; }
export function IconSparkle(p: IconProps) { return <S {...p}><path d="M10 2 11.5 7.5 17 9 11.5 10.5 10 16 8.5 10.5 3 9 8.5 7.5 10 2Z"/><path d="M16 14l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2Z" strokeWidth="1.3"/></S>; }
export function IconSend(p: IconProps) { return <S {...p}><path d="M3 10 17 3 10 17 9.3 11.3 3 10Z"/><path d="M9.3 11.3 17 3"/></S>; }
export function IconEdit(p: IconProps) { return <S {...p}><path d="M14.5 2.5a2.12 2.12 0 0 1 3 3L6 17H3v-3L14.5 2.5Z"/></S>; }
export function IconCheck(p: IconProps) { return <S {...p}><path d="M4 10.5 8.5 15 16 6"/></S>; }
export function IconCheckCircle(p: IconProps) { return <S {...p}><circle cx="10" cy="10" r="8"/><path d="M6.5 10.5 9 13 13.5 7.5"/></S>; }
export function IconChevronR(p: IconProps) { return <S {...p}><path d="M7.5 5 12.5 10 7.5 15"/></S>; }
export function IconChevronL(p: IconProps) { return <S {...p}><path d="M12.5 5 7.5 10 12.5 15"/></S>; }
export function IconChevronD(p: IconProps) { return <S {...p}><path d="M5 7.5 10 12.5 15 7.5"/></S>; }
export function IconSearch(p: IconProps) { return <S {...p}><circle cx="9" cy="9" r="6"/><path d="M13.5 13.5 17 17"/></S>; }
export function IconPlus(p: IconProps) { return <S {...p}><path d="M10 3v14M3 10h14"/></S>; }
export function IconDownload(p: IconProps) { return <S {...p}><path d="M10 3v10M6 9l4 4 4-4"/><path d="M3 17h14"/></S>; }
export function IconPhone(p: IconProps) { return <S {...p}><path d="M5 2h4l1.5 3.5-2 2a10 10 0 0 0 4 4l2-2L18 11v4c0 1.1-.9 2-2 2A15 15 0 0 1 3 4c0-1.1.9-2 2-2Z"/></S>; }
export function IconPin(p: IconProps) { return <S {...p}><path d="M10 17s-6-5-6-9a6 6 0 1 1 12 0c0 4-6 9-6 9Z"/><circle cx="10" cy="8" r="2"/></S>; }
export function IconTruck(p: IconProps) { return <S {...p}><rect x="1" y="5" width="11" height="10" rx="1"/><path d="M12 8h3.5L18 11v4h-6V8Z"/><circle cx="5" cy="17" r="1.5"/><circle cx="15" cy="17" r="1.5"/></S>; }
export function IconCard(p: IconProps) { return <S {...p}><rect x="2" y="5" width="16" height="11" rx="2"/><path d="M2 9h16"/><path d="M6 13h2"/></S>; }
export function IconCash(p: IconProps) { return <S {...p}><rect x="2" y="6" width="16" height="10" rx="2"/><circle cx="10" cy="11" r="2.5"/><path d="M6 9v4M14 9v4"/></S>; }
export function IconWallet(p: IconProps) { return <S {...p}><path d="M3 6a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6Z"/><path d="M13 11a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" fill="currentColor" stroke="none"/><path d="M13 6V4"/></S>; }
export function IconX(p: IconProps) { return <S {...p}><path d="M5 5 15 15M15 5 5 15"/></S>; }
export function IconClock(p: IconProps) { return <S {...p}><circle cx="10" cy="10" r="8"/><path d="M10 6v4l3 2"/></S>; }
export function IconTrend(p: IconProps) { return <S {...p}><path d="M3 13 7 9l3 3 4-5 3 3"/><path d="M14 7h3v3"/></S>; }
export function IconBell(p: IconProps) { return <S {...p}><path d="M10 2a6 6 0 0 1 6 6c0 3 1 4 1.5 5H2.5C3 12 4 11 4 8a6 6 0 0 1 6-6Z"/><path d="M8 17a2 2 0 0 0 4 0"/></S>; }
export function IconUser(p: IconProps) { return <S {...p}><circle cx="10" cy="6" r="3.5"/><path d="M2 18c0-4 3.6-7 8-7s8 3 8 7"/></S>; }
export function IconFilter(p: IconProps) { return <S {...p}><path d="M3 5h14M6 10h8M9 15h2"/></S>; }
export function IconMore(p: IconProps) { return <S {...p}><circle cx="5" cy="10" r="1" fill="currentColor" stroke="none"/><circle cx="10" cy="10" r="1" fill="currentColor" stroke="none"/><circle cx="15" cy="10" r="1" fill="currentColor" stroke="none"/></S>; }
export function IconBox(p: IconProps) { return <S {...p}><path d="M10 2 18 6v8l-8 4L2 14V6l8-4Z"/><path d="M2 6l8 4 8-4M10 10v8"/></S>; }
export function IconBag(p: IconProps) { return <S {...p}><path d="M6 7V5a4 4 0 0 1 8 0v2"/><rect x="2" y="7" width="16" height="12" rx="2"/></S>; }
export function IconLock(p: IconProps) { return <S {...p}><rect x="4" y="9" width="12" height="9" rx="2"/><path d="M7 9V7a3 3 0 0 1 6 0v2"/><circle cx="10" cy="14" r="1.5" fill="currentColor" stroke="none"/></S>; }
export function IconTag(p: IconProps) { return <S {...p}><path d="M3 3h6l8 8-6 6L3 9V3Z"/><circle cx="7" cy="7" r="1.5" fill="currentColor" stroke="none"/></S>; }
export function IconRefresh(p: IconProps) { return <S {...p}><path d="M3 10a7 7 0 0 1 13-3.5"/><path d="M17 10a7 7 0 0 1-13 3.5"/><path d="M15 3l1 3.5-3.5 1"/><path d="M5 17l-1-3.5 3.5-1"/></S>; }
export function IconGrid(p: IconProps) { return <S {...p}><rect x="2" y="2" width="6" height="6" rx="1"/><rect x="12" y="2" width="6" height="6" rx="1"/><rect x="2" y="12" width="6" height="6" rx="1"/><rect x="12" y="12" width="6" height="6" rx="1"/></S>; }
export function IconMoon(p: IconProps) { return <S {...p}><path d="M17 12A8 8 0 0 1 8 3a7 7 0 1 0 9 9Z"/></S>; }
export function IconInfo(p: IconProps) { return <S {...p}><circle cx="10" cy="10" r="8"/><path d="M10 6v.5M10 9v5"/></S>; }
export function IconImage(p: IconProps) { return <S {...p}><rect x="2" y="3" width="16" height="14" rx="2"/><circle cx="7" cy="8" r="1.5"/><path d="M2 15l4-4 3 3 3-3 6 5"/></S>; }
export function IconStar(p: IconProps) { return <S {...p}><path d="M10 2l2 5.5 5.5.5-4 4 1 5.5L10 15l-4.5 2.5 1-5.5-4-4 5.5-.5L10 2Z"/></S>; }
