import { cleanLabel, parseAmount, excelDateToJSDate, formatDate, cleanLabelForStructure2 } from './utils.js';

// ==========================================
// PROCESADORES ESPECIALIZADOS POR FAMILIA
// ==========================================

// Familia 1: Exterior (AVIPRORCA / HPC) -> Quita cabecera, calcula signo con col 4
const processExteriorTipo1 = (data, diario) => {
    let result = JSON.parse(JSON.stringify(data));
    result.shift();
    const rows = result.map(row => {
        const amount = String(row[3] || '');
        const sign = String(row[4] || '');
        const finalAmount = sign.trim() === '-' ? '-' + amount : amount;
        return [
            cleanLabel(row[0]),
            formatDate(row[1]),
            row[2],
            parseAmount(finalAmount),
            diario
        ];
    });
    return [['ETIQUETA', 'FECHA', 'REFERENCIA', 'IMPORTE', 'DIARIO'], ...rows];
};

// Familia 2: Exterior (FRANCO / R / Y / W / AL) -> Mantiene cabecera, invierte fechas MM/DD
const processExteriorTipo2 = (data, diario) => {
    const formatDateExterior = (dateStr) => {
        if (!dateStr || typeof dateStr !== 'string') return dateStr;
        const parts = dateStr.split('/');
        return parts.length === 3 ? `${parts[1]}/${parts[0]}/${parts[2]}` : dateStr;
    };
    const rows = data.map(row => [
        cleanLabelForStructure2(row[3]),
        formatDateExterior(row[1]),
        row[4],
        parseAmount(row[5]),
        diario
    ]);
    return [['ETIQUETA', 'FECHA', 'REFERENCIA', 'IMPORTE', 'DIARIO'], ...rows];
};

// Familia 3: Venezuela -> Mapeo dinámico por nombres de columna originales
const processVenezuela = (data, diario) => {
    if (!data.length) return [['ETIQUETA', 'FECHA', 'REFERENCIA', 'IMPORTE', 'DIARIO']];
    const headers = data[0].map(h => {
        if (typeof h === 'string') {
            if (h.toLowerCase() === 'monto') return 'IMPORTE';
            if (h.toLowerCase() === 'concepto') return 'ETIQUETA';
            return h.toUpperCase();
        }
        return h;
    });
    const idx = {
        ETIQUETA: headers.indexOf('ETIQUETA'),
        FECHA: headers.indexOf('FECHA'),
        REFERENCIA: headers.indexOf('REFERENCIA'),
        IMPORTE: headers.indexOf('IMPORTE')
    };
    const rows = data.slice(1).map(row => [
        cleanLabel(row[idx.ETIQUETA]),
        row[idx.FECHA],
        row[idx.REFERENCIA],
        parseAmount(row[idx.IMPORTE]),
        diario
    ]);
    return [['ETIQUETA', 'FECHA', 'REFERENCIA', 'IMPORTE', 'DIARIO'], ...rows];
};

// Familia 4: Bancaribe -> Manejo de fechas seriales de Excel y lógica de referencias TDDC
const processBancaribe = (data, diario) => {
    const excelSerialToDate = (serial) => {
        if (typeof serial !== 'number' || isNaN(serial)) return null;
        return new Date((serial - 25569) * 86400 * 1000);
    };
    const parseBancaribeAmount = (amount) => {
        if (typeof amount === 'number') return amount;
        return parseFloat(String(amount).replace(/\./g, '').replace(',', '.')) || 0;
    };

    const rows = data.slice(1).map(row => {
        let finalDate = row[0];
        if (typeof row[0] === 'number') {
            const dateObj = excelSerialToDate(row[0]);
            if (dateObj) {
                const day = String(dateObj.getDate()).padStart(2, '0');
                const month = String(dateObj.getMonth() + 1).padStart(2, '0');
                finalDate = `${day}/${month}/${dateObj.getFullYear()}`;
            }
        }
        let amountWithSign = row[4];
        if (row[3] === 'D') amountWithSign = '-' + row[4];
        let finalReference = String(row[1] || '');
        if (/TD[DC] - ADMINISTRACION/.test(row[2] || '')) {
            if (finalReference.length >= 11) finalReference = finalReference.substring(7, 10);
        }
        return [
            cleanLabel(row[2]),
            finalDate,
            finalReference,
            parseBancaribeAmount(amountWithSign),
            diario
        ];
    });
    return [['ETIQUETA', 'FECHA', 'REFERENCIA', 'IMPORTE', 'DIARIO'], ...rows];
};

