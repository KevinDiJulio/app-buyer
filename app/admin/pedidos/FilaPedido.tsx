"use client";

import { useState } from "react";
import { Badge, Text } from "@chakra-ui/react";
import { actualizarEstadoPedido } from "./actions";

const ESTADOS = [
  { value: "pendiente", label: "Pendiente", color: "gray" },
  { value: "pagado", label: "Pagado", color: "blue" },
  { value: "en_preparacion", label: "En preparación", color: "orange" },
  { value: "despachado", label: "Despachado", color: "purple" },
  { value: "entregado", label: "Entregado", color: "green" },
  { value: "cancelado", label: "Cancelado", color: "red" },
];

type Item = {
  id: number;
  cantidad: number;
  precioUnitario: number;
  producto: { nombre: string; emoji: string };
};

type Pedido = {
  id: number;
  userId: string;
  total: number;
  estado: string;
  creadoEn: Date;
  items: Item[];
};

export default function FilaPedido({ pedido }: { pedido: Pedido }) {
  const [estado, setEstado] = useState(pedido.estado);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const estadoInfo = ESTADOS.find((e) => e.value === estado) ?? ESTADOS[0];

  async function handleCambioEstado(nuevoEstado: string) {
    setCargando(true);
    setError(null);
    const estadoAnterior = estado;
    setEstado(nuevoEstado);
    try {
      await actualizarEstadoPedido(pedido.id, nuevoEstado);
    } catch (e) {
      setEstado(estadoAnterior);
      setError(e instanceof Error ? e.message : "Error al actualizar");
    } finally {
      setCargando(false);
    }
  }

  const fecha = new Date(pedido.creadoEn).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <tr style={{ borderBottom: "1px solid var(--chakra-colors-gray-100)" }}>
      <td style={{ padding: "12px 16px", fontSize: "13px", color: "var(--chakra-colors-gray-500)" }}>
        #{pedido.id}
      </td>
      <td style={{ padding: "12px 16px", fontSize: "13px" }}>
        <Text fontSize="xs" color="gray.400" fontFamily="mono">
          {pedido.userId.slice(0, 20)}…
        </Text>
      </td>
      <td style={{ padding: "12px 16px", fontSize: "13px" }}>
        {pedido.items.map((item) => (
          <div key={item.id}>
            {item.producto.emoji} {item.producto.nombre} × {item.cantidad}
          </div>
        ))}
      </td>
      <td style={{ padding: "12px 16px", fontSize: "13px", fontWeight: 600 }}>
        ${pedido.total.toLocaleString("es-AR")}
      </td>
      <td style={{ padding: "12px 16px" }}>
        <Badge colorPalette={estadoInfo.color} size="sm">
          {estadoInfo.label}
        </Badge>
      </td>
      <td style={{ padding: "12px 16px", fontSize: "13px", color: "var(--chakra-colors-gray-400)" }}>
        {fecha}
      </td>
      <td style={{ padding: "12px 16px" }}>
        <select
          value={estado}
          disabled={cargando}
          onChange={(e) => handleCambioEstado(e.target.value)}
          style={{
            fontSize: "13px",
            padding: "4px 8px",
            borderRadius: "6px",
            border: "1px solid #555",
            background: "#1a1a2e",
            color: "#fff",
            cursor: cargando ? "not-allowed" : "pointer",
          }}
        >
          {ESTADOS.map((e) => (
            <option key={e.value} value={e.value}>
              {e.label}
            </option>
          ))}
        </select>
        {error && (
          <Text color="red.500" fontSize="xs" mt={1}>{error}</Text>
        )}
      </td>
    </tr>
  );
}
