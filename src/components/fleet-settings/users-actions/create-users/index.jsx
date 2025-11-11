// Framework: React (JSX)
// src/components/fleet-settings/pagesModais/listaMotoristas/create-users/index.jsx
import React, { useState, useEffect } from 'react';

// Bibliotecas
import Swal from 'sweetalert2';
import * as pdfjsLib from "pdfjs-dist";
import "pdfjs-dist/build/pdf.worker.min.mjs";
import Tesseract from "tesseract.js";


// Banco de dados (Firebase Realtime Database - SDK modular)
import { db } from '../../../../firebaseConnection';
import { ref, set, get } from 'firebase/database';

// Inputs customizados do projeto
import InputTel from '../../../inputs/InputTelefone';
import InputCpf from '../../../inputs/formatCPF';
import InputData from '../../../inputs/formatDate';

// Ícones
import { IoClose } from "react-icons/io5";
import { MdAddBox } from "react-icons/md";
import { LuSave } from "react-icons/lu";

// Estilos e tema
import { Box, TextDefault } from '../../../../stylesAppDefault';
import { colors } from '../../../../theme';
import {
    Select,
    Input,
    Button,
    ModalAreaTotalDisplay,
    ModalAreaInfo,
    DefaultButton,
    InputHora,
    SmoothReveal
} from './styles';