// Familia 5: Banesco -> Mapeo dinámico e inversión de fecha YYYY/MM/DD
const processBanesco = (data, diario) => {
    if (!data.length) return [['ETIQUETA', 'FECHA', 'REFERENCIA', 'IMPORTE', 'DIARIO']];
    const headers = data[0].map(h => {
        if (typeof h === 'string') {
            if (h.toLowerCase() === 'monto') return 'IMPORTE';
            if (h.toLowerCase().includes('descripci')) return 'ETIQUETA';
            return h.toUpperCase();
        }
        return h;
    });
    const idx = {
        ETIQUETA: headers.indexOf('ETIQUETA'),
        FECHA: headers.indexOf('FECHA'),
        REFERENCIA: headers.indexOf('REFERENCIA'),
        IMPORTE: headers.indexOf('IMPORTE')
    };
    const formatDateBanesco = (dateStr) => {
        if (!dateStr || typeof dateStr !== 'string') return dateStr;
        const parts = dateStr.split('/');
        return parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : dateStr;
    };
    const rows = data.slice(1).map(row => [
        cleanLabel(row[idx.ETIQUETA]),
        formatDateBanesco(row[idx.FECHA]),
        row[idx.REFERENCIA],
        parseAmount(row[idx.IMPORTE]),
        diario
    ]);
    return [['ETIQUETA', 'FECHA', 'REFERENCIA', 'IMPORTE', 'DIARIO'], ...rows];
};

// Familia 6: Provincial -> Detección difusa de nombres de columna con fallbacks fijos
const processProvincial = (data, diario) => {
    if (!data.length) return [['ETIQUETA', 'FECHA', 'REFERENCIA', 'IMPORTE', 'DIARIO']];
    const headers = data[0].map(h => {
        if (typeof h === 'string') {
            let normalized = h.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "").trim();
            if (normalized.includes('descrip') || normalized.includes('concepto') || normalized.includes('detalle')) return 'ETIQUETA';
            if (normalized.includes('fecha')) return 'FECHA';
            if (normalized.includes('referencia') || normalized.includes('refer')) return 'REFERENCIA';
            if (normalized.includes('importe') || normalized.includes('monto')) return 'IMPORTE';
        }
        return h;
    });
    const idxETIQUETA = headers.indexOf('ETIQUETA') !== -1 ? headers.indexOf('ETIQUETA') : 2;
    const idxFECHA = headers.indexOf('FECHA') !== -1 ? headers.indexOf('FECHA') : 0;
    const idxREFERENCIA = headers.indexOf('REFERENCIA') !== -1 ? headers.indexOf('REFERENCIA') : 1;
    const idxIMPORTE = headers.indexOf('IMPORTE') !== -1 ? headers.indexOf('IMPORTE') : 4;

    const rows = data.slice(1).map(row => [
        cleanLabel(row[idxETIQUETA] || ""),
        (row[idxFECHA] || "").toString().replace(/-/g, '/'),
        (row[idxREFERENCIA] || "").toString().trim(),
        parseAmount(row[idxIMPORTE] || "0"),
        diario
    ]);
    return [['ETIQUETA', 'FECHA', 'REFERENCIA', 'IMPORTE', 'DIARIO'], ...rows];
};

// Familia 7: Banco del Tesoro -> Escaneo dinámico de fila de cabecera y fusión Débito/Crédito
const processBancoTesoro = (data, diario) => {
    if (!Array.isArray(data) || data.length === 0) {
        return [['ETIQUETA', 'FECHA', 'REFERENCIA', 'IMPORTE', 'DIARIO']];
    }
    const normalizeText = (cell) => typeof cell === 'string' ? cell.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') : '';
    
    let headerRowIndex = data.findIndex(row => {
        if (!Array.isArray(row)) return false;
        const normRow = row.map(normalizeText);
        return normRow.some(c => c.includes('fecha')) &&
               normRow.some(c => c.includes('referencia')) &&
               normRow.some(c => c.includes('concepto') || c.includes('detalle') || c.includes('movimiento'));
    });

    if (headerRowIndex === -1) headerRowIndex = 3;

    const headerNames = (data[headerRowIndex] || []).map(normalizeText);
    const idxFecha = headerNames.findIndex(h => h.includes('fecha'));
    const idxReferencia = headerNames.findIndex(h => h.includes('referencia'));
    const idxConcepto = headerNames.findIndex(h => h.includes('concepto') || h.includes('detalle') || h.includes('movimiento'));
    const idxDebito = headerNames.findIndex(h => h.includes('debito') || h.includes('deb'));
    const idxCredito = headerNames.findIndex(h => h.includes('credito') || h.includes('cred'));

    const finalIdxDebito = idxDebito !== -1 ? idxDebito : 5;
    const finalIdxCredito = idxCredito !== -1 ? idxCredito : 6;

    const parseDateValue = (value) => {
        if (typeof value === 'number' && !isNaN(value)) {
            const dateObj = excelDateToJSDate(value);
            if (dateObj instanceof Date && !isNaN(dateObj)) {
                return `${String(dateObj.getDate()).padStart(2, '0')}/${String(dateObj.getMonth() + 1).padStart(2, '0')}/${dateObj.getFullYear()}`;
            }
        }
        if (typeof value === 'string') {
            const text = value.trim();
            if (text.includes('/')) return formatDate(text);
            if (text.includes('-')) {
                const parts = text.split('-');
                if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
            }
        }
        return value;
    };
    const rows = data.slice(headerRowIndex + 1).map(row => {
        const debito = parseAmount(row[finalIdxDebito] || 0);
        const credito = parseAmount(row[finalIdxCredito] || 0);
        const importe = debito !== 0 ? -Math.abs(debito) : credito;
        
        // Extraemos y formateamos los valores base de la fila actual
        const etiquetaRaw = row[idxConcepto] || '';
        const fechaFormateada = parseDateValue(row[idxFecha] || '');
        let referenciaFinal = String(row[idxReferencia] || '').trim();

        // =========================================================================
        // NUEVA REGLA: Inyección de referencias dinámicas para TDD vacías
        // =========================================================================
        const etiquetaStr = String(etiquetaRaw);
        const patrones = ["LQ TDD 87949028", "COM/LIQ/TDD 87949028", "LQ TDC 87949028", "COM/LIQ/TDC 87949028", "DB TDD 87949028", "LQ ELE 87949028", "COM/LIQ/ELE 87949028", "COM. ASIGNACION MCD CORPORATIV"];

        for (const patron of patrones) {
            if (etiquetaStr.includes(patron)) {
                // Extraemos lo que quede a la derecha del patrón (ej: " VAL-4567")
                const resto = etiquetaStr.split(patron)[1] || "";
                
                // Creamos la referencia uniendo la Fecha Formateada + Resto de la etiqueta (sin espacios)
                referenciaFinal = `${fechaFormateada}${resto}`.replace(/\s+/g, '').trim();
                break; // Rompemos el ciclo al encontrar la primera coincidencia
            }
        }
        // =========================================================================

        return [
            cleanLabel(etiquetaRaw),
            fechaFormateada,
            referenciaFinal, // Retorna la original del banco o la autogenerada arriba
            importe,
            diario
        ];
    });

    return [['ETIQUETA', 'FECHA', 'REFERENCIA', 'IMPORTE', 'DIARIO'], ...rows];
};

