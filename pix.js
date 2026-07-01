// pix.js — gerador de BR Code (Pix) com valor + CRC16. NÃO ALTERAR A LÓGICA.

// CRC16/CCITT-FALSE (poly 0x1021, init 0xFFFF) — padrão Pix
function crc16(str) {
  let crc = 0xFFFF;
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      crc = (crc & 0x8000) ? ((crc << 1) ^ 0x1021) : (crc << 1);
      crc &= 0xFFFF;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

// Quebra o payload EMV em campos de nível superior {id, len, val}
function parseTLV(p) {
  const out = [];
  let i = 0;
  while (i < p.length) {
    const id = p.substr(i, 2);
    const len = parseInt(p.substr(i + 2, 2), 10);
    const val = p.substr(i + 4, len);
    out.push({ id, len, val });
    i += 4 + len;
  }
  return out;
}

// Gera o "copia e cola" com o valor embutido
function gerarPix(valor) {
  // remove CRC (63) e qualquer valor (54) pré-existentes
  const campos = parseTLV(PIX_BASE).filter(f => f.id !== "63" && f.id !== "54");
  const v = Number(valor).toFixed(2);           // ex.: 99 -> "99.00"
  campos.push({ id: "54", len: v.length, val: v });
  campos.sort((a, b) => a.id.localeCompare(b.id)); // ordem crescente de ID (regra EMV)
  let payload = campos.map(f => f.id + String(f.len).padStart(2, "0") + f.val).join("");
  payload += "6304";                            // abre o campo do CRC
  return payload + crc16(payload);
}
