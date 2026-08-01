import re
import string

# Basic Kannada stop words helper
KANNADA_STOP_WORDS = {
    "ಮತ್ತು", "ಈ", "ಆದರೆ", "ಯಾವಾಗ", "ಎಲ್ಲಿ", "ಹೇಗೆ", "ಯಾರು", "ಅಥವಾ", "ಇದು", "ಅದು"
}

def clean_text(text: str) -> str:
    """
    Cleans raw input text containing English/Kannada strings:
    - Lowercases English characters.
    - Strips punctuation marks.
    - Removes extra whitespaces.
    - Filters basic stop words.
    """
    if not text:
        return ""
        
    # Lowercase English characters only (preserving Kannada characters)
    text = text.lower()
    
    # Strip common punctuation
    punctuation_pattern = re.compile('[%s]' % re.escape(string.punctuation))
    text = punctuation_pattern.sub(' ', text)
    
    # Standardize whitespaces
    words = text.split()
    
    # Filter basic stop words
    cleaned_words = [w for w in words if w not in KANNADA_STOP_WORDS]
    
    return " ".join(cleaned_words)
