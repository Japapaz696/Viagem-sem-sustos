import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const countries = JSON.parse(readFileSync(resolve(projectRoot, 'src/data/countries.json'), 'utf8'));
const errors = [];
const warnings = [];
const seenIds = new Set();
const reviewWindowDays = 90;
const now = Date.now();

for (const [index, country] of countries.entries()) {
  const row = `countries.json[${index}] (${country?.id ?? 'sem id'})`;
  if (!country || typeof country !== 'object') {
    errors.push(`${row}: registro inválido.`);
    continue;
  }
  if (!/^[a-z]{2}$/.test(country.id ?? '')) errors.push(`${row}: id deve ter duas letras minúsculas.`);
  if (seenIds.has(country.id)) errors.push(`${row}: id duplicado.`);
  seenIds.add(country.id);

  for (const field of ['slug', 'name', 'flag', 'officialUrl', 'lastUpdated']) {
    if (typeof country[field] !== 'string' || !country[field].trim()) errors.push(`${row}: campo obrigatório ausente: ${field}.`);
  }
  if (!['exempt', 'evisa', 'arrival', 'required'].includes(country.visa?.type)) errors.push(`${row}: categoria de visto inválida.`);
  if (!Number.isInteger(country.passport?.minValidityMonths) || country.passport.minValidityMonths < 0) errors.push(`${row}: validade de passaporte inválida.`);
  if (!Number.isInteger(country.maxStayDays) || country.maxStayDays < 0 || (country.id !== 'br' && country.maxStayDays === 0)) errors.push(`${row}: permanência precisa ser informada (zero só é aceito para o país de origem).`);

  const urls = [country.officialUrl, ...Object.values(country.sources ?? {})].filter(Boolean);
  if (!country.sources || typeof country.sources !== 'object') errors.push(`${row}: fontes por requisito ausentes.`);
  else {
    for (const key of ['visa', 'passport', 'stay', 'vaccines']) {
      if (!country.sources[key] && country.id !== 'br') errors.push(`${row}: fonte de ${key} ausente.`);
    }
  }
  for (const value of urls) {
    try {
      const parsed = new URL(value);
      if (!['https:', 'http:'].includes(parsed.protocol)) errors.push(`${row}: protocolo inválido em ${value}.`);
    } catch {
      errors.push(`${row}: URL inválida: ${value}.`);
    }
  }

  const updated = Date.parse(country.lastUpdated);
  if (!Number.isFinite(updated)) errors.push(`${row}: lastUpdated não é uma data válida.`);
  else if (updated > now + 86_400_000) errors.push(`${row}: lastUpdated está no futuro.`);
  else if (now - updated > reviewWindowDays * 86_400_000) warnings.push(`${row}: revisão há mais de ${reviewWindowDays} dias.`);

  const image = resolve(projectRoot, 'public/imagens/Destinos/images-destinos', `${country.id}.jpg`);
  if (!existsSync(image)) errors.push(`${row}: imagem local não encontrada (${image}).`);
}

if (!countries.length) errors.push('Nenhum país cadastrado.');
for (const warning of warnings) console.warn(`AVISO ${warning}`);
for (const error of errors) console.error(`ERRO ${error}`);
if (errors.length) process.exitCode = 1;
else console.log(`Dados estruturais válidos: ${countries.length} destinos, IDs únicos, fontes/URLs e imagens presentes. ${warnings.length} aviso(s) de revisão vencida.`);
