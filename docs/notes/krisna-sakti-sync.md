---
title: Bridging Planning and Budget — Building KRISNA ↔ SAKTI Sync
description: Notes from my work as a KRISNA Systems Analyst on the Sinkronisasi SAKTI feature — data design, validation, queues, and coordinating with the SAKTI side.
---

# Bridging Planning and Budget: Building KRISNA ↔ SAKTI Sync

## Introduction

I work as a **Systems Analyst on KRISNA**, the national development planning system run by Bappenas (Kementerian PPN), focusing on Renja K/L, the annual work plans of ministries and agencies. A big part of my recent work has been **Sinkronisasi SAKTI**: the feature that pulls budget-side data from **SAKTI**, the Ministry of Finance's budget application (via its *Modul Sinkron*), checks it, and writes it into KRISNA.

On paper it sounds like "just an API integration". In practice it sits right on the line between two institutions, two data models, and hundreds of users who need both systems to agree. These notes cover what I built, what I learned coordinating with the SAKTI side, and how we handle validation issues day to day.

## The problem: one hierarchy, two owners

Renja K/L data is a tree:

```
Program
 └─ Sasaran Program (+ indikator)
     └─ Kegiatan
         └─ Sasaran Kegiatan (+ IKK)
             └─ KRO  (Klasifikasi Rincian Output)
                 └─ RO  (Rincian Output)
                     ├─ Indikator RO
                     ├─ Lokasi RO
                     └─ Komponen
```

After the *Nota Keuangan* stage, ownership splits in the middle. **Program down to Sasaran Kegiatan and its indicators (IKK) stay in KRISNA.** **KRO and below are maintained in SAKTI Modul Sinkron** and become read-only in KRISNA.

The tricky part is the seam. An RO lives on the SAKTI side, but it *points to* a Sasaran Kegiatan on the KRISNA side, and each Indikator RO points to a KRISNA IKK. Two systems, one tree, and links that cross the boundary. Most of the interesting bugs and user questions come from exactly that seam.

## What I built

The Sinkronisasi SAKTI page gives each program a four-step flow:

1. **Fetch Data Baru**: pull the latest data from apisakti, including TOR/RAB documents.
2. **Bandingkan**: a side-by-side comparison of current KRISNA data ("Semula") against incoming SAKTI data ("Menjadi"), with the differences. Read-only, with an Excel export for archiving.
3. **Validasi**: a dry run of the sync against a rule set (28 rules), each marked *wajib* (blocking) or not. Nothing is saved; the result shows which rows fail and why.
4. **Sync ke KRISNA**: runs the same mandatory validation again and only commits if everything passes. Otherwise the whole sync is rolled back, so KRISNA never ends up half-updated.

Design decisions I'm happy with:

- **Validate before you write, and validate again when you write.** The standalone Validasi step is optional and exists for visibility. The real guard is inside Sync, which is transactional: all or nothing.
- **A data-readiness gate.** Every row SAKTI sends carries a `validSakti` flag. If any row isn't `1` yet (still being validated on the SAKTI side), the page shows a clear status and a per-level breakdown, and disables Bandingkan, Validasi and Sync until a fresh fetch comes back clean. That turned a confusing class of errors into one obvious message.
- **Documents fail safe.** If a TOR/RAB file fails to download from SAKTI, KRISNA keeps the file it already has instead of wiping it, and users can download the list of failed files.
- **A queue, on purpose.** Requests from every ministry are processed one at a time. Fetch is the heaviest step (files arrive base64-encoded and are decoded one by one), and sync writes allocations that must land exactly right, so serializing beats racing. We later split Bandingkan / Validasi / Sync away from the Fetch queue so they don't wait behind slow downloads.
- **Raw data stays inspectable.** "Unduh ADK (CSV)" exports exactly what apisakti sent (output, sub-output, indicator, location and component tables), so any validation result can be traced back to the source rows.

## Coordinating with SAKTI

