'use client';

import { useState, type FormEvent } from 'react';
import { Clock3, Database, LoaderCircle, LogIn, LogOut, Moon, ShieldCheck, Sun, Trash2, UserRound } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useSupabase } from '@/contexts/SupabaseContext';

export default function SettingsPanel({ onClearSaved, savedCount, syncMessage }: {
  onClearSaved: () => Promise<void>;
  savedCount: number;
  syncMessage: string;
}) {
  const { resolvedMode } = useTheme();
  const { client, user, ready } = useSupabase();
  const [email, setEmail] = useState('');
  const [authBusy, setAuthBusy] = useState(false);
  const [message, setMessage] = useState('');

  async function sendMagicLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!client) return;
    setAuthBusy(true);
    setMessage('');
    try {
      const { error } = await client.auth.signInWithOtp({
        email: email.trim(),
        options: { emailRedirectTo: window.location.origin },
      });
      setMessage(error
        ? 'Não foi possível enviar o link. Confira o e-mail e tente novamente.'
        : 'Se esse e-mail puder receber login, enviaremos um link em instantes.');
    } catch {
      setMessage('Não foi possível enviar o link agora. Tente novamente em instantes.');
    } finally {
      setAuthBusy(false);
    }
  }

  async function signOut() {
    if (!client) return;
    setAuthBusy(true);
    try {
      const { error } = await client.auth.signOut({ scope: 'local' });
      setMessage(error ? 'Não foi possível sair da conta. Tente novamente.' : 'Você saiu da conta.');
    } catch {
      setMessage('Não foi possível sair da conta. Tente novamente.');
    } finally {
      setAuthBusy(false);
    }
  }

  async function clearSavedDestinations() {
    if (!savedCount) {
      setMessage('Você ainda não tem destinos salvos neste dispositivo.');
      return;
    }
    const confirmText = user
      ? 'Apagar os destinos salvos da sua conta e deste navegador?'
      : 'Apagar todos os destinos salvos neste dispositivo?';
    if (!window.confirm(confirmText)) return;

    try {
      await onClearSaved();
      setMessage(user ? 'Destinos salvos removidos da sua conta.' : 'Destinos salvos apagados deste dispositivo.');
    } catch {
      setMessage('Não foi possível remover os destinos salvos da conta. Tente novamente.');
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <header>
        <h1 className="font-display text-3xl font-bold tracking-tight text-[var(--fg-strong)]">Configurações</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">Veja como o app trata aparência, dados e privacidade.</p>
      </header>

      <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6" aria-labelledby="settings-account">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent)]">
            <UserRound className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 id="settings-account" className="font-semibold text-[var(--fg-strong)]">Conta e sincronização</h2>
            <p className="mt-1 text-sm leading-6 text-[var(--muted)]">Entre com seu e-mail para guardar seus destinos salvos na nuvem e acessá-los em outros dispositivos.</p>

            {!client ? (
              <p className="mt-3 rounded-lg bg-[var(--surface-muted)] p-3 text-sm leading-6 text-[var(--muted)]">
                A conexão ainda não foi configurada. Copie <code className="font-mono text-xs">.env.example</code> para <code className="font-mono text-xs">.env.local</code>, preencha a URL e a chave publicável do Supabase e reinicie o servidor.
              </p>
            ) : !ready ? (
              <p className="mt-3 inline-flex items-center gap-2 text-sm text-[var(--muted)]"><LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" /> Verificando sessão…</p>
            ) : user ? (
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <p className="min-h-11 flex items-center gap-2 text-sm font-medium text-[var(--fg-strong)]"><span className="h-2 w-2 rounded-full bg-[var(--success)]" aria-hidden="true" /> Conectado como {user.email}</p>
                <button type="button" onClick={signOut} disabled={authBusy} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--fg-strong)] transition-colors hover:bg-[var(--surface-muted)] disabled:cursor-wait disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]">
                  <LogOut className="h-4 w-4" aria-hidden="true" /> Sair
                </button>
              </div>
            ) : (
              <form onSubmit={sendMagicLink} className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
                <div className="min-w-0 flex-1">
                  <label htmlFor="account-email" className="mb-1.5 block text-sm font-medium text-[var(--fg-strong)]">Seu e-mail</label>
                  <input id="account-email" type="email" name="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="voce@exemplo.com" className="min-h-11 w-full rounded-lg border border-[var(--border-strong)] bg-[var(--bg)] px-3.5 py-2.5 text-sm text-[var(--fg-strong)] outline-none placeholder:text-[var(--muted-soft)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20" />
                  <p className="mt-1.5 text-xs text-[var(--muted)]">No primeiro acesso, confirmar o link cria sua conta.</p>
                </div>
                <button type="submit" disabled={authBusy} className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:brightness-110 disabled:cursor-wait disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2">
                  {authBusy ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" /> : <LogIn className="h-4 w-4" aria-hidden="true" />}
                  Enviar link de acesso
                </button>
              </form>
            )}
            <p className="mt-3 min-h-5 text-sm text-[var(--muted)]" aria-live="polite">{message}</p>
            {syncMessage && <p className="text-sm text-[var(--muted)]" aria-live="polite">{syncMessage}</p>}
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6" aria-labelledby="settings-appearance">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent)]">
            {resolvedMode === 'dark' ? <Moon className="h-5 w-5" aria-hidden="true" /> : <Sun className="h-5 w-5" aria-hidden="true" />}
          </span>
          <div className="min-w-0 flex-1">
            <h2 id="settings-appearance" className="font-semibold text-[var(--fg-strong)]">Aparência</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">O tema acompanha o horário local do seu dispositivo: claro durante o dia e escuro à noite.</p>
            <p className="mt-3 inline-flex items-center gap-2 rounded-md bg-[var(--surface-muted)] px-3 py-2 text-sm font-medium text-[var(--fg-strong)]" aria-live="polite">
              <Clock3 className="h-4 w-4 text-[var(--accent)]" aria-hidden="true" />
              Tema {resolvedMode === 'dark' ? 'escuro' : 'claro'} ativo agora
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6" aria-labelledby="settings-data">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent)]">
            <Database className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 id="settings-data" className="font-semibold text-[var(--fg-strong)]">Seus destinos salvos</h2>
            <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
              {savedCount} {savedCount === 1 ? 'destino salvo' : 'destinos salvos'}. {user ? 'Sua lista da conta sincroniza com o Supabase.' : 'Sem entrar, a lista fica apenas neste navegador.'}
            </p>
            <button type="button" onClick={clearSavedDestinations} className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--fg-strong)] transition-colors hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] dark:hover:bg-rose-950/20 dark:hover:text-rose-300">
              <Trash2 className="h-4 w-4" aria-hidden="true" /> Apagar destinos salvos
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6" aria-labelledby="settings-privacy">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent)]">
            <ShieldCheck className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h2 id="settings-privacy" className="font-semibold text-[var(--fg-strong)]">Privacidade</h2>
            <p className="mt-1 text-sm leading-6 text-[var(--muted)]">O app não solicita sua localização nem envia notificações. Os requisitos de viagem são carregados de dados locais do projeto.</p>
            <p className="mt-3 text-sm text-[var(--muted)]">Os Termos de Uso e a Política de Privacidade precisam ser escritos antes de uma publicação pública.</p>
          </div>
        </div>
      </section>

      <p className="text-xs leading-5 text-[var(--muted-soft)]">Os requisitos mostrados usam como referência turismo de curta duração com passaporte brasileiro. Trabalho, estudo, residência, trânsito e outros documentos podem ter regras diferentes. Confira as fontes oficiais antes de embarcar.</p>
    </div>
  );
}
