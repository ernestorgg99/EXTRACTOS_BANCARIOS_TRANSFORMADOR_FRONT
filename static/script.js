// Variable global para almacenar los datos del archivo procesado
let appState = {
    workbookData: null,
    currentFileName: ""
};

// Elementos del DOM
const dropArea = document.getElementById('drop-area');
const fileElem = document.getElementById('fileElem');
const fileInfo = document.getElementById('file-info');
const previewTable = document.getElementById('preview-table');
const transformButtons = document.querySelectorAll('.transform-btn');
const exportBtn = document.getElementById('exportBtn');

// Inicializar pestañas y modo oscuro
function initTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.dataset.tab;
            document.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
            document.getElementById(`tab-${tabId}`).classList.add('active');
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
}
function initDarkMode() {
    const toggle = document.getElementById('darkModeToggle');
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark');
        toggle.textContent = '☀️';
    }
    toggle.addEventListener('click', () => {
        document.body.classList.toggle('dark');
        const isDark = document.body.classList.contains('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        toggle.textContent = isDark ? '☀️' : '🌙';
    });
}

// Toast notifications
function mostrarToast(mensaje, tipo = 'info') {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = mensaje;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// --- MANEJO DE EVENTOS DRAG & DROP ---
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false);
});
function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}
['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, () => dropArea.classList.add('highlight'), false);
});
['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, () => dropArea.classList.remove('highlight'), false);
});
dropArea.addEventListener('drop', handleDrop, false);
fileElem.addEventListener('change', handleFileSelect, false);

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFile(files[0]);
}
function handleFileSelect(e) {
    const files = e.target.files;
    if (files.length) handleFile(files[0]);
}

// --- PROCESAMIENTO DE ARCHIVOS ---
function handleFile(file) {
    if (!file) return;
    appState.currentFileName = file.name.split('.').slice(0, -1).join('.');
    fileInfo.textContent = `Archivo cargado: ${file.name}`;
    const reader = new FileReader();
    const fileExtension = file.name.split('.').pop().toLowerCase();
    reader.onload = function(e) {
        try {
            let workbook;
            if (fileExtension === 'csv') {
                const csvData = e.target.result;
                workbook = XLSX.read(csvData, { type: 'string', raw: true });
            } else {
                const data = e.target.result;
                workbook = XLSX.read(data, { type: 'array', raw: true });
            }
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            appState.workbookData = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: false, defval: "" });
            displayPreview(appState.workbookData);
            mostrarToast(`✅ Archivo "${file.name}" cargado correctamente`);
        } catch (error) {
            mostrarToast(`❌ Error al leer el archivo: ${error.message}`, 'error');
            console.error(error);
        }
    };
    if (fileExtension === 'csv') {
        reader.readAsText(file, 'UTF-8');
    } else {
        reader.readAsArrayBuffer(file);
    }
}

function displayPreview(data) {
    previewTable.innerHTML = '';
    if (!data || data.length === 0) return;
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');
    const previewData = data.slice(0, 10000);
    previewData.forEach((row, rowIndex) => {
        const tr = document.createElement('tr');
        row.forEach((cell, colIndex) => {
            const cellElement = document.createElement(rowIndex === 0 ? 'th' : 'td');
            cellElement.textContent = String(cell);
            if (rowIndex !== 0 && colIndex === 3 && typeof cell === 'string' && cell.includes('DUPLICADO')) {
                cellElement.classList.add('duplicado');
                cellElement.title = 'Movimiento duplicado en el sistema';
            }
            tr.appendChild(cellElement);
        });
        if (rowIndex === 0) thead.appendChild(tr);
        else tbody.appendChild(tr);
    });
    previewTable.appendChild(thead);
    previewTable.appendChild(tbody);
}

// --- COMUNICACIÓN CON BACKEND ---
const API_BASE_URL = 'https://extractosbancariostransformadorbackend-production.up.railway.app';

const sendDataToBackend = async (data) => {
    const apiUrl = `${API_BASE_URL}/api/check_duplicates`;
    document.getElementById('loading-overlay').style.display = 'flex';
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ movements: data }),
        });
        if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
        const result = await response.json();
        if (result.processed_extract) {
            displayPreview(result.processed_extract);
            mostrarToast("✅ Comparación finalizada. Revisa la tabla para ver los duplicados.");
        } else {
            mostrarToast("⚠️ No se recibió el extracto procesado del servidor.");
        }
    } catch (error) {
        mostrarToast(`❌ Error: ${error.message}`);
        console.error(error);
    } finally {
        document.getElementById('loading-overlay').style.display = 'none';
    }
};

// --- TRANSFORMACIONES Y EVENTOS ---
import { transformations } from './transformations.js';
transformButtons.forEach(button => {
    button.addEventListener('click', async () => {
        if (!appState.workbookData) {
            mostrarToast("Por favor, carga un archivo primero.");
            return;
        }
        const structure = button.dataset.structure;
        if (transformations[structure]) {
            try {
                const originalDataCopy = JSON.parse(JSON.stringify(appState.workbookData));
                const transformedData = transformations[structure](originalDataCopy);
                await sendDataToBackend(transformedData);
            } catch (error) {
                mostrarToast(`Error al transformar: ${error.message}`);
                console.error(error);
            }
        } else {
            mostrarToast(`Estructura no encontrada: ${structure}`);
        }
    });
});

// --- EXPORTAR CSV LIMPIO ---
import { exportToCsv } from './utils.js';
function limpiarYExportar() {
    const tabla = document.querySelector('#preview-table tbody');
    if (!tabla || tabla.rows.length === 0) {
        mostrarToast("No hay datos para exportar.");
        return;
    }
    const filas = Array.from(tabla.rows);
    const datosFiltrados = [];
    const encabezados = ['ETIQUETA', 'FECHA', 'REFERENCIA', 'IMPORTE', 'DIARIO'];
    datosFiltrados.push(encabezados);
    filas.forEach(row => {
        const importeCell = row.cells[3];
        if (importeCell && !importeCell.textContent.includes('DUPLICADO')) {
            const fila = Array.from(row.cells).map(cell => cell.textContent);
            datosFiltrados.push(fila);
        }
    });
    const nombreBase = appState.currentFileName || 'extracto';
    const nombreFinal = `${nombreBase} - extracto limpio.csv`;
    exportToCsv(datosFiltrados, nombreFinal);
    mostrarToast(`✅ Archivo exportado: ${nombreFinal}`);
    setTimeout(() => location.reload(), 1500);
}
window.limpiarYExportar = limpiarYExportar;
exportBtn.addEventListener('click', limpiarYExportar);

// Inicialización
initTabs();
initDarkMode();
window.cerrarModal = () => {}; // legacy

// Verificar estado del servicio al cargar
async function checkServiceStatus() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/status`);
        const data = await response.json();
        if (data.status !== 'aprobado') {
            mostrarToast('⚠️ Servicio no disponible. Contacta al administrador.', 'error');
            // Deshabilitar botones de transformación
            document.querySelectorAll('.transform-btn').forEach(btn => btn.disabled = true);
        }
    } catch (error) {
        console.error('Error verificando estado del servicio:', error);
        mostrarToast('⚠️ No se puede conectar al servicio.', 'error');
    }
}

window.addEventListener('load', checkServiceStatus);