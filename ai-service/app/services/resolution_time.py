class ResolutionTimePredictor:
    @staticmethod
    def predict(category: str, priority: str, severity: int) -> Tuple[int, str]:
        """
        Predicts expected resolution SLA hours.
        Returns: Tuple of (SLA Hours, SLA String Representation)
        """
        # Base categorizations
        base_hours = {
            "GARBAGE": 24,
            "ROADS": 120,
            "WATER": 48,
            "ELECTRICITY": 12,
            "DRAINAGE": 36,
            "TRAFFIC": 8,
            "POLLUTION": 168,
            "PUBLIC_SAFETY": 24,
            "OTHER": 48
        }
        
        hours = base_hours.get(category, 48)
        
        # Priority multipliers
        if priority == "CRITICAL":
            hours = max(2, int(hours * 0.25)) # Cut resolution window to 25% of base
        elif priority == "HIGH":
            hours = int(hours * 0.50)
        elif priority == "LOW":
            hours = int(hours * 1.50)

        # Scale by severity score bounds
        if severity > 80:
            hours = int(hours * 1.2) # High complexity adds 20% work time
            
        time_str = f"{hours} hours"
        if hours >= 24:
            days = hours // 24
            time_str = f"{days} days" if days > 1 else "1 day"
            
        return hours, time_str
