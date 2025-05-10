'use client';

import { useMemo, useState } from 'react';
import {
  Calendar,
  DollarSign,
  Mail,
  MapPin,
  Phone,
  Plus,
  UserPlus,
  Users,
} from 'lucide-react';
import DataTable from '@/components/ui/data-table';
import MetricCard from '@/components/ui/metric-card';
import FormModal from '@/components/ui/form-modal';
import { useParams } from 'next/navigation';
import { useTranslation } from '@/app/i18n/client';

interface BandMember {
  id: string;
  name: string;
  role: string;
  joinDate: string;
  status: 'active' | 'inactive';
  email: string;
  phone: string;
}

interface Performance {
  id: string;
  date: string;
  venue: string;
  revenue: number;
  status: 'completed' | 'upcoming' | 'cancelled';
  attendance: number;
  notes?: string;
}

interface FinancialRecord {
  id: string;
  date: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  status: 'paid' | 'pending' | 'overdue';
}

interface Band {
  id: string;
  name: string;
  genre: string;
  members: number;
  status: 'active' | 'inactive' | 'on_break';
  location: string;
  contact: {
    email: string;
    phone: string;
  };
  upcomingPerformances: number;
  monthlyRevenue: number;
  memberList: BandMember[];
  performances: Performance[];
  financials: FinancialRecord[];
}

const mockBands: Band[] = [
  {
    id: '1',
    name: 'The Jazz Quartet',
    genre: 'Jazz',
    members: 4,
    status: 'active',
    location: 'New York, NY',
    contact: {
      email: 'jazz@example.com',
      phone: '+1 (555) 123-4567',
    },
    upcomingPerformances: 5,
    monthlyRevenue: 4500,
    memberList: [
      {
        id: 'm1',
        name: 'John Smith',
        role: 'Saxophone',
        joinDate: '2023-01-15',
        status: 'active',
        email: 'john@example.com',
        phone: '+1 (555) 111-1111',
      },
      {
        id: 'm2',
        name: 'Sarah Johnson',
        role: 'Piano',
        joinDate: '2023-02-01',
        status: 'active',
        email: 'sarah@example.com',
        phone: '+1 (555) 222-2222',
      },
    ],
    performances: [
      {
        id: 'p1',
        date: '2024-03-15',
        venue: 'Blue Note Jazz Club',
        revenue: 2500,
        status: 'upcoming',
        attendance: 0,
        notes: 'Special guest appearance',
      },
      {
        id: 'p2',
        date: '2024-02-28',
        venue: 'Jazz Cafe',
        revenue: 1800,
        status: 'completed',
        attendance: 120,
      },
    ],
    financials: [
      {
        id: 'f1',
        date: '2024-03-01',
        type: 'income',
        category: 'Performance Fee',
        amount: 2500,
        description: 'Blue Note Jazz Club',
        status: 'paid',
      },
      {
        id: 'f2',
        date: '2024-03-05',
        type: 'expense',
        category: 'Equipment',
        amount: 500,
        description: 'New microphone set',
        status: 'pending',
      },
    ],
  },
  {
    id: '2',
    name: 'Rock Revolution',
    genre: 'Rock',
    members: 5,
    status: 'active',
    location: 'Los Angeles, CA',
    contact: {
      email: 'rock@example.com',
      phone: '+1 (555) 234-5678',
    },
    upcomingPerformances: 3,
    monthlyRevenue: 3800,
    memberList: [],
    performances: [],
    financials: [],
  },
  {
    id: '3',
    name: 'Classical Ensemble',
    genre: 'Classical',
    members: 8,
    status: 'on_break',
    location: 'Boston, MA',
    contact: {
      email: 'classical@example.com',
      phone: '+1 (555) 345-6789',
    },
    upcomingPerformances: 0,
    monthlyRevenue: 2800,
    memberList: [],
    performances: [],
    financials: [],
  },
];

type TabType = 'overview' | 'members' | 'performances' | 'financials';

interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

interface FilterConfig {
  key: string;
  value: string;
}

