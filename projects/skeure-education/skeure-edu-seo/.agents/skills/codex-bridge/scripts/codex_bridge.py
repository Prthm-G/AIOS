#!/usr/bin/env python3
"""Run a bounded Codex peer task from a Claude-first workspace."""

from __future__ import annotations

import argparse
import datetime as dt
import fcntl
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
from typing import TextIO


SEO_ROOT = Path(__file__).resolve().parents[4]
RUNS_ROOT = SEO_ROOT / ".bridge" / "runs"
LOCK_PATH = SEO_ROOT / ".bridge" / "write.lock"
SKILL_ROUTER = SEO_ROOT / "bridge" / "SKILL-ROUTER.md"

SKILL_RULES: tuple[tuple[str, tuple[str, ...]], ...] = (
    ("seo-project-setup", ("setup", "baseline", "project context", "gsc")),
    (
        "seo-coach",
        ("seo coach", "next seo step", "seo progress", "prioritize seo"),
    ),
    (
        "competitive-landscape",
        ("landscape", "market category", "market structure", "competitor set"),
    ),
    (
        "competitor-analysis",
        ("competitor", "comparison", "content gap", "share of voice"),
    ),
    (
        "keyword-research",
        ("keyword", "search volume", "search intent", "query"),
    ),
    (
        "keyword-clustering",
        ("cluster", "cannibal", "keyword map", "topic map", "hub"),
    ),
    (
        "link-prospecting",
        ("backlink", "link prospect", "digital pr", "outreach prospect"),
    ),
    (
        "deslop",
        ("copy", "draft", "rewrite", "edit prose", "tone", "ai writing"),
    ),
)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Delegate a bounded ask, review, or implementation task to Codex."
    )
    parser.add_argument("mode", choices=("ask", "review", "implement", "status"))
    parser.add_argument(
        "prompt",
        nargs="?",
        help="Inline prompt, '-' for stdin, or omit when using --prompt-file.",
    )
    parser.add_argument("--prompt-file", type=Path)
    parser.add_argument("--cwd", type=Path, default=SEO_ROOT)
    parser.add_argument("--add-dir", action="append", type=Path, default=[])
    parser.add_argument("--allow-write", action="store_true")
    parser.add_argument("--model")
    parser.add_argument(
        "--effort",
        choices=("low", "medium", "high", "xhigh", "max", "ultra"),
        default="high",
    )
    parser.add_argument("--search", action="store_true")
    parser.add_argument("--keep-session", action="store_true")
    parser.add_argument("--label", default="")
    return parser.parse_args()


def run_capture(command: list[str], cwd: Path | None = None) -> tuple[int, str]:
    result = subprocess.run(
        command,
        cwd=cwd,
        text=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        check=False,
    )
    return result.returncode, result.stdout.strip()


def git_status(cwd: Path) -> str:
    code, output = run_capture(
        ["git", "-C", str(cwd), "status", "--short", "--", "."]
    )
    return output if code == 0 else f"git status unavailable: {output}"


def read_prompt(args: argparse.Namespace) -> str:
    selected = sum(
        [
            bool(args.prompt_file),
            args.prompt == "-",
            bool(args.prompt and args.prompt != "-"),
        ]
    )
    if selected != 1:
        raise ValueError(
            "provide exactly one prompt source: inline, '-', or --prompt-file"
        )
    if args.prompt_file:
        return args.prompt_file.resolve().read_text(encoding="utf-8").strip()
    if args.prompt == "-":
        return sys.stdin.read().strip()
    return str(args.prompt).strip()


def slug(value: str) -> str:
    cleaned = "".join(ch.lower() if ch.isalnum() else "-" for ch in value)
    return "-".join(part for part in cleaned.split("-") if part)[:40]


