from abc import ABC, abstractmethod
import pandas as pd
import pdfplumber
import io

class BaseBankParser(ABC):
    def __init__(self, file_content: bytes, password: str = None):
        self.file_content = file_content
        self.password = password

    @abstractmethod
    def parse(self) -> pd.DataFrame:
        """
        Parses the PDF and returns a standardized pandas DataFrame 
        with columns: ['Date', 'Description', 'Debit', 'Credit', 'Balance']
        """
        pass

    def get_pdf(self):
        """Helper to open the PDF safely in-memory."""
        return pdfplumber.open(io.BytesIO(self.file_content), password=self.password)

    def standardize_df(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Ensures the dataframe has the correct columns.
        """
        expected_cols = ['Date', 'Description', 'Debit', 'Credit', 'Balance']
        for col in expected_cols:
            if col not in df.columns:
                df[col] = None
        
        # Reorder and keep only expected columns
        return df[expected_cols]
