"use client";

type Producto = {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  emoji: string;
  stock: number;
};

const GRADIENTES = [
  "linear-gradient(135deg, #8B5CF6, #6D28D9)",
  "linear-gradient(135deg, #3B82F6, #0891B2)",
  "linear-gradient(135deg, #10B981, #0D9488)",
  "linear-gradient(135deg, #F97316, #D97706)",
  "linear-gradient(135deg, #EC4899, #E11D48)",
  "linear-gradient(135deg, #6366F1, #3B82F6)",
];

export default function TarjetaProducto({ producto }: { producto: Producto }) {
  const gradiente = GRADIENTES[producto.id % GRADIENTES.length];
  const sinStock = producto.stock === 0;

  return (
    <div className="tarjeta">
      <div className="tarjeta-header" style={{ background: gradiente }}>
        <span className="tarjeta-emoji">{producto.emoji}</span>
      </div>

      <div className="tarjeta-body">
        <h2 className="tarjeta-nombre">{producto.nombre}</h2>
        <p className="tarjeta-descripcion">{producto.descripcion}</p>

        <div className="tarjeta-footer">
          <span className="tarjeta-precio">${producto.precio.toFixed(2)}</span>
          <span className={`tarjeta-stock ${sinStock ? "sin-stock" : "con-stock"}`}>
            {sinStock ? "Sin stock" : `${producto.stock} uds.`}
          </span>
        </div>

        <button
          className={`tarjeta-btn ${sinStock ? "tarjeta-btn-disabled" : ""}`}
          disabled={sinStock}
        >
          {sinStock ? "Sin stock" : "Comprar"}
        </button>
      </div>
    </div>
  );
}
