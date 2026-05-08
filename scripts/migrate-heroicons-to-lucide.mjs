/**
 * One-shot migration: @heroicons/vue → lucide-vue-next
 * Run: node scripts/migrate-heroicons-to-lucide.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

/** Heroicons component name → lucide-vue-next export name */
const ICON_MAP = {
    DocumentMagnifyingGlassIcon: 'FileSearch',
    ChatBubbleLeftEllipsisIcon: 'MessageSquare',
    WrenchScrewdriverIcon: 'Wrench',
    DocumentCurrencyEuroIcon: 'Euro',
    ClipboardDocumentListIcon: 'ClipboardList',
    ClipboardDocumentIcon: 'ClipboardList',
    QuestionMarkCircleIcon: 'CircleHelp',
    EllipsisHorizontalIcon: 'Ellipsis',
    EllipsisVerticalIcon: 'EllipsisVertical',
    InformationCircleIcon: 'Info',
    ChevronUpDownIcon: 'ChevronsUpDown',
    MagnifyingGlassIcon: 'Search',
    ArrowsUpDownIcon: 'ArrowUpDown',
    AcademicCapIcon: 'GraduationCap',
    BuildingOffice2Icon: 'Building2',
    BuildingOfficeIcon: 'Building2',
    CalendarDaysIcon: 'Calendar',
    CheckBadgeIcon: 'BadgeCheck',
    CheckCircleIcon: 'CircleCheck',
    IdentificationIcon: 'IdCard',
    InboxArrowDownIcon: 'Inbox',
    PaperAirplaneIcon: 'Send',
    PencilSquareIcon: 'SquarePen',
    Squares2X2Icon: 'LayoutGrid',
    TableCellsIcon: 'Table',
    UserCircleIcon: 'CircleUser',
    QueueListIcon: 'ListOrdered',
    GlobeAltIcon: 'Globe',
    MegaphoneIcon: 'Megaphone',
    ChartBarIcon: 'BarChart3',
    SquaresPlusIcon: 'LayoutGrid',
    DocumentTextIcon: 'FileText',
    ChevronDoubleLeftIcon: 'ChevronsLeft',
    ChevronDoubleRightIcon: 'ChevronsRight',
    ShieldExclamationIcon: 'ShieldAlert',
    ShieldCheckIcon: 'ShieldCheck',
    ChatBubbleOvalLeftEllipsisIcon: 'MessageSquare',
    ListBulletIcon: 'List',
    Cog6ToothIcon: 'Cog',
    Cog8ToothIcon: 'Cog',
    PlayCircleIcon: 'CirclePlay',
    ArrowRightCircleIcon: 'CircleArrowRight',
    ArrowLeftIcon: 'ArrowLeft',
    ArrowRightIcon: 'ArrowRight',
    ArrowPathIcon: 'RefreshCw',
    ArrowDownTrayIcon: 'Download',
    ChevronDownIcon: 'ChevronDown',
    ChevronRightIcon: 'ChevronRight',
    ChevronUpIcon: 'ChevronUp',
    ChevronLeftIcon: 'ChevronLeft',
    LockClosedIcon: 'Lock',
    LockOpenIcon: 'LockOpen',
    EyeSlashIcon: 'EyeOff',
    EnvelopeIcon: 'Mail',
    FaceFrownIcon: 'Frown',
    BellAlertIcon: 'BellRing',
    PaperClipIcon: 'Paperclip',
    PhoneIcon: 'Phone',
    UserPlusIcon: 'UserPlus',
    TrashIcon: 'Trash2',
    PencilIcon: 'Pencil',
    Bars3Icon: 'Menu',
    StarIcon: 'Star',
    XCircleIcon: 'XCircle',
    XMarkIcon: 'X',
    PlusIcon: 'Plus',
    EyeIcon: 'Eye',
    MapPinIcon: 'MapPin',
    CheckIcon: 'Check',
    HomeIcon: 'Home',
    UserIcon: 'User',
    UsersIcon: 'Users',
    UserGroupIcon: 'Users',
    MapIcon: 'Map',
    FunnelIcon: 'Filter',
    ClockIcon: 'Clock',
    InboxIcon: 'Inbox',
    PowerIcon: 'Power',
    PlusCircleIcon: 'CirclePlus',
    SparklesIcon: 'Sparkles',
    BriefcaseIcon: 'Briefcase',
    CalendarIcon: 'Calendar',
    LinkIcon: 'Link',
    ShoppingBagIcon: 'ShoppingBag',
    HeartIcon: 'Heart',
    ArrowTrendingUpIcon: 'TrendingUp',
    CursorArrowRaysIcon: 'MousePointerClick',
    CurrencyEuroIcon: 'Euro',
    CurrencyDollarIcon: 'DollarSign',
    ScaleIcon: 'Scale',
    TicketIcon: 'Ticket',
    CreditCardIcon: 'CreditCard',
    FilmIcon: 'Film',
    PhotoIcon: 'Image',
    VideoCameraIcon: 'Video',
    MusicalNoteIcon: 'Music',
    SpeakerWaveIcon: 'Volume2',
    RssIcon: 'Rss',
    SignalIcon: 'Signal',
    WifiIcon: 'Wifi',
    DevicePhoneMobileIcon: 'Smartphone',
    ComputerDesktopIcon: 'Monitor',
    PrinterIcon: 'Printer',
    ArchiveBoxIcon: 'Archive',
    FolderIcon: 'Folder',
    FolderOpenIcon: 'FolderOpen',
    DocumentIcon: 'File',
    DocumentDuplicateIcon: 'Copy',
    ClipboardIcon: 'Clipboard',
    BookOpenIcon: 'BookOpen',
    NewspaperIcon: 'Newspaper',
};

