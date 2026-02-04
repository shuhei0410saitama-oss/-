"""
Document Rule Checker
PDFやWord文書の文章ルール違反をチェックするツール
"""

from .file_reader import read_document, read_pdf, read_docx
from .rule_checker import (
    check_document,
    load_rules,
    load_rules_from_text_file,
    create_rules_from_text,
    Violation,
)
from .offline_checker import check_document_offline

__version__ = "1.1.0"
__all__ = [
    "read_document",
    "read_pdf",
    "read_docx",
    "check_document",
    "check_document_offline",
    "load_rules",
    "load_rules_from_text_file",
    "create_rules_from_text",
    "Violation",
]
