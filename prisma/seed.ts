import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const productos = [
  // Audio
  { nombre: "Auriculares Bluetooth", descripcion: "Sonido premium, cancelación de ruido activa", precio: 89.99, emoji: "🎧", stock: 15 },
  { nombre: "Auriculares In-Ear", descripcion: "True wireless, IPX4, 30hs de batería", precio: 59.99, emoji: "🎵", stock: 22 },
  { nombre: "Parlante Portátil", descripcion: "360°, waterproof, 20hs autonomía", precio: 75.0, emoji: "🔊", stock: 18 },
  { nombre: "Barra de Sonido", descripcion: "2.1ch, Dolby Atmos, 120W, HDMI ARC", precio: 199.0, emoji: "📻", stock: 7 },
  { nombre: "Micrófono USB", descripcion: "Cardioide, 192kHz/24bit, ideal streaming", precio: 110.0, emoji: "🎙️", stock: 12 },
  { nombre: "Auriculares Gaming", descripcion: "7.1 surround, RGB, micrófono retráctil", precio: 79.99, emoji: "🎮", stock: 14 },
  { nombre: "Amplificador DAC", descripcion: "Hi-Fi, 32bit/384kHz, 2x salida 6.3mm", precio: 145.0, emoji: "🎚️", stock: 5 },
  { nombre: "Vincha con Micrófono", descripcion: "Cancelación eco, USB-C, plegable", precio: 45.0, emoji: "📞", stock: 20 },

  // Periféricos
  { nombre: "Teclado Mecánico", descripcion: "Switches tactiles, RGB, layout 80%", precio: 120.0, emoji: "⌨️", stock: 8 },
  { nombre: "Teclado Inalámbrico", descripcion: "Bluetooth 5.0, multidispositivo, batería 6 meses", precio: 55.0, emoji: "🖱️", stock: 25 },
  { nombre: "Mouse Inalámbrico", descripcion: "2.4GHz, ergonómico, 6 botones programables", precio: 45.5, emoji: "🖱️", stock: 20 },
  { nombre: "Mouse Gaming", descripcion: "16000 DPI, 8 botones, RGB, polling 1000Hz", precio: 69.99, emoji: "🎯", stock: 16 },
  { nombre: "Mouse Vertical", descripcion: "Ergonómico, 6 botones, 2.4GHz", precio: 38.0, emoji: "🖱️", stock: 11 },
  { nombre: "Mousepad XL", descripcion: "900x400mm, base antideslizante, tela suave", precio: 22.0, emoji: "📋", stock: 30 },
  { nombre: "Webcam HD", descripcion: "1080p, micrófono integrado, plug & play", precio: 65.0, emoji: "📷", stock: 12 },
  { nombre: "Webcam 4K", descripcion: "4K 30fps, autoenfoque, corrección de luz IA", precio: 149.0, emoji: "🎥", stock: 6 },

  // Monitores
  { nombre: "Monitor 27\" FHD", descripcion: "IPS, 144Hz, 1ms, HDMI + DisplayPort", precio: 320.0, emoji: "🖥️", stock: 5 },
  { nombre: "Monitor 24\" FHD", descripcion: "VA, 165Hz, 1ms, FreeSync Premium", precio: 219.0, emoji: "🖥️", stock: 9 },
  { nombre: "Monitor 32\" 4K", descripcion: "IPS, 60Hz, HDR400, USB-C 90W", precio: 499.0, emoji: "🖥️", stock: 3 },
  { nombre: "Monitor Curvo 34\"", descripcion: "UWQHD, 144Hz, VA, 1500R curvatura", precio: 589.0, emoji: "🖥️", stock: 2 },
  { nombre: "Monitor Portátil 15\"", descripcion: "FHD, USB-C, 1.2kg, funda incluida", precio: 185.0, emoji: "💻", stock: 8 },
  { nombre: "Monitor Gaming 27\" 240Hz", descripcion: "IPS, 240Hz, 0.5ms, G-Sync Compatible", precio: 420.0, emoji: "🖥️", stock: 4 },

  // Almacenamiento
  { nombre: "SSD Externo 1TB", descripcion: "USB 3.2, 1050MB/s lectura, compacto", precio: 95.0, emoji: "💾", stock: 18 },
  { nombre: "SSD Externo 2TB", descripcion: "USB 3.2 Gen2, 2000MB/s, aluminio", precio: 169.0, emoji: "💾", stock: 10 },
  { nombre: "HDD Externo 4TB", descripcion: "USB 3.0, backup automático, 2.5\"", precio: 89.0, emoji: "🗄️", stock: 14 },
  { nombre: "SSD NVMe 1TB", descripcion: "PCIe 4.0, 7000MB/s, M.2 2280", precio: 99.0, emoji: "⚡", stock: 20 },
  { nombre: "Pendrive 128GB", descripcion: "USB 3.2, 400MB/s, compacto giratorio", precio: 18.0, emoji: "🔑", stock: 40 },
  { nombre: "Tarjeta SD 256GB", descripcion: "V30, A2, 180MB/s, UHS-I U3", precio: 28.0, emoji: "📸", stock: 35 },
  { nombre: "NAS 2 Bahías", descripcion: "Gigabit Ethernet, compatible RAID 0/1", precio: 249.0, emoji: "🖥️", stock: 4 },
  { nombre: "Lector de Tarjetas", descripcion: "USB-C, SD + microSD + CF, UHS-II", precio: 25.0, emoji: "📂", stock: 28 },

  // Conectividad
  { nombre: "Hub USB-C 7en1", descripcion: "HDMI 4K, USB-A x3, SD, PD 100W", precio: 38.0, emoji: "🔌", stock: 25 },
  { nombre: "Hub USB-A 4en1", descripcion: "USB 3.0 x4, 5Gbps, alimentación activa", precio: 19.0, emoji: "🔌", stock: 30 },
  { nombre: "Dock Station", descripcion: "15en1, dual 4K, Ethernet, audio, 100W PD", precio: 129.0, emoji: "⚡", stock: 7 },
  { nombre: "Router WiFi 6", descripcion: "AX3000, 4 antenas, MU-MIMO, 2402Mbps 5GHz", precio: 89.0, emoji: "📡", stock: 9 },
  { nombre: "Repetidor WiFi 6", descripcion: "AX1800, EasyMesh, puerto Gigabit", precio: 49.0, emoji: "📶", stock: 15 },
  { nombre: "Switch Gigabit 8p", descripcion: "8 puertos, plug & play, metal", precio: 35.0, emoji: "🌐", stock: 12 },

  // Laptops y tablets
  { nombre: "Soporte para Laptop", descripcion: "Aluminio, ajustable 6 niveles, plegable", precio: 28.0, emoji: "💻", stock: 30 },
  { nombre: "Soporte Dual Monitor", descripcion: "Gas-spring, VESA 75/100, 2 brazos", precio: 79.0, emoji: "🖥️", stock: 6 },
  { nombre: "Tablet 10\" Android", descripcion: "2K, 128GB, 8000mAh, stylus incluido", precio: 189.0, emoji: "📱", stock: 11 },
  { nombre: "Funda Tablet Universal", descripcion: "10-11\", soporte plegable, teclado bluetooth", precio: 32.0, emoji: "🛡️", stock: 22 },
  { nombre: "Laptop Stand Plegable", descripcion: "Plástico ABS, 7 alturas, 1.5kg soporte", precio: 15.0, emoji: "📐", stock: 35 },
  { nombre: "Reposamuñecas Teclado", descripcion: "Memory foam, 43cm, lavable", precio: 14.0, emoji: "🖐️", stock: 28 },

  // Cables y carga
  { nombre: "Cable USB-C 2m 240W", descripcion: "USB4, 240W, 40Gbps, 8K 60Hz", precio: 22.0, emoji: "🔋", stock: 40 },
  { nombre: "Cargador 65W GaN", descripcion: "2x USB-C + USB-A, plegable, PD 3.0", precio: 35.0, emoji: "⚡", stock: 25 },
  { nombre: "Cargador 140W GaN", descripcion: "3 puertos, PD 3.1, tamaño compacto", precio: 55.0, emoji: "⚡", stock: 14 },
  { nombre: "Batería Portátil 20000mAh", descripcion: "65W PD, 2x USB-C, 1x USB-A, pantalla LED", precio: 49.0, emoji: "🔋", stock: 20 },
  { nombre: "Cargador Inalámbrico 15W", descripcion: "Qi2, compatible MagSafe, stand incluido", precio: 28.0, emoji: "🔌", stock: 18 },
  { nombre: "Regleta 6 Tomas con USB", descripcion: "4x USB-A + 2x USB-C, protección picos", precio: 32.0, emoji: "⚡", stock: 22 },

  // Smartphones y accesorios
  { nombre: "Soporte Celular Auto", descripcion: "MagSafe + brazo articulado, 360°", precio: 24.0, emoji: "📱", stock: 30 },
  { nombre: "Selfie Ring Light", descripcion: "26cm, 3 colores, soporte articulado 2m", precio: 29.0, emoji: "💡", stock: 17 },
  { nombre: "Trípode Flexible", descripcion: "Gorillapod 30cm, cabeza rotante, carga 1kg", precio: 19.0, emoji: "📷", stock: 24 },
  { nombre: "Estabilizador Gimbal", descripcion: "3 ejes, IA seguimiento, app control", precio: 89.0, emoji: "🎥", stock: 8 },

  // Cámaras
  { nombre: "Cámara Acción 4K", descripcion: "4K60, EIS, waterproof 10m, pantalla táctil", precio: 159.0, emoji: "📷", stock: 9 },
  { nombre: "Cámara Instantánea", descripcion: "Film 54x86mm, flash integrado, 8 fotos por pack", precio: 79.0, emoji: "📸", stock: 13 },
  { nombre: "Dron con Cámara", descripcion: "4K, estabilización IA, 30min vuelo, 5km alcance", precio: 399.0, emoji: "🚁", stock: 3 },

  // Gaming
  { nombre: "Control Inalámbrico PC", descripcion: "Xbox layout, vibración doble, 20hs batería", precio: 55.0, emoji: "🎮", stock: 16 },
  { nombre: "Silla Gaming", descripcion: "Reclinable 165°, reposacabezas, lumbar ajustable", precio: 289.0, emoji: "🪑", stock: 5 },
  { nombre: "Teclado Gaming TKL", descripcion: "Switches ópticos, RGB por tecla, USB-C", precio: 95.0, emoji: "⌨️", stock: 10 },
  { nombre: "Headset Gaming 7.1", descripcion: "Surround virtual, micrófono cancelación ruido", precio: 69.0, emoji: "🎧", stock: 14 },
  { nombre: "Capturadora HDMI", descripcion: "4K pass-through, 1080p60 grabación, USB-C", precio: 79.0, emoji: "🎬", stock: 7 },
  { nombre: "Mousepad Gaming RGB", descripcion: "900x400mm, 14 efectos LED, USB powered", precio: 35.0, emoji: "🌈", stock: 19 },

  // Impresión y oficina
  { nombre: "Impresora Multifunción", descripcion: "WiFi, dúplex, scanner, 22ppm color", precio: 219.0, emoji: "🖨️", stock: 6 },
  { nombre: "Escáner Portátil A4", descripcion: "600dpi, USB-C, tarjeta SD, sin PC", precio: 89.0, emoji: "📄", stock: 8 },
  { nombre: "Destructora de Papel", descripcion: "Micro-corte P-5, 8 hojas, tarjetas de crédito", precio: 59.0, emoji: "📑", stock: 10 },
  { nombre: "Pizarra Digital A4", descripcion: "E-ink, escritura a mano, 4096 niveles presión", precio: 129.0, emoji: "📝", stock: 7 },

  // Iluminación y ergonomía
  { nombre: "Lámpara LED Escritorio", descripcion: "USB-C, 5 temperaturas, sensor táctil, plegable", precio: 28.0, emoji: "💡", stock: 20 },
  { nombre: "Monitor Light Bar", descripcion: "Sin deslumbramiento, control inalámbrico, 2700-6500K", precio: 45.0, emoji: "💡", stock: 15 },
  { nombre: "Teclado Numérico Bluetooth", descripcion: "34 teclas, batería 6 meses, aluminio", precio: 29.0, emoji: "🔢", stock: 18 },
  { nombre: "Almohadilla Ergonómica Mouse", descripcion: "Gel, base antideslizante, 25x21cm", precio: 12.0, emoji: "🖱️", stock: 35 },
  { nombre: "Filtro Privacidad 14\"", descripcion: "Anti-espía 60°, anti-reflejo, removible", precio: 34.0, emoji: "🔒", stock: 14 },
  { nombre: "Soporte Monitor + Organizador", descripcion: "Bandeja cajón, 2 USB-A, bambú", precio: 39.0, emoji: "🗂️", stock: 11 },
  { nombre: "Ventilador USB Mini", descripcion: "3 velocidades, 360° rotación, silencioso", precio: 16.0, emoji: "🌀", stock: 28 },
  { nombre: "Alfombrilla Calefactora", descripcion: "USB, 3 temperaturas, 40x30cm, apagado auto", precio: 22.0, emoji: "🌡️", stock: 16 },

  // Extra
  { nombre: "Adaptador HDMI a DisplayPort", descripcion: "4K 60Hz, activo, plug & play", precio: 18.0, emoji: "🔌", stock: 25 },
  { nombre: "Cable Ethernet Cat8 3m", descripcion: "40Gbps, 2000MHz, blindado, RJ45", precio: 14.0, emoji: "🌐", stock: 30 },
  { nombre: "Teclado Español Retroiluminado", descripcion: "USB, silencioso, 7 colores LED, anti-derrame", precio: 29.0, emoji: "⌨️", stock: 18 },
  { nombre: "Limpiador Pantallas Kit", descripcion: "Spray 100ml + microfibra, anti-estático", precio: 9.0, emoji: "🧹", stock: 50 },
  { nombre: "Webcam con Luz Ring", descripcion: "1080p, ring light integrado, USB, plug & play", precio: 55.0, emoji: "📷", stock: 11 },
  { nombre: "Soporte para Celular Escritorio", descripcion: "Aluminio, ajustable, plegable, universal", precio: 17.0, emoji: "📱", stock: 28 },
  { nombre: "Auriculares con Cable", descripcion: "Hi-Fi, 40mm drivers, jack 3.5mm + USB-C", precio: 34.0, emoji: "🎧", stock: 20 },
];

async function main() {
  await prisma.producto.deleteMany();
  await prisma.producto.createMany({ data: productos });
  console.log(`Seed completado — ${productos.length} productos cargados`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
