import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, FileText, CreditCard, ShoppingBag, MessageSquare, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { BookAppointmentDialog } from "@/components/appointments/BookAppointmentDialog";
import { AppointmentsList } from "@/components/appointments/AppointmentsList";
import { MedicalRecordsView } from "@/components/medical/MedicalRecordsView";

export default function PatientDashboard() {
  const { user, loading, userRole, signOut } = useAuth();
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!loading && (!user || userRole !== "patient")) {
      navigate("/patient-login");
    }
  }, [user, loading, userRole, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary">Mr. Bur Dental</h1>
              <p className="text-sm text-muted-foreground">Patient Portal</p>
            </div>
            <Button variant="outline" onClick={signOut} className="gap-2">
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <div>
            <h2 className="text-3xl font-bold mb-2">Welcome back!</h2>
            <p className="text-muted-foreground">Manage your appointments, medical records, and more</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-6 bg-card/50 backdrop-blur border-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-muted-foreground">Upcoming</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card/50 backdrop-blur border-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-muted-foreground">Records</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card/50 backdrop-blur border-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">$0</p>
                  <p className="text-sm text-muted-foreground">Balance</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card/50 backdrop-blur border-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <ShoppingBag className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-muted-foreground">Cart Items</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Dashboard Tabs */}
          <Tabs defaultValue="appointments" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="appointments" className="gap-2">
                <Calendar className="h-4 w-4" />
                Appointments
              </TabsTrigger>
              <TabsTrigger value="records" className="gap-2">
                <FileText className="h-4 w-4" />
                Medical Records
              </TabsTrigger>
              <TabsTrigger value="billing" className="gap-2">
                <CreditCard className="h-4 w-4" />
                Billing
              </TabsTrigger>
              <TabsTrigger value="products" className="gap-2">
                <ShoppingBag className="h-4 w-4" />
                Products
              </TabsTrigger>
              <TabsTrigger value="chat" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                Chat
              </TabsTrigger>
            </TabsList>

            <TabsContent value="appointments" className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">My Appointments</h3>
                <BookAppointmentDialog onSuccess={() => setRefreshKey(prev => prev + 1)} />
              </div>
              <AppointmentsList userId={user.id} userRole="patient" refresh={refreshKey} />
            </TabsContent>

            <TabsContent value="records" className="space-y-4">
              <h3 className="text-xl font-semibold mb-4">Medical Records</h3>
              <MedicalRecordsView patientId={user.id} />
            </TabsContent>

            <TabsContent value="billing" className="space-y-4">
              <Card className="p-8 text-center bg-card/50 backdrop-blur">
                <CreditCard className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Billing History</h3>
                <p className="text-muted-foreground">Your invoices and payment history will appear here</p>
              </Card>
            </TabsContent>

            <TabsContent value="products" className="space-y-4">
              <Card className="p-8 text-center bg-card/50 backdrop-blur">
                <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Browse Dental Products</h3>
                <p className="text-muted-foreground mb-4">Premium dental care products recommended by our professionals</p>
                <Button>Browse Products</Button>
              </Card>
            </TabsContent>

            <TabsContent value="chat" className="space-y-4">
              <Card className="p-8 text-center bg-card/50 backdrop-blur">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Chat with Your Doctor</h3>
                <p className="text-muted-foreground">Start a conversation after booking your first appointment</p>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
}