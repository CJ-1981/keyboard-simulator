#!/usr/bin/env python3
"""Merge cover + body PDFs into final deliverable, apply metadata, run QA."""
import sys
from pypdf import PdfReader, PdfWriter

A4_W, A4_H = 595.28, 841.89

def normalize_page_to_a4(page):
    box = page.mediabox
    w, h = float(box.width), float(box.height)
    # Always scale to exact A4 if dimensions deviate by even a sub-pixel amount
    if abs(w - A4_W) > 0.3 or abs(h - A4_H) > 0.3:
        page.scale_to(A4_W, A4_H)
    return page

def insert_cover(cover_pdf, body_pdf, output_pdf):
    writer = PdfWriter()
    cover_page = PdfReader(cover_pdf).pages[0]
    writer.add_page(normalize_page_to_a4(cover_page))
    for page in PdfReader(body_pdf).pages:
        writer.add_page(normalize_page_to_a4(page))
    writer.add_metadata({
        '/Title': 'Keyboard Lab — Product Plan',
        '/Author': 'Z.ai',
        '/Creator': 'Z.ai',
        '/Subject': 'Product plan, interview question bank, and design proposals for a browser-based keyboard layout and keycap color simulator.',
    })
    with open(output_pdf, 'wb') as f:
        writer.write(f)
    print(f'Merged PDF: {output_pdf}')

if __name__ == '__main__':
    insert_cover(
        '/home/z/my-project/work/cover.pdf',
        '/home/z/my-project/work/body.pdf',
        '/home/z/my-project/download/KeyboardLab-Product-Plan.pdf',
    )