def status() -> int:
    checks: list[tuple[str, bool, str]] = []
    for command in ("claude", "codex", "git", "python3"):
        path = shutil.which(command)
        checks.append((command, bool(path), path or "missing"))

    if shutil.which("codex"):
        code, auth = run_capture(["codex", "login", "status"])
        checks.append(("codex-auth", code == 0, auth))
        _, mcp = run_capture(["codex", "mcp", "list"])
        openseo_line = next(
            (line for line in mcp.splitlines() if line.lstrip().startswith("openseo")),
            "",
        )
        openseo_ready = bool(openseo_line) and "Not logged in" not in openseo_line
        checks.append(
            (
                "codex-openseo",
                openseo_ready,
                openseo_line.strip() or "missing",
            )
        )

    skill = SEO_ROOT / ".agents" / "skills" / "codex-bridge" / "SKILL.md"
    claude_skill = SEO_ROOT / ".claude" / "skills" / "codex-bridge"
    checks.append(("shared-skill", skill.exists(), str(skill)))
    checks.append(("claude-skill-link", claude_skill.exists(), str(claude_skill)))
    checks.append(("skill-router", SKILL_ROUTER.exists(), str(SKILL_ROUTER)))

    width = max(len(name) for name, _, _ in checks)
    for name, ok, detail in checks:
        marker = "OK" if ok else "FAIL"
        print(f"{name:<{width}}  {marker:<4}  {detail}")
    return 0 if all(ok for _, ok, _ in checks) else 2


def codex_prompt(mode: str, cwd: Path, user_prompt: str) -> str:
    permission = (
        "You may edit files only inside the supplied working directories."
        if mode == "implement"
        else "This is a read-only task. Do not modify files."
    )
    prompt_lower = user_prompt.lower()
    selected_skills = ["codex-bridge", "skeure-seo-orchestrator"]
    selected_skills.extend(
        name
        for name, terms in SKILL_RULES
        if any(term in prompt_lower for term in terms)
    )
    skill_paths = "\n".join(
        f"- {SEO_ROOT / '.agents' / 'skills' / name / 'SKILL.md'}"
        for name in dict.fromkeys(selected_skills)
    )
    return f"""You are Codex acting as a bounded peer under Claude orchestration.

Mode: {mode}
Working directory: {cwd}
SEO workspace: {SEO_ROOT}

{permission}
Codex may report that the machine-wide skill-description budget is exceeded. That is
expected on this workstation and must not stop the task. Ignore the global skill catalog.
Read the applicable AGENTS.md files, then read the project skill router:
- {SKILL_ROUTER}
Read these explicitly selected project skills before acting:
{skill_paths}
If the router identifies one more project skill as clearly required, read that skill too.
Do not invoke Claude, do not recursively delegate the task back, and do not broaden scope.
Never deploy, alter DNS, activate redirects, send messages, purchase anything, expose secrets,
or make destructive changes unless the task explicitly authorizes that exact action.
Distinguish verified evidence from inference. Education, finance, legal, regulatory,
testimonial, rating, placement, and partner claims require primary-source evidence.

Task:
{user_prompt}

Return a concise result with these headings:
1. Outcome
2. Evidence or files changed
3. Checks run
4. Findings or residual risks
5. Recommended next action
"""


def stream_process(
    command: list[str], prompt: str, events: Path, stderr_path: Path
) -> int:
    with (
        events.open("w", encoding="utf-8") as log,
        stderr_path.open("w", encoding="utf-8") as stderr_log,
    ):
        process = subprocess.Popen(
            command,
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=stderr_log,
            text=True,
            bufsize=1,
        )
        assert process.stdin is not None
        assert process.stdout is not None
        process.stdin.write(prompt)
        process.stdin.close()
        for line in process.stdout:
            log.write(line)
            log.flush()
            try:
                event = json.loads(line)
            except json.JSONDecodeError:
                continue
            event_type = event.get("type")
            if event_type in {
                "thread.started",
                "turn.completed",
                "turn.failed",
                "error",
            }:
                print(f"[codex] {event_type}", flush=True)
        return process.wait()


