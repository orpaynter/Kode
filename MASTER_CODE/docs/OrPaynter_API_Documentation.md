# OrPaynter API Documentation

## AI Assessment Service API

### `assessRoofDamage(imageBase64: string): Promise<RoofAssessmentResult>`

Assesses roof damage using OpenAI Vision API or intelligent simulation.

**Parameters:**
- `imageBase64`: Base64 encoded image data of the roof

**Returns:**
```typescript
interface RoofAssessmentResult {
  damageDetected: boolean;
  damageType: string | null;
  damageLocation: string | null;
  assessmentAccuracy: number; // 0-1 confidence score
  urgency: 'low' | 'medium' | 'high' | 'critical';
  estimatedCost: {
    min: number;
    max: number;
  };
  recommendations: string[];
}
```

**Example Usage:**
```typescript
import { assessRoofDamage } from './services/openai';

const result = await assessRoofDamage(base64Image);
console.log(`Damage detected: ${result.damageDetected}`);
if (result.damageDetected) {
  console.log(`Type: ${result.damageType}`);
  console.log(`Urgency: ${result.urgency}`);
  console.log(`Cost: $${result.estimatedCost.min} - $${result.estimatedCost.max}`);
}
```

## BANT Qualification API

### `calculateBANTScore(lead: LeadData): BANTScoring`

Calculates comprehensive BANT score for lead qualification.

**Parameters:**
```typescript
interface LeadData {
  budget: string | null;
  authority: string | null;
  need: string | null;
  timeline: string | null;
}
```

**Returns:**
```typescript
interface BANTScoring {
  budget: number;     // Score out of 25
  authority: number;  // Score out of 25
  need: number;       // Score out of 25
  timeline: number;   // Score out of 25
  overall: number;    // Total score out of 100
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  priority: 'hot' | 'warm' | 'cold';
}
```

## State Management API

### Zustand Store Interface

```typescript
interface AppState {
  user: {
    name: string | null;
    email: string | null;
    licenseType: 'basic' | 'professional' | 'enterprise' | null;
    isAuthenticated: boolean;
  };
  assessment: {
    images: string[];
    results: RoofAssessmentResult | null;
    isProcessing: boolean;
  };
  leadQualification: {
    currentLead: LeadData;
    leads: any[];
  };
}
```

### Store Actions

```typescript
// User management
setUser(userData: Partial<User>): void;

// Assessment management
addAssessmentImage(image: string): void;
clearAssessmentImages(): void;
setAssessmentResults(results: RoofAssessmentResult): void;
setAssessmentProcessing(isProcessing: boolean): void;

// Lead management
updateCurrentLead(lead: Partial<LeadData>): void;
saveLead(): void;
```

## Configuration APIs

### OpenAI Service Configuration

```typescript
// Validate API key format
validateOpenAIKey(apiKey: string): boolean;

// Get service status
getAIServiceStatus(): {
  isUsingRealAPI: boolean;
  hasValidKey: boolean;
  serviceMode: 'production' | 'simulation';
};
```

### Environment Variables

```bash
# OpenAI Configuration (optional)
TAURI_OPENAI_API_KEY=sk-your-openai-api-key

# Stripe Configuration (required for production)
STRIPE_PUBLISHABLE_KEY=pk_your_stripe_key
STRIPE_SECRET_KEY=sk_your_stripe_secret
```

## Component APIs

### ImageUpload Component

**Props:**
```typescript
interface ImageUploadProps {
  onImagesChange?: (images: string[]) => void;
  onAssessmentComplete?: (results: RoofAssessmentResult) => void;
  maxImages?: number; // Default: 10
  acceptedFormats?: string[]; // Default: ['image/*']
}
```

**Features:**
- Drag & drop file upload
- Multiple image support
- Real-time processing feedback
- Comprehensive results display

### BANTQualification Component

**Props:**
```typescript
interface BANTProps {
  onQualificationComplete?: (score: BANTScoring) => void;
  onLeadSaved?: (lead: LeadData) => void;
  autoReset?: boolean; // Default: false
}
```

**Features:**
- Conversational chatbot interface
- Real-time score calculation
- Grade visualization
- Lead priority classification

### Settings Component

**Props:**
```typescript
interface SettingsProps {
  onApiKeyUpdate?: (isValid: boolean) => void;
  onSubscriptionChange?: (plan: string) => void;
}
```

**Features:**
- API key management
- Subscription plan selection
- Service status monitoring
- Account information display

## Error Handling

### API Error Types

```typescript
interface APIError {
  code: string;
  message: string;
  details?: any;
}

// Common error codes
const ErrorCodes = {
  INVALID_API_KEY: 'INVALID_API_KEY',
  OPENAI_API_ERROR: 'OPENAI_API_ERROR',
  INVALID_IMAGE_FORMAT: 'INVALID_IMAGE_FORMAT',
  PROCESSING_FAILED: 'PROCESSING_FAILED',
  NETWORK_ERROR: 'NETWORK_ERROR'
};
```

### Error Handling Example

```typescript
try {
  const result = await assessRoofDamage(imageBase64);
  // Handle success
} catch (error) {
  if (error.code === 'OPENAI_API_ERROR') {
    // Fallback to simulation
    const simulatedResult = await simulateAssessment(imageBase64);
  } else {
    // Handle other errors
    console.error('Assessment failed:', error.message);
  }
}
```

## Integration Examples

### Basic Assessment Flow

```typescript
import { useAppStore } from './store';
import { assessRoofDamage } from './services/openai';

const AssessmentExample = () => {
  const { assessment, setAssessmentResults, setAssessmentProcessing } = useAppStore();
  
  const handleAssessment = async (images: string[]) => {
    setAssessmentProcessing(true);
    try {
      const result = await assessRoofDamage(images[0]);
      setAssessmentResults(result);
      
      // Handle result based on urgency
      if (result.urgency === 'critical') {
        // Immediate contractor notification
        notifyEmergencyContractors(result);
      }
    } finally {
      setAssessmentProcessing(false);
    }
  };
};
```

### BANT Qualification Integration

```typescript
import { calculateBANTScore } from './components/bant/BANTQualification';

const QualificationExample = () => {
  const handleQualificationComplete = (score: BANTScoring) => {
    // Route lead based on grade
    switch (score.grade) {
      case 'A':
      case 'B':
        assignToPremiumContractors(score);
        break;
      case 'C':
        addToNormalQueue(score);
        break;
      default:
        addToNurtureSequence(score);
    }
  };
};
```

## Testing

### Unit Test Examples

```typescript
// Assessment service test
describe('assessRoofDamage', () => {
  it('should return damage assessment', async () => {
    const mockImage = 'data:image/jpeg;base64,/9j/4AAQ...';
    const result = await assessRoofDamage(mockImage);
    
    expect(result.damageDetected).toBeDefined();
    expect(result.assessmentAccuracy).toBeGreaterThan(0.8);
    expect(result.recommendations).toHaveLength.greaterThan(0);
  });
});

// BANT scoring test
describe('calculateBANTScore', () => {
  it('should calculate high score for premium lead', () => {
    const premiumLead = {
      budget: '$50,000',
      authority: 'homeowner',
      need: 'emergency repair',
      timeline: 'immediately'
    };
    
    const score = calculateBANTScore(premiumLead);
    expect(score.grade).toBe('A');
    expect(score.priority).toBe('hot');
    expect(score.overall).toBeGreaterThan(85);
  });
});
```

---

**API Documentation Version:** 1.0  
**Last Updated:** August 18, 2025  
**Compatibility:** OrPaynter Enhanced v1.0+