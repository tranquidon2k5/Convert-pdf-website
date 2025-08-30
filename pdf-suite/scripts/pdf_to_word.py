import sys

def main():
    try:
        from pdf2docx import Converter
    except Exception as e:
        print("pdf2docx missing. Install with: pip install pdf2docx", file=sys.stderr)
        sys.exit(2)

    if len(sys.argv) < 3:
        print("Usage: pdf_to_word.py <input.pdf> <output.docx>")
        sys.exit(1)

    input_pdf = sys.argv[1]
    output_docx = sys.argv[2]
    cv = Converter(input_pdf)
    try:
        cv.convert(output_docx, start=0, end=None)
    finally:
        cv.close()

if __name__ == "__main__":
    main()







