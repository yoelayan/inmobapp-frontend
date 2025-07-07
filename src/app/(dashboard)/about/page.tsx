"use client"
import React from 'react';

import { Button } from '@mui/material';

import {
  Table,
  TableContainer,
  TableHeader,
  TableBody,
  TablePagination,
  TableFilter,
  createTableStore,

} from '@/components/common/Table';

import type { ResponseAPI, TableFilterItem, TableSorting } from '@/components/common/Table';


// Tipo para los datos
interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: string;
}

// Fetcher para la API
const fetchUsuarios = async ({
  page,
  pageSize,
  filters,
  sorting
}: {
  page: number;
  pageSize: number;
  filters: TableFilterItem[];
  sorting: TableSorting[];
}): Promise<ResponseAPI<Usuario>> => {
  try {
    // Construir parámetros de búsqueda
    const params = new URLSearchParams();

    params.append('page', String(page));
    params.append('per_page', String(pageSize));

    // Añadir filtros
    filters.forEach(filter => {
      params.append(`filter[${filter.field}]`, filter.value);
    });

    // Añadir ordenamiento
    if (sorting.length > 0) {
      const sortParams = sorting.map(s =>
        `${s.id}:${s.desc ? 'desc' : 'asc'}`
      ).join(',');

      params.append('sort', sortParams);
    }

    const response = {
      count: 1,
      page_number: page,
      num_pages: 1,
      per_page: pageSize,
      next: null,
      previous: null,
      results: [
        {
          id: 1,
          nombre: 'Juan Perez',
          email: 'juan.perez@example.com',
          rol: 'Admin'
        }
      ]
    }
    return response;

  } catch (error) {
    console.error('Error al obtener usuarios:', error);

    return {
      count: 0,
      page_number: page,
      num_pages: 0,
      per_page: pageSize,
      next: null,
      previous: null,
      results: []
    };
  }
};

// Crear store para la tabla de usuarios
const useUsuariosTableStore = createTableStore<Usuario>(fetchUsuarios);

// Columnas de la tabla
const columns = [
  {
    accessorKey: 'id',
    header: 'ID',
    size: 80,
  },
  {
    accessorKey: 'nombre',
    header: 'Nombre',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'rol',
    header: 'Rol',
    cell: ({ getValue }: { getValue: () => string }) => {
      const rol = getValue();
      let color = 'inherit';

      switch (rol) {
        case 'Admin':
          color = 'error.main';
          break;
        case 'Editor':
          color = 'primary.main';
          break;
        default:
          color = 'text.secondary';
      }

      return <span style={{ color }}>{rol}</span>;
    }
  }
];

// Componente principal
const UsuariosTable = () => {
  const tableStore = useUsuariosTableStore();

  const handleAgregarUsuario = () => {
    console.log('Agregar usuario');
    // Lógica para mostrar modal de agregar usuario
  };

  const handleRowClick = (usuario: Usuario) => {
    console.log('Usuario seleccionado:', usuario);
    // Lógica para abrir detalle o editar usuario
  };

  // Ejemplo de filtros personalizados
  const filtrarPorRol = (rol: string) => {
    tableStore.addFilter({ field: 'rol', value: rol });
  };

  return (
    <Table columns={columns} state={tableStore}>
      <TableFilter placeholder="Buscar usuarios...">
        <Button
          variant="outlined"
          size="small"
          onClick={() => filtrarPorRol('Admin')}
        >
          Solo Admins
        </Button>
        <Button
          variant="outlined"
          size="small"
          onClick={() => filtrarPorRol('Editor')}
        >
          Solo Editores
        </Button>
        <Button
          variant="outlined"
          size="small"
          onClick={() => tableStore.setFilters([])}
        >
          Limpiar filtros
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAgregarUsuario}
        >
          Agregar Usuario
        </Button>
      </TableFilter>

      <TableContainer>
        <TableHeader />
        <TableBody onRowClick={handleRowClick} />
      </TableContainer>

      <TablePagination />
    </Table>
  );
};

export default UsuariosTable;
