# Política de Privacidade — rascunho interno

> **Não publicar ainda.** Este texto descreve o comportamento técnico observado no projeto em 31/10/2026. Antes de publicar, preencher os campos pendentes, confirmar a operação real e revisar com orientação jurídica. A ANPD orienta que o titular consiga identificar o controlador e um canal para exercer seus direitos; os dados abaixo ainda não identificam o responsável pelo ViagemSemSusto.

## Responsável pelo tratamento

- Controlador (nome/razão social): **[PENDENTE]**
- CNPJ/CPF e endereço para contato: **[PENDENTE — confirmar com responsável jurídico]**
- Canal de privacidade para solicitações: **[PENDENTE]**
- Encarregado, se aplicável: **[PENDENTE — confirmar obrigação ou hipótese de dispensa]**
- Endereço oficial do serviço: **[PENDENTE]**

## Dados tratados e finalidade técnica observada

- **E-mail e identificador da conta:** usados pelo Supabase Auth no acesso por link enviado por e-mail.
- **Países salvos e identificador da conta:** usuários conectados podem sincronizar os destinos escolhidos com a tabela `saved_destinations` no Supabase. A política de acesso limita cada conta aos próprios registros.
- **Destinos salvos sem login:** mantidos no `localStorage` do navegador e removíveis pela tela Configurações ou pela limpeza dos dados do navegador.
- **Consulta de requisitos:** os dados dos destinos são fornecidos por um arquivo JSON incluído no app; não é necessário informar localização para essa consulta.
- **Compartilhamento:** ao acionar o botão, o usuário escolhe compartilhar pelo recurso do dispositivo ou copiar o resumo para a área de transferência. O app não envia esse resumo por conta própria.

O app atualmente não solicita localização do dispositivo nem envia notificações. Isso não descreve eventuais registros técnicos mantidos pela hospedagem, pelo Supabase, pelo provedor de e-mail ou pelo navegador; confirmar fornecedores e respectivos registros antes da publicação.

## Fornecedores e armazenamento

O código integra Supabase Auth e Postgres para login e sincronização. O projeto Supabase está configurado na região de São Paulo (`sa-east-1`). Confirmar os termos, subprocessadores, transferências internacionais e prazos de retenção vigentes do fornecedor antes de publicar esta seção.

## Retenção e exclusão

- Lista local: permanece no navegador até que a pessoa a apague ou remova os dados do site.
- Lista sincronizada: pode ser apagada pela ação de Configurações.
- Conta e dados associados: **[PENDENTE — definir como solicitar exclusão integral da conta e qual o prazo de retenção/exclusão no Supabase]**.
- Logs e mensagens de autenticação dos fornecedores: **[PENDENTE — confirmar retenção e responsabilidades]**.

## Direitos e solicitações

A pessoa titular pode solicitar confirmação e acesso, correção, informação sobre o tratamento e demais direitos previstos na LGPD pelos canais do controlador indicados acima. **O canal ainda precisa ser definido e implementado antes da publicação.**

## Cookies e armazenamento local

O app usa `localStorage` para manter destinos salvos neste navegador quando a pessoa não está conectada e para persistir preferências do app. **[PENDENTE — inventariar cookies, armazenamento adicional, analytics e ferramentas de hospedagem no ambiente publicado.]**

## Alterações

Data deste rascunho técnico: 31/10/2026. A versão pública deverá informar uma data de vigência e como mudanças relevantes serão comunicadas.

## Pendências antes de transformar em política pública

1. Identificar controlador e canal de contato para privacidade.
2. Definir o processo de exclusão de conta e de dados na nuvem.
3. Confirmar fornecedores, logs, subprocessadores, retenção e transferências internacionais.
4. Inventariar cookies e tecnologias da hospedagem no ambiente real.
5. Revisar bases legais, prazos e texto com o responsável pelo tratamento e assessoria jurídica.

## Referências oficiais

- [ANPD — Direitos dos titulares](https://www.gov.br/anpd/pt-br/assuntos/titular-de-dados-1/direito-dos-titulares)
- [ANPD — Controlador, operador e encarregado](https://www.gov.br/anpd/pt-br/canais_atendimento/cidadao-titular-de-dados/denuncia-peticao-de-titular-referente-lgpd)
- [Lei nº 13.709/2018 — LGPD](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm)
