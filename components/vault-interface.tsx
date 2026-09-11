"use client";

import Link from "next/link";
import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";

type ItemKind = "password" | "api-key";
type View = "all" | "passwords" | "trash";

type VaultItem = {
  id: number;
  kind: ItemKind;
  name: string;
  account: string;
  secret: string;
};

const labels: Record<View, { eyebrow: string; heading: string; description: string }> = {
  all: { eyebrow: "Personal vault", heading: "Your secure vault.", description: "Passwords and API keys, kept together." },
  passwords: { eyebrow: "Personal vault", heading: "Passwords.", description: "Your website and application login details." },
  trash: { eyebrow: "Personal vault", heading: "Trash.", description: "Deleted items are kept here until you remove them forever." },
};

function itemColor(item: VaultItem) {
  if (item.kind === "api-key") return "bg-[#0f766e]";
  return ["bg-[#3850e9]", "bg-[#24292f]", "bg-[#7c3aed]", "bg-[#0f766e]"][item.id % 4];
}

function Icon({ name, className = "" }: { name: string; className?: string }) {
  const paths: Record<string, ReactNode> = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    key: <><circle cx="7.5" cy="15.5" r="3.5" /><path d="m10.2 12.8 8.3-8.3" /><path d="m15 6 3 3" /><path d="m12.5 8.5 3 3" /></>,
    code: <><path d="m8 9-3 3 3 3" /><path d="m16 9 3 3-3 3" /><path d="m14 5-4 14" /></>,
    trash: <><path d="M4 7h16" /><path d="M10 11v5" /><path d="M14 11v5" /><path d="M6 7l1 13h10l1-13" /><path d="M9 7V4h6v3" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.12 2.12-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.04 1.55V20.3h-3v-.09A1.7 1.7 0 0 0 10.66 18.66a1.7 1.7 0 0 0-1.88.34l-.06.06-2.12-2.12.06-.06A1.7 1.7 0 0 0 7 15a1.7 1.7 0 0 0-1.55-1.04H5.3v-3h.15A1.7 1.7 0 0 0 7 9.92a1.7 1.7 0 0 0-.34-1.88L6.6 7.98l2.12-2.12.06.06a1.7 1.7 0 0 0 1.88.34 1.7 1.7 0 0 0 1.04-1.55V4.6h3v.11a1.7 1.7 0 0 0 1.04 1.55 1.7 1.7 0 0 0 1.88-.34l.06-.06 2.12 2.12-.06.06A1.7 1.7 0 0 0 19.4 10a1.7 1.7 0 0 0 1.55 1.04h.15v3h-.15A1.7 1.7 0 0 0 19.4 15Z" /></>,
    search: <><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4 4" /></>,
    plus: <><path d="M12 5v14" /><path d="M5 12h14" /></>,
    eye: <><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" /><circle cx="12" cy="12" r="2.5" /></>,
    eyeOff: <><path d="m3 3 18 18" /><path d="M10.6 6.1A10.7 10.7 0 0 1 12 6c6 0 9.5 6 9.5 6a17.4 17.4 0 0 1-3.1 3.7" /><path d="M6.1 6.2A17.7 17.7 0 0 0 2.5 12S6 18 12 18c1.5 0 2.8-.37 3.9-.93" /><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" /></>,
    copy: <><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M15 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h3" /></>,
    lock: <><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></>,
    chevron: <path d="m8 10 4 4 4-4" />,
    x: <><path d="m6 6 12 12" /><path d="m18 6-12 12" /></>,
    restore: <><path d="M3 12a9 9 0 1 0 3-6.7" /><path d="M3 4v5h5" /></>,
  };

  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>{paths[name]}</svg>;
}

