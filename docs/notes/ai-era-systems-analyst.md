---
title: From Slides to Pull Requests — How AI Changed My Work as a Systems Analyst
description: I'm not a programmer, but I open pull requests now. Notes on how my workflow as a Systems Analyst changed in the AI era, what got faster, and why human review matters more than ever.
---

# From Slides to Pull Requests: How AI Changed My Work as a Systems Analyst

## Introduction

I'm a **Systems Analyst**, not a programmer. For most of my career my job ended where the code began: I found the problem, explained it, and handed it over. Then AI tools became good enough to sit inside my daily work, and that line moved. These days I sometimes open a pull request myself, and a senior developer reviews it and merges it.

These notes are about that shift: what my workflow looked like before, what it looks like now, and what didn't change at all.

## Before: the lone analyst

My old workflow was a relay race, and I ran the first leg alone:

1. **Gather** the issue and every scrap of information around it.
2. **Validate** it in the system: reproduce it, check the data, make sure it's real.
3. **Write it up** as a note or a slide deck that explains the problem and the expected fix.
4. **Pass it to a developer** and walk them through it.
5. **Discuss** the details, the edge cases, and what I really meant.
6. **Wait** for the code.
7. **Test** it, and send it back if it wasn't quite right.

Then, voilà, the hot code is baked. It worked, but it was slow. Every handover lost a bit of context, and a lot of time went into waiting rather than working.

## After: the workflow is the boss

Now a large part of that relay runs as a workflow, with AI helping at almost every step: investigating an issue, tracing it through the code, drafting the explanation, and drafting the change itself.

The biggest change is that I now have **two ways forward** instead of one:

- **Create an issue** for the developers, as before, when the change is large, risky or needs deep design work.
- **Open a pull request myself** when the change is clear and contained. A senior reviews it and merges it.

I still validate everything in the system first. That part was always my job, and it still is.

## An example: RKP flash updates

RKP (the government's annual work plan) sometimes needs a **flash update**: a small change that has to land quickly. In the old flow that meant slides → developer → wait, and a change like that could take **about a week**.

With the new workflow, the same kind of update now takes **a couple of days**. The work didn't disappear. The waiting and the back-and-forth between handovers shrank.

## Where AI still falls short

AI is fast, but it isn't always deep. Sometimes it fixes the **surface of a problem** instead of the cause: the symptom goes away, but the real issue is still sitting somewhere else in the codebase.

That's where a human has to step in: someone who reads the wider code, understands why it was built that way, and can tell a real fix from a patch. In practice, that's what the senior's review is for. AI speeds up the drafting; people still decide what's correct.

## What didn't change

- **Understanding the business.** Knowing what a planner actually needs, and why, is still the hardest and most valuable part.
- **Validating in the system.** A change based on a misread problem is still a wrong change, just a faster one.
- **Talking to people.** Users, developers and seniors are still where the real answers come from.

## What I took away

- **The role grew; it didn't shrink.** I went from describing changes to proposing them as code.
- **Speed comes from fewer handovers.** Less waiting, less lost context, shorter loops.
- **Review matters more than ever.** When anyone can open a PR, the person who reads it carefully is the safety net.
- **Know when to stop and ask.** If a fix feels too easy, it might only be fixing the surface.
- **Overall, we're faster as a team.** Not because AI does everything, but because each of us can now do more of the loop ourselves.

*This is a living note. My workflow is still changing, and I'll update this as it does.*
