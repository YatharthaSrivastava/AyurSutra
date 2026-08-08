"""Regenerate Tracker.pdf from tracker.md after each sprint."""
from pathlib import Path

from fpdf import FPDF

ROOT = Path(__file__).resolve().parent.parent
MD_PATH = ROOT / "tracker.md"
OUT_PATH = ROOT / "Tracker.pdf"
DOWNLOADS_PATH = Path(r"c:\Users\Yathartha\Downloads\Tracker.pdf")


def wrap(pdf: FPDF, text: str, h: float = 4, font_size: int = 8) -> None:
    safe = text.encode("latin-1", "replace").decode("latin-1")
    if len(safe) > 110:
        safe = safe[:107] + "..."
    pdf.set_x(pdf.l_margin)
    pdf.set_font("Helvetica", "", font_size)
    pdf.multi_cell(pdf.epw, h, safe)


def main() -> None:
    text = MD_PATH.read_text(encoding="utf-8")
    pdf = FPDF()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.add_page()
    pdf.set_font("Helvetica", "B", 14)
    wrap(pdf, "AyurSutra - Milestone & Deliverables Tracker", 6)
    pdf.ln(4)
    pdf.set_font("Helvetica", "", 8)

    for line in text.splitlines():
        if not line.strip():
            pdf.ln(2)
            continue
        if line.startswith("# "):
            pdf.ln(2)
            pdf.set_font("Helvetica", "B", 11)
            wrap(pdf, line[2:], 5)
            pdf.set_font("Helvetica", "", 8)
        elif line.startswith("## "):
            pdf.ln(1)
            pdf.set_font("Helvetica", "B", 10)
            wrap(pdf, line[3:], 5)
            pdf.set_font("Helvetica", "", 8)
        elif line.startswith("|"):
            wrap(pdf, line.replace("|", " ").strip(), 3, font_size=7)
        else:
            wrap(pdf, line, 4)

    pdf.output(str(OUT_PATH))
    if DOWNLOADS_PATH.parent.exists():
        import shutil

        shutil.copy2(OUT_PATH, DOWNLOADS_PATH)
        print(f"Updated: {DOWNLOADS_PATH}")
    print(f"Generated: {OUT_PATH}")


if __name__ == "__main__":
    main()
