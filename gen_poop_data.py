#!/usr/bin/env python3
"""Generate poop_data.js from a Google Sheets export of the Entries tab.

Usage: python3 gen_poop_data.py sheet_values.json
where sheet_values.json is {"values": [[Timestamp, Name, Date, Time, Size, Texture, Notes], ...]}
"""
import json, sys, datetime

vals = json.load(open(sys.argv[1]))["values"]
header, rows = vals[0], vals[1:]

entries = []
for r in rows:
    r = r + [""] * (7 - len(r))
    ts, name, date, time, size, texture, notes = r
    if not date:
        continue
    entries.append({
        "date": date, "time": time, "size": size, "texture": texture,
        "notes": notes, "logged": ts, "by": name,
    })

entries.sort(key=lambda e: (e["date"], e["time"] or "99:99"))

# Miralax dose history - sourced from Miki's note in the sheet (Aug 24, 2026 row) and her
# Slack message Aug 28, 2026 ("on 25mg for a long time, now down to 21mg"). Sheet note:
# "reduced from 25g to 21g starting Aug 21; Aug 22 first day of 21g. Before Aug 8 measured
# by cap (likely closer to 28-30g); since Aug 8 G-tube surgery measured by scale,
# conclusively 25g from Aug 8." Dose start predates the log (~Dec 29, 2025 per Miki).
dose_markers = [
    {"date": entries[0]["date"], "dose_g": 25, "label": "25g by cap (likely ~28-30g actual)", "note": "On Miralax since ~Dec 29, 2025; cap-measured until Aug 8"},
    {"date": "2026-08-08", "dose_g": 25, "label": "25g by scale", "note": "Scale-measured from G-tube surgery (Aug 8); conclusively 25g"},
    {"date": "2026-08-22", "dose_g": 21, "label": "21g", "note": "First full day of 21g (reduced from 25g)"},
]

out = {
    "generated_at": datetime.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ"),
    "entries": entries,
    "dose_markers": dose_markers,
}
js = ("const POOP_META = " + json.dumps({k: out[k] for k in ("generated_at",)}, indent=2) + ";\n"
      + "const POOP_ENTRIES = " + json.dumps(entries, indent=2) + ";\n"
      + "const DOSE_MARKERS = " + json.dumps(dose_markers, indent=2) + ";\n")
open("poop_data.js", "w").write(js)
print("entries:", len(entries), "| range:", entries[0]["date"], "->", entries[-1]["date"])
