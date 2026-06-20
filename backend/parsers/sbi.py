import pandas as pd
from .base import BaseBankParser

class SBIParser(BaseBankParser):
    def parse(self) -> pd.DataFrame:
        all_rows = []
        
        try:
            with self.get_pdf() as pdf:
                for page in pdf.pages:
                    tables = page.extract_tables()
                    for table in tables:
                        for row in table:
                            if not row or row[0] is None or "Txn Date" in str(row[0]) or "Date" in str(row[0]):
                                continue
                            
                            # Standard SBI columns: Txn Date, Value Date, Description, Ref No, Debit, Credit, Balance
                            if len(row) >= 7:
                                date = row[0]
                                desc = row[2]
                                debit = row[4] if row[4] else 0.0
                                credit = row[5] if row[5] else 0.0
                                balance = row[6] if row[6] else 0.0
                                
                                all_rows.append({
                                    'Date': date,
                                    'Description': desc,
                                    'Debit': debit,
                                    'Credit': credit,
                                    'Balance': balance
                                })
        except Exception as e:
            raise Exception(f"Failed to parse SBI statement: {str(e)}")
            
        df = pd.DataFrame(all_rows)
        return self.standardize_df(df)
