"use client";

import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "marketplace-chat-mensajes";
import styles from "./ChatWidget.module.css";

type Producto = {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
  emoji: string;
};

type Mensaje = {
  texto: string;
  rol: "ai" | "user";
};

const SUGERENCIAS = [
  { label: "¿Qué productos tienen?", texto: "¿Qué productos tienen disponibles?" },
  { label: "Los más baratos", texto: "¿Cuáles son los más baratos?" },
  { label: "¿Cómo compro?", texto: "¿Cómo funciona el proceso de compra?" },
];

function fmt(n: number) {
  return "$" + n.toLocaleString("es-AR");
}

async function responder(mensajes: Mensaje[]): Promise<string> {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mensajes }),
  });
  if (!res.ok) return "Hubo un error al conectar con el asistente. Intentá de nuevo.";
  const data = await res.json();
  return data.respuesta;
}

function renderTexto(texto: string) {
  return texto
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br>");
}

export default function ChatWidget({ productos }: { productos: Producto[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [typing, setTyping] = useState(false);
  const [texto, setTexto] = useState("");
  const [busy, setBusy] = useState(false);
  const [welcomed, setWelcomed] = useState(false);
  const [showSuggs, setShowSuggs] = useState(true);

  // Cargar historial guardado al montar
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: Mensaje[] = JSON.parse(saved);
        if (parsed.length > 0) {
          setMensajes(parsed);
          setWelcomed(true);
          setShowSuggs(false);
        }
      }
    } catch {
      // localStorage corrupto — ignorar
    }
  }, []);

  // Guardar cada vez que cambian los mensajes
  useEffect(() => {
    if (mensajes.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mensajes));
    }
  }, [mensajes]);
  const msgsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  function scrollBottom() {
    setTimeout(() => {
      if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
    }, 20);
  }

  function addMsg(texto: string, rol: "ai" | "user") {
    setMensajes((prev) => [...prev, { texto, rol }]);
    scrollBottom();
  }

  function openChat() {
    setIsOpen(true);
    if (!welcomed) {
      setWelcomed(true);
      setTimeout(() => addMsg("¡Hola! Soy el asistente del Marketplace 👋 ¿En qué te puedo ayudar?", "ai"), 300);
    }
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  async function doReply(q: string) {
    if (busy) return;
    setBusy(true);
    setShowSuggs(false);
    setTyping(true);
    scrollBottom();
    // Construir historial incluyendo el mensaje del usuario recién enviado
    const historialActual = [...mensajes, { texto: q, rol: "user" as const }];
    const respuesta = await responder(historialActual);
    setTyping(false);
    addMsg(respuesta, "ai");
    setBusy(false);
  }

  async function handleSend(q?: string) {
    const msg = (q ?? texto).trim();
    if (!msg || busy) return;
    setTexto("");
    addMsg(msg, "user");
    await doReply(msg);
    inputRef.current?.focus();
  }

  const fabClass = [styles.fab, isOpen && styles.fabOpen, isOpen && styles.fabSeen].filter(Boolean).join(" ");
  const popupClass = [styles.popup, isOpen && styles.popupVisible, isExpanded && styles.popupExpanded].filter(Boolean).join(" ");

  return (
    <>
      {/* FAB */}
      <button className={fabClass} onClick={() => (isOpen ? setIsOpen(false) : openChat())} aria-label="Abrir asistente">
        <div className={styles.unreadDot} />
        {/* Ícono chat */}
        <svg className={styles.fabIconChat} width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path d="M4 4h14a2 2 0 012 2v8a2 2 0 01-2 2H7l-4 4V6a2 2 0 012-2z" fill="white" />
        </svg>
        {/* Ícono cerrar */}
        <svg className={styles.fabIconClose} width="17" height="17" viewBox="0 0 17 17" fill="none">
          <path d="M2 2l13 13M15 2L2 15" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      </button>

      {/* Popup */}
      <div className={popupClass} role="dialog" aria-label="Asistente del Marketplace">
        {/* Header */}
        <header className={styles.popupHeader}>
          <div className={styles.popupAvatar}>🛒</div>
          <div>
            <div className={styles.popupName}>Asistente del Marketplace</div>
            <div className={styles.popupStatus}>En línea</div>
          </div>
          <span className={styles.popupPowered}>Claude AI</span>
          <div className={styles.popupActions}>
            <button
              className={styles.iconBtn}
              onClick={() => {
                setMensajes([]);
                setWelcomed(false);
                setShowSuggs(true);
                localStorage.removeItem(STORAGE_KEY);
              }}
              title="Limpiar conversación"
              aria-label="Limpiar"
            >
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M2 3h9M5 3V2h3v1M4 3l.5 7.5h4L9 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button
              className={[styles.iconBtn, isExpanded && styles.iconBtnActive].filter(Boolean).join(" ")}
              onClick={() => setIsExpanded((e) => !e)}
              title="Ver catálogo"
              aria-label="Expandir"
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <rect x="1" y="1" width="5" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
                <path d="M9 4.5h5M9 7.5h5M9 10.5h5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </button>
            <button className={styles.iconBtn} onClick={() => setIsOpen(false)} aria-label="Cerrar">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </header>

        <div className={styles.popupBody}>
          {/* Panel productos */}
          <div className={styles.productsPanel}>
            <div className={styles.productsPanelInner}>
              <div className={styles.panelLabel}>Catálogo</div>
              {productos.map((p) => (
                <div
                  key={p.id}
                  className={styles.panelProduct}
                  onClick={() => { addMsg(`Contame sobre ${p.emoji} ${p.nombre}`, "user"); doReply(`info ${p.nombre.toLowerCase()}`); }}
                >
                  <span className={styles.panelEmoji}>{p.emoji}</span>
                  <div>
                    <div className={styles.panelName}>{p.nombre}</div>
                    <div className={styles.panelPrice}>{fmt(p.precio)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat */}
          <div className={styles.chatSide}>
            <div className={styles.messages} ref={msgsRef}>
              {mensajes.map((m, i) => (
                <div key={i} className={`${styles.msgRow} ${m.rol === "user" ? styles.user : ""}`}>
                  <div
                    className={`${styles.bubble} ${m.rol === "ai" ? styles.bubbleAi : styles.bubbleUser}`}
                    dangerouslySetInnerHTML={{ __html: renderTexto(m.texto) }}
                  />
                </div>
              ))}
              {typing && (
                <div className={styles.msgRow}>
                  <div className={styles.typingBubble}>
                    <div className={styles.dot} />
                    <div className={styles.dot} />
                    <div className={styles.dot} />
                  </div>
                </div>
              )}
            </div>

            {showSuggs && mensajes.length === 0 && (
              <div className={styles.suggestions}>
                {SUGERENCIAS.map((s) => (
                  <button key={s.label} className={styles.suggBtn} onClick={() => handleSend(s.texto)}>
                    {s.label}
                  </button>
                ))}
              </div>
            )}

            <div className={styles.inputArea}>
              <textarea
                ref={inputRef}
                className={styles.inputField}
                placeholder="Preguntá algo..."
                rows={1}
                value={texto}
                onChange={(e) => {
                  setTexto(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = Math.min(e.target.scrollHeight, 80) + "px";
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
                }}
                aria-label="Mensaje"
              />
              <button className={styles.sendBtn} onClick={() => handleSend()} disabled={busy} aria-label="Enviar">
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path d="M12 6.5L1 1l2 5.5-2 5.5 11-5.5z" fill="white" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
