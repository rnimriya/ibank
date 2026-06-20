from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import uvicorn
import io
import pandas as pd
# import pdfplumber  # We'll use this for actual extraction later

app = FastAPI(title="Convert Statement API", description="In-memory PDF extraction engine.")

# Add CORS middleware to allow Next.js frontend to communicate
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "healthy", "service": "Convert Statement Engine"}

@app.post("/api/parse")
async def parse_pdf(
    file: UploadFile = File(...),
    password: Optional[str] = Form(None),
    target_format: str = Form("csv")
):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
    
    # Read file into memory (Zero disk storage policy)
    contents = await file.read()
    
    # Simple bank inference logic based on filename (MVP approach)
    filename_lower = file.filename.lower()
    df = None
    
    try:
        if "hdfc" in filename_lower:
            from parsers.hdfc import HDFCParser
            parser = HDFCParser(contents, password)
            df = parser.parse()
        elif "sbi" in filename_lower:
            from parsers.sbi import SBIParser
            parser = SBIParser(contents, password)
            df = parser.parse()
        elif "icici" in filename_lower:
            from parsers.icici import ICICIParser
            parser = ICICIParser(contents, password)
            df = parser.parse()
        else:
            # Fallback mock if it's an unrecognized bank for demo purposes
            mock_data = {
                "Date": ["2023-10-01", "2023-10-02"],
                "Description": ["Mocked Generic Parsing", "Please specify bank in filename"],
                "Debit": [100.0, 0.0],
                "Credit": [0.0, 200.0],
                "Balance": [900.0, 1100.0]
            }
            df = pd.DataFrame(mock_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    if target_format.lower() == 'csv':
        csv_buffer = io.StringIO()
        df.to_csv(csv_buffer, index=False)
        return {"filename": f"{file.filename}_converted.csv", "data": csv_buffer.getvalue(), "format": "csv"}
    elif target_format.lower() == 'xlsx':
        # Return base64 or binary later, for now just returning JSON to prove it works
        return {"filename": f"{file.filename}_converted.xlsx", "data": mock_data, "format": "xlsx"}
    else:
        # Fallback to JSON
        return {"filename": file.filename, "data": mock_data, "format": target_format}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
