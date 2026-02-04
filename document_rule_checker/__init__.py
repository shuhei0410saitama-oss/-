"""
Document Rule Checker
PDFやWord文書の文章ルール違反をチェックするツール
"""

from .file_reader import read_document, read_pdf, read_docx
from .rule_checker import check_document, load_rules, Violation

__version__ = "1.0.0"
__all__ = [
    "read_document",
    "read_pdf",
    "read_docx",
    "check_document",
    "load_rules",
    "Violation",
]
