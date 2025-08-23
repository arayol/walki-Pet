import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, FileText, Database, Mail } from "lucide-react";
import { LGPDConsents as ConsentConfig } from "@/utils/securityValidation";

interface LGPDConsentsProps {
  consents: {
    acceptedTerms: boolean;
    acceptedPrivacy: boolean;
    acceptedDataProcessing: boolean;
    acceptedMarketing: boolean;
  };
  onConsentChange: (consent: keyof LGPDConsentsProps['consents'], value: boolean) => void;
  errors: Record<string, string>;
}

const consentIcons = {
  terms: FileText,
  privacy: Shield,
  dataProcessing: Database,
  marketing: Mail
};

export const LGPDConsents = ({ consents, onConsentChange, errors }: LGPDConsentsProps) => {
  return (
    <div className="space-y-4">
      {/* Termos de Uso */}
      <div className="flex items-center space-x-3">
        <Checkbox
          id="acceptedTerms"
          checked={consents.acceptedTerms}
          onCheckedChange={(checked) => 
            onConsentChange('acceptedTerms', checked as boolean)
          }
          data-testid="checkbox-terms"
        />
        <Label 
          htmlFor="acceptedTerms" 
          className="text-sm cursor-pointer flex-1"
        >
          Aceito os{" "}
          <a 
            href="/termos-de-uso" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
            data-testid="link-terms"
          >
            termos de uso
          </a>{" "}
          e política de privacidade
          <span className="text-red-500 ml-1">*</span>
        </Label>
      </div>
      {errors.acceptedTerms && (
        <p className="text-sm text-red-600 ml-7" data-testid="error-terms">
          {errors.acceptedTerms}
        </p>
      )}
    </div>
  );
};