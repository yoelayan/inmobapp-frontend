# Table Component with Mobile Column Priority

## Overview

The Table component now supports responsive column priority for mobile devices. This allows you to control which columns are displayed in the main table view and which columns are moved to an expandable collapse area on mobile screens.

## Mobile Column Priority System

### How it works

- On desktop: All columns are displayed normally
- On mobile: Only priority columns (top N by priority) are shown in the main table
- Lower priority columns are moved to an expandable collapse area
- Users can tap the expand icon to see additional column details

### Column Priority Configuration

Add `meta.priority` to your column definitions to control mobile display:

```typescript
const columns: ColumnDef<YourDataType>[] = [
  {
    accessorKey: 'name',
    header: 'Nombre',
    meta: {
      priority: 10 // High priority - always show in mobile main view
    }
  },
  {
    accessorKey: 'email',
    header: 'Email',
    meta: {
      priority: 9 // High priority - always show in mobile main view
    }
  },
  {
    accessorKey: 'phone',
    header: 'Teléfono',
    meta: {
      priority: 5 // Medium priority - show in collapse on mobile
    }
  },
  {
    accessorKey: 'notes',
    header: 'Notas',
    meta: {
      hideInMobile: true // Hide completely in mobile
    }
  }
]
```

### Priority Rules

- **Higher numbers = Higher priority** (10 > 5 > 1)
- **Columns without priority default to 0**
- **First N columns (by priority) are shown in mobile main view**
- **Remaining columns are shown in the expandable collapse area**
- **Desktop view shows all columns regardless of priority**

### Usage Examples

#### Basic Usage (Default 3 priority columns)

```tsx
<Table columns={columns} state={tableState} actions={actions}>
  <TableContainer>
    <TableHeader />
    <TableBody />
  </TableContainer>
  <TablePagination />
</Table>
```

#### Custom Priority Column Count

```tsx
<Table columns={columns} state={tableState} actions={actions}>
  <TableContainer>
    <TableHeader priorityColumns={2} /> {/* Show top 2 priority columns */}
    <TableBody priorityColumns={2} />
  </TableContainer>
  <TablePagination />
</Table>
```

#### Complete Example with Priority Configuration

```tsx
import type { ColumnDef } from '@tanstack/react-table'

interface User {
  id: string
  name: string
  email: string
  phone: string
  department: string
  status: 'active' | 'inactive'
  created_at: string
  notes: string
}

const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: 'Nombre',
    enableSorting: true,
    meta: {
      priority: 10 // Always show in mobile - most important
    }
  },
  {
    accessorKey: 'email',
    header: 'Email',
    meta: {
      priority: 9 // Always show in mobile - very important
    }
  },
  {
    accessorKey: 'status',
    header: 'Estado',
    cell: ({ getValue }) => (
      <Chip 
        label={getValue() === 'active' ? 'Activo' : 'Inactivo'}
        color={getValue() === 'active' ? 'success' : 'default'}
      />
    ),
    meta: {
      priority: 8 // Always show in mobile - important status info
    }
  },
  {
    accessorKey: 'phone',
    header: 'Teléfono',
    meta: {
      priority: 6 // Show in collapse on mobile - secondary info
    }
  },
  {
    accessorKey: 'department',
    header: 'Departamento',
    meta: {
      priority: 5 // Show in collapse on mobile - secondary info
    }
  },
  {
    accessorKey: 'created_at',
    header: 'Fecha de Creación',
    meta: {
      priority: 4 // Show in collapse on mobile - less important
    }
  },
  {
    accessorKey: 'notes',
    header: 'Notas Internas',
    meta: {
      hideInMobile: true // Hide completely in mobile - not needed on mobile
    }
  }
]

const UserTable = () => {
  const tableState = useTableState()
  
  return (
    <Table columns={columns} state={tableState}>
      <TableContainer>
        <TableHeader priorityColumns={3} />
        <TableBody priorityColumns={3} />
      </TableContainer>
      <TablePagination />
    </Table>
  )
}
```

## Mobile Behavior

### Main Table View (Mobile)
- Shows expand/collapse icon in first column
- Displays only top N priority columns
- Maintains all table functionality (sorting, filtering, actions)

### Collapse Area (Mobile)
- Triggered by tapping the expand icon
- Shows non-priority columns in a clean, organized layout
- Each collapsed column displays as "Label: Value" pairs
- Maintains proper cell rendering (including custom cell components)

### Desktop View
- No change in behavior
- All columns displayed normally
- No expand/collapse functionality

## Migration Guide

### Updating Existing Tables

1. **Add priority meta to your column definitions:**
```tsx
// Before
{
  accessorKey: 'name',
  header: 'Nombre'
}

// After
{
  accessorKey: 'name',
  header: 'Nombre',
  meta: {
    priority: 10 // Add priority
  }
}
```

2. **No changes needed for basic usage** - defaults to showing top 3 priority columns

3. **Optional: Customize priority column count**
```tsx
<TableHeader priorityColumns={2} />
<TableBody priorityColumns={2} />
```

### Best Practices

1. **Assign priorities thoughtfully:**
   - 10-8: Critical information (names, IDs, status)
   - 7-5: Important secondary information
   - 4-1: Nice-to-have information
   - hideInMobile: Internal/admin-only data

2. **Keep mobile main view focused:**
   - Limit to 2-4 priority columns for best mobile UX
   - Ensure most important data is immediately visible

3. **Test on actual mobile devices:**
   - Verify column widths work well
   - Ensure touch targets are appropriate
   - Check that collapsed data is easily readable

## API Reference

### TableHeader Props
```tsx
interface TableHeaderProps {
  priorityColumns?: number // Number of priority columns to show in mobile (default: 3)
}
```

### TableBody Props
```tsx
interface TableBodyProps {
  onRowClick?: (row: any) => void
  renderRow?: (row: any, actions?: React.ReactNode) => React.ReactNode
  renderActions?: (row: any) => React.ReactNode
  showActions?: boolean
  priorityColumns?: number // Number of priority columns to show in mobile (default: 3)
}
```

### Column Meta Configuration
```tsx
interface ColumnMeta {
  priority?: number // Higher numbers = higher priority (1-10 recommended)
  hideInMobile?: boolean // Hide column completely in mobile view
}
``` 
