import pdfplumber
import docx2txt

def extract_text(file):
    filename = file.filename.lower()
    ext = filename.split(".")[-1]

    if ext == "pdf":
        return extract_pdf(file)
    else:
        return extract_docx(file)

def extract_pdf(file):
    text = ""
    with pdfplumber.open(file) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    return text

def extract_docx(file):
    return docx2txt.process(file)