const heroNames = Object.keys(ICON_MAP).sort((a, b) => b.length - a.length);

function walk(dir, acc = []) {
    for (const name of fs.readdirSync(dir)) {
        const p = path.join(dir, name);
        const st = fs.statSync(p);
        if (st.isDirectory()) {
            if (name === 'node_modules' || name === '.nuxt' || name === '.output') continue;
            walk(p, acc);
        }
        else if (name.endsWith('.vue')) acc.push(p);
    }
    return acc;
}

function migrateFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (!content.includes('@heroicons/vue')) return false;

    const usedLucide = new Set();

    const registerLucide = (name) => {
        if (name && /^[A-Z]/.test(name)) usedLucide.add(name);
    };

    // Aliased imports (must run before generic replacements)
    const aliasPairs = [
        [/StarIcon as StarIconOutline/g, 'Star as StarOutline'],
        [/StarIcon as StarIconSolid/g, 'Star as StarSolid'],
        [/InformationCircleIcon as InfoIcon/g, 'Info as InfoIcon'],
    ];
    for (const [re, rep] of aliasPairs) {
        if (re.test(content)) {
            content = content.replace(re, rep);
            const lucideName = rep.split(' as ')[0].trim();
            registerLucide(lucideName);
        }
    }

    // Template / script: rename alias usages
    content = content.replace(/\bStarIconOutline\b/g, 'StarOutline');
    content = content.replace(/\bStarIconSolid\b/g, 'StarSolid');
    registerLucide('Star');

    for (const h of heroNames) {
        const lucide = ICON_MAP[h];
        const re = new RegExp(`\\b${h}\\b`, 'g');
        if (re.test(content)) {
            content = content.replace(re, lucide);
            registerLucide(lucide);
        }
    }

    // Remove all @heroicons imports (single or multi-line)
    content = content.replace(
        /import\s*\{[\s\S]*?\}\s*from\s*['"]@heroicons\/vue\/[^'"]+['"]\s*;?\s*/g,
        '',
    );

    // Merge or add lucide import
    const lucideNames = [...usedLucide].sort();
    if (lucideNames.length === 0) return false;

    const lucideLine = `import { ${lucideNames.join(', ')} } from 'lucide-vue-next';\n`;

    const existingLucide = /import\s*\{([^}]+)\}\s*from\s*['"]lucide-vue-next['"]/;
    const m = content.match(existingLucide);
    if (m) {
        const existing = m[1]
            .split(',')
            .map(s => s.trim())
            .filter(Boolean);
        const merged = [...new Set([...existing, ...lucideNames])].sort();
        content = content.replace(
            existingLucide,
            `import { ${merged.join(', ')} } from 'lucide-vue-next'`,
        );
    }
    else {
        const scriptMatch = content.match(/<script[^>]*>/);
        if (scriptMatch) {
            const insertAt = scriptMatch.index + scriptMatch[0].length;
            content = content.slice(0, insertAt) + '\n' + lucideLine + content.slice(insertAt);
        }
    }

    fs.writeFileSync(filePath, content);
    return true;
}

const files = walk(path.join(ROOT, 'app')).concat(walk(path.join(ROOT, 'backup')));
let n = 0;
for (const f of files) {
    if (migrateFile(f)) {
        n++;
        console.log('migrated', path.relative(ROOT, f));
    }
}
console.log('Done. Files migrated:', n);