function NavLink({ href, active, icon, children, count }: { href: string; active: boolean; icon: string; children: ReactNode; count?: number }) {
  return <Link href={href} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 ${active ? "bg-[#eceee8] text-[#202120]" : "text-[#777a74] hover:bg-[#f0f1ed]"}`}><Icon name={icon} className="h-[18px] w-[18px]" />{children}{count !== undefined && <span className="ml-auto text-xs text-[#777a74]">{count}</span>}</Link>;
}

export function VaultInterface({ view }: { view: View }) {
  const [items, setItems] = useState<VaultItem[]>([]);
  const [trash, setTrash] = useState<VaultItem[]>([]);
  const [search, setSearch] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [visibleSecrets, setVisibleSecrets] = useState<number[]>([]);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const query = view === "trash" ? "?trash=true" : view === "passwords" ? "?type=password" : "";

    async function loadItems() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/vault${query}`, { signal: controller.signal });
        const data = await response.json() as VaultItem[] | { error: string };
        if (!response.ok || !Array.isArray(data)) throw new Error("error" in data ? data.error : "Unable to load vault items.");
        if (view === "trash") setTrash(data);
        else setItems(data);
      } catch (caught) {
        if (!controller.signal.aborted) setError(caught instanceof Error ? caught.message : "Unable to load vault items.");
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    void loadItems();
    return () => controller.abort();
  }, [view]);

  const currentItems = view === "trash" ? trash : items;
  const visibleItems = useMemo(() => {
    const query = search.toLowerCase().trim();
    return currentItems.filter((item) => {
      const matchingType = view !== "passwords" || item.kind === "password";
      return matchingType && `${item.name} ${item.account}`.toLowerCase().includes(query);
    });
  }, [currentItems, search, view]);

  function toggleSecret(id: number) {
    setVisibleSecrets((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  async function copySecret(id: number, secret: string) {
    try {
      await navigator.clipboard.writeText(secret);
      setCopiedId(id);
      window.setTimeout(() => setCopiedId(null), 1500);
    } catch {
      setCopiedId(null);
    }
  }

  async function addItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const kind = form.get("kind") as ItemKind;
    const name = String(form.get("name") || "").trim();
    const account = String(form.get("account") || "").trim();
    const secret = String(form.get("secret") || "");
    if (!name || !account || !secret) return;
    setError(null);
    try {
      const response = await fetch("/api/vault", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, name, account, secret }),
      });
      const data = await response.json() as VaultItem | { error: string };
      if (!response.ok || !("id" in data)) throw new Error("error" in data ? data.error : "Unable to save this vault item.");
      setItems((current) => [data, ...current]);
      setShowAddForm(false);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to save this vault item.");
    }
  }

  async function updateItem(item: VaultItem, action: "trash" | "restore") {
    setError(null);
    try {
      const response = await fetch(`/api/vault/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (!response.ok) {
        const data = await response.json() as { error?: string };
        throw new Error(data.error ?? "Unable to update this vault item.");
      }
      if (action === "trash") setItems((current) => current.filter(({ id }) => id !== item.id));
      else setTrash((current) => current.filter(({ id }) => id !== item.id));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to update this vault item.");
    }
  }

  const header = labels[view];
  return <main className="min-h-screen bg-[#f7f7f5] text-[#202120]"><div className="mx-auto flex min-h-screen max-w-[1536px]">
    <aside className="hidden w-[264px] shrink-0 flex-col border-r border-[#e8e8e4] bg-[#fafaf8] px-5 py-7 lg:flex">
      <div className="flex items-center gap-3 px-3"><div className="grid h-9 w-9 place-items-center rounded-xl bg-[#202120] text-white"><Icon name="lock" className="h-5 w-5" /></div><span className="text-lg font-semibold tracking-[-0.04em]">keepsafe</span></div>
      <nav className="mt-12 space-y-1 text-[14px] font-medium"><NavLink href="/vault" active={view === "all"} icon="grid" count={items.length}>All items</NavLink><NavLink href="/password" active={view === "passwords"} icon="key" count={items.filter((item) => item.kind === "password").length}>Passwords</NavLink><NavLink href="/trash" active={view === "trash"} icon="trash" count={trash.length}>Trash</NavLink></nav>
      <div className="mt-auto space-y-5"><div className="rounded-2xl bg-[#ebece7] p-4"><div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#4d60e5]"><Icon name="lock" className="h-4 w-4" /></div><p className="text-sm font-semibold">Your vault is encrypted</p><p className="mt-1 text-xs leading-5 text-[#767871]">Secrets are encrypted before local storage.</p></div><button className="flex w-full items-center gap-3 px-3 py-2 text-sm text-[#777a74]"><Icon name="settings" className="h-[18px] w-[18px]" />Settings</button><button className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left hover:bg-[#f0f1ed]"><span className="grid h-8 w-8 place-items-center rounded-full bg-[#c8d7d2] text-xs font-semibold text-[#2f4b43]">AM</span><span><span className="block text-sm font-medium">Alex Morgan</span><span className="block text-xs text-[#858781]">Personal vault</span></span><Icon name="chevron" className="ml-auto h-4 w-4 text-[#858781]" /></button></div>
    </aside>
    <section className="flex min-w-0 flex-1 flex-col px-5 py-6 sm:px-9 lg:px-12 lg:py-9"><header className="flex items-center justify-between gap-4"><Link href="/vault" className="flex items-center gap-2 font-semibold lg:hidden"><span className="grid h-8 w-8 place-items-center rounded-lg bg-[#202120] text-white"><Icon name="lock" className="h-4 w-4" /></span>keepsafe</Link><div className="hidden lg:block" />{view !== "trash" && <button onClick={() => setShowAddForm(true)} className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#202120] px-4 text-sm font-medium text-white shadow-sm transition hover:bg-[#363735]"><Icon name="plus" className="h-4 w-4" />Add item</button>}</header>
      <div className="mt-14 max-w-5xl"><p className="text-sm font-medium text-[#777a74]">{header.eyebrow}</p><h1 className="mt-2 text-4xl font-semibold tracking-[-0.055em] sm:text-5xl">{header.heading}</h1><p className="mt-4 text-base text-[#777a74]">{header.description}</p></div>
      <div className="mt-11 max-w-5xl"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><h2 className="text-lg font-semibold tracking-[-0.03em]">{view === "trash" ? "Deleted items" : view === "passwords" ? "Saved passwords" : "All items"} <span className="ml-1 text-sm font-normal text-[#858781]">{visibleItems.length}</span></h2><label className="flex h-10 w-full items-center gap-2 rounded-lg border border-[#e4e5e1] bg-white px-3 text-[#858781] sm:w-[248px] focus-within:border-[#a7aaa2] focus-within:ring-2 focus-within:ring-[#dfe1dc]"><Icon name="search" className="h-4 w-4" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={view === "trash" ? "Search deleted items" : "Search your vault"} className="w-full bg-transparent text-sm text-[#202120] outline-none placeholder:text-[#989a95]" /></label></div>
        {error && <p role="alert" className="mt-4 rounded-lg bg-[#fff1ef] px-4 py-3 text-sm text-[#a13b2d]">{error}</p>}<div className="mt-5 overflow-hidden rounded-xl border border-[#e6e7e3] bg-white"><div className="hidden grid-cols-[minmax(170px,1.05fr)_minmax(150px,1fr)_100px_minmax(120px,.8fr)_98px] gap-5 border-b border-[#edeeea] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#989a95] md:grid"><span>Item</span><span>Account / use</span><span>Type</span><span>Secret</span><span className="text-right">Actions</span></div>{visibleItems.map((item) => { const secretVisible = visibleSecrets.includes(item.id); return <article key={item.id} className="grid gap-4 border-b border-[#edeeea] px-5 py-5 last:border-b-0 md:grid-cols-[minmax(170px,1.05fr)_minmax(150px,1fr)_100px_minmax(120px,.8fr)_98px] md:items-center md:gap-5 md:px-6"><div className="flex items-center gap-3"><div className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${itemColor(item)} text-sm font-semibold text-white`}>{item.name.slice(0, 1)}</div><span className="text-sm font-medium">{item.name}</span></div><div className="text-sm text-[#6f716c] md:truncate"><span className="mr-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#989a95] md:hidden">Use</span>{item.account}</div><div><span className="rounded-full bg-[#f0f1ed] px-2 py-1 text-[11px] font-medium capitalize text-[#676a64]">{item.kind === "api-key" ? "API key" : "Password"}</span></div><div className="flex items-center gap-3"><span className="min-w-0 flex-1 truncate font-mono text-sm tracking-[0.1em] text-[#575954]">{secretVisible ? item.secret : "••••••••••••"}</span><button onClick={() => toggleSecret(item.id)} aria-label={secretVisible ? "Hide secret" : "Show secret"} className="text-[#878984] hover:text-[#202120]"><Icon name={secretVisible ? "eyeOff" : "eye"} className="h-4 w-4" /></button></div><div className="flex items-center justify-end">{view === "trash" ? <button onClick={() => void updateItem(item, "restore")} className="inline-flex h-8 items-center gap-1.5 rounded-md px-2 text-xs font-medium text-[#4e60db] hover:bg-[#f1f2ee]"><Icon name="restore" className="h-3.5 w-3.5" />Restore</button> : <><button onClick={() => copySecret(item.id, item.secret)} className="inline-flex h-8 items-center gap-1.5 rounded-md px-2 text-xs font-medium text-[#5f625c] hover:bg-[#f1f2ee]">{copiedId === item.id ? "Copied" : "Copy"}<Icon name="copy" className="h-3.5 w-3.5" /></button><button onClick={() => void updateItem(item, "trash")} aria-label={`Move ${item.name} to trash`} className="rounded-md p-2 text-[#878984] hover:bg-[#f1f2ee] hover:text-[#202120]"><Icon name="trash" className="h-4 w-4" /></button></>}</div></article>; })}{isLoading && <div className="px-6 py-14 text-center text-sm text-[#777a74]">Loading your vault…</div>}{!isLoading && visibleItems.length === 0 && <div className="px-6 py-14 text-center text-sm text-[#777a74]">{view === "trash" ? "Trash is empty." : "No saved items match your search."}</div>}</div>{view !== "trash" && <button onClick={() => setShowAddForm(true)} className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[#4e60db] hover:text-[#3549d5]"><Icon name="plus" className="h-4 w-4" />Add a password or API key</button>}</div>
    </section>
  </div>{showAddForm && <AddItemForm onClose={() => setShowAddForm(false)} onSubmit={addItem} />}</main>;
}

function AddItemForm({ onClose, onSubmit }: { onClose: () => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  const [kind, setKind] = useState<ItemKind>("password");
  return <div className="fixed inset-0 z-10 grid place-items-center bg-[#202120]/25 p-5" role="dialog" aria-modal="true" aria-labelledby="add-item-title"><form onSubmit={onSubmit} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl shadow-black/15 sm:p-7"><div className="flex items-start justify-between"><div><p className="text-sm font-medium text-[#777a74]">Personal vault</p><h2 id="add-item-title" className="mt-1 text-2xl font-semibold tracking-[-0.04em]">Add an item</h2></div><button type="button" onClick={onClose} className="rounded-lg p-2 text-[#777a74] hover:bg-[#f1f2ee]" aria-label="Close form"><Icon name="x" className="h-5 w-5" /></button></div><div className="mt-7"><span className="block text-sm font-medium">Item type</span><div className="mt-2 grid grid-cols-2 rounded-lg bg-[#f0f1ed] p-1"><label className={`cursor-pointer rounded-md px-3 py-2 text-center text-sm font-medium ${kind === "password" ? "bg-white text-[#202120] shadow-sm" : "text-[#777a74]"}`}><input className="sr-only" type="radio" name="kind" value="password" checked={kind === "password"} onChange={() => setKind("password")} />Password</label><label className={`cursor-pointer rounded-md px-3 py-2 text-center text-sm font-medium ${kind === "api-key" ? "bg-white text-[#202120] shadow-sm" : "text-[#777a74]"}`}><input className="sr-only" type="radio" name="kind" value="api-key" checked={kind === "api-key"} onChange={() => setKind("api-key")} />API key</label></div></div><div className="mt-5 space-y-4"><label className="block text-sm font-medium">{kind === "api-key" ? "Service name" : "Website"}<input name="name" required placeholder={kind === "api-key" ? "e.g. OpenAI" : "e.g. Spotify"} className="mt-1.5 h-11 w-full rounded-lg border border-[#e1e3de] px-3 text-sm outline-none transition focus:border-[#6675dc] focus:ring-2 focus:ring-[#e1e5ff]" /></label><label className="block text-sm font-medium">{kind === "api-key" ? "Use or environment" : "Username or email"}<input name="account" required autoComplete={kind === "password" ? "username" : "off"} placeholder={kind === "api-key" ? "e.g. Development" : "you@example.com"} className="mt-1.5 h-11 w-full rounded-lg border border-[#e1e3de] px-3 text-sm outline-none transition focus:border-[#6675dc] focus:ring-2 focus:ring-[#e1e5ff]" /></label><label className="block text-sm font-medium">{kind === "api-key" ? "API key" : "Password"}<input name="secret" required type="password" autoComplete="new-password" placeholder={kind === "api-key" ? "Paste your API key" : "Enter a strong password"} className="mt-1.5 h-11 w-full rounded-lg border border-[#e1e3de] px-3 text-sm outline-none transition focus:border-[#6675dc] focus:ring-2 focus:ring-[#e1e5ff]" /></label></div><div className="mt-7 flex justify-end gap-3"><button type="button" onClick={onClose} className="h-10 rounded-lg px-4 text-sm font-medium text-[#62645f] hover:bg-[#f1f2ee]">Cancel</button><button className="h-10 rounded-lg bg-[#202120] px-4 text-sm font-medium text-white hover:bg-[#363735]">Save item</button></div></form></div>;
}
