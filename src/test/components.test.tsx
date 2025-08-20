import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { KanbanBoard } from '../components/ui/KanbanBoard';
import { DataTable } from '../components/ui/DataTable';

// Mock DndContext to avoid issues in tests
vi.mock('@dnd-kit/core', () => ({
  DndContext: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DragOverlay: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useSensor: () => ({}),
  useSensors: () => [],
  PointerSensor: class {},
}));

vi.mock('@dnd-kit/sortable', () => ({
  SortableContext: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useSortable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: () => {},
    transform: null,
    transition: null,
    isDragging: false,
  }),
  verticalListSortingStrategy: {},
}));

vi.mock('@dnd-kit/utilities', () => ({
  CSS: {
    Transform: {
      toString: () => '',
    },
  },
}));

describe('KanbanBoard', () => {
  const mockColumns = [
    { id: 'todo', title: 'To Do' },
    { id: 'doing', title: 'Doing' },
    { id: 'done', title: 'Done' },
  ];

  const mockCards = [
    { id: '1', title: 'Task 1', columnId: 'todo', content: <div>Content 1</div> },
    { id: '2', title: 'Task 2', columnId: 'doing', content: <div>Content 2</div> },
  ];

  it('renders columns and cards', () => {
    const mockOnCardMove = vi.fn();
    
    render(
      <KanbanBoard
        columns={mockColumns}
        cards={mockCards}
        onCardMove={mockOnCardMove}
      />
    );

    expect(screen.getByText('To Do')).toBeInTheDocument();
    expect(screen.getByText('Doing')).toBeInTheDocument();
    expect(screen.getByText('Done')).toBeInTheDocument();
    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
  });
});

describe('DataTable', () => {
  const mockData = [
    { id: '1', name: 'John Doe', role: 'Engineer', company: 'Tech Corp' },
    { id: '2', name: 'Jane Smith', role: 'Designer', company: 'Design Co' },
  ];

  const mockColumns = [
    { id: 'name' as keyof typeof mockData[0], header: 'Name', sortable: true },
    { id: 'role' as keyof typeof mockData[0], header: 'Role' },
    { id: 'company' as keyof typeof mockData[0], header: 'Company' },
  ];

  it('renders table with data', () => {
    render(
      <DataTable
        data={mockData}
        columns={mockColumns}
      />
    );

    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Role')).toBeInTheDocument();
    expect(screen.getByText('Company')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('handles search functionality', () => {
    render(
      <DataTable
        data={mockData}
        columns={mockColumns}
        searchable={true}
      />
    );

    const searchInput = screen.getByPlaceholderText('Search...');
    fireEvent.change(searchInput, { target: { value: 'John' } });

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
  });
});