def main() -> int:
    args = parse_args()
    if args.mode == "status":
        return status()

    codex = shutil.which("codex")
    if not codex:
        print("codex executable not found", file=sys.stderr)
        return 2

    cwd = args.cwd.resolve()
    if not cwd.is_dir():
        print(f"working directory does not exist: {cwd}", file=sys.stderr)
        return 2

    if args.mode == "implement" and not args.allow_write:
        print("implement mode requires --allow-write", file=sys.stderr)
        return 2
    if args.mode != "implement" and args.allow_write:
        print("--allow-write is valid only in implement mode", file=sys.stderr)
        return 2

    try:
        user_prompt = read_prompt(args)
    except (OSError, ValueError) as exc:
        print(str(exc), file=sys.stderr)
        return 2
    if not user_prompt:
        print("prompt cannot be empty", file=sys.stderr)
        return 2

    timestamp = dt.datetime.now(dt.timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    label = f"-{slug(args.label)}" if args.label else ""
    run_dir = RUNS_ROOT / f"{timestamp}-{args.mode}{label}"
    run_dir.mkdir(parents=True, exist_ok=False)
    result_path = run_dir / "result.md"
    events_path = run_dir / "events.jsonl"
    stderr_path = run_dir / "stderr.log"

    prompt = codex_prompt(args.mode, cwd, user_prompt)
    (run_dir / "request.md").write_text(prompt, encoding="utf-8")
    (run_dir / "git-before.txt").write_text(
        git_status(cwd) + "\n", encoding="utf-8"
    )

    sandbox = "workspace-write" if args.mode == "implement" else "read-only"
    command = [
        codex,
        "--ask-for-approval",
        "never",
        "--sandbox",
        sandbox,
        "--cd",
        str(cwd),
        "--config",
        f'model_reasoning_effort="{args.effort}"',
    ]
    if args.model:
        command.extend(["--model", args.model])
    if args.search:
        command.append("--search")
    for directory in args.add_dir:
        command.extend(["--add-dir", str(directory.resolve())])
    command.extend(
        [
            "exec",
            "--json",
            "--output-last-message",
            str(result_path),
        ]
    )
    if not args.keep_session:
        command.append("--ephemeral")
    command.append("-")

    metadata = {
        "mode": args.mode,
        "cwd": str(cwd),
        "add_dirs": [str(path.resolve()) for path in args.add_dir],
        "sandbox": sandbox,
        "approval_policy": "never",
        "model": args.model or "configured default",
        "effort": args.effort,
        "search": args.search,
        "started_at": dt.datetime.now(dt.timezone.utc).isoformat(),
        "command": command[:-1] + ["<stdin>"],
    }
    (run_dir / "metadata.json").write_text(
        json.dumps(metadata, indent=2) + "\n", encoding="utf-8"
    )

    lock_handle: TextIO | None = None
    if args.mode == "implement":
        LOCK_PATH.parent.mkdir(parents=True, exist_ok=True)
        lock_handle = LOCK_PATH.open("w", encoding="utf-8")
        try:
            fcntl.flock(lock_handle, fcntl.LOCK_EX | fcntl.LOCK_NB)
        except BlockingIOError:
            print("another write-mode bridge run is active", file=sys.stderr)
            return 3
        lock_handle.write(f"{os.getpid()} {run_dir}\n")
        lock_handle.flush()

    try:
        print(f"run directory: {run_dir}")
        exit_code = stream_process(command, prompt, events_path, stderr_path)
    finally:
        if lock_handle is not None:
            fcntl.flock(lock_handle, fcntl.LOCK_UN)
            lock_handle.close()

    (run_dir / "git-after.txt").write_text(
        git_status(cwd) + "\n", encoding="utf-8"
    )
    metadata["finished_at"] = dt.datetime.now(dt.timezone.utc).isoformat()
    metadata["exit_code"] = exit_code
    (run_dir / "metadata.json").write_text(
        json.dumps(metadata, indent=2) + "\n", encoding="utf-8"
    )

    if exit_code != 0:
        print(
            f"Codex failed with exit code {exit_code}; inspect {events_path} "
            f"and {stderr_path}",
            file=sys.stderr,
        )
        return 4
    if not result_path.exists():
        print(f"Codex did not write {result_path}", file=sys.stderr)
        return 5

    print(f"\nresult: {result_path}\n")
    print(result_path.read_text(encoding="utf-8").strip())
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
