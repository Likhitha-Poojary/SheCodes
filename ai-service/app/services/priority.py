class PriorityPredictor:
    @staticmethod
    def predict(category: str, severity_level: str, is_near_critical_facility: bool = False, duplicate_count: int = 0) -> str:
        """
        Determines the priority level: LOW, MEDIUM, HIGH, CRITICAL.
        Factors:
        - Critical categories (WATER leaks flooding roads, public safety issues)
        - Visual Damage levels
        - Proximity metrics (duplicate_count indicates repeat issue)
        """
        # Base weights mapping
        category_score = 0
        if category in ["PUBLIC_SAFETY", "DRAINAGE"]:
            category_score = 3
        elif category in ["ROADS", "WATER", "ELECTRICITY"]:
            category_score = 2
        else:
            category_score = 1

        severity_score = 0
        if severity_level == "HIGH_DAMAGE":
            severity_score = 3
        elif severity_level == "MEDIUM_DAMAGE":
            severity_score = 2
        else:
            severity_score = 1

        total_weight = category_score + severity_score
        
        # Multipliers
        if is_near_critical_facility:
            total_weight += 2
        if duplicate_count > 3:
            total_weight += 1

        if total_weight >= 7:
            return "CRITICAL"
        elif total_weight >= 5:
            return "HIGH"
        elif total_weight >= 3:
            return "MEDIUM"
        else:
            return "LOW"