const CreateUsers = ({ closeModalAddMotorista, empresaIdProp, empresaNome: empresaNomeProp }) => {
    // Cargos e bases vindos do DB
    const [cargos, setCargos] = useState([]);     // [{id, nome, tipoAcesso}]
    const [bases, setBases] = useState([]);     // string[]

    // Estado do formulário
    const [form, setForm] = useState({
        nome: '',
        sobrenome: '',
        cpf: '',
        email: '',
        contato: '',
        status: '',
        horarioEntrada: '',
        horarioSaida: '',
        obs: '',
        base: '',
        senha: '',

        // Cargo (link com DB)
        cargoId: '',
        cargoNome: '',
        tipoAcesso: '', // 'motorista' | 'gestor'

        // CNH (apenas se motorista)
        cnhNumero: '',
        cnhValidade: '',
        cnhCategoria: '',
        cnhPrimeiraHab: '',
        cnhObs: ''
    });

    // Carregar cargos e bases do RTDB (corrigido para fleetBusiness)
    useEffect(() => {
        if (!empresaIdProp) return;

        const fetchData = async () => {
            try {
                // CARGOS: fleetBusiness/<empresaId>/cargos (obj -> array [{id, ...}])
                const snapCargos = await get(ref(db, `fleetBusiness/${empresaIdProp}/cargos`));
                if (snapCargos.exists()) {
                    const obj = snapCargos.val() || {};
                    const arr = Object.keys(obj).map((k) => ({ id: k, ...obj[k] })); // {id, nome, tipoAcesso}
                    setCargos(arr);
                } else {
                    setCargos([]);
                }

                // BASES: fleetBusiness/<empresaId>/bases (array simples). Fallback "Matriz".
                const snapBases = await get(ref(db, `fleetBusiness/${empresaIdProp}/bases`));
                if (snapBases.exists()) {
                    const raw = snapBases.val();
                    const arr = Array.isArray(raw) ? raw : Object.values(raw || {});
                    setBases(arr.length ? arr : ['Matriz']);
                } else {
                    setBases(['Matriz']);
                }
            } catch (err) {
                console.error('Erro ao carregar cargos/bases:', err);
                setCargos([]);
                setBases(['Matriz']);
            }
        };

        fetchData();
    }, [empresaIdProp]);

    // Troca de campos
    const handleChange = (field, value) => {
        // Seleção de cargo por ID -> refletir cargoNome e tipoAcesso
        if (field === 'cargoId') {
            const cargoSel = cargos.find(c => c.id === value);
            if (cargoSel) {
                setForm(prev => ({
                    ...prev,
                    cargoId: cargoSel.id,
                    cargoNome: cargoSel.nome || '',
                    tipoAcesso: cargoSel.tipoAcesso === 'gestor' ? 'gestor' : 'motorista'
                }));
                return;
            } else {
                setForm(prev => ({ ...prev, cargoId: '', cargoNome: '', tipoAcesso: '' }));
                return;
            }
        }

        setForm(prev => ({ ...prev, [field]: value }));
    };

    // Máscara simples para HH:MM
    const handleHoraChange = (field, value) => {
        let v = String(value).replace(/\D/g, '');
        if (v.length >= 3) v = v.slice(0, 2) + ':' + v.slice(2, 4);
        if (v.length > 5) v = v.slice(0, 5);
        handleChange(field, v);
    };

    const isMotorista = form.tipoAcesso === 'motorista';

    const gerarMatriculaUnica = async (empresaId) => {
        const usersRef = ref(db, `fleetBusiness/${empresaId}/users`);
        const snap = await get(usersRef);

        const usadas = new Set();
        if (snap.exists()) {
            const data = snap.val();
            const arr = Array.isArray(data) ? data : Object.values(data || {});
            arr.forEach((u) => {
                if (u && typeof u.matricula === 'string') usadas.add(u.matricula);
                if (u && typeof u.matricula === 'number') usadas.add(String(u.matricula));
            });
        }

        // Gera entre 100000 e 999999 (6 dígitos; sem zero à esquerda)
        let tentativa = 0;
        while (true) {
            const m = String(Math.floor(100000 + Math.random() * 900000));
            if (!usadas.has(m)) return m;
            tentativa++;
            if (tentativa > 50) {
                // fallback ultra-raro: ainda 6 dígitos, mas permite zero à esquerda
                const m2 = String(Math.floor(Math.random() * 1000000)).padStart(6, '0');
                if (!usadas.has(m2)) return m2;
            }
        }
    };

    // Salvar usuário no RTDB (corrigido para fleetBusiness/<empresaId>/users como array)
    const salvarUsuario = async () => {
        // Validações mínimas já existentes no layout
        if (!form.nome || !form.sobrenome || !form.cpf || !form.senha || !form.cargoId || !form.status) {
            Swal.fire('Atenção', 'Preencha os campos obrigatórios.', 'warning');
            return;
        }
        if (isMotorista && (!form.cnhNumero || !form.cnhValidade || !form.cnhCategoria || !form.cnhPrimeiraHab)) {
            Swal.fire('Atenção', 'Preencha os dados da CNH para motoristas.', 'warning');
            return;
        }

        try {
            const usersRef = ref(db, `fleetBusiness/${empresaIdProp}/users`);
            const snap = await get(usersRef);

            let nextIndex = 0;
            if (snap.exists()) {
                const data = snap.val();
                nextIndex = Array.isArray(data) ? data.length : Object.keys(data).length;
            }

            const matricula = await gerarMatriculaUnica(empresaIdProp);

            // Vinculando usuário ao cargo no momento do save: salvamos cargoId, cargoNome e tipoAcesso
            await set(ref(db, `fleetBusiness/${empresaIdProp}/users/${nextIndex}`), {
                matricula, // <<< nova propriedade persistida
                nome: form.nome,
                sobrenome: form.sobrenome,
                cpf: form.cpf,
                email: form.email || '',
                contato: form.contato || '',
                status: form.status || 'ativo',
                horarioEntrada: form.horarioEntrada || '',
                horarioSaida: form.horarioSaida || '',
                obs: form.obs || '',
                base: form.base || 'Matriz',
                senha: form.senha,

                cargoId: form.cargoId,     // <<< vínculo
                // cargoNome: (remoção da duplicidade)
                // tipoAcesso: (remoção da duplicidade)

                cnhNumero: isMotorista ? form.cnhNumero : '',
                cnhValidade: isMotorista ? form.cnhValidade : '',
                cnhCategoria: isMotorista ? form.cnhCategoria : '',
                cnhPrimeiraHab: isMotorista ? form.cnhPrimeiraHab : '',
                cnhObs: isMotorista ? form.cnhObs : '',
                criadoEm: new Date().toISOString()
            });

            Swal.fire('Sucesso', 'Usuário cadastrado e vinculado ao cargo.', 'success');
            closeModalAddMotorista();
        } catch (err) {
            console.error('Erro ao salvar usuário:', err);
            Swal.fire('Erro', 'Não foi possível salvar o usuário. Tente novamente.', 'error');
        }
    };



    /* ---------------------------------------------
 * Dependências esperadas no projeto:
 * - pdfjs-dist (pdfjsLib deve estar disponível)
 * - tesseract.js (createWorker)
 * - SweetAlert2 (Swal)
 * ---------------------------------------------
 * Se ainda não estiverem no escopo, importe onde for conveniente:
 * import * as pdfjsLib from 'pdfjs-dist';
 * import { createWorker } from 'tesseract.js';
 * import Swal from 'sweetalert2';
 */

    // ---------- Utils ----------

    // ---------- PDF: extrai texto "selecionável" ----------
    // ---------- PDF: extrai texto "selecionável" ----------
    const readPdfAsText = async (arrayBuffer) => {
        const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;

        let out = '';
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            out += content.items.map(it => it.str).join(' ') + ' ';
        }
        return out.trim();
    };

    // ---------- OCR imagem/canvas ----------
    const ocrCanvas = async (canvasOrFile) => {
        const worker = await createWorker();
        await worker.loadLanguage('por+eng');
        await worker.initialize('por+eng');
        const { data: { text } } = await worker.recognize(canvasOrFile);
        await worker.terminate();
        return (text || '').trim();
    };

    // ---------- Render PDF -> OCR todas páginas ----------
    const ocrPdfAllPages = async (arrayBuffer, scale = 3.0) => {
        const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;

        let text = '';
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const viewport = page.getViewport({ scale });
            const canvas = document.createElement('canvas');
            canvas.width = Math.ceil(viewport.width);
            canvas.height = Math.ceil(viewport.height);
            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            await page.render({ canvasContext: ctx, viewport }).promise;
            text += ' ' + await ocrCanvas(canvas);
        }
        return text.trim();
    };

    // ---------- QR leitura segura ----------
    const decodeQrFromCanvas = (canvas) => {
        try {
            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const dataClone = new Uint8ClampedArray(imgData.data); // cópia física
            const qr = jsQR(dataClone, imgData.width, imgData.height, { inversionAttempts: 'attemptBoth' });
            return qr?.data || '';
        } catch (err) {
            console.warn('[decodeQrFromCanvas] Falha:', err);
            return '';
        }
    };

    // ---------- QR leitura segura ----------
    // ---------- QR leitura 100% segura (sem detached ArrayBuffer) ----------
    // ---------- QR leitura 100% funcional e sem erro de ArrayBuffer ----------
    // ==========================
    // decodeQrFromPdfAllPages ✅
    // ==========================
    // ======================================================
    // Função completa: decodeQrFromPdfAllPages (versão final)
    // ======================================================
    const decodeQrFromPdfAllPages = async (inputFileOrArrayBuffer, scale = 3.0) => {
        try {
            // 🧩 Garante que sempre teremos um Blob válido
            let pdfBlob;

            if (inputFileOrArrayBuffer instanceof File) {
                // Se o parâmetro for um File, usa diretamente
                pdfBlob = inputFileOrArrayBuffer;
            } else if (inputFileOrArrayBuffer instanceof ArrayBuffer) {
                // Se vier como ArrayBuffer, recria os bytes manualmente
                const copy = new Uint8Array(inputFileOrArrayBuffer.byteLength);
                copy.set(new Uint8Array(inputFileOrArrayBuffer));
                pdfBlob = new Blob([copy], { type: "application/pdf" });
            } else {
                throw new Error("Tipo de entrada inválido para decodeQrFromPdfAllPages.");
            }

            // 🧠 Cria URL temporária — o PDF.js fará o fetch sem tocar no buffer
            const url = URL.createObjectURL(pdfBlob);

            // 🔧 Carrega o PDF via URL (sem ArrayBuffer, sem detach)
            const pdf = await pdfjsLib.getDocument({
                url,
                disableAutoFetch: true,
                disableStream: true,
                useWorkerFetch: false,
            }).promise;

            // 🔍 Percorre todas as páginas tentando achar o QR
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const viewport = page.getViewport({ scale });

                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d", { willReadFrequently: true });
                canvas.width = Math.ceil(viewport.width);
                canvas.height = Math.ceil(viewport.height);

                await page.render({ canvasContext: ctx, viewport }).promise;

                // 🔎 Tenta ler QR do canvas principal
                let payload = decodeQrFromCanvas(canvas);
                if (payload) {
                    URL.revokeObjectURL(url);
                    return payload;
                }

                // 🔁 Segunda tentativa: quadrantes (QR cortado)
                const quadrants = [
                    [0, 0, 0.5, 0.5],
                    [0.5, 0, 0.5, 0.5],
                    [0, 0.5, 0.5, 0.5],
                    [0.5, 0.5, 0.5, 0.5],
                ];

                for (const [x, y, w, h] of quadrants) {
                    const subCanvas = document.createElement("canvas");
                    subCanvas.width = canvas.width * w;
                    subCanvas.height = canvas.height * h;
                    const sctx = subCanvas.getContext("2d", { willReadFrequently: true });

                    sctx.drawImage(
                        canvas,
                        canvas.width * x,
                        canvas.height * y,
                        canvas.width * w,
                        canvas.height * h,
                        0,
                        0,
                        subCanvas.width,
                        subCanvas.height
                    );

                    payload = decodeQrFromCanvas(subCanvas);
                    if (payload) {
                        URL.revokeObjectURL(url);
                        return payload;
                    }
                }
            }

            // 🧹 Libera a URL temporária
            URL.revokeObjectURL(url);
            return "";
        } catch (err) {
            console.error("Erro ao processar PDF QR:", err);
            return "";
        }
    };








    // ---------- Extração de campos ----------
    const extractFields = (raw) => {
        const normalize = (s) =>
            (s || '')
                .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
                .replace(/[|]+/g, ' ')
                .replace(/\s+/g, ' ')
                .trim();

        const onlyDigits = (s) => (s || '').replace(/\D/g, '');

        const up = normalize(raw).toUpperCase();

        // Número
        let numero = '';
        let m = up.match(/(REG(ISTRO)?[^0-9]{0,10})(\d{9,12})/);
        if (m) numero = m[4];

        // Datas
        const datas = up.match(/\b([0-3]\d)[\/\-]([01]\d)[\/\-](\d{4})\b/g) || [];
        let cnhValidade = '', cnhPrimeiraHab = '';
        m = up.match(/VALIDADE[^0-9]{0,15}([0-3]\d[\/\-][01]\d[\/\-]\d{4})/);
        if (m) cnhValidade = m[1];
        m = up.match(/(1A|1ª|PRIMEIRA)\s*HABILITACAO[^0-9]{0,15}([0-3]\d[\/\-][01]\d[\/\-]\d{4})/);
        if (m) cnhPrimeiraHab = m[2];
        const cnhCategoria = (up.match(/\bCAT[^A-Z0-9]{0,6}([A-E]{1,2})\b/) || [])[1] || '';

        return { numero, cnhValidade, cnhCategoria, cnhPrimeiraHab };
    };

    // ---------- Função principal ----------

    const handleUploadCNH = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            Swal.fire({
                title: "CNH Adaptive OCR Turbo Diesel+ 🧠",
                html: `
        <div style="text-align:left">
          <b>Modo:</b> Extreme NASA Infinity PRO MAX ⚙️<br/>
          <b>Status:</b> Iniciando leitura...
          <div id="progressText">0%</div>
          <div style="width:100%;background:#222;border-radius:5px;">
            <div id="progressFill" style="height:10px;width:0%;background:#00ff00;border-radius:5px;"></div>
          </div>
        </div>`,
                allowOutsideClick: false,
                showConfirmButton: false,
                didOpen: () => Swal.showLoading(),
            });

            const buf = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(buf) }).promise;

            let allText = [];
            let coordsData = [];

            const updateProgress = (done, total) => {
                const pct = Math.min(100, Math.round((done / total) * 100));
                const fill = document.getElementById("progressFill");
                const txt = document.getElementById("progressText");
                if (fill && txt) {
                    fill.style.width = `${pct}%`;
                    txt.textContent = `${pct}%`;
                }
            };

            let globalCount = 0;
            const passes = 4;
            const total = pdf.numPages * passes * 4;

            for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                const page = await pdf.getPage(pageNum);

                // 🧠 Auto-adaptação: detecta layout de CNH
                const testViewport = page.getViewport({ scale: 1 });
                const textContent = await page.getTextContent();
                const layoutText = textContent.items.map((t) => t.str).join(" ").toUpperCase();
                const scale = layoutText.includes("CARTEIRA NACIONAL DE HABILITAÇÃO")
                    ? 3.5
                    : layoutText.includes("CARTEIRA DE MOTORISTA")
                        ? 3.8
                        : 4.0;

                const viewport = page.getViewport({ scale });
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d", { willReadFrequently: true });
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                await page.render({ canvasContext: ctx, viewport }).promise;

                // 🧩 Modo debug visual: overlay com quadrantes
                document.body.appendChild(canvas);
                canvas.style.border = "2px solid #0f0";
                canvas.style.maxWidth = "100%";
                canvas.style.margin = "10px auto";
                canvas.style.display = "block";
                const overlayCtx = ctx;
                overlayCtx.lineWidth = 2;
                overlayCtx.strokeStyle = "rgba(255,0,0,0.6)";
                overlayCtx.font = "18px monospace";

                const quadrants = [
                    [0, 0, canvas.width / 2, canvas.height / 2],
                    [canvas.width / 2, 0, canvas.width / 2, canvas.height / 2],
                    [0, canvas.height / 2, canvas.width / 2, canvas.height / 2],
                    [canvas.width / 2, canvas.height / 2, canvas.width / 2, canvas.height / 2],
                ];

                for (const [qx, qy, qw, qh] of quadrants) {
                    for (let pass = 0; pass < passes; pass++) {
                        const tmp = document.createElement("canvas");
                        tmp.width = qw;
                        tmp.height = qh;
                        const tctx = tmp.getContext("2d");

                        // 🔧 Filtros dinâmicos adaptados a layout
                        const contrast = 120 + pass * 10;
                        const brightness = 90 + pass * 8;
                        const saturate = 110 + pass * 5;
                        tctx.filter = `contrast(${contrast}%) brightness(${brightness}%) saturate(${saturate}%)`;
                        tctx.drawImage(canvas, qx, qy, qw, qh, 0, 0, qw, qh);

                        const { data } = await Tesseract.recognize(tmp, "por+eng", {
                            tessedit_char_whitelist:
                                "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZÇÀÉÈÍÓÚãâêîôûáéíóú.-/: ",
                        });

                        globalCount++;
                        updateProgress(globalCount, total);

                        overlayCtx.strokeRect(qx, qy, qw, qh);
                        overlayCtx.fillStyle = "rgba(0,255,0,0.3)";
                        overlayCtx.fillText(`${Math.round((globalCount / total) * 100)}%`, qx + 10, qy + 25);

                        allText.push(data.text);
                        coordsData.push({ text: data.text, x: qx, y: qy });
                    }
                }
            }

            // 🔎 Comparativo de texto
            const rawText = allText.join(" ").toUpperCase();
            console.log("🧾 Texto bruto OCR:", rawText);

            // Limpeza pesada
            let text = rawText.replace(/\s+/g, " ").replace(/[O]/g, "0").replace(/[I]/g, "1");

            // === Extrações ===
            const numero = text.match(/\b\d{8,12}\b/)?.[0] || "";
            const datas = text.match(/\b\d{2}\/\d{2}\/\d{4}\b/g) || [];
            const validade = datas.find((d) => /203\d/.test(d)) || "";
            const primeiraHab = datas.find((d) => /202\d/.test(d)) || "";

            // === Categoria adaptativa ===
            const combinedCats = new Set();
            coordsData.forEach((objA) => {
                coordsData.forEach((objB) => {
                    const dx = Math.abs(objA.x - objB.x);
                    const dy = Math.abs(objA.y - objB.y);
                    if (dx < 300 && dy < 300) {
                        const catsA = objA.text.match(/[A-E]/g);
                        const catsB = objB.text.match(/[A-E]/g);
                        if (catsA && catsB) catsA.concat(catsB).forEach((c) => combinedCats.add(c));
                    }
                });
            });

            let categoria = "";
            const catFull = text.match(/\b(CAT(?:EGORIA)?\.?\s*[A-E]{1,2})\b/g);
            if (catFull?.length) {
                categoria = catFull.pop().replace(/CAT(?:EGORIA)?\.?/g, "").replace(/[^A-E]/g, "");
            } else {
                const nearCats = Array.from(combinedCats).sort();
                categoria = nearCats.slice(0, 2).join("");
            }
            if (categoria.length > 2) categoria = categoria.slice(0, 2);

            // === Observações ===
            let obs = text.match(/OBSERVAÇÕES?[:\s\-]*([A-Z0-9\s]+)/)?.[1] || "";
            if (!obs && text.includes("EAR")) obs = "EAR";
            if (!obs && text.includes("ACC")) obs = "ACC";
            obs = obs.replace(/\s+/g, " ").trim() || "—";

            // === Atualiza os inputs automaticamente ===
            setForm((prev) => ({
                ...prev,
                cnhNumero: numero || prev.cnhNumero,
                cnhValidade: validade || prev.cnhValidade,
                cnhCategoria: categoria || prev.cnhCategoria,
                cnhPrimeiraHab: primeiraHab || prev.cnhPrimeiraHab,
                cnhObs: obs || prev.cnhObs,
            }));

            Swal.close();
            Swal.fire({
                title: "Dados detectados (NASA Infinity 🚀)",
                html: `
        <div style="text-align:left">
          <strong>Nº Registro:</strong> ${numero || "—"}<br/>
          <strong>Validade:</strong> ${validade || "—"}<br/>
          <strong>Categoria:</strong> ${categoria || "—"}<br/>
          <strong>1ª Habilitação:</strong> ${primeiraHab || "—"}<br/>
          <strong>Observações:</strong> ${obs || "—"}<hr/>
          <small><b>Comparativo:</b><br/>${text.slice(0, 400)}...</small>
        </div>`,
                width: 600,
                icon: "success",
                confirmButtonText: "Dados inseridos ✅",
            });

            console.log("✅ CNH OCR Turbo Diesel+ COMPLETO.");
        } catch (err) {
            console.error("Erro CNH OCR Extreme:", err);
            Swal.fire("Erro", "Falha no processamento da CNH", "error");
        }
    };

    return (
        <ModalAreaTotalDisplay>
            <ModalAreaInfo>
                <Box
                    width="100%"
                    height="65px"
                    color={colors.black}
                    direction="row"
                    topSpace="10px"
                    bottomSpace="20px"
                    align="center"
                    justify="space-between"
                >
                    <Box leftSpace="20px">
                        <MdAddBox size="30px" color={colors.silver} />
                        <TextDefault left="10px" color={colors.silver} weight="bold" size="20px">
                            Novo Usuário — {form.nomeEmpresa || empresaNomeProp || 'Empresa'}
                        </TextDefault>
                    </Box>

                    <DefaultButton onClick={closeModalAddMotorista}>
                        <IoClose size="30px" color={colors.silver} />
                    </DefaultButton>
                </Box>

                <Box
                    direction="column"
                    width="100%"
                    height="auto"
                    color={colors.darkGrayTwo}
                    align="center"
                    paddingTop="20px"
                    paddingBottom="10px"
                >
                    {/* Linha 1 */}
                    <Box direction="row" justify="space-between" align="flex-start" bottomSpace="10px" width="94.5%">
                        <Box flex="1" direction="column">
                            <TextDefault size="12px" color={colors.silver} bottom="5px">Nome</TextDefault>
                            <Input placeholder="Nome *" value={form.nome} onChange={e => handleChange('nome', e.target.value)} />
                        </Box>

                        <Box flex="1" direction="column" leftSpace="30px">
                            <TextDefault size="12px" color={colors.silver} bottom="5px">Sobrenome</TextDefault>
                            <Input placeholder="Sobrenome *" value={form.sobrenome} onChange={e => handleChange('sobrenome', e.target.value)} />
                        </Box>

                        <Box flex="0.5" direction="column" leftSpace="30px">
                            <TextDefault size="12px" color={colors.silver} bottom="5px">CPF</TextDefault>
                            <InputCpf placeholder="CPF *" value={form.cpf} onChange={(val) => handleChange('cpf', val)} />
                        </Box>
                    </Box>

                    {/* Linha 2 */}
                    <Box direction="row" justify="space-between" align="flex-start" bottomSpace="10px" width="94.5%">
                        <Box flex="1" direction="column">
                            <TextDefault size="12px" color={colors.silver} bottom="5px">E-mail</TextDefault>
                            <Input placeholder="Email" value={form.email} onChange={e => handleChange('email', e.target.value)} />
                        </Box>

                        <Box flex="1" direction="column" leftSpace="30px">
                            <TextDefault size="12px" color={colors.silver} bottom="5px">Telefone/WhatsApp</TextDefault>
                            <InputTel placeholder="Telefone/WhatsApp *" value={form.contato} onChange={(val) => handleChange('contato', val)} />
                        </Box>

                        <Box flex="1" direction="column" leftSpace="30px">
                            <TextDefault size="12px" color={colors.silver} bottom="5px">Status</TextDefault>
                            <Select value={form.status} onChange={e => handleChange('status', e.target.value)}>
                                <option value="">Selecione o status</option>
                                <option value="ativo">Ativo</option>
                                <option value="inativo">Inativo</option>
                                <option value="ferias">Férias</option>
                                <option value="afastado">Afastado</option>
                                <option value="demitido">Demitido</option>
                            </Select>
                        </Box>

                        <Box flex="1" direction="column" leftSpace="20px">
                            <TextDefault size="12px" color={colors.silver} bottom="5px">Horário de trabalho</TextDefault>
                            <Box direction="row" align="center">
                                <InputHora value={form.horarioEntrada} onChange={(e) => handleHoraChange('horarioEntrada', e.target.value)} />
                                <TextDefault size="12px" color={colors.silver} left="10px" right="10px">às</TextDefault>
                                <InputHora value={form.horarioSaida} onChange={(e) => handleHoraChange('horarioSaida', e.target.value)} />
                            </Box>
                        </Box>
                    </Box>

                    {/* Linha 3 */}
                    <Box direction="row" justify="space-between" align="flex-start" bottomSpace="10px" width="94.5%">
                        <Box flex="1" direction="column">
                            <TextDefault size="12px" color={colors.silver} bottom="5px">Observações</TextDefault>
                            <Input placeholder="Usuário com deficiência ou outra observação" value={form.obs} onChange={e => handleChange('obs', e.target.value)} />
                        </Box>

                        <Box flex="1" direction="column" leftSpace="35px">
                            <TextDefault size="12px" color={colors.silver} bottom="5px">Cargo (acesso a plataforma)</TextDefault>
                            <Select value={form.cargoId} onChange={e => handleChange('cargoId', e.target.value)}>
                                <option value="">Selecione o cargo</option>
                                {cargos.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.nome} {c.tipoAcesso === 'motorista' ? '(Motorista)' : '(Gestão)'}
                                    </option>
                                ))}
                            </Select>
                        </Box>

                        <Box flex="1" direction="column" leftSpace="20px">
                            <TextDefault size="12px" color={colors.silver} bottom="5px">Base / Filial</TextDefault>
                            <Select value={form.base} onChange={e => handleChange('base', e.target.value)}>
                                {bases.map((b, i) => (
                                    <option key={i} value={b}>{b}</option>
                                ))}
                            </Select>
                        </Box>

                        <Box flex="1" direction="column" leftSpace="20px">
                            <TextDefault size="12px" color={colors.silver} bottom="5px">Senha de acesso</TextDefault>
                            <Input placeholder="Senha *" type="password" value={form.senha} onChange={e => handleChange('senha', e.target.value)} />
                        </Box>
                    </Box>
                </Box>

                {/* CNH com efeito suave (apenas para motorista) */}
                <SmoothReveal open={isMotorista}>
                    {isMotorista && (
                        <>
                            <TextDefault size="13px" top="40px" bottom="10px" color={colors.silver}>Dados da CNH:</TextDefault>
                            <Box
                                direction="column"
                                width="100%"
                                height="auto"
                                color={colors.darkGrayTwo}
                                align="center"
                                paddingTop="20px"
                                paddingBottom="10px"
                            >
                                <Box direction="row" justify="space-between" align="flex-start" bottomSpace="10px" width="94.5%">
                                    <Box flex="1.5" direction="column" rightSpace={'15px'}>
                                        <TextDefault size="12px" color={colors.silver} bottom="5px">PDF da sua CNH</TextDefault>
                                        <input
                                            id="upload-cnh"
                                            type="file"
                                            accept="application/pdf,image/*"
                                            style={{ display: 'none' }}
                                            onChange={handleUploadCNH}
                                        />

                                        <Button onClick={() => document.getElementById('upload-cnh').click()}>
                                            Upload CNH (PDF)
                                        </Button>
                                    </Box>

                                    <Box flex="1" direction="column">
                                        <TextDefault size="12px" color={colors.silver} bottom="5px">CNH - Número de Registro</TextDefault>
                                        <Input placeholder="CNH - Número de Registro" value={form.cnhNumero} onChange={e => handleChange('cnhNumero', e.target.value)} />
                                    </Box>

                                    <Box flex="1" direction="column" leftSpace="30px">
                                        <TextDefault size="12px" color={colors.silver} bottom="5px">CNH - Validade</TextDefault>
                                        <InputData placeholder="CNH - Validade" value={form.cnhValidade} onChange={(val) => handleChange('cnhValidade', val)} />
                                    </Box>

                                    <Box flex="1" direction="column" leftSpace="30px">
                                        <TextDefault size="12px" color={colors.silver} bottom="5px">CNH - Categoria</TextDefault>
                                        <Input placeholder="CNH - Categoria" value={form.cnhCategoria} onChange={e => handleChange('cnhCategoria', e.target.value)} />
                                    </Box>

                                    <Box flex="1" direction="column" leftSpace="30px">
                                        <TextDefault size="12px" color={colors.silver} bottom="5px">CNH - Data 1ª Habilitação</TextDefault>
                                        <InputData placeholder="CNH - Data 1ª Habilitação" value={form.cnhPrimeiraHab} onChange={(val) => handleChange('cnhPrimeiraHab', val)} />
                                    </Box>

                                    <Box flex="1" direction="column" leftSpace="30px">
                                        <TextDefault size="12px" color={colors.silver} bottom="5px">Observação CNH</TextDefault>
                                        <Input placeholder="Observação CNH" value={form.cnhObs} onChange={e => handleChange('cnhObs', e.target.value)} />
                                    </Box>
                                </Box>
                            </Box>
                        </>
                    )}
                </SmoothReveal>

                <Box direction="row" justify="space-between" topSpace="20px">
                    <Button onClick={salvarUsuario}>
                        <LuSave color={colors.silver} size="20px" />
                        <TextDefault color={colors.silver} left="10px">Salvar</TextDefault>
                    </Button>
                </Box>
            </ModalAreaInfo>
        </ModalAreaTotalDisplay>
    );
};

export default CreateUsers;
