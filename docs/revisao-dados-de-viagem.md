# Revisão dos dados de viagem

## Escopo atual

`src/data/countries.json` resume viagens de turismo de curta duração para pessoas com passaporte brasileiro comum. O resumo não decide requisitos para trabalho, estudo, residência, trânsito, dupla nacionalidade ou outros documentos. Em países do Mercosul e associados, o RG pode substituir o passaporte somente em viagens de turismo e quando estiver em bom estado, com foto que identifique a pessoa; a Polícia Federal recomenda documento emitido há menos de 10 anos.

## Como revisar um destino

1. Registre a nacionalidade/documento, o motivo da viagem, a duração e, quando relevante, os países de origem e trânsito considerados.
2. Confirme visto e autorização eletrônica na autoridade migratória, ministério das relações exteriores ou consulado oficial do destino. Diferencie isenção de visto, eVisa, ETA e visto tradicional.
3. Confirme a permanência autorizada. Não trate um limite comum como garantido: a autoridade de fronteira pode conceder prazo menor.
4. Verifique validade do passaporte e documentos alternativos, incluindo as condições para usar RG.
5. Separe exigências sanitárias de entrada das recomendações de saúde. Registre condições ligadas à origem, escalas, região visitada, idade ou situação médica.
6. Atualize cada link em `sources` para a página que sustenta aquele dado. Use `vaccinesHealth` para recomendações médicas separadas e `electronicAuthorization` para sistemas como o ETIAS.
7. Atualize `lastUpdated` somente depois de conferir todos os campos do destino e registre a data real da revisão.
8. Revise o diff e execute `npm run validate:data`.

## O que a validação automatizada cobre

`npm run validate:data` confere campos obrigatórios, IDs únicos, datas, formato dos links, presença das imagens e avisa quando uma revisão tem mais de 90 dias. Ela não abre os links nem prova que uma regra continua correta. A confirmação do conteúdo exige leitura manual das fontes oficiais.

## Referências verificadas em 31/10/2026

- Polícia Federal, uso de RG no Mercosul: https://www.gov.br/pf/pt-br/assuntos/passaporte/suporte/duvidas_/inicio/mercosul
- Ministério das Relações Exteriores da Tailândia, certificado internacional de febre amarela: https://www.mfa.go.th/en/publicservice/5d5bcc2615e39c306000a30d
- Ministério da Saúde da Colômbia, febre amarela e áreas de risco: https://www2.minsalud.gov.co/salud/publica/PET/Paginas/Fiebre-amarilla.aspx
- União Europeia, estado atual do ETIAS: https://travel-europe.europa.eu/pt/etias/faq

Os requisitos mudam. Esta revisão documenta as fontes consultadas, não substitui a confirmação do viajante com a autoridade competente antes da partida.
