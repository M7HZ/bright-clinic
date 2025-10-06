import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Users, MessageSquare, BarChart3, LogOut, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { AppointmentsList } from "@/components/appointments/AppointmentsList";

export default function DoctorDashboard() {
  const { user, loading, userRole, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || userRole !== "doctor")) {
      navigate("/staff-login");
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
              <p className="text-sm text-muted-foreground">Doctor Portal</p>
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
            <h2 className="text-3xl font-bold mb-2">Welcome, Doctor!</h2>
            <p className="text-muted-foreground">Manage your patients and appointments</p>
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
                  <p className="text-sm text-muted-foreground">Today</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card/50 backdrop-blur border-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-muted-foreground">Patients</p>
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
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-muted-foreground">Messages</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Dashboard Tabs */}
          <Tabs defaultValue="appointments" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="appointments" className="gap-2">
                <Calendar className="h-4 w-4" />
                Appointments
              </TabsTrigger>
              <TabsTrigger value="patients" className="gap-2">
                <Users className="h-4 w-4" />
                My Patients
              </TabsTrigger>
              <TabsTrigger value="chat" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                Chat
              </TabsTrigger>
              <TabsTrigger value="analytics" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="appointments" className="space-y-4">
              <h3 className="text-xl font-semibold mb-4">My Appointments</h3>
              <AppointmentsList userId={user.id} userRole="doctor" />
            </TabsContent>

            <TabsContent value="patients" className="space-y-4">
              <Card className="p-8 text-center bg-card/50 backdrop-blur">
                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Patients Yet</h3>
                <p className="text-muted-foreground">Patients assigned to you will appear here</p>
              </Card>
            </TabsContent>

            <TabsContent value="chat" className="space-y-4">
              <Card className="p-8 text-center bg-card/50 backdrop-blur">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Messages</h3>
                <p className="text-muted-foreground">Patient messages will appear here</p>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <Card className="p-8 text-center bg-card/50 backdrop-blur">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Analytics Dashboard</h3>
                <p className="text-muted-foreground">View your patient statistics and performance metrics</p>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
}