from typing import Tuple, Optional
from uuid import UUID

# Hardcoded master department IDs to emulate database reference returns
DEPT_MAPPINGS = {
    "GARBAGE": {"dept_code": "BBMP_SWM", "dept_name": "BBMP Solid Waste Management"},
    "ROADS": {"dept_code": "BBMP_ENG", "dept_name": "BBMP Road Infrastructure"},
    "WATER": {"dept_code": "BWSSB_MNT", "dept_name": "BWSSB Water Maintenance Division"},
    "ELECTRICITY": {"dept_code": "BESCOM_OPS", "dept_name": "BESCOM Operations"},
    "DRAINAGE": {"dept_code": "BWSSB_SWR", "dept_name": "BWSSB Sewerage Division"},
    "TRAFFIC": {"dept_code": "TRAFFIC_POL", "dept_name": "Karnataka Traffic Police"},
    "POLLUTION": {"dept_code": "KSPCB", "dept_name": "Karnataka Pollution Control Board"},
    "PUBLIC_SAFETY": {"dept_code": "BBMP_ADM", "dept_name": "BBMP Administrative Safety"},
    "OTHER": {"dept_code": "STATE_SEC", "dept_name": "State Secretariat"}
}

class DepartmentRouter:
    @staticmethod
    def get_department(category: str) -> dict:
        """
        Maps the classified category to the appropriate government department.
        """
        return DEPT_MAPPINGS.get(category, DEPT_MAPPINGS["OTHER"])

    @staticmethod
    def recommend_team(category: str, ward_id: Optional[int]) -> str:
        """
        Determines the nearest responding crew team.
        """
        suffix = f"Ward {ward_id}" if ward_id else "Sub-Division HQ"
        return f"{category.title()} Action Force - {suffix}"
