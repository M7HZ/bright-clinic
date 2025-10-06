import { useEffect, useState } from "react";
import { FileText, Heart, Pill, Activity, User, Phone } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

interface MedicalRecord {
  id: string;
  dental_history: string;
  allergies: string;
  current_medications: string;
  treatments: string;
  height_cm: number;
  weight_kg: number;
  bmi: number;
  blood_type: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  created_at: string;
  updated_at: string;
}

interface MedicalRecordsViewProps {
  patientId: string;
}

export const MedicalRecordsView = ({ patientId }: MedicalRecordsViewProps) => {
  const [record, setRecord] = useState<MedicalRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecord();
  }, [patientId]);

  const fetchRecord = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("patient_records")
        .select("*")
        .eq("patient_id", patientId)
        .maybeSingle();

      if (error) throw error;
      setRecord(data);
    } catch (error) {
      console.error("Error fetching medical record:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!record) {
    return (
      <Card className="p-8 text-center bg-card/50 backdrop-blur">
        <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">No Medical Records</h3>
        <p className="text-muted-foreground">
          Your medical records will be created after your first visit
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Basic Health Info */}
      <Card className="p-6 bg-card/50 backdrop-blur border-border">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Health Metrics
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Height</p>
            <p className="text-lg font-semibold">{record.height_cm ? `${record.height_cm} cm` : "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Weight</p>
            <p className="text-lg font-semibold">{record.weight_kg ? `${record.weight_kg} kg` : "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">BMI</p>
            <p className="text-lg font-semibold">{record.bmi || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Blood Type</p>
            <p className="text-lg font-semibold">{record.blood_type || "N/A"}</p>
          </div>
        </div>
      </Card>

      {/* Medical Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 bg-card/50 backdrop-blur border-border">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            Allergies
          </h3>
          <p className="text-muted-foreground">{record.allergies || "No known allergies"}</p>
        </Card>

        <Card className="p-6 bg-card/50 backdrop-blur border-border">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Pill className="h-5 w-5 text-primary" />
            Current Medications
          </h3>
          <p className="text-muted-foreground">{record.current_medications || "None"}</p>
        </Card>
      </div>

      {/* Dental History */}
      <Card className="p-6 bg-card/50 backdrop-blur border-border">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Dental History
        </h3>
        <p className="text-muted-foreground whitespace-pre-line">
          {record.dental_history || "No dental history recorded"}
        </p>
      </Card>

      {/* Treatments */}
      {record.treatments && (
        <Card className="p-6 bg-card/50 backdrop-blur border-border">
          <h3 className="text-lg font-semibold mb-3">Treatment History</h3>
          <p className="text-muted-foreground whitespace-pre-line">{record.treatments}</p>
        </Card>
      )}

      {/* Emergency Contact */}
      <Card className="p-6 bg-card/50 backdrop-blur border-border">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Phone className="h-5 w-5 text-primary" />
          Emergency Contact
        </h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span>{record.emergency_contact_name || "Not provided"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{record.emergency_contact_phone || "Not provided"}</span>
          </div>
        </div>
      </Card>
    </div>
  );
};