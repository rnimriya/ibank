import pandas as pd
from .base import BaseBankParser

class ICICIParser(BaseBankParser):
    def parse(self) -> pd.DataFrame:
        all_rows = []
        
        try:
            with self.get_pdf() as pdf:
                for page in pdf.pages:
                    tables = page.extract_tables()
                    for table in tables:
                        for row in table:
                            # Basic heuristic
                            if not row or row[0] is None or "Date" in str(row[0]):
                                continue
                            
                            # Standard ICICI columns: Date, Mode, Remarks, Amount(Dr), Amount(Cr), Balance
                            if len(row) >= 6:
                                date = row[0]
                                desc = f"{row[1]} - {row[2]}" if row[1] else row[2]
                                debit = row[3] if row[3] else 0.0
                                credit = row[4] if row[4] else 0.0
                                balance = row[5] if row[5] else 0.0
                                
                                all_rows.append({
                                    'Date': date,
                                    'Description': desc,
                                    'Debit': debit,
                                    'Credit': credit,
                                    'Balance': balance
                                })
        except Exception as e:
            raise Exception(f"Failed to parse ICICI statement: {str(e)}")
            
        df = pd.DataFrame(all_rows)
        return self.standardize_df(df)
