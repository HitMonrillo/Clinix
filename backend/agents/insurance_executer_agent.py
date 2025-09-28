from typing import Dict, Any

class InsuranceExecutorAgent:
    def __init__(self):
        self = self

    def get_plan_details(self, name: str, coverage: Dict[str, Any]) -> str:
        """
        Lookup full plan details given a Plan ID.
        """

        out = f"""
        Hello {name}.
        Because of your insurance plan of {coverage["plan"]} with {coverage["company"]},
        Your co-pay for {coverage["service"]} is ${coverage["co-pay"]}.
        Thank you!
        """
        return out

