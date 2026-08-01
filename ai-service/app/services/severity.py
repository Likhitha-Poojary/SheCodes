class SeverityScorer:
    @staticmethod
    def calculate(cv_damage_level: str, cv_confidence: float, description: str) -> int:
        """
        Calculates a numerical severity score from 0 to 100.
        Factors:
        - OpenCV damage outputs
        - Description text indicators (e.g. panic keywords like "flooded", "accident")
        """
        # Base severity based on image detection
        base_scores = {
            "HIGH_DAMAGE": 80,
            "MEDIUM_DAMAGE": 50,
            "LOW_DAMAGE": 20,
            "UNKNOWN_DAMAGE": 15
        }
        
        score = base_scores.get(cv_damage_level, 15)
        
        # Add CV confidence weight
        score += int(cv_confidence * 10)
        
        # Keyword-based multipliers
        text_lower = description.lower()
        critical_keywords = ["emergency", "accident", "injured", "collapsed", "flooded", "danger", "burst"]
        
        for keyword in critical_keywords:
            if keyword in text_lower:
                score += 5
                
        # Constrain between 0 and 100
        return max(0, min(score, 100))
