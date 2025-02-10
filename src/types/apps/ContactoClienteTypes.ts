export type ContactoCliente {
    id: number;
    tipo: {
        id: number;
        descripcion: string;
        nombre: string;
        activo: boolean;
    };
    valor: string;
}