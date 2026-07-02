import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { KpiCard } from '@/components/ui/kpi-card';
import { Briefcase } from 'lucide-react';

describe('KpiCard', () => {
  it('renders the title and value correctly', () => {
    render(<KpiCard title="Active Projects" value="8" icon={Briefcase} trend={10} />);
    expect(screen.getByText('Active Projects')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText(/10%/)).toBeInTheDocument();
  });

  it('renders downward trends correctly', () => {
    render(<KpiCard title="Issues" value="2" icon={Briefcase} trend={-5} />);
    expect(screen.getByText('Issues')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText(/5%/)).toBeInTheDocument();
  });
});