export default function BandsPage() {
  const params = useParams();
  const language = params.lng as string;
  const { t } = useTranslation(language, 'bands');
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [selectedBand, setSelectedBand] = useState<Band | null>(null);
  const [sortConfig, setSortConfig] = useState<SortConfig | undefined>(
    undefined,
  );
  const [filterConfig, setFilterConfig] = useState<FilterConfig | null>(null);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [isPerformanceModalOpen, setIsPerformanceModalOpen] = useState(false);
  const [isFinancialModalOpen, setIsFinancialModalOpen] = useState(false);

  // Form states
  const [newMember, setNewMember] = useState<Partial<BandMember>>({});
  const [newPerformance, setNewPerformance] = useState<Partial<Performance>>(
    {},
  );
  const [newFinancial, setNewFinancial] = useState<Partial<FinancialRecord>>(
    {},
  );

  const bandColumns = [
    { key: 'name', label: t('name') },
    { key: 'genre', label: t('genre') },
    { key: 'members', label: t('members') },
    { key: 'location', label: t('location') },
    {
      key: 'status',
      label: t('status'),
      render: (item: Band) => (
        <span
          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
            item.status === 'active'
              ? 'bg-green-100 text-green-800'
              : item.status === 'on_break'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
          }`}
        >
          {t(`status-${item.status}`)}
        </span>
      ),
    },
    {
      key: 'upcomingPerformances',
      label: t('upcoming-performances'),
    },
  ];

  const memberColumns = [
    { key: 'name', label: t('name') },
    { key: 'role', label: t('role') },
    { key: 'joinDate', label: t('join-date') },
    {
      key: 'status',
      label: t('status'),
      render: (item: BandMember) => (
        <span
          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
            item.status === 'active'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {t(`status-${item.status}`)}
        </span>
      ),
    },
  ];

  const performanceColumns = [
    { key: 'date', label: t('date') },
    { key: 'venue', label: t('venue') },
    { key: 'revenue', label: t('revenue') },
    {
      key: 'status',
      label: t('status'),
      render: (item: Performance) => (
        <span
          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
            item.status === 'completed'
              ? 'bg-green-100 text-green-800'
              : item.status === 'upcoming'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-red-100 text-red-800'
          }`}
        >
          {t(`status-${item.status}`)}
        </span>
      ),
    },
    { key: 'attendance', label: t('attendance') },
  ];

  const financialColumns = [
    { key: 'date', label: t('date') },
    { key: 'type', label: t('type') },
    { key: 'category', label: t('category') },
    { key: 'amount', label: t('amount') },
    { key: 'description', label: t('description') },
    {
      key: 'status',
      label: t('status'),
      render: (item: FinancialRecord) => (
        <span
          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
            item.status === 'paid'
              ? 'bg-green-100 text-green-800'
              : item.status === 'pending'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
          }`}
        >
          {t(`status-${item.status}`)}
        </span>
      ),
    },
  ];

  const handleSort = (key: string) => {
    setSortConfig((current) => {
      if (current?.key === key) {
        return current.direction === 'asc'
          ? { key, direction: 'desc' }
          : undefined;
      }
      return { key, direction: 'asc' };
    });
  };

  const handleFilter = (key: string, value: string) => {
    setFilterConfig({ key, value });
  };

  const filteredBands = useMemo(() => {
    let result = mockBands.filter(
      (band) =>
        band.name
          .toLowerCase()
          .includes(filterConfig?.value?.toLowerCase() || '') ||
        band.genre
          .toLowerCase()
          .includes(filterConfig?.value?.toLowerCase() || '') ||
        band.location
          .toLowerCase()
          .includes(filterConfig?.value?.toLowerCase() || ''),
    );

    // Apply sorting
    if (sortConfig) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof Band];
        const bValue = b[sortConfig.key as keyof Band];
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [mockBands, sortConfig, filterConfig]);

  const handleAddMember = () => {
    if (selectedBand && newMember.name && newMember.role) {
      const member: BandMember = {
        id: `m${Date.now()}`,
        name: newMember.name,
        role: newMember.role,
        joinDate: new Date().toISOString().split('T')[0],
        status: 'active',
        email: newMember.email || '',
        phone: newMember.phone || '',
      };
      selectedBand.memberList.push(member);
      setNewMember({});
      setIsMemberModalOpen(false);
    }
  };

  const handleAddPerformance = () => {
    if (selectedBand && newPerformance.date && newPerformance.venue) {
      const performance: Performance = {
        id: `p${Date.now()}`,
        date: newPerformance.date,
        venue: newPerformance.venue,
        revenue: newPerformance.revenue || 0,
        status: 'upcoming',
        attendance: 0,
        notes: newPerformance.notes,
      };
      selectedBand.performances.push(performance);
      setNewPerformance({});
      setIsPerformanceModalOpen(false);
    }
  };

  const handleAddFinancial = () => {
    if (selectedBand && newFinancial.type && newFinancial.amount) {
      const financial: FinancialRecord = {
        id: `f${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        type: newFinancial.type as 'income' | 'expense',
        category: newFinancial.category || '',
        amount: newFinancial.amount,
        description: newFinancial.description || '',
        status: 'pending',
      };
      selectedBand.financials.push(financial);
      setNewFinancial({});
      setIsFinancialModalOpen(false);
    }
  };

  const renderTabContent = () => {
    if (!selectedBand) {
      return (
        <DataTable
          language={language}
          columns={bandColumns}
          data={mockBands}
          onSort={handleSort}
          onFilter={handleFilter}
          sortConfig={sortConfig}
        />
      );
    }

    switch (activeTab) {
      case 'members':
        return (
          <DataTable
            language={language}
            columns={memberColumns}
            data={selectedBand.memberList}
            onSort={handleSort}
            onFilter={handleFilter}
            sortConfig={sortConfig}
          />
        );
      case 'performances':
        return (
          <DataTable
            language={language}
            columns={performanceColumns}
            data={selectedBand.performances}
            onSort={handleSort}
            onFilter={handleFilter}
            sortConfig={sortConfig}
          />
        );
      case 'financials':
        return (
          <DataTable
            language={language}
            columns={financialColumns}
            data={selectedBand.financials}
            onSort={handleSort}
            onFilter={handleFilter}
            sortConfig={sortConfig}
          />
        );
      default:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-lg border p-4">
                <h3 className="mb-2 text-sm font-medium text-gray-500">
                  {t('contact-info')}
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-900">
                      {selectedBand.contact.email}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-900">
                      {selectedBand.contact.phone}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-900">
                      {selectedBand.location}
                    </span>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border p-4">
                <h3 className="mb-2 text-sm font-medium text-gray-500">
                  {t('quick-stats')}
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {t('total-members')}
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {selectedBand.members}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {t('upcoming-performances')}
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {selectedBand.upcomingPerformances}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {t('monthly-revenue')}
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      ${selectedBand.monthlyRevenue.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{t('bands')}</h1>
        <button
          onClick={() => {
            /* handle add band */
          }}
          className="flex items-center space-x-2 rounded-lg bg-[#15b7b9] px-4 py-2 text-sm font-medium text-white hover:bg-[#15b7b9]/90"
        >
          <Plus className="h-4 w-4" />
          <span>{t('add-new')}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard
          icon={<Users className="h-5 w-5 text-[#15b7b9]" />}
          title={t('total-bands')}
          value={mockBands.length}
          trend={{ value: 5, isPositive: true }}
        />
        <MetricCard
          icon={<Calendar className="h-5 w-5 text-[#15b7b9]" />}
          title={t('upcoming-performances')}
          value={mockBands.reduce(
            (acc, band) => acc + band.upcomingPerformances,
            0,
          )}
          trend={{ value: 8, isPositive: true }}
        />
        <MetricCard
          icon={<DollarSign className="h-5 w-5 text-[#15b7b9]" />}
          title={t('total-revenue')}
          value={`$${mockBands.reduce((acc, band) => acc + band.monthlyRevenue, 0).toLocaleString()}`}
          trend={{ value: 12, isPositive: true }}
        />
      </div>

      <div className="rounded-lg border bg-white shadow-sm">
        <div className="border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              {selectedBand ? selectedBand.name : t('all-bands')}
            </h2>
            {selectedBand && (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setIsMemberModalOpen(true)}
                  className="flex items-center space-x-2 rounded-lg bg-[#15b7b9] px-4 py-2 text-sm font-medium text-white hover:bg-[#15b7b9]/90"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>{t('add-member')}</span>
                </button>
                <button
                  onClick={() => setIsPerformanceModalOpen(true)}
                  className="flex items-center space-x-2 rounded-lg bg-[#15b7b9] px-4 py-2 text-sm font-medium text-white hover:bg-[#15b7b9]/90"
                >
                  <Calendar className="h-4 w-4" />
                  <span>{t('add-performance')}</span>
                </button>
                <button
                  onClick={() => setIsFinancialModalOpen(true)}
                  className="flex items-center space-x-2 rounded-lg bg-[#15b7b9] px-4 py-2 text-sm font-medium text-white hover:bg-[#15b7b9]/90"
                >
                  <DollarSign className="h-4 w-4" />
                  <span>{t('add-transaction')}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="border-b">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('overview')}
              className={`border-b-2 px-1 py-4 text-sm font-medium ${
                activeTab === 'overview'
                  ? 'border-[#15b7b9] text-[#15b7b9]'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              {t('overview')}
            </button>
            <button
              onClick={() => setActiveTab('members')}
              className={`border-b-2 px-1 py-4 text-sm font-medium ${
                activeTab === 'members'
                  ? 'border-[#15b7b9] text-[#15b7b9]'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              {t('members')}
            </button>
            <button
              onClick={() => setActiveTab('performances')}
              className={`border-b-2 px-1 py-4 text-sm font-medium ${
                activeTab === 'performances'
                  ? 'border-[#15b7b9] text-[#15b7b9]'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              {t('performances')}
            </button>
            <button
              onClick={() => setActiveTab('financials')}
              className={`border-b-2 px-1 py-4 text-sm font-medium ${
                activeTab === 'financials'
                  ? 'border-[#15b7b9] text-[#15b7b9]'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              {t('financials')}
            </button>
          </nav>
        </div>

        <div className="p-6">{renderTabContent()}</div>
      </div>

      {/* Modals */}
      <FormModal
        isOpen={isMemberModalOpen}
        onClose={() => setIsMemberModalOpen(false)}
        title={t('add-member')}
      >
        <div className="space-y-4">{/* Member form content */}</div>
      </FormModal>

      <FormModal
        isOpen={isPerformanceModalOpen}
        onClose={() => setIsPerformanceModalOpen(false)}
        title={t('add-performance')}
      >
        <div className="space-y-4">{/* Performance form content */}</div>
      </FormModal>

      <FormModal
        isOpen={isFinancialModalOpen}
        onClose={() => setIsFinancialModalOpen(false)}
        title={t('add-transaction')}
      >
        <div className="space-y-4">{/* Financial form content */}</div>
      </FormModal>
    </div>
  );
}