// ==========================================
// EXPORTACIÓN DE ESTRUCTURAS (MAPEO)
// ==========================================
export const transformations = {
    // Estructuras Tipo 1 (Exterior)
    "1-ExteriorAVIPRORCA": (data) => processExteriorTipo1(data, "Exterior AVIPRORCA"),
    "1.1-Exterior $ AVIPRORCA": (data) => processExteriorTipo1(data, "Exterior Dolares AVIPRORCA"),
    "1.2-Exterior Avip Divisas Electronicas": (data) => processExteriorTipo1(data, "Exterior Avip Divisas Electronicas"),
    "1-ExteriorDetalesHPC": (data) => processExteriorTipo1(data, "Exterior Detales HPC"),

    // Estructuras Tipo 2 (Exterior variantes)
    "2-ExteriorFRANCO": (data) => processExteriorTipo2(data, "Exterior FRANCO"),
    "2-Exterior(R)": (data) => processExteriorTipo2(data, "Exterior (R)"),
    "2-Exterior R Divisas $": (data) => processExteriorTipo2(data, "Exterior R Divisas $"),
    "2-Exterior(Y)": (data) => processExteriorTipo2(data, "Exterior (Y)"),
    "2-Exterior(W)": (data) => processExteriorTipo2(data, "Exterior (W)"),
    "2-Exterior W Divisas $": (data) => processExteriorTipo2(data, "Exterior W Divisas $"),
    "2-Exterior(AL)": (data) => processExteriorTipo2(data, "Exterior (AL)"),
    "2-Exterior AL Divisas $": (data) => processExteriorTipo2(data, "Exterior AL Divisas $"),

    // Estructuras Tipo 3 (Venezuela)
    "3-VenezuelaAVIPRORCA": (data) => processVenezuela(data, "Venezuela AVIPRORCA"),
    "3-VenezuelaDetalesHPC": (data) => processVenezuela(data, "Venezuela Detales HPC"),

    // Estructuras Tipo 4 (Bancaribe)
    "4-BancaribeAVIPRORCA": (data) => processBancaribe(data, "Bancaribe AVIPRORCA"),
    "4-BancaribeDetalesHPC": (data) => processBancaribe(data, "Bancaribe Detales HPC"),
    "4.1-BancaribeFranco": (data) => processBancaribe(data, "BanCaribe Franco"),
    "4.2-Bancaribe_Aviprorca_Divisas_$": (data) => processBancaribe(data, "Ban Caribe Aviprorca Divisas $"),

    // Estructuras Tipo 5 (Banesco)
    "5-BanescoAVIPRORCA": (data) => processBanesco(data, "Banesco AVIPRORCA"),
    "5-BanescoFRANCO": (data) => processBanesco(data, "Banesco FRANCO"),

    // Estructura Tipo 6 (Provincial)
    "6-ProvincialAVIPRORCA": (data) => processProvincial(data, "Provincial AVIPRORCA"),

    // Nueva Estructura Tipo 7 (Banco del Tesoro)
    "7-Banco_del_TesoroAVIPRORCA": (data) => processBancoTesoro(data, "Banco del Tesoro"),
    "7.1-Banco_del_TesoroAVIPRORCA$": (data) => processBancoTesoro(data, "Banco del Tesoro Divisas $")
};
