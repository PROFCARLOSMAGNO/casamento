// data.js — EDITE AQUI: casal, WhatsApp, chave Pix e presentes

const CASAL = { nome1: "Carlos Magno", nome2: "Andreia de Fátima" };

// Número do WhatsApp do casal para notificação (opcional).
// Formato: código do país + DDD + número sem traços/espaços.
// Ex.: "5511999887766" → Brasil (55) + DDD (11) + número.
// Deixe null para desativar o botão de WhatsApp.
const WHATSAPP = null;
// const WHATSAPP = "5511075689118"; // descomente e ajuste para ativar

// Pix "copia e cola" base — SEM valor. NÃO ALTERE (é a chave real do casal).
const PIX_BASE =
  "00020126500014br.gov.bcb.pix0111075689118370213Casamento_C&A5204000053039865802BR5922CARLOS_MAGNO_PRECECHAN6006SUZANO62290525ixXHTIdd7jNXbuZSDshzbHxMp63049BB1";

// foto: URL da imagem (ou null para placeholder). titulo: copy editável.
// As fotos abaixo são placeholders gerados por picsum.photos (aleatórios, mas
// fixos por "seed" — a mesma URL sempre traz a mesma imagem). Troque pela URL
// da foto real do casal quando tiverem uma para cada presente.
function fotoPlaceholder(seed) {
  return "https://picsum.photos/seed/casamento-ca-" + seed + "/600/450";
}

const PRESENTES = [
  { valor: 189, titulo: "Carteira com dinheiro", foto: "carteira.png" },
  { valor: 239, titulo: "Coleira para seu Pet", foto: "coleira.png" },
  { valor: 299, titulo: "Guarda-Chuva", foto: "guardachuva.png" },
  { valor: 339.99, titulo: "Sapato do Noivo", foto: "sapato.png" },
  { valor: 469, titulo: "Gravata do Noivo", foto: "gravata.png" },
  { valor: 589, titulo: "Beijo da Noiva", foto: "beijo.png" },
  { valor: 679, titulo: "Guardanapo da Noiva", foto: "guardanapo.png" },
  { valor: 779, titulo: "Beijo do Noivo", foto: "beijo.png" },
  { valor: 888, titulo: "Meia do Noivo", foto: "meia.png" },
  { valor: 989, titulo: "aspirador", foto: "aspirador.png" },
  { valor: 1269, titulo: "Regador", foto: "regador.png" },
  { valor: 1399, titulo: "cafeteira", foto: "cafeteira.png" },
  { valor: 1479, titulo: "Kit de Limpeza", foto: "vassoura.png" },
  { valor: 1700, titulo: "Maquina de Lavar", foto: "lava.png" },
  { valor: 2000, titulo: "Fantasia", foto: "fantasia.png" },
  { valor: 2500, titulo: "Viagem para Disney", foto: "viagem.png" },
  { valor: 3000, titulo: "Bolsa de Grife", foto: "bolsa.png" },
  { valor: 3400, titulo: "Roupa de Grife", foto: "roupa.png" },
  { valor: 3800, titulo: "Anel de ouro ", foto: "anel.png" },
  { valor: 5000, titulo: "Brinco de diamante", foto: "brinco.png" },
  { valor: 5600, titulo: "Vinho Europeu", foto: "vinho.png" },
  { valor: 7000, titulo: "café goumert", foto: "cafe.png" },
  { valor: 14599, titulo: "oculos de grife", foto: "oculos.png" },
  { valor: 19000, titulo: "Relogio de Grife", foto: "relogio.png" },
  {
    valor: 20000,
    titulo: "Ingresso para o final da copa",
    foto: "ingresso.png",
  },
];