A lot of the work wasn't code. It was making two systems agree on meaning:

- **Agreeing on who owns what.** We pinned down which entities are authored where, so each fix has one home. For anything from KRO down, the answer is "fix it in SAKTI, then fetch again".
- **Mapping fields across models.** Things like linking an RO to its Sasaran Kegiatan (`kdSasKeg`) and an indicator to its IKK (`kdIkk`), and handling quirks such as codes losing their leading zeros in exports (`001` → `1`).
- **Being able to prove a result.** When users felt a validation was wrong, being able to open the raw ADK files and show the exact rows (an empty `validSakti`, or an indicator pointing to an IKK that doesn't exist) settled it quickly and kept the discussion factual.
- **Feeding back what users hit.** Recurring user questions became requests for clearer messages, better status labels, and wording that explains *what's wrong, why, where to fix it, and what to do next*.

## How we handle a validation issue

The users are planners in ministries' planning bureaus, not engineers, and a 28-rule validation report can be intimidating. Over time, handling a failed validation settled into a repeatable process:

**1. Check the gate first.** Before any rule runs, the data has to be ready. If the status shows `validSakti` ≠ 1, some rows are still being validated in SAKTI, and Bandingkan, Validasi and Sync stay locked. There's nothing to fix in KRISNA yet: finish validation in SAKTI, then Fetch Data Baru.

**2. Triage the result.** Once validation runs, sort the failing rules by:
- **wajib or not:** mandatory rules block Sync; non-mandatory ones (missing TOR/RAB on a priority RO, for example) can be resolved later;
- **level:** Program, Sasaran, Kegiatan, KRO, RO, Indikator RO, Lokasi or Komponen;
- **owner:** which side of the KRISNA/SAKTI split that level belongs to. This one decision tells the user where the fix will happen.

**3. Read the failing code.** Each problem row comes with a full code such as `CB.1234.ABC.001.03`, which reads as Program · Kegiatan · KRO · RO · Indikator. Breaking it apart tells you exactly which item to look at.

**4. Trace it to the source data.** Download the ADK and follow the links. For an indicator that "doesn't support its IKK", for example:
- in the indicator table, find the row and read `kdIkk`, which says which IKK it points to;
- in the RO table, read `kdSasKeg` to see which Sasaran Kegiatan the RO hangs under;
- in KRISNA, check whether that IKK actually exists under that Sasaran Kegiatan, and whether the Sasaran Kegiatan is suspended.

If the IKK doesn't exist, or its parent is suspended, the validation is right, and now you know why. Users who don't want to open CSVs can check the same RO directly in SAKTI Modul Sinkron instead.

**5. Fix it where it lives.** For anything from KRO down, the fix happens in SAKTI: point the indicator to an existing IKK, or move the RO to the correct, active Sasaran Kegiatan.

**6. Close the loop.** Back in KRISNA: **Fetch Data Baru → Validasi → Sync**. If a mandatory rule still fails, Sync rolls back and nothing changes, so it's safe to iterate.

**7. Answer with evidence.** When a user believes a validation is wrong, the answer is always the raw rows: "these two lines in your ADK have an empty `validSakti`", or "this indicator points to IKK 02, which doesn't exist". Showing the source data keeps the conversation factual and quick, and recurring cases go back into clearer rule messages and status labels.

## What I took away

- **Integration problems are mostly ownership problems.** Once "who is the source of truth for this field?" is settled, most of the code follows.
- **Dry runs and all-or-nothing writes build trust.** Users click Sync with more confidence when they know a failed check changes nothing.
- **Make every error actionable.** "Validation failed" is useless. "This indicator points to IKK 02, which doesn't exist under Sasaran Kegiatan 02; fix it in SAKTI, then Fetch → Validasi" gets resolved.
- **A repeatable triage beats case-by-case firefighting.** Gate → triage → trace → fix at the source → re-fetch turns most "the system is wrong" reports into a five-minute check.

*This is a living note. I'll add more as the sync evolves.*
