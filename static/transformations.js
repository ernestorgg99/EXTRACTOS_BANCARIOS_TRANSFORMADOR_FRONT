import { cleanLabel, parseAmount, excelDateToJSDate, formatDate, cleanLabelForStructure2 } from './utils.js';

export const transformations = {
    // Estructura 1: Exterior AVIPRORCA
    "1-ExteriorAVIPRORCA": (data) => {
        let result = JSON.parse(JSON.stringify(data));
        result.shift();
        result = result.map(row => {
            const amount = String(row[3] || '');
            const sign = String(row[4] || '');
            row[3] = sign.trim() === '-' ? '-' + amount : amount;
            return row;
        });
        result = result.map(row => { row.splice(4, 2); return row; });
        const diario = "Exterior AVIPRORCA";
        result = result.map(row => [
            cleanLabel(row[0]),
            formatDate(row[1]),
            row[2],
            parseAmount(row[3]),
            diario
        ]);
        result.unshift(['ETIQUETA', 'FECHA', 'REFERENCIA', 'IMPORTE', 'DIARIO']);
        return result;
    },
    "1.1-Exterior $ AVIPRORCA": (data) => {
        let result = JSON.parse(JSON.stringify(data));
        result.shift();
        result = result.map(row => {
            const amount = String(row[3] || '');
            const sign = String(row[4] || '');
            row[3] = sign.trim() === '-' ? '-' + amount : amount;
            return row;
        });
        result = result.map(row => { row.splice(4, 2); return row; });
        const diario = "Exterior Dolares AVIPRORCA";
        result = result.map(row => [
            cleanLabel(row[0]),
            formatDate(row[1]),
            row[2],
            parseAmount(row[3]),
            diario
        ]);
        result.unshift(['ETIQUETA', 'FECHA', 'REFERENCIA', 'IMPORTE', 'DIARIO']);
        return result;
    },
    "1-ExteriorDetalesHPC": (data) => {
        let result = JSON.parse(JSON.stringify(data));
        result.shift();
        result = result.map(row => {
            const amount = String(row[3] || '');
            const sign = String(row[4] || '');
            row[3] = sign.trim() === '-' ? '-' + amount : amount;
            return row;
        });
        result = result.map(row => { row.splice(4, 2); return row; });
        const diario = "Exterior Detales HPC";
        result = result.map(row => [
            cleanLabel(row[0]),
            formatDate(row[1]),
            row[2],
            parseAmount(row[3]),
            diario
        ]);
        result.unshift(['ETIQUETA', 'FECHA', 'REFERENCIA', 'IMPORTE', 'DIARIO']);
        return result;
    },
    "2-ExteriorFRANCO": (data) => {
        let result = JSON.parse(JSON.stringify(data));
        const diario = "Exterior FRANCO";
        const formatDateExterior = (dateStr) => {
            if (!dateStr || typeof dateStr !== 'string') return dateStr;
            const parts = dateStr.split('/');
            if (parts.length === 3) return `${parts[1]}/${parts[0]}/${parts[2]}`;
            return dateStr;
        };
        result = result.map(row => [
            cleanLabelForStructure2(row[3]),
            formatDateExterior(row[1]),
            row[4],
            parseAmount(row[5]),
            diario
        ]);
        result.unshift(['ETIQUETA', 'FECHA', 'REFERENCIA', 'IMPORTE', 'DIARIO']);
        return result;
    },
    "2-Exterior(R)": (data) => {
        let result = JSON.parse(JSON.stringify(data));
        const diario = "Exterior (R)";
        const formatDateExterior = (dateStr) => {
            if (!dateStr || typeof dateStr !== 'string') return dateStr;
            const parts = dateStr.split('/');
            if (parts.length === 3) return `${parts[1]}/${parts[0]}/${parts[2]}`;
            return dateStr;
        };
        result = result.map(row => [
            cleanLabelForStructure2(row[3]),
            formatDateExterior(row[1]),
            row[4],
            parseAmount(row[5]),
            diario
        ]);
        result.unshift(['ETIQUETA', 'FECHA', 'REFERENCIA', 'IMPORTE', 'DIARIO']);
        return result;
    },
    "2-Exterior R Divisas $": (data) => {
        let result = JSON.parse(JSON.stringify(data));
        const diario = "Exterior R Divisas $";
        const formatDateExterior = (dateStr) => {
            if (!dateStr || typeof dateStr !== 'string') return dateStr;
            const parts = dateStr.split('/');
            if (parts.length === 3) return `${parts[1]}/${parts[0]}/${parts[2]}`;
            return dateStr;
        };
        result = result.map(row => [
            cleanLabelForStructure2(row[3]),
            formatDateExterior(row[1]),
            row[4],
            parseAmount(row[5]),
            diario
        ]);
        result.unshift(['ETIQUETA', 'FECHA', 'REFERENCIA', 'IMPORTE', 'DIARIO']);
        return result;
    },
    "2-Exterior(Y)": (data) => {
        let result = JSON.parse(JSON.stringify(data));
        const diario = "Exterior (Y)";
        const formatDateExterior = (dateStr) => {
            if (!dateStr || typeof dateStr !== 'string') return dateStr;
            const parts = dateStr.split('/');
            if (parts.length === 3) return `${parts[1]}/${parts[0]}/${parts[2]}`;
            return dateStr;
        };
        result = result.map(row => [
            cleanLabelForStructure2(row[3]),
            formatDateExterior(row[1]),
            row[4],
            parseAmount(row[5]),
            diario
        ]);
        result.unshift(['ETIQUETA', 'FECHA', 'REFERENCIA', 'IMPORTE', 'DIARIO']);
        return result;
    },
    "2-Exterior(W)": (data) => {
        let result = JSON.parse(JSON.stringify(data));
        const diario = "Exterior (W)";
        const formatDateExterior = (dateStr) => {
            if (!dateStr || typeof dateStr !== 'string') return dateStr;
            const parts = dateStr.split('/');
            if (parts.length === 3) return `${parts[1]}/${parts[0]}/${parts[2]}`;
            return dateStr;
        };
        result = result.map(row => [
            cleanLabelForStructure2(row[3]),
            formatDateExterior(row[1]),
            row[4],
            parseAmount(row[5]),
            diario
        ]);
        result.unshift(['ETIQUETA', 'FECHA', 'REFERENCIA', 'IMPORTE', 'DIARIO']);
        return result;
    },
    "2-Exterior W Divisas $": (data) => {
        let result = JSON.parse(JSON.stringify(data));
        const diario = "Exterior W Divisas $";
        const formatDateExterior = (dateStr) => {
            if (!dateStr || typeof dateStr !== 'string') return dateStr;
            const parts = dateStr.split('/');
            if (parts.length === 3) return `${parts[1]}/${parts[0]}/${parts[2]}`;
            return dateStr;
        };
        result = result.map(row => [
            cleanLabelForStructure2(row[3]),
            formatDateExterior(row[1]),
            row[4],
            parseAmount(row[5]),
            diario
        ]);
        result.unshift(['ETIQUETA', 'FECHA', 'REFERENCIA', 'IMPORTE', 'DIARIO']);
        return result;
    },
    "2-Exterior(AL)": (data) => {
        let result = JSON.parse(JSON.stringify(data));
        const diario = "Exterior (AL)";
        const formatDateExterior = (dateStr) => {
            if (!dateStr || typeof dateStr !== 'string') return dateStr;
            const parts = dateStr.split('/');
            if (parts.length === 3) return `${parts[1]}/${parts[0]}/${parts[2]}`;
            return dateStr;
        };
        result = result.map(row => [
            cleanLabelForStructure2(row[3]),
            formatDateExterior(row[1]),
            row[4],
            parseAmount(row[5]),
            diario
        ]);
        result.unshift(['ETIQUETA', 'FECHA', 'REFERENCIA', 'IMPORTE', 'DIARIO']);
        return result;
    },
    "2-Exterior AL Divisas $": (data) => {
        let result = JSON.parse(JSON.stringify(data));
        const diario = "Exterior AL Divisas $";
        const formatDateExterior = (dateStr) => {
            if (!dateStr || typeof dateStr !== 'string') return dateStr;
            const parts = dateStr.split('/');
            if (parts.length === 3) return `${parts[1]}/${parts[0]}/${parts[2]}`;
            return dateStr;
        };
        result = result.map(row => [
            cleanLabelForStructure2(row[3]),
            formatDateExterior(row[1]),
            row[4],
            parseAmount(row[5]),
            diario
        ]);
        result.unshift(['ETIQUETA', 'FECHA', 'REFERENCIA', 'IMPORTE', 'DIARIO']);
        return result;
    },
    "3-VenezuelaAVIPRORCA": (data) => {
        let result = JSON.parse(JSON.stringify(data));
        const diario = "Venezuela AVIPRORCA";
        let headers = result[0].map(h => {
            if (typeof h === 'string') {
                if (h.toLowerCase() === 'monto') return 'IMPORTE';
                if (h.toLowerCase() === 'concepto') return 'ETIQUETA';
                return h.toUpperCase();
            }
            return h;
        });
        result[0] = headers;
        result = result.map(row => {
            row.splice(7, 2);
            row.splice(5, 1);
            row.splice(3, 1);
            return row;
        });
        const oldIndices = {
            ETIQUETA: headers.indexOf('ETIQUETA'),
            FECHA: headers.indexOf('FECHA'),
            REFERENCIA: headers.indexOf('REFERENCIA'),
            IMPORTE: headers.indexOf('IMPORTE')
        };
        result = result.map((row, index) => [
            cleanLabel(row[oldIndices.ETIQUETA]),
            row[oldIndices.FECHA],
            row[oldIndices.REFERENCIA],
            index > 0 ? parseAmount(row[oldIndices.IMPORTE]) : row[oldIndices.IMPORTE],
            diario
        ]);
        result[0] = ['ETIQUETA', 'FECHA', 'REFERENCIA', 'IMPORTE', 'DIARIO'];
        return result;
    },
    "3-VenezuelaDetalesHPC": (data) => {
        let result = JSON.parse(JSON.stringify(data));
        const diario = "Venezuela Detales HPC";
        let headers = result[0].map(h => {
            if (typeof h === 'string') {
                if (h.toLowerCase() === 'monto') return 'IMPORTE';
                if (h.toLowerCase() === 'concepto') return 'ETIQUETA';
                return h.toUpperCase();
            }
            return h;
        });
        result[0] = headers;
        result = result.map(row => {
            row.splice(7, 2);
            row.splice(5, 1);
            row.splice(3, 1);
            return row;
        });
        const oldIndices = {
            ETIQUETA: headers.indexOf('ETIQUETA'),
            FECHA: headers.indexOf('FECHA'),
            REFERENCIA: headers.indexOf('REFERENCIA'),
            IMPORTE: headers.indexOf('IMPORTE')
        };
        result = result.map((row, index) => [
            cleanLabel(row[oldIndices.ETIQUETA]),
            row[oldIndices.FECHA],
            row[oldIndices.REFERENCIA],
            index > 0 ? parseAmount(row[oldIndices.IMPORTE]) : row[oldIndices.IMPORTE],
            diario
        ]);
        result[0] = ['ETIQUETA', 'FECHA', 'REFERENCIA', 'IMPORTE', 'DIARIO'];
        return result;
    },
    "4-BancaribeAVIPRORCA": (data) => {
        const excelSerialToDate = (serial) => {
            if (typeof serial !== 'number' || isNaN(serial)) return null;
            const daysSince1900 = serial - 25569;
            return new Date(daysSince1900 * 86400 * 1000);
        };
        const parseBancaribeAmount = (amount) => {
            if (typeof amount === 'number') return amount;
            let cleaned = String(amount).replace(/\./g, '').replace(',', '.');
            return parseFloat(cleaned) || 0;
        };
        let result = JSON.parse(JSON.stringify(data));
        result.shift();
        const diario = "Bancaribe AVIPRORCA";
        const transformedRows = result.map(row => {
            let finalDate = row[0];
            if (typeof row[0] === 'number') {
                const dateObj = excelSerialToDate(row[0]);
                if (dateObj) {
                    const day = String(dateObj.getDate()).padStart(2, '0');
                    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
                    const year = dateObj.getFullYear();
                    finalDate = `${day}/${month}/${year}`;
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
        transformedRows.unshift(['ETIQUETA', 'FECHA', 'REFERENCIA', 'IMPORTE', 'DIARIO']);
        return transformedRows;
    },
    "4-BancaribeDetalesHPC": (data) => {
        const excelSerialToDate = (serial) => {
            if (typeof serial !== 'number' || isNaN(serial)) return null;
            const daysSince1900 = serial - 25569;
            return new Date(daysSince1900 * 86400 * 1000);
        };
        const parseBancaribeAmount = (amount) => {
            if (typeof amount === 'number') return amount;
            let cleaned = String(amount).replace(/\./g, '').replace(',', '.');
            return parseFloat(cleaned) || 0;
        };
        let result = JSON.parse(JSON.stringify(data));
        result.shift();
        const diario = "Bancaribe Detales HPC";
        const transformedRows = result.map(row => {
            let finalDate = row[0];
            if (typeof row[0] === 'number') {
                const dateObj = excelSerialToDate(row[0]);
                if (dateObj) {
                    const day = String(dateObj.getDate()).padStart(2, '0');
                    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
                    const year = dateObj.getFullYear();
                    finalDate = `${day}/${month}/${year}`;
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
        transformedRows.unshift(['ETIQUETA', 'FECHA', 'REFERENCIA', 'IMPORTE', 'DIARIO']);
        return transformedRows;
    },
    "4.1-BancaribeFranco": (data) => {
        const excelSerialToDate = (serial) => {
            if (typeof serial !== 'number' || isNaN(serial)) return null;
            const daysSince1900 = serial - 25569;
            return new Date(daysSince1900 * 86400 * 1000);
        };
        const parseBancaribeAmount = (amount) => {
            if (typeof amount === 'number') return amount;
            let cleaned = String(amount).replace(/\./g, '').replace(',', '.');
            return parseFloat(cleaned) || 0;
        };
        let result = JSON.parse(JSON.stringify(data));
        result.shift();
        const diario = "BanCaribe Franco";
        const transformedRows = result.map(row => {
            let finalDate = row[0];
            if (typeof row[0] === 'number') {
                const dateObj = excelSerialToDate(row[0]);
                if (dateObj) {
                    const day = String(dateObj.getDate()).padStart(2, '0');
                    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
                    const year = dateObj.getFullYear();
                    finalDate = `${day}/${month}/${year}`;
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
        transformedRows.unshift(['ETIQUETA', 'FECHA', 'REFERENCIA', 'IMPORTE', 'DIARIO']);
        return transformedRows;
    },
    "5-BanescoAVIPRORCA": (data) => {
        let result = JSON.parse(JSON.stringify(data));
        let headers = result[0].map(h => {
            if (typeof h === 'string') {
                if (h.toLowerCase() === 'monto') return 'IMPORTE';
                if (h.toLowerCase().includes('descripci')) return 'ETIQUETA';
                return h.toUpperCase();
            }
            return h;
        });
        result[0] = headers;
        result = result.map(row => { row.splice(4, 1); return row; });
        const diario = "Banesco AVIPRORCA";
        const headerRow = result[0];
        const oldIndices = {
            ETIQUETA: headerRow.indexOf('ETIQUETA'),
            FECHA: headerRow.indexOf('FECHA'),
            REFERENCIA: headerRow.indexOf('REFERENCIA'),
            IMPORTE: headerRow.indexOf('IMPORTE')
        };
        const formatDateBanesco = (dateStr) => {
            if (!dateStr || typeof dateStr !== 'string') return dateStr;
            const parts = dateStr.split('/');
            if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
            return dateStr;
        };
        result = result.map((row, index) => [
            cleanLabel(row[oldIndices.ETIQUETA]),
            index > 0 ? formatDateBanesco(row[oldIndices.FECHA]) : row[oldIndices.FECHA],
            row[oldIndices.REFERENCIA],
            index > 0 ? parseAmount(row[oldIndices.IMPORTE]) : row[oldIndices.IMPORTE],
            diario
        ]);
        result[0] = ['ETIQUETA', 'FECHA', 'REFERENCIA', 'IMPORTE', 'DIARIO'];
        return result;
    },
    "5-BanescoFRANCO": (data) => {
        let result = JSON.parse(JSON.stringify(data));
        let headers = result[0].map(h => {
            if (typeof h === 'string') {
                if (h.toLowerCase() === 'monto') return 'IMPORTE';
                if (h.toLowerCase().includes('descripci')) return 'ETIQUETA';
                return h.toUpperCase();
            }
            return h;
        });
        result[0] = headers;
        result = result.map(row => { row.splice(4, 1); return row; });
        const diario = "Banesco FRANCO";
        const headerRow = result[0];
        const oldIndices = {
            ETIQUETA: headerRow.indexOf('ETIQUETA'),
            FECHA: headerRow.indexOf('FECHA'),
            REFERENCIA: headerRow.indexOf('REFERENCIA'),
            IMPORTE: headerRow.indexOf('IMPORTE')
        };
        const formatDateBanesco = (dateStr) => {
            if (!dateStr || typeof dateStr !== 'string') return dateStr;
            const parts = dateStr.split('/');
            if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
            return dateStr;
        };
        result = result.map((row, index) => [
            cleanLabel(row[oldIndices.ETIQUETA]),
            index > 0 ? formatDateBanesco(row[oldIndices.FECHA]) : row[oldIndices.FECHA],
            row[oldIndices.REFERENCIA],
            index > 0 ? parseAmount(row[oldIndices.IMPORTE]) : row[oldIndices.IMPORTE],
            diario
        ]);
        result[0] = ['ETIQUETA', 'FECHA', 'REFERENCIA', 'IMPORTE', 'DIARIO'];
        return result;
    },
    // ==================== PROVINCIAL CORREGIDO ====================
    "6-ProvincialAVIPRORCA": (data) => {
        let result = JSON.parse(JSON.stringify(data));
        // Detección flexible de columnas
        let headers = result[0].map((h, idx) => {
            if (typeof h === 'string') {
                let normalized = h.toLowerCase()
                                 .normalize("NFD")
                                 .replace(/[\u0300-\u036f]/g, "")
                                 .replace(/[^a-z0-9]/g, "")
                                 .trim();
                // Acepta "descrip" (cubre Descripción, Descripci�n, etc.)
                if (normalized.includes('descrip') || normalized.includes('concepto') || normalized.includes('detalle')) {
                    return 'ETIQUETA';
                }
                if (normalized.includes('fecha')) return 'FECHA';
                if (normalized.includes('referencia') || normalized.includes('refer')) return 'REFERENCIA';
                if (normalized.includes('importe') || normalized.includes('monto')) return 'IMPORTE';
            }
            return h;
        });
        result[0] = headers;
        const idx = {
            ETIQUETA: headers.indexOf('ETIQUETA'),
            FECHA: headers.indexOf('FECHA'),
            REFERENCIA: headers.indexOf('REFERENCIA'),
            IMPORTE: headers.indexOf('IMPORTE')
        };
        // Si no encuentra alguna, asume posiciones por defecto (ajusta según tu archivo)
        if (idx.ETIQUETA === -1) idx.ETIQUETA = 2;   // comúnmente columna 3
        if (idx.FECHA === -1) idx.FECHA = 0;
        if (idx.REFERENCIA === -1) idx.REFERENCIA = 1;
        if (idx.IMPORTE === -1) idx.IMPORTE = 4;
        return result.map((row, index) => {
            if (index === 0) return ['ETIQUETA', 'FECHA', 'REFERENCIA', 'IMPORTE', 'DIARIO'];
            const etiquetaRaw = row[idx.ETIQUETA] || "";
            const fechaRaw = row[idx.FECHA] || "";
            const referenciaRaw = row[idx.REFERENCIA] || "";
            const importeRaw = row[idx.IMPORTE] || "0";
            return [
                cleanLabel(etiquetaRaw),
                fechaRaw.toString().replace(/-/g, '/'),
                referenciaRaw.toString().trim(),
                parseAmount(importeRaw),
                "Provincial AVIPRORCA"
            ];
        });
    }
};