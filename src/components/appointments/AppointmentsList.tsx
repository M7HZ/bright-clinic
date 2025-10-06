import { useEffect, useState } from "react";
import { Calendar, Clock, User, FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface Appointment {
  id: string;
  appointment_date: string;
  appointment_time: string;
  reason: string;
  status: string;
  doctor?: {
    profiles: {
      full_name: string;
    };
    specialization: string;
  };
  patient?: {
    full_name: string;
  };
}

interface AppointmentsListProps {
  userId: string;
  userRole: "patient" | "doctor" | "clerk_admin";
  refresh?: number;
}

export const AppointmentsList = ({ userId, userRole, refresh }: AppointmentsListProps) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, [userId, userRole, refresh]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      let query = supabase.from("appointments").select("*");

      if (userRole === "patient") {
        query = query.eq("patient_id", userId);
      } else if (userRole === "doctor") {
        query = query.eq("doctor_id", userId);
      }

      const { data, error } = await query.order("appointment_date", { ascending: true });

      if (error) throw error;
      
      // Fetch related data separately
      const appointmentsWithDetails = await Promise.all((data || []).map(async (apt) => {
        const details: any = { ...apt };
        
        if (apt.doctor_id) {
          const { data: doctorData } = await supabase
            .from("doctors")
            .select("specialization, profiles(full_name)")
            .eq("user_id", apt.doctor_id)
            .single();
          details.doctor = doctorData;
        }
        
        if (userRole !== "patient") {
          const { data: patientData } = await supabase
            .from("profiles")
            .select("full_name")
            .eq("user_id", apt.patient_id)
            .single();
          details.patient = patientData;
        }
        
        return details;
      }));

      setAppointments(appointmentsWithDetails);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "completed":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "cancelled":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <Card className="p-8 text-center bg-card/50 backdrop-blur">
        <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">No Appointments</h3>
        <p className="text-muted-foreground">
          {userRole === "patient" 
            ? "Book your first appointment to get started"
            : "No appointments scheduled yet"}
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <Card key={appointment.id} className="p-6 bg-card/50 backdrop-blur border-border hover:border-primary/50 transition-all">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-3 flex-1">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold">
                      {format(new Date(appointment.appointment_date), "MMMM d, yyyy")}
                    </h4>
                    <Badge className={getStatusColor(appointment.status)}>
                      {appointment.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {appointment.appointment_time}
                    </span>
                    {userRole !== "patient" && appointment.patient && (
                      <span className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {appointment.patient.full_name}
                      </span>
                    )}
                    {userRole === "patient" && appointment.doctor && (
                      <span className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        Dr. {(appointment.doctor.profiles as any)?.full_name}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-2 text-sm pl-13">
                <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                <p className="text-muted-foreground">{appointment.reason}</p>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};