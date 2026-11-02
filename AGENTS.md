# Korean with Juju desktop app publishing

The user launches the installed Whale desktop app “Korean with Juju 쌤 · 수업 자료”.
Its start URL is https://elisa0402-bot.github.io/Learn-Korean-with-JUJU/index.html.
Editing this E: folder alone does not update the installed app.

When the user requests lesson edits, the authorized scope includes publishing those edits to the existing app. Finish local changes, verify them, then publish the requested files to the existing GitHub repository elisa0402-bot/Learn-Korean-with-JUJU (main). Verify the deployed URL contains the edits before reporting completion. Do not claim that a local-only edit updates the desktop app.

Preserve unrelated remote changes: inspect the current remote main and use its tree as the base. In November 2026, remote index.html already includes lesson 18 while the old E: copy did not. Do not replace remote files wholesale with stale local versions. Use connected GitHub tools when local git is unavailable. Update the branch with an expected-head lease, without force. Do not publish backup files.

Automatic freshness uses app-update.js, version.json, and sw.js. When a page that includes app-update.js changes, give it a new data-page-version on its script tag and update its matching entry in version.json in the SAME commit. Add the script tag for newly edited lesson HTML if absent. The client checks on open, focus, online, visibility return, and every 60 seconds while visible; it preserves work in progress. The service worker uses fresh network responses online and cached lessons offline. Do not add unrequested background filesystem watchers or publish unfinished edits.

Dialogue layout: place each 가: and 나: turn on a separate line with a blank line between turns, including newly added dialogues; split translations by speaker too. Keep Korean, English, French, answer display, and grading values in sync. Match existing illustration style and embed replacement images inside lesson HTML.
