import React, { useState } from 'react';
import {
    Box,
    Collapse,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import type { Header, TableAction } from '../TableComponent';
import TableActions from './TableActions';

interface RowProps {
    rowData: any;
    headers: Header[];
    actions?: TableAction[];
}

const Row = ({ rowData, headers, actions }: RowProps) => {
    const [open, setOpen] = useState(false);
    const [firstHeader, secondHeader, ...restHeaders] = headers;

    return (
        <React.Fragment>
            <TableRow 
                className="cursor-pointer transition duration-300 transform hover:-translate-y-1"
                onClick={() => setOpen(!open)}
            >
                <TableCell>
                    <IconButton size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    {rowData[firstHeader.key]}
                </TableCell>
                <TableCell component="th" scope="row">
                    {rowData[secondHeader.key]}
                </TableCell>
                {actions && (
                    <TableCell align="right">
                        <TableActions row={rowData} actions={actions} />
                    </TableCell>
                )}
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={headers.length + (actions ? 1 : 0)}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="body2" gutterBottom component="div">
                                Detalles
                            </Typography>
                            <Table size="small">
                                <TableBody>
                                    {restHeaders.map(header => (
                                        <TableRow key={header.key}>
                                            <TableCell component="th" scope="row" sx={{ fontWeight: 600 }}>
                                                {header.label}
                                            </TableCell>
                                            <TableCell>{rowData[header.key]}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
};

interface TableCollapsibleProps {
    headers: Header[];
    data: any[];
    actions?: TableAction[];
}

const TableCollapsible = ({ headers, data, actions }: TableCollapsibleProps) => {
    return (
        <TableContainer>
            <Table aria-label="collapsible table">
                <TableHead>
                    <TableRow>
                        <TableCell />
                        <TableCell>{headers[0]?.label}</TableCell>
                        <TableCell>{headers[1]?.label}</TableCell>
                        {actions && <TableCell align="right">Acciones</TableCell>}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map(row => (
                        <Row key={row.id} rowData={row} headers={headers} actions={actions} />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default TableCollapsible